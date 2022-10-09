//================//IMPORTS//================//
const fs = require('fs')
const pwVal = require("password-validator");
const jwt = require('jsonwebtoken');
//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//========//File Mover
exports.fileMove = (folder, filename) => {    
    fs.rename(`images/${filename}`, `images/${folder}/${filename}`, (err) => {
        if (err) {
            console.log("Echec lors de la redirection du fichier : " + err)
        } else {
            console.log("le fichier a ete deplace")
        }
    })
}

//========//File suppressor
exports.fileDel = (folder, filename) => {
    let link = `images/${folder}/${filename}`
    if (folder === '/') {link = `images/${filename}`}

    fs.unlink(link, (err) => {
        if (err) {
            console.log("Echec lors de la suppression du fichier : " + err)
        } else {
            console.log("le fichier a ete supprime")
        }
    })
}

//========//Image URL
exports.newAvatarUrl = (req) => {
    const url = req.file ? (
        `${req.protocol}://${req.get('host')}/images/users/${req.file.filename}`
    ) : (
        `./images/random-user.png` 
    )
    return url
}

exports.newImageUrl = (req) => `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`

//========//Recherche
exports.findUser = async (props) => await prisma.user.findUnique({ where : props });

exports.findPost = async (props) => await prisma.post.findUnique({ where : props });

exports.findComment = async (props) => await prisma.comment.findUnique({ where : props });

//========//FORMATAGE DATES
exports.dateFormat = (rawDate) => {
    return new Date(rawDate).toISOString().split("T")[0]
}
