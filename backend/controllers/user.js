//========//IMPORTS//========//
const bcrypt = require('bcrypt');
const utils = require('../utils/utils');
const errMsg = require('../utils/errorMsg');
const { parse } = require('dotenv');
//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

        
//================//UTILISATEURS//================//

//========//NOUVEAU
exports.signup = (req, res, next) => {
    (function reqValidation() {
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
                        const ntk = utils.tokenGen(newUser.id, newUser.isAdmin)

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
                        const ntk = utils.tokenGen(user.id, user.isAdmin)

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
    await prisma.user.findMany()
    .then(users => res.status(200).json(users))
    .then(async () => { await prisma.$disconnect() })
    .catch(error =>  res.status(500).json(error));
};


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
                        utils.userManage(user.id, false, req, res)
                    }
                    // REACTIVER 
                    else {
                        utils.userManage(user.id, true, req, res)
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
                                utils.userManage(user.id, false, req, res)
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
                const oldFile = user.avatarUrl.split('/images/users/')[1];
                utils.fileDel('users', oldFile)
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
                .catch(error =>  res.status(500).json(error))
            }
        } else {
            res.status(403).json(errMsg.authErr);
        }
    })
    .catch(error =>  res.status(500).json(error));
}