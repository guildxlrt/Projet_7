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
exports.passwdValid = async (value) => {
    const schema = new pwVal();

    // configuration
    schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(2)                              // Must have uppercase letters
    .has().lowercase(2)                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
    
    // invocation
    schema.validate(value)
};

exports.findUser = async (props) => await prisma.user.findUnique({ where : props });

exports.findPost = async (props) => await prisma.post.findUnique({ where : props });

exports.findComment = async (props) => await prisma.comment.findUnique({ where : props });

