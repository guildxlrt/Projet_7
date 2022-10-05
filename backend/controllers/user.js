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
        if (req.body.birthday !== "") {console.log(2)}

        //---ACCEPT
        if ((utils.emailValid(req.body.email)) && (utils.passwdValid(req.body.password)) && (req.body.password === req.body.passConfirm) && (utils.surnameValid(req.body.surname)) && (utils.nameValid(req.body.name))) {
            bcrypt.hash(req.body.password, 10)
            .then(async hash => {
                // formatage date
                const birthday = utils.birthday(req.body.birthday)

                // construction
                const datas = {
                    surname : req.body.surname,
                    name : req.body.name,
                    birthday : birthday,
                    email : req.body.email,
                    password : hash
                }
                
                // recherche de fichier
                const newUser = { 
                    ...datas,
                    avatarUrl : utils.newAvatarUrl(req)
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
            .catch(error => console.log(error) || res.status(500).json(error));
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
            if (req.body.birthday === "") {
                error.date = errMsg.dateErr
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
                .catch(error => console.log(error) || res.status(500).json(error));
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
    .catch(error => console.log(error) || res.status(500).json(error));
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
    const auth = req.auth.userId

     // Recherche de l'utilisateur
     await utils.findUser({id : Number(req.params.id)})
     .then(async user => {
        if ((user.id === auth) && (user.isActive)) {
            // recherche
            await utils.findUser({ id : auth })
            .then((datas) => {
                const infos = {
                    id : datas.id,
                    email : datas.email,
                    name : datas.name,
                    surname : datas.surname,
                    birthday : utils.dateFormat(datas.birthday),
                    signupDate : utils.dateFormat(datas.signupDate),
                    avatarUrl : datas.avatarUrl
                }
                return res.status(200).json(infos)
            })
            .then(async () => { await prisma.$disconnect() })
            .catch(error => console.log(error) || res.status(500).json(error));
        } else {
            return res.status(403).json(errMsg.authErr);
        }
     })
}


//================//MANAGE//================//

//========//MODIFICATIONS
exports.update = async (req, res, next) => {
    const auth = req.auth.userId
    
    // Recherche de l'utilisateur
    await utils.findUser({id : auth})
    .then(async user => {
        // verification utilisateur
        if ((user.id === auth) && (user.isActive)) {
            if ((utils.surnameValid(req.body.surname)) && (utils.nameValid(req.body.name))) {
                // Donnees a soumettre
                let updateUser = {}
                if (req.body.name) updateUser.name = req.body.name
                if (req.body.surname) updateUser.surname = req.body.surname
                if (req.body.birthday) updateUser.birthday = utils.birthday(req.body.birthday)

                // Enregistrement dans la BDD
                await prisma.user.update({
                    where : { id : auth },
                    data : updateUser
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ 
                    message : 'utilisateur modifie : ',
                    updates : { ...updateUser }
                }))
                .catch(error => console.log(error) || res.status(500).json(error))
            }
            //----Erreurs
            else {
                let error = {};
                
                // prenomNom
                if ((utils.surnameValid(req.body.surname)) === false) {
                    error.surname = errMsg.surnameErr
                }
                // Nom de famille
                if ((utils.nameValid(req.body.name)) === false) {
                    error.name = errMsg.nameErr
                }

                return res.status(400).json(error)
            }
        // mauvais utilisateur
        } else {
            return res.status(403).json(errMsg.authErr);
        }
    })
    .catch(error => console.log(error) || res.status(500).json(error));
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
                            .catch(error => console.log(error) || res.status(500).json(error));
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
            .catch(error => console.log(error) || res.status(500).json(error));
        // mauvais utilisateur
        } else {
            return res.status(403).json(errMsg.authErr);
        }
    })
    .catch(error => console.log(error) || res.status(500).json(error));
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
        .catch(error => console.log(error) || res.status(500).json(error));
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
                .catch(error => console.log(error) || res.status(500).json(error));
            // mauvais utilisateur
            } else {
                res.status(403).json(errMsg.authErr);
            }
        })
        .catch(error => console.log(error) || res.status(500).json(error));
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
            const avatarName = user.avatarUrl.split('/images/')[1]
     
            //----Suppression du fichier
            if (!(avatarName === 'random-user.png')) {
                utils.fileDel(user.avatarUrl)
            }

            //----Mise a jour BDD
            const url = utils.newAvatarUrl(req);
            let message = req.file ? ('user ' + user.id +  ' : Nouvel avatar !') : ('user ' + user.id +  ' : Avatar par defaut');

            if (!(req.file) && (avatarName === 'random-user.png')) {
                console.log("Pas de modification : avatar deja par defaut")
                return res.status(304).end()
            } else {
                // Enregistrer
                await prisma.user.update({
                    where : { id : auth },
                    data : { avatarUrl : url }
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ message : message }))
                .catch(error => console.log(error) || res.status(500).json(error))
            }
        } else {
            res.status(403).json(errMsg.authErr);
        }
    })
    .catch(error => console.log(error) || res.status(500).json(error));
}
