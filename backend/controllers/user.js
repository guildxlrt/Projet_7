//========//IMPORTS//========//
const bcrypt = require('bcrypt');
const utils = require('../utils/utils');
const errMsg = require('../utils/errorMsg');
const usrTools = require('../utils/usrTools')
const token = require('../utils/token')
const { parse } = require('dotenv');
//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

        
//================//UTILISATEURS//================//

//========//NOUVEAU
exports.signup = (req, res, next) => {
    (function reqValidation() {
        // formatage date
        const birthday = usrTools.birthdayFormat(req.body.birthday);

        //====// Validation de donnees 
        const legalAgeTest = usrTools.ageValidator(birthday)
        const emailTest = utusrToolsils.emailValid(req.body.email)
        const passStrength = usrTools.passwdValid(req.body.password)
        const surnameTest = usrTools.surnameValid(req.body.surname)
        const nameTest = usrTools.nameValid(req.body.name)

        //---ACCEPT
        if ((legalAgeTest === true) && (emailTest === true) && (passStrength === true) && (req.body.password === req.body.passConfirm) && (surnameTest === true) && (nameTest === true)) {
            bcrypt.hash(req.body.password, 10)
            .then(async hash => {

                // construction
                const datas = {
                    surname : req.body.surname,
                    name : req.body.name,
                    birthday : birthday,
                    email : req.body.email,
                    password : hash
                }
            
                const newUser = { 
                    ...datas,
                    avatarUrl : utils.newAvatarUrl(req)
                }

                // redirection du nouveau fichier
                if (req.file) {
                    utils.fileMove('users', req.file.filename)
                }

                // enregistrement
                await prisma.user.create({ data : newUser })
                .then(async () => {
                    await utils.findUser({email : req.body.email})
                    .then(newUser => {
                        const ntk = token.tokenGen(newUser.id, newUser.isAdmin)

                        // Creation Cookie de connexion                        
                        res
                        .cookie('jwt', ntk.gen, { maxAge : ntk.exp, httpOnly : true, sameSite: 'lax', secure: false })
                        .status(201).json({
                            message : 'utilisateur cree !',
                            userId : newUser.id,
                            isAdmin : newUser.isAdmin
                        })
                    })
                })
                .then(async () => { await prisma.$disconnect() })
                .catch(error => {
                    if (error.code === "P2002") {
                        // EMAIL DEJA UTILISE
                        res.status(405).json(errMsg.emailInUse)
                    } else {
                        console.log(error) || res.status(500).json(error)
                    }
                })
            })
            .catch(error =>  res.status(500).json(error));
        }
        //---REJET
        else {
            let error = {}
            // Email
            if ((usrTools.emailValid(req.body.email)) === false) {
                error.email = errMsg.emailSignup
            }
            // Mot De Passe
            if ((usrTools.passwdValid(req.body.password)) === false) {
                error.password = errMsg.passStrenght
            }
            if (req.body.password !== req.body.passConfirm) {
                error.passConfirm = errMsg.passwordConfErr
            }
            // prenomNom
            if ((usrTools.surnameValid(req.body.surname)) === false) {
                error.surname = errMsg.surnameErr
            }
            // Nom de famille
            if ((usrTools.nameValid(req.body.name)) === false) {
                error.name = errMsg.nameErr
            }
            // Date de naissance
            if ((req.body.birthday === "") || (req.body.birthday === null)) {
                error.date = errMsg.dateErr
            }
            if (legalAgeTest === false) {
                error.legal_age = errMsg.legalAgeErr
            }

            return res.status(400).json({ error : error })
        }
    })();
};


//========//CONNEXION
exports.login = async (req, res, next) => {
    await utils.findUser({email : req.body.email})
    .then(async user => {
        if (user) {
            // Compte actif
            if (user.isActive) {
                // mot de passe
                await bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (valid) {
                        const ntk = token.tokenGen(user.id, user.isAdmin)

                        // Creation Cookie de connexion
                        res
                        .cookie('jwt', ntk.gen, { maxAge : ntk.exp, httpOnly : true, sameSite: 'lax', secure: false })
                        .status(200).json({
                            userId : user.id,
                            isAdmin : user.isAdmin
                        })
                    }
                    // mauvais mot de passe
                    else {
                        res.status(401).json(errMsg.passLogin);
                    }
                })
                .catch(error =>  res.status(500).json(error));
            // utilisateur inactif
            } else {
                return res.status(401).json(errMsg.unactived);
            }
        }
        // mauvais email
        else {
            return res.status(401).json(errMsg.unknowEmail);
        }
    })
    .catch(error =>  res.status(500).json(error));
};

//========//DECONNEXION
exports.logout = async (req, res, next) => {
    if(req.cookies.jwt) {
        // Suppression du cookie
       return res
       .clearCookie('jwt')
       .status(200).json({ message : "Deconnexion utilisateur reussie" }) 
    } else {
        return res.status(400).json(errMsg.tokkenErr)
    }
}

//========//DECODE TOKEN
exports.userToken = async (req, res, next) => {
    return res.status(200).json(req.auth)
}

//========//USER PROFIL
exports.userInfos = async (req, res, next) => {

    // Recherche de l'utilisateur
    await utils.findUser({id : Number(req.params.id)})
    .then(async (datas) => {
        const infos = {
            id : datas.id,
            email : datas.email,
            name : datas.name,
            surname : datas.surname,
            birthday : utils.dateFormat(datas.birthday),
            signupDate : utils.dateFormat(datas.signupDate),
            avatarUrl : datas.avatarUrl,
            isActive : datas.isActive,
            isAdmin : datas.isAdmin
        }
        return res.status(200).json(infos)
    })
    .catch(() => res.status(404).json(errMsg.userNotFound));
}

//========//TOUT LES UTILISATEURS
exports.getAllUsers = async (req, res, next) => {
    // recherche
    await prisma.user.findMany({
        where: {
            isActive : true,
        }
    })
    .then(users => res.status(200).json(users))
    .then(async () => { await prisma.$disconnect() })
    .catch(error =>  res.status(500).json(error));
};