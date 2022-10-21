//================//IMPORTS//================//
const fs = require('fs')
const pwVal = require("password-validator");
//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//========//File Move
exports.fileMove = (folder, filename) => {  
    console.log(folder)  
    fs.rename(`images/${filename}`, `images/${folder}/${filename}`, (err) => {
        if (!err) console.log(filename+" has been moved to "+folder)
    })
}

//=======// Clean store
exports.fileDel = (filename) => {
    const folders = [ `images/`, `images/users/`, `images/posts/`]

    folders.forEach((folder) => {
        const link = `${folder}${filename}`
        fs.unlink(link, (err) => {
            if (!err) console.log(filename+" has been removed")
        })
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


//==================================//
//========//USER CREATION//========//

//--------//Email validation
exports.emailValid = (value) => new RegExp(/^([a-z0-9._-]+)@([a-z0-9]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/, 'g').test(value);

//--------//Name validation
exports.surnameValid = (value) => new RegExp(/^([a-zA-ZÀ-ÿ]{2,26})(-[a-zA-ZÀ-ÿ]{2,26})?(\s[a-zA-ZÀ-ÿ]{2,26})?$/, 'g').test(value);

//--------//Surname validation
exports.nameValid = (value) => new RegExp(/^([a-zA-ZÀ-ÿ]{1,3}\s)?([a-zA-ZÀ-ÿ]{1,3}[']{1})?([a-zA-ZÀ-ÿ]{2,26})(\s[a-zA-ZÀ-ÿ]{2,26})?(-[a-zA-ZÀ-ÿ]{2,26})?(\s[a-zA-ZÀ-ÿ]{2,26})?$/, 'g').test(value);

//--------//Format birthday
exports.birthdayFormat = (value) => new Date(value)

exports.ageValidator = (value) => {
    const now = new Date();
    const inputDate = new Date(value)
    const oneYear = 1000 * 60 * 60 * 24 * 365  
                      
    const age = (now - inputDate) / oneYear
    const limitAge = 18

    if (age < limitAge) {
        return false
    }
    else {
        return true
    }
}

//--------//Password
exports.passwdValid = (value) => new pwVal()
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(2)                              // Must have uppercase letters
    .has().lowercase(2)                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']) // Blacklist these value
    .validate(value);

