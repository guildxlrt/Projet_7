//===================================//
//========//USER MANAGEMENT//========//
//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//========//Update User Status
exports.userBlocking = async (targetId, bolValue, req, res) => {
    //---Utilisateur
    await prisma.user.update({
        where : { id : targetId },
        data : { 
            isActive : bolValue,
            Post : {
                updateMany : {
                    where : { userId : targetId },
                    data : { isActive : bolValue }
                } 
            },
            Comment : {
                updateMany : {
                    where : { userId : targetId },
                    data : { isActive : bolValue }
                } 
            }
        },
    })
    .then(() => {
        if (bolValue === false) {
            console.log('Compte Desactive !') || res.status(200).json({ message : 'Compte Desactive !' })
        } else {
            console.log('Compte (re)active !') || res.status(200).json({ message : 'Compte (re)active !' })
        }
    })
    .catch(error => res.status(500).json({ error : error }))
}

//=================================//
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

