//========//IMPORTS//========//
const bcrypt = require('bcrypt');
const utils = require('../utils/utils');
const errMsg = require('../utils/errorMsg');
const blockUser = require('../utils/blockUser')
const { parse } = require('dotenv');
const errorFileReq = require('../utils/errorFileReq')

//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//================//MANAGE//================//

//========//MODIFICATIONS
exports.update = async (req, res, next) => {
    const auth = req.auth.userId
    
    // Recherche de l'utilisateur
    await utils.findUser({id : auth})
    .then(async user => {
        // verification utilisateur
        if ((user.id === auth) && (user.isActive)) {

            //====// Traitement des donnees
            let userDatas = {
                surname : user.surname,
                name : user.name,
                birthday : user.birthday
            }

            //----New Value
            if (req.body.surname) userDatas.surname = req.body.surname
            if (req.body.name) userDatas.name = req.body.name
            if (req.body.birthday) {
                userDatas.birthday = utils.birthdayFormat(req.body.birthday)
            }

            //====// Validation de donnees
            const legalAgeTest = utils.ageValidator(userDatas.birthday)
            const surnameTest = utils.surnameValid(userDatas.surname)
            const nameTest = utils.nameValid(userDatas.name)

            //----Valid
            if ((surnameTest === true) && (nameTest === true) && (legalAgeTest === true)) {
                // Enregistrement dans la BDD
                await prisma.user.update({
                    where : { id : auth },
                    data : userDatas
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ 
                    message : 'utilisateur modifie : ',
                    updates : { ...userDatas }
                }))
                .catch(error =>  res.status(500).json(error))
            }
            //----Erreurs
            else {
                let error = {};

                // Prenom
                if ((surnameTest) === false) {
                    error.surname = errMsg.surnameErr
                }

                // Nom
                if (nameTest === false) {
                    error.name = errMsg.nameErr
                }
                // Date
                if ((userDatas.birthday === "") || (userDatas.birthday === null)) {
                    error.date = errMsg.dateErr
                }
                if (legalAgeTest === false) {
                    error.legal_age = errMsg.legalAgeErr
                }

                return res.status(400).json(error)
            }
        // Mauvais utilisateur
        } else {
            return res.status(403).json(errMsg.authErr);
        }
    })
    .catch(error =>  res.status(500).json(error));
}

//========//CHANGER MDP
exports.password = async (req, res, next) => {
    const auth = req.auth.userId

    console.log(req.body.newPass+'||'+req.body.passConfirm)

    // Recherche de l'utilisateur
    await utils.findUser({id : auth})
    //-----VERIFICATION
    .then(async user => {
        // utilisateur
        if ((user.id === auth) && (user.isActive)) {
            // ancient
            await bcrypt.compare(req.body.password, user.password)
            .then(async valid => {
                if (valid) {
                    //---Nouveau
                    if ((req.body.password != req.body.newPass) && (req.body.newPass === req.body.passConfirm) && (utils.passwdValid(req.body.newPass))) {
                        bcrypt.hash(req.body.passConfirm, 10)
                        .then(async hash => {
                            // enregistrement du nouveau mot de passe
                            await prisma.user.update({
                                where : { id : auth },
                                data : { password : hash }
                            })
                            .then(async () => { await prisma.$disconnect() })
                            .then(() => res.status(200).json({ message : 'mot de passe modifie !' }))
                            .catch(error =>  res.status(500).json(error));
                        })
                    }
                    //---Erreurs
                    else {
                        let error = {}

                        // renouvellement
                        if (req.body.password === req.body.newPass) {
                            error.renewal = errMsg.renewal
                        }
                        // concordance
                        if (!(req.body.newPass === req.body.passConfirm)) {
                            error.congruency = errMsg.passwordConfErr
                        }
                        // force
                        if (!(utils.passwdValid(req.body.newPass))) {
                            error.force = errMsg.passStrenght
                        }

                        return res.status(400).json({ error : error })
                    }
                // mauvais mot de passe
                } else {
                    res.status(403).json({ error : { entry : errMsg.passErr} })
                }
            })
            .catch(error =>  res.status(500).json(error));
        // mauvais utilisateur
        } else {
            return res.status(403).json(errMsg.authErr);
        }
    })
    .catch(error =>  res.status(500).json(error));
}

//========//DESACTIVER
exports.disable = async (req, res, next) => {
    const target = Number(req.params.id)
    const auth = req.auth.userId

    //---Quel utilisateur ?
    //------ADMINISTRATEUR
    if (req.auth.isAdmin === true) {
        await utils.findUser({id : auth})
        //---Verifications
        .then(async admin => {
            // administrateur
            if ((auth === admin.id) && (admin.isAdmin === true) && (admin.isActive === true)) {
                await utils.findUser({id : target})
                .then( async user => {
                    // DESACTIVER
                    if (user.isActive === true) {
                        blockUser(user.id, false, req, res)
                    }
                    // REACTIVER 
                    else {
                        blockUser(user.id, true, req, res)
                    }
                })
            //non admin
            } else {
                res.status(403).json(errMsg.authErr);
            }
        })
        .catch(error =>  res.status(500).json(error));
    }
    //------UTILISATEUR NORMAL
    else {
        // Recherche de l'utilisateur
        await utils.findUser({id : target})
        //----Verification
        .then(async user => {
            // utilisateur
            if ((auth === user.id ) && (user.isActive)) {
                //mot de passe
                await bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (valid) {
                            // email
                            if (req.body.email === user.email) {
                                blockUser(user.id, false, req, res)
                            }
                            // mauvais
                            else {
                                res.status(403).json(errMsg.emailUser);
                            }
                        //Mauvais mot de passe
                        } else {
                            res.status(403).json({error : errMsg.passErr})
                    }
                })
                .catch(error =>  res.status(500).json(error));
            // mauvais utilisateur
            } else {
                res.status(403).json(errMsg.authErr);
            }
        })
        .catch(error =>  res.status(500).json(error));
    }
}

//================//AVATAR//================//

//========//CHANGER AVATAR
exports.avatar = async (req, res, next) => {
    const auth = req.auth.userId

    await utils.findUser({id : auth})
    .then(async user => {
        //----Verification
        if ((auth === user.id ) && (user.isActive)) {
            const oldFile = user.avatarUrl.split('/images/')[1]
            const url = utils.newAvatarUrl(req);
     
            //----Suppression Ancient fichier
            if (!(oldFile === 'random-user.png')) {
                const fileToRm = user.avatarUrl.split('/images/users/')[1];
                utils.fileDel(fileToRm)
            }

            //---- Nouveau fichier
            if (req.file) {
                //----Replacer nouveau fichier
                utils.fileMove('users', req.file.filename)
            }

            let message = req.file ? ('user ' + user.id +  ' : Nouvel avatar !') : ('user ' + user.id +  ' : Avatar par defaut');

            if (!(req.file) && (oldFile === 'random-user.png')) {
                return res.status(304).end()
            } else {
                // Enregistrer
                await prisma.user.update({
                    where : { id : auth },
                    data : { avatarUrl : url }
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ message : message }))
                .catch(error =>  errorFileReq(error, 500, req, res))
            }
        } else {
            errorFileReq(errMsg.authErr, 403, req, res)
        }
    })
    .catch(error => errorFileReq(error, 500, req, res));
}