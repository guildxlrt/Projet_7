//========//IMPORTS//========//
const bcrypt = require('bcrypt');
const utils = require('../utils/utils');
//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

        
//================//UTILISATEURS//================//

//========//NOUVEAU
exports.signup = (req, res, next) => {
    (function reqValidation() {
        if (!(req.file)) console.log('Aucun')
        if (req.file) console.log(req.file)
        //---ACCEPT
        if ((utils.emailValid(req.body.email)) && (utils.passwdValid(req.body.password)) && (req.body.password === req.body.passwordConf) && (utils.surnameValid(req.body.surname)) && (utils.nameValid(req.body.name))) {
            bcrypt.hash(req.body.password, 10)
            .then(async hash => {
                // formatage date
                const birthday = utils.birthday(req.body.birthday)

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
                        console.log("l'email est deja utilise") || res.status(405).json({ error : { email : "l'email est deja utilise" } })
                    } else {
                        console.log(error) || res.status(500).json(error)
                    }
                })
            })
            .catch(error => console.log(error) || res.status(500).json(error));
        }
        //---REJET
        else {
            let errors = {}
            // Email
            if ((utils.emailValid(req.body.email)) === false) {
                errors.email = utils.emailErr
            }
            // Mot De Passe
            if ((utils.passwdValid(req.body.password)) === false) {
                errors.password = utils.passErr
            }
            if (req.body.password !== req.body.passwordConf) {
                errors.passwordConf = utils.passwordConfErr
            }
            // prenomNom
            if ((utils.surnameValid(req.body.surname)) === false) {
                errors.surname = utils.surnameErr
            }
            // Nom de famille
            if ((utils.nameValid(req.body.name)) === false) {
                errors.name = utils.nameErr
            }

            return res.status(400).json({ errors : errors })
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
                    else {
                        res.status(401).json({ error : "Paire login/mot de passe incorrecte" });
                    }
                })
                .catch(error => console.log(error) || res.status(500).json(error));
            } else {
                return res.status(401).json({ error : "Le Compte n'est plus actif"});
            }
        }
        else {
            return res.status(401).json({ error : "L'adresse email est inconnue" });
        }
    })
    .catch(error => console.log(error) || res.status(500).json(error));
};

//========//DECONNEXION
exports.logout = async (req, res, next) => {
    if(req.cookies.jwt) {
       return res
       .clearCookie('jwt')
       .status(200).json({ message : "Deconnexion utilisateur reussie" }) 
    } else {
        return res.status(400).json({ message : "No cookie token, so no able to disconnect some user" })
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
                res.status(200).json(infos)
            })
            .then(async () => { await prisma.$disconnect() })
            .catch(error => console.log(error) || res.status(500).json(error));
        } else {
            return res.status(403).json({ error : 'Acces non authorise' });
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
                const updateUser = {
                    name : req.body.name,
                    surname : req.body.surname,
                    birthday : utils.birthday(req.body.birthday)
                }

                // Enregistrement dans la BDD
                await prisma.user.update({
                    where : { id : auth },
                    data : updateUser
                })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(200).json({ message : 'utilisateur modifie !' }))
                .catch(error => console.log(error) || res.status(500).json(error))
            }
            //----Erreurs
            // prenomNom
            else if ((utils.surnameValid(req.body.surname)) === false) {
                return res.status(400).json({ error : {surname : utils.surnameErr} })
            }
            // Nom de famille
            else if ((utils.nameValid(req.body.name)) === false) {
            return res.status(400).json({ error : {name : utils.nameErr} })
            }
        } else {
            return res.status(403).json({ error : 'Acces non authorise' });
        }
    })
    .catch(error => console.log(error) || res.status(500).json(error));
}

//========//CHANGER MDP
exports.password = async (req, res, next) => {
    const auth = req.auth.userId

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
                    if ((req.body.password != req.body.newPass) && (req.body.newPass === req.body.passwordConf) && (utils.passwdValid(req.body.newPass))) {
                        bcrypt.hash(req.body.passwordConf, 10)
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
                        let errors = {}

                        // renouvellement
                        if (req.body.password === req.body.newPass) {
                            errors.renewal = "Le nouveau mot de passe doit differer du nouveau."
                        }
                        // concordance
                        if (req.body.newPass != req.body.passwordConf) {
                            errors.congruency = utils.passwordConfErr
                        }
                        // force
                        if (!(utils.passwdValid(req.body.newPass))) {
                            errors.force = utils.passErr
                        }

                        return res.status(400).json({ errors : errors })
                    }
                } else {
                    res.status(403).json({ error : 'Mot de passe incorrect' })
                }
            })
            .catch(error => console.log(error) || res.status(500).json(error));
        } else {
            return res.status(403).json({ error : 'Acces non authorise' });
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
                // recherche de l'utilisateur cible
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
            } else {
                res.status(403).json({ error : 'Acces non authorise' });
            }
        })
        .catch(error => console.log(error) || res.status(500).json(error));
    }
    //------UTILISATEUR NORMAL
    else {
        // Recherche de l'utilisateur
        await utils.findUser({id : target})
        //---Verifications
        .then(async user => {
            // utilisateur
            if ((auth === user.id ) && (user.isActive)) {
                utils.userManage(user.id, false, req, res)
            } else {
                res.status(403).json({ error : 'Acces non authorise' });
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
                message = "Pas de modification : avatar deja par defaut"
                console.log(message)
                return res.status(304).json({ message : message })
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
            res.status(403).json({ error : 'Acces non authorise' });
        }
    })
    .catch(error => console.log(error) || res.status(500).json(error));
}
