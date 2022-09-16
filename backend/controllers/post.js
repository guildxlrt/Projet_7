//---IMPORTS
//const fs = require('fs')
// prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// AFFICHER TOUT
exports.getAllPosts = async (req, res, next) => {
    await prisma.post.findMany()
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json({error}));
};
// AFFICHER UNE SEULE
exports.getOnePost = async (req, res, next) => {
    await prisma.post.findUnique({
        where : {
            id : Number(req.params.id)
        }
    })
    .then(post => res.status(200).json(post))
    .catch(error => res.status(404).json({error}));
};

exports.createPost = async (req, res, next) => {
    //---Verification
    const content = req.file ? {
        ...JSON.parse(req.body),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId : req.auth.userId
    } : { 
        ...req.body,
        userId : req.auth.userId
    };

    //---Enregistrement    
    try {
        await prisma.post.create({data : content})
        .then(async () => {
            await prisma.$disconnect()
        })
        .then(() => res.status(201).json({ message : 'Post cree !'}))
    }
    catch (e) {
        console.error(e) || res.status(400).json({error : e })
        await prisma.$disconnect()
        process.exit(1)
    }
};

// MODIFIER
exports.modifyPost = (req, res, next) => {
    console.log('test')
};

// SUPPRIMER
exports.deletePost = (req, res, next) => {
    console.log('test') 
};


// LIKER
exports.likePost = (req, res, next) => {
    console.log('test')
};

// COMMENTER
exports.commentPost = (req, res, next) => {
    console.log('test')
};