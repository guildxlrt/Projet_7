//========//IMPORTS//========//
const utils = require('../utils/utils');
const errMsg = require('../utils/errorMsg')
const errorFileReq = require('../utils/errorFileReq')

//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//================//POST//================//

//========//NOUVEAU
exports.createPost = async (req, res, next) => {
    const auth = req.auth.userId
    // utilisateur
    await utils.findUser({id : auth})
    .then( async user => {
        if (user.isActive) {
            // Condition Fichier
            const content = req.file ? {
                ...req.body,
                imageUrl : utils.newImageUrl(req),
                userId : auth
            } : {
                ...req.body,
                userId : auth
            };

            // Redirection du nouveau fichier
            if (req.file) {
                utils.fileMove('posts', req.file.filename)
            }

            
            let text = ''
            text = req.body.text

            // Enregistrement
            await prisma.post.create({data : content})
            .then((post) => res.status(201).json(post))
            .catch((error) => {errorFileReq(error, 500, req)})
        } else {
            return errorFileReq(errMsg.authErr, 403, req)
        }
    })
    .catch((error) => {errorFileReq(error, 500, req)})
};

//========//TOUT AFFICHER
exports.getAllPosts = async (req, res, next) => {
    // recherche
    await prisma.post.findMany({
        where: {
            isActive : true,
        },
        include : {
          Comment : true,
          Like : true
        },
    })
    .then(posts => res.status(200).json(posts))
    .then(async () => { await prisma.$disconnect() })
    .catch(error =>  res.status(500).json(error));
};

//========//UN SEUL
exports.getOnePost = async (req, res, next) => {
    // recherche
    await utils.findPost({id : Number(req.params.id)})
    .then(post => res.status(200).json(post))
    .then(async () => { await prisma.$disconnect() })
    .catch(error =>  res.status(500).json(error));
};


//========//MODIFIER
exports.modifyPost = async (req, res, next) => {
    const target = Number(req.params.id)
    const auth = req.auth.userId

    // Validation de la requete
    const update = async (datas) => {
        await prisma.post.update({
            where : { id : target },
            data : datas
        })
        .then((post) => res.status(200).json(post))
        .catch(error =>  errorFileReq(error, 500, req));
    }

    // Recherche
    await utils.findPost({id : target})
    .then(async (post) => {

        // utilisateur
        await utils.findUser({id : auth})
        .then(async user => {

            // verification
            if ((post.userId === auth) && (user.isActive)) {

                //========// TRAITEMENT DE LA REQUETE
                let content = {...req.body, updated : true}

                //----Suppression video
                if (req.body.novideo === true) {
                    // Erreurs requete
                    if (post.video === null) {
                        return errorFileReq(errMsg.PostErrReq, 400, req)
                    }
                    // Requete valide             
                    else {
                        content.video = null
                        delete content.novideo
                    }
                }
                
                //----Suppression Image
                if (req.body.nofile === true) {
                    // Erreurs requete
                    if (req.file) {
                        return errorFileReq(errMsg.PostErrReq, 400, req)
                    }
                    else if (post.imageUrl === null) {
                        return errorFileReq(errMsg.PostErrReq, 400, req)
                    }
                    // Requete valide             
                    else {
                        // suppression du fichier
                        const oldFile = post.imageUrl.split('/images/posts/')[1];
                        utils.fileDel('posts', oldFile)

                        // enregistrer
                        content.imageUrl = null
                        delete content.nofile
                        update(content)
                    }                    
                }
                //----Modifier que le text
                else if (!req.file) {
                    // enregistrer
                    delete content.nofile
                    update(content)
                }
                //---- Nouvelle image
                else if (req.file) {
                    content = {
                        ...(req.body),
                        imageUrl : utils.newImageUrl(req)
                    }

                    // //----Nouvelle image
                    if (!(post.imageUrl === null)) {
                        //----Suppression Ancient fichier
                        const oldFile = post.imageUrl.split('/images/posts/')[1];
                        utils.fileDel(oldFile)
                    }

                    // redirection du nouveau fichier
                    utils.fileMove('posts', req.file.filename)

                    // enregistrer
                    delete content.nofile
                    update(content)
                }
            } else {
                return errorFileReq(errMsg.authErr, 403, req, res)
            }
        })    
    })
    .catch(error =>  errorFileReq(error, 500, req, res));
};

//========//SUPPRIMER
exports.deletePost = async (req, res, next) => {
    const target = Number(req.params.id)
    const auth = req.auth.userId

    //------ADMINISTRATEUR
    if (req.auth.isAdmin) {
        await utils.findUser({id : auth})
        .then(async admin => {
            // verification administrateur
            if ((auth === admin.id) && (admin.isActive) && (admin.isAdmin)) {  
                //---Suppression fichier
                await utils.findPost({id : target})
                .then(post => {
                    if (post.imageUrl != null) {
                        const oldFile = post.imageUrl.split('/images/posts/')[1];
                        utils.fileDel(oldFile)
                    }
                })

                //---Suppression dans la BDD
                await prisma.post.delete({
                    where : { id : target}
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ message : 'publication supprime !' }))
                .catch(error => res.status(500).json(error))
            } else {
                return res.status(403).json(errMsg.authErr)
            }
        })
    }
    //------UTILISATEUR NORMAL
    else {
        // Recherche dans le post
        await utils.findPost({id : target})
        .then(async post => {
            // verification utilisateur
            await utils.findUser({id : auth})
            .then(async user => {
                if ((post.userId === auth) && (user.isActive)) {
                    //---Suppression fichier
                    if (post.imageUrl != null) {
                        const oldFile = post.imageUrl.split('/images/posts/')[1];
                        utils.fileDel(oldFile)
                    }
                        
                    //---Suppression dans la BDD
                    await prisma.post.delete({
                        where : { id : target}
                    })
                    .then(async () => { await prisma.$disconnect() })
                    .then(() => res.status(200).json({ message : 'publication supprime !' }))
                    .catch(error => res.status(500).json(error))
                } else {
                    return res.status(403).json(errMsg.authErr)
                }
            })
        })
        .catch(error => res.status(500).json(error));
    }
};

