//========//IMPORTS//========//
const bcrypt = require('bcrypt');
const utils = require('../utils/utils');
const errMsg = require('../utils/errorMsg');
const token = require('../utils/token');
const { parse } = require('dotenv');
const errorFileReq = require('../utils/errorFileReq')

//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

        
//================//UTILISATEURS//================//

//========//NOUVEAU
exports.signup = (req, res, next) => {
    (function reqValidation() {
        debugger;
        // formatage date
        const birthday = utils.birthdayFormat(req.body.birthday);


        //====// Validation de donnees 
        const legalAgeTest = utils.ageValidator(birthday)
        const emailTest = utils.emailValid(req.body.email)
        const passStrength = utils.passwdValid(req.body.password)
        const surnameTest = utils.surnameValid(req.body.surname)
        const nameTest = utils.nameValid(req.body.name)

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
                        errorFileReq(errMsg.emailInUse, 405, req)
                    } else {
                        errorFileReq(error, 500, req)
                    }
                })
            })
            .catch(error => errorFileReq(error, 500, req));
        }
        //---REJET
        else {
            let error = {}
            // Email
            if ((utils.emailValid(req.body.email)) === false) {
                error.email = errMsg.emailSignup
            }
            // Mot De Passe
            if ((utils.passwdValid(req.body.password)) === false) {
                error.password = errMsg.passStrenght
            }
            if (req.body.password !== req.body.passConfirm) {
                error.passConfirm = errMsg.passwordConfErr
            }
            // prenomNom
            if ((utils.surnameValid(req.body.surname)) === false) {
                error.surname = errMsg.surnameErr
            }
            // Nom de famille
            if ((utils.nameValid(req.body.name)) === false) {
                error.name = errMsg.nameErr
            }
            // Date de naissance
            if ((req.body.birthday === "") || (req.body.birthday === null)) {
                error.date = errMsg.dateErr
            }
            if (legalAgeTest === false) {
                error.legal_age = errMsg.legalAgeErr
            }

            return errorFileReq({ error : error }, 400, req)
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
    const auth = req.auth

    //---Quel utilisateur ?
    //------ADMINISTRATEUR
    if (auth.isAdmin) {
        await utils.findUser({id : auth.userId})
        //---Verifications
        .then(async admin => {
            // administrateur
            if ((auth.userId === admin.id) && (admin.isAdmin === true) && (admin.isActive === true)) {
                // RECHERCHE
                await prisma.user.findMany()
                .then((users) => {
                    users.map((user) => {
                        delete user.password
                        return user
                    })
                    res.status(200).json(users)
                })
                .catch(error =>  res.status(500).json(error));
            //non admin
            } else {
                res.status(403).json(errMsg.authErr);
            }
        })
        .catch(error =>  res.status(500).json(error));
    }
    //------UTILISATEUR NORMAL
    else {
        // Recherche
        await prisma.user.findMany({
            where: {
                isActive : true
            }
        })
        .then((users) => {
            users.map((user) => {
                // delete user.password
                // delete user.isActive
                return user
            })
            res.status(200).json(users)
        })
        .catch(error =>  res.status(500).json(error));
    }
};