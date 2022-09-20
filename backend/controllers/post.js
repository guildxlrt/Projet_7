//========//IMPORTS//========//
const utils = require('../utils/utils');
//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//================//POST//================//

//========//NOUVEAU
exports.createPost = async (req, res, next) => {
    // utilisateur
    const findUser = utils.findUser({id : req.auth.userId})

    if (findUser.isActive) {
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
        .catch(error => console.log(error) || res.status(400).json({ message : error }))
    } else {
        return res.status(401).json({ message : 'Acces non authorise' })
    }

    
};

//========//TOUT AFFICHER
exports.getAllPosts = async (req, res, next) => {
    // recherche
    await prisma.post.findMany({
        where : { isActive : true }
    })
    .then(posts => res.status(200).json(posts))
    .then(async () => { await prisma.$disconnect() })
    .catch(error => console.log(error) || res.status(400).json({ message : error }));
};

//========//UN SEUL
exports.getOnePost = async (req, res, next) => {
    // recherche
    utils.findPost({id : Number(req.params.id)})
    .then(post => res.status(200).json(post))
    .then(async () => { await prisma.$disconnect() })
    .catch(error => console.log(error) || res.status(404).json({ message : error }));
};


//========//MODIFIER
exports.modifyPost = async (req, res, next) => {
    // Recherche
    utils.findPost({id : Number(req.params.id)})
    .then(async (post) => {
        
        // verification utilisateur
        const findUser = utils.findUser({id : req.auth.userId})

        if ((post.userId === req.auth.userId) && (findUser.isActive)) {
            //---Recherche fichier
            const content = req.file ? {
                ...JSON.parse(req.body),
                imageUrl : utils.newImageUrl(req)
            } : { ...req.body };

            //---Suppression ancien fichier
            //---Suppression fichier
            fileDel(post.imageUrl)

            //---Enregistrement
            await prisma.post.update({
                where : { id : Number(req.params.id) },
                data : content
            })
            .then(async () => { await prisma.$disconnect() })
            .then(() => res.status(200).json({ message : 'Publication modifie !' }))
            .catch(error => console.log(error) || res.status(401).json({ message : error }));

        } else {
            return res.status(401).json({ message : 'Acces non authorise' })
        }
    })
    .catch(error => console.log(error) || res.status(500).json({ message : error }));
};

//========//SUPPRIMER
exports.deletePost = async (req, res, next) => {
    //---Quel utilisateur ?
    //------ADMINISTRATEUR
    if (req.auth.isAdmin) {
        utils.findUser({id : req.auth.userId})
        .then(async admin => {
            // verification administrateur
            if ((req.auth.userId === admin.id) && (admin.isActive) && (admin.isAdmin)) {
                
                //---Suppression fichier
                utils.findPost({id : Number(req.params.id)})
                .then(post => {
                    fileDel(post.imageUrl)
                })

                //---Suppression dans la BDD
                await prisma.post.delete({
                    where : { id : Number(req.params.id)}
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ message : 'publication supprime !' }))
                .catch(error => res.status(401).json({ message : error }))

            } else {
                return res.status(401).json({ message : 'Acces non authorise' })
            }
        })
    }
    //------UTILISATEUR NORMAL
    else {
        // Recherche dans le post
        utils.findPost({id : Number(req.params.id)})
        .then(async post => {
            // verification utilisateur
            const user = utils.findUser({id : req.auth.userId})
            if ((post.userId === req.auth.userId) && (user.isActive)) {
                
                //---Suppression fichier
                fileDel(post.imageUrl)

                //---Suppression dans la BDD
                await prisma.post.delete({
                    where : { id : Number(req.params.id)}
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ message : 'publication supprime !' }))
                .catch(error => res.status(401).json({ message : error }))

            } else {
                return res.status(401).json({ message : 'Acces non authorise' })
            }
        })
        .catch(error => res.status(500).json({ message : error }));
    }
};

//================//LIKER//================//
exports.likePost = async (req, res, next) => {
    //---RECHERCHES
    // like doublon
    const findLike = await prisma.like.findFirst({
        where : {
            userId : req.auth.userId,
            postId : Number(req.params.id)
        }
    })
    // publication
    const findPost = utils.findPost({id : Number(req.params.id)})
    // utilisateur
    const findUser = utils.findUser({id : req.auth.userId})

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
                .catch(error => console.log(error) || res.status(400).json({ message : error }))
            }
            else {
                return res.status(401).json({ message : 'auto-like interdit' })
            }
        }
        //========//doublon : RETIRER
        else {
            await prisma.like.delete({
                where : { id : findLike.id }
            })
            .then(async () => { await prisma.$disconnect() })
            .then(() => res.status(200).json({ message : 'like supprime !' }))
            .catch(error => res.status(401).json({ message : error }))
        }
    } else {
        return res.status(401).json({ message : 'Acces non authorise' });
    }
};