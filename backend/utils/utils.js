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

//========//Recherche
exports.findUser = async (props) => await prisma.user.findUnique({ where : props });

exports.findPost = async (props) => await prisma.post.findUnique({ where : props });

exports.findComment = async (props) => await prisma.comment.findUnique({ where : props });


//========//USER CREATION//========//

//--------//Error messages
exports.emailErr = "l'email doit etre au format email : jack.nicholson@laposte.fr, sasha93.dupont@yahoo.fr, kanap-service_client@kanap.co.fr ...";
exports.passErr = "le mot de passe n'est pas assez fort : il doit contenir au minimum 2 chiffres, 2 minuscules et 2 majuscules; il doit etre d'une longueur minimum de 8 caracteres";
exports.surnameErr = "Votre prenom doit comporter 2 caracteres minimum, avec  une majuscule suivit de minuscules: Paul, Marie-Louise, Jose Antonio ...";
exports.nameErr = "Votre nom de famille doit comporter 2 caracteres minimum, avec une majuscule suivit de minuscules : Dupont, D'Artagnan, De Sade, Primo De Rivera ...";

//--------//Email validation
exports.emailValid = (value) => new RegExp(/^([a-z0-9._-]+)@([a-z0-9]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/, 'g').test(value);

//--------//Name validation
exports.surnameValid = (value) => new RegExp(/^([a-zA-ZÀ-ÿ]{2,26})(-[a-zA-ZÀ-ÿ]{2,26})?(\s[a-zA-ZÀ-ÿ]{2,26})?$/, 'g').test(value);

//--------//Surname validation
exports.nameValid = (value) => new RegExp(/^([a-zA-ZÀ-ÿ]{1,3}\s)?([a-zA-ZÀ-ÿ]{1,3}[']{1})?([a-zA-ZÀ-ÿ]{2,26})(\s[a-zA-ZÀ-ÿ]{2,26})?(-[a-zA-ZÀ-ÿ]{2,26})?(\s[a-zA-ZÀ-ÿ]{2,26})?$/, 'g').test(value);

//--------//Format birthday
exports.birthday = (value) => value ? new Date(value) : null;

//--------//Password
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

//========//USER MANAGEMENT//========//


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