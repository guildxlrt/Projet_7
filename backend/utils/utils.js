//================//IMPORTS//================//
const fs = require('fs')
const pwVal = require("password-validator");
//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//========//File suppressor
exports.fileDel = (target) => {
    //---Suppression fichier
    const filename = target.split('/images/')[1];
    fs.unlink(`images/${filename}`, (err) => {
        if (err) {
            console.log("Echec lors de la suppression du fichier : " + err)
        } else {
            console.log("le fichier a ete supprime")
        }
    })
}

//========//Get new URL
exports.newImageUrl = (req) => `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

//========//Email validation
exports.emailValid = (value) => new RegExp(/^([a-z0-9._-]+)@([a-z0-9]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/, 'g').test(value);

//========//Password
exports.passwdValid = (value) => new pwVal()
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(2)                              // Must have uppercase letters
    .has().lowercase(2)                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']) // Blacklist these value
    .validate(value)
;

//========//Format birthday
exports.birthday = (date) => date ? new Date(date) : null;

//========//Recherche
exports.findUser = async (props) => await prisma.user.findUnique({ where : props });

exports.findPost = async (props) => await prisma.post.findUnique({ where : props });

exports.findComment = async (props) => await prisma.comment.findUnique({ where : props });

//========//Update User Status
exports.userManage = async (targetId, bolValue, req, res) => {
    //---Utilisateur
    await prisma.user.update({
        where : { id : targetId },
        data : { isActive : bolValue }
    })
    .then( console.log('user status update') )
    //---Publications
    .then(async () => {
        await prisma.post.updateMany({
            where : { userId : targetId },
            data : { isActive : bolValue }
        })
        .then( console.log('user posts update') )
        .catch(error => console.log(error));
    })
    //---Commentaires
    .then(async () => {
        await prisma.comment.updateMany({
            where : { userId : targetId },
            data : { isActive : bolValue }
        })
        .then( console.log('user comments update') )
        .catch(error => console.log(error));
    })
    .then(async () => { await prisma.$disconnect() })
    .then(() => {
        if (bolValue === false) {
            console.log('Compte Desactive !') || res.status(200).json({ message : 'Compte Desactive !' })
        } else {
            console.log('Compte (re)active !') || res.status(200).json({ message : 'Compte (re)active !' })
        }
    })
    .catch(error => console.log(error) || res.status(401).json({ message : error }))
}

//========//Update Avatar BDD
exports.avatarUpdate = async (auth, url) => {
    let message = '';
    if (url == null) { message = 'Avatar supprime !' }
    else { message = 'Avatar change !' }

    //---Enregistrer
    await prisma.user.update({
        where : { id : auth },
        data : { avatarUrl : url }
    })
    .then(async () => { await prisma.$disconnect() })
    .then(() => res.status(200).json({ message : message }))
    .catch(error => console.log(error) || res.status(401).json({ message : error }));
} ;
