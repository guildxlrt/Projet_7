//========//IMPORTS//========//
const utils = require('../utils/utils');
//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//================//COMMENTAIRES//================//

//========//CREER
exports.commentPost = async (req, res, next) => {
    const auth = req.auth.userId

    // Recherche post 
    await utils.findPost({id : Number(req.params.id_post)})
    .then( async post => {
        console.log(post)
        if(post.isActive) {
            // Recherche utilisateur
            await utils.findUser({id : auth})
            .then( async user => {
                if (user.isActive) {
                    // enregistrement
                    await prisma.comment.create({
                        data : {
                            text : req.body.text,
                            postId : Number(req.params.id_post),
                            userId : auth
                        }
                    })
                    .then(async () => { await prisma.$disconnect() })
                    .then(() => res.status(201).json({ message : 'commentaire publie !' }))
                    .catch(error =>  res.status(500).json(error))
                } else {
                    return res.status(403).json(errMsg.authErr);
                }
            })
            .catch(error =>  res.status(500).json(error));
        } else {
            return res.status(403).json(errMsg.authErr);
        }
    })
    .catch(error =>  res.status(500).json(error));
};

//========//AFFICHER
exports.getPostComments = async (req, res, next) => {
    // recherche
    await prisma.comment.findMany({
        where : {
            postId : Number(req.params.id_post),
            isActive : true
        }
    })
    .then(comments => res.status(200).json(comments))
    .then(async () => { await prisma.$disconnect() })
    .catch(error => console.log(error) || res.status(404).json(error));
}

//========//UN SEUL
exports.getOneComment = async (req, res, next) => {
    // recherche
    await utils.findComment({id : Number(req.params.id)})
    .then(comment => res.status(200).json(comment))
    .then(async () => { await prisma.$disconnect() })
    .catch(error => console.log(error) || res.status(404).json(error));
};

//========//MODIFIER
exports.modifyComment = async (req, res, next) => {
    const auth = auth
    const target = Number(req.params.id)

    // Recherche
    await utils.findComment({id : target})
    .then(async comment => {
        // verification utilisateur
        await utils.findUser({id : auth})
        .then(async user => {
            if ((comment.userId === auth) && (user.isActive)) {
            
                // enregistrement
                await prisma.comment.update({
                    where : {
                        id : target
                    },
                    data : {
                        text : req.body.text
                    }
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ message : 'Commentaire modifie !' }))
                .catch(error =>  res.status(500).json(error));
    
            } else {
                return res.status(403).json(errMsg.authErr)
            }
        })
    })
    .catch(error =>  res.status(500).json(error));
}

//========//SUPPRIMER
exports.delComment = async (req, res, next) => {
    const auth = req.auth.userId
    const target = Number(req.params.id)

    //---Quel utilisateur ?
    //------ADMINISTRATEUR
    if (req.auth.isAdmin === true) {
        await utils.findUser({id : auth})
        .then(async admin => {
            // verification administrateur
            if ((auth === admin.id) && (admin.isActive === true) && (admin.isAdmin === true)) {
                
                // enregistrement
                await prisma.comment.delete({
                    where : { id : target }
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ message : 'commentaire supprime !' }))
                .catch(error => res.status(500).json(error))

            } else {
                return res.status(403).json(errMsg.authErr)
            }
        })
    }
    //------UTILISATEUR NORMAL
    else {
        // Recherche dans le post
        await utils.findComment({id : target})
        .then(async comment => {
            // verification utilisateur
            await utils.findUser({id : auth})
            .then(async user => {
                if ((comment.userId === auth) && (user.isActive)) {
                    // enregistrement
                    await prisma.comment.delete({
                        where : { id : target }
                    })
                    .then(async () => { await prisma.$disconnect() })
                    .then(() => res.status(200).json({ message : 'commentaire supprime !' }))
                    .catch(error => res.status(500).json(error))
                } else {
                    return res.status(403).json(errMsg.authErr)
                }
            })
        })
        .catch(error => res.status(500).json(error));
    }
}
