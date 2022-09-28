//========//IMPORTS//========//
const utils = require('../utils/utils');
//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//================//POST//================//

//========//NOUVEAU
exports.createPost = async (req, res, next) => {
    // utilisateur
    await utils.findUser({id : req.auth.userId})
    .then( async user => {
        if (user.isActive) {
            // Condition Fichier
            const content = req.file ? {
                ...JSON.parse(req.body),
                imageUrl : utils.newImageUrl(req),
                userId : req.auth.userId
            } : {
                ...req.body,
                userId : req.auth.userId
            };

            // Enregistrement
            await prisma.post.create({data : content})
            .then(async () => { await prisma.$disconnect() })
            .then(() => res.status(201).json({ message : 'publication cree !'}))
            .catch(error => console.log(error) || res.status(400).json(error))
        } else {
            return res.status(401).json({ error : 'Acces non authorise' })
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
    .catch(error => console.log(error) || res.status(400).json(error));
};

//========//UN SEUL
exports.getOnePost = async (req, res, next) => {
    // recherche
    await utils.findPost({id : Number(req.params.id)})
    .then(post => res.status(200).json(post))
    .then(async () => { await prisma.$disconnect() })
    .catch(error => console.log(error) || res.status(404).json(error));
};


//========//MODIFIER
exports.modifyPost = async (req, res, next) => {
    // Recherche
    await utils.findPost({id : Number(req.params.id)})
    .then(async (post) => {
        
        // verification utilisateur
        await utils.findUser({id : req.auth.userId})
        .then(async user => {
            if ((post.userId === req.auth.userId) && (user.isActive)) {
                //---Recherche fichier
                const content = req.file ? {
                    ...JSON.parse(req.body),
                    imageUrl : utils.newImageUrl(req)
                } : { ...req.body };
    
                //---Suppression ancien fichier
                req.file ? (function findURL () {
                    if (post.imageUrl != null) {
                        utils.fileDel(post.imageUrl)
                    }
                })() : null;
    
                //---Enregistrement
                await prisma.post.update({
                    where : { id : Number(req.params.id) },
                    data : content
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ message : 'Publication modifie !' }))
                .catch(error => console.log(error) || res.status(401).json(error));
    
            } else {
                return res.status(401).json({ error : 'Acces non authorise' })
            }
        })    
    })
    .catch(error => console.log(error) || res.status(500).json(error));
};

//========//SUPPRIMER
exports.deletePost = async (req, res, next) => {
    //------ADMINISTRATEUR
    if (req.auth.isAdmin) {
        await utils.findUser({id : req.auth.userId})
        .then(async admin => {
            // verification administrateur
            if ((req.auth.userId === admin.id) && (admin.isActive) && (admin.isAdmin)) {  
                //---Suppression fichier
                await utils.findPost({id : Number(req.params.id)})
                .then(post => {
                    if (post.imageUrl != null) {
                        utils.fileDel(post.imageUrl)
                    }
                })

                //---Suppression dans la BDD
                await prisma.post.delete({
                    where : { id : Number(req.params.id)}
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ message : 'publication supprime !' }))
                .catch(error => res.status(401).json(error))
            } else {
                return res.status(401).json({ error : 'Acces non authorise' })
            }
        })
    }
    //------UTILISATEUR NORMAL
    else {
        // Recherche dans le post
        await utils.findPost({id : Number(req.params.id)})
        .then(async post => {
            // verification utilisateur
            await utils.findUser({id : req.auth.userId})
            .then(async user => {
                if ((post.userId === req.auth.userId) && (user.isActive)) {
                    //---Suppression fichier
                    if (post.imageUrl != null) {
                        utils.fileDel(post.imageUrl)
                    }
                        
                    //---Suppression dans la BDD
                    await prisma.post.delete({
                        where : { id : Number(req.params.id)}
                    })
                    .then(async () => { await prisma.$disconnect() })
                    .then(() => res.status(200).json({ message : 'publication supprime !' }))
                    .catch(error => res.status(401).json(error))
                } else {
                    return res.status(401).json({ error : 'Acces non authorise' })
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
    const findLike = prisma.like.findFirst({
        where : {
            userId : req.auth.userId,
            postId : Number(req.params.id)
        }
    })
    
    // l'utilisateur et le post doivent etre actif
    if ((findUser.isActive) && (findPost.isActive)) {
        // CONDITIONS
        //========//Aucun doublon : AJOUTER
        if (!Boolean(findLike)) {
            // empecher les auto-like
            if (!(findPost.userId === req.auth.userId)) {            
                // enregistrement
                await prisma.like.create({
                    data : {
                        postId : Number(req.params.id),
                        userId : req.auth.userId
                    }
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(201).json({ message : 'publication likee !'}))
                .catch(error => console.log(error) || res.status(400).json(error))
            }
            else {
                return res.status(401).json({ error : 'auto-like interdit' })
            }
        }
        //========//doublon : RETIRER
        else {
            await prisma.like.delete({
                where : { id : findLike.id }
            })
            .then(async () => { await prisma.$disconnect() })
            .then(() => res.status(200).json({ message : 'like supprime !' }))
            .catch(error => res.status(401).json(error))
        }
    } else {
        return res.status(401).json({ error : 'Acces non authorise' });
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
    .catch(error => console.log(error) || res.status(400).json(error));
}