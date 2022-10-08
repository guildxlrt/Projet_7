//========//IMPORTS//========//
const utils = require('../utils/utils');
const errMsg = require('../utils/errorMsg')
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
            console.log(req.body)
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

            // Enregistrement
            await prisma.post.create({data : content})
            .then(async () => { await prisma.$disconnect() })
            .then(() => res.status(201).json({ message : 'publication cree !'}))
            .catch(error =>  res.status(500).json(error))
        } else {
            return res.status(403).json(errMsg.authErr)
        }
    })
};

//========//TOUT AFFICHER
exports.getAllPosts = async (req, res, next) => {
    // recherche
    await prisma.post.findMany({
        where : { isActive : true }
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
        .then(async () => { await prisma.$disconnect() })
        .then(() => res.status(200).json({ message : 'Publication modifie !' }))
        .catch(error =>  res.status(500).json(error));
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
                let content = req.body

                //----Suppression Image
                if (req.body.nofile === true) {
                    // Erreurs requete
                    if (req.file) {
                        fileDel('/', req.file.filename)
                        return res.status(400).json(errMsg.PostErrReq)
                    }
                    else if (post.imageUrl === null) {
                        return res.status(400).json(errMsg.PostErrReq)
                    }
                    // Requete valide             
                    else {
                        // suppression du fichier
                        const oldFile = post.imageUrl.split('/images/posts/')[1];
                        utils.fileDel('posts', oldFile)
                        content.imageUrl = null

                        // enregistrer
                        delete content.nofile
                        if (content.text === "") delete content.text
                        update(content)
                    }                    
                }
                //----Texte seulement
                else if (!req.file) {
                    // enregistrer
                    delete content.nofile
                    if (content.text === "") delete content.text
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
                        utils.fileDel('posts', oldFile)
                    }
                    // redirection du nouveau fichier
                    utils.fileMove('posts', req.file.filename)

                    // enregistrer
                    delete content.nofile
                    if (content.text === "") { delete content.text }
                    update(content)
                }
            } else {
                return res.status(403).json(errMsg.authErr)
            }
        })    
    })
    .catch(error =>  res.status(500).json(error));
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
                        utils.fileDel(post.imageUrl)
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
                        utils.fileDel(post.imageUrl)
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

//================//LIKER//================//
exports.likePost = async (req, res, next) => {
    const liker = req.auth.userId
    const postToLike = Number(req.params.id)
    
    //---RECHERCHES
    // utilisateur
    const findUser = await utils.findUser({id : liker})
    // publication
    const findPost = await utils.findPost({id : postToLike})
    // like doublon
    const findLike = await prisma.like.findFirst({
        where : {
            userId : liker,
            postId : postToLike
        }
    })
    
    // l'utilisateur et le post doivent etre actif
    if ((findUser.isActive) && (findPost.isActive)) {
        // CONDITIONS
        //========//Aucun doublon : AJOUTER
        if (!Boolean(findLike)) {
            if (!(findPost.userId === liker)) {            
                // enregistrement
                await prisma.like.create({
                    data : {
                        postId : postToLike,
                        userId : liker
                    }
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(201).json({ message : 'publication likee !'}))
                .catch(error =>  res.status(500).json(error))
            }
            // empecher autolike
            else {
                return res.status(403).json(errMsg.likeErr)
            }
        }
        //========//doublon : RETIRER
        else {
            await prisma.like.delete({
                where : { id : findLike.id }
            })
            .then(async () => { await prisma.$disconnect() })
            .then(() => res.status(200).json({ message : 'like supprime !' }))
            .catch(error => res.status(500).json(error))
        }
    // mauvais utilisateur
    } else {
        return res.status(403).json(errMsg.authErr);
    }
};

//================//COUNT OF LIKES//================//
exports.likesCount = async (req, res, next) => {
    // recherche
    await prisma.like.count({
        where : { postId : Number(req.params.id) }
    })
    .then(likes => res.status(200).json({likes : likes}))
    .then(async () => { await prisma.$disconnect() })
    .catch(error =>  res.status(500).json(error));
}