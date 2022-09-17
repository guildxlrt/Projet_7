//---IMPORTS
//const fs = require('fs')
// prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// TOUT AFFICHER
exports.getAllPosts = async (req, res, next) => {
    // recherche
    await prisma.post.findMany()
    .then(async () => { await prisma.$disconnect() })
    .then(posts => res.status(200).json(posts))
    .catch(error => console.log(error) || res.status(400).json({ message : error }));
};

// UN SEUL
exports.getOnePost = async (req, res, next) => {
    // recherche
    await prisma.post.findUnique({
        where : {
            id : Number(req.params.id)
        }
    })
    .then(async () => { await prisma.$disconnect() })
    .then(post => res.status(200).json(post))
    .catch(error => console.log(error) || res.status(404).json({ message : error }));
};

// NOUVEAU
exports.createPost = async (req, res, next) => {
    // Condition Fichier
    const content = req.file ? {
        ...JSON.parse(req.body),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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
};

// MODIFIER
exports.modifyPost = async (req, res, next) => {
    // Recherche
    await prisma.post.findUnique({
        where : {
            id : Number(req.params.id)
        }
    })
    .then(async (post) => {
        // verification utilisateur
        if (post.userId === req.auth.userId) {
            // enregistrement
            await prisma.post.update({
                where : {
                    id : Number(req.params.id)
                },
                data : {
                    title : req.body.modify.title,
                    text : req.body.modify.text
                }
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

// SUPPRIMER
exports.deletePost = async (req, res, next) => {
     // Recherche 
     await prisma.post.findUnique({
        where : {
            id : Number(req.params.id)
        }
    })
    .then(async (post) => {
        // verification utilisateur
        if (post.userId === req.auth.userId) {
            // enregistrement
            await prisma.post.delete({
                where : {
                    id : Number(req.params.id)
                }
            })
            .then(async () => { await prisma.$disconnect() })
            .then(() => res.status(200).json({ message : 'publication supprime !' }))
            .catch(error => res.status(401).json({ message : error }))
        } else {
            return res.status(401).json({ message : 'Acces non authorise' })
        }
    })
    .catch(error => res.status(500).json({ message : error }));
};

// anti-autolike    : Ok
// anti-multilike   : No
// LIKER
exports.likePost = async (req, res, next) => {
    // Recherche du post
    await prisma.post.findUnique({
        where : {
            id : Number(req.params.id)
        }
    })
    .then( async (post) => {
        // empecher les auto-like
        if (post.userId != req.auth.userId) {
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
    })
};

// COMMENTER
exports.commentPost = async (req, res, next) => {
    // enregistrement
    await prisma.comment.create({
        data : {
            text : req.body.text,
            postId : Number(req.params.id),
            userId : req.auth.userId
        }
    })
    .then(async () => { await prisma.$disconnect() })
    .then(() => res.status(201).json({ message : 'commentaire publie !'}))
    .catch(error => console.log(error) || res.status(400).json({ message : error }))
};