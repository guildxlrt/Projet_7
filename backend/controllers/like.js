//========//IMPORTS//========//
const utils = require('../utils/utils');
const errMsg = require('../utils/errorMsg')

//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//================// LIKER //================//
exports.likePost = async (req, res, next) => {
    const liker = req.auth.userId
    const postToLike = Number(req.params.id_post)
    
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
                .then((like) => res.status(201).json(like))
                .catch(error =>  res.status(500).json(error))
            }
            // empecher autolike
            else {
                return res.status(403).json(errMsg.autolikeErr)
            }
        }
        //========//doublon
        else {
            return res.status(403).json(errMsg.likeErr)
        }
    // mauvais utilisateur
    } else {
        return res.status(403).json(errMsg.authErr);
    }
};

//================// DISLIKE //================//
exports.unlikePost = async (req, res, next) => {
    const liker = req.auth.userId
    const postToDislike = Number(req.params.id_post)
    
    //---RECHERCHES
    // utilisateur
    const findUser = await utils.findUser({id : liker})
    // publication
    const findPost = await utils.findPost({id : postToDislike})
    // like doublon
    const findLike = await prisma.like.findFirst({
        where : {
            userId : liker,
            postId : postToDislike
        }
    })

    // l'utilisateur et le post doivent etre actif
    if ((findUser.isActive) && (findPost.isActive)) {
        // CONDITIONS
        //========// RETIRER
        if (Boolean(findLike)) {
            await prisma.like.delete({
                where : { id : findLike.id }
            })
            .then(async () => { await prisma.$disconnect() })
            .then(() => res.status(200).json({ message : 'like supprime !' }))
            .catch(error => res.status(500).json(error))
        }
        else {
            return res.status(400).json(errMsg.unlikeErr);
        }

    // mauvais utilisateur
    } else {
        return res.status(403).json(errMsg.authErr);
    }
}