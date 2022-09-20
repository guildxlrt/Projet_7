//========//IMPORTS//========//
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utils = require('../utils/utils');
//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

        
//================//UTILISATEURS//================//

//========//NOUVEAU
exports.signup = (req, res, next) => {
    (function reqValidation() {
        //---ACCEPT
        if ((utils.emailValid(req.body.email)) && (utils.passwdValid(req.body.password))) {
            bcrypt.hash(req.body.password, 10)
            .then(async hash => {
                // mot de pass
                req.body.password = hash;
                // formatage date
                req.body.birthday ? req.body.birthday = new Date(req.body.birthday) : null

                // recherche de fichier
                const newUser = req.file ? {
                    ...JSON.parse(req.body),
                    imageUrl : utils.newImageUrl(req)
                } : { ...req.body };

                // enregistrement
                await prisma.user.create({ data : newUser })
                .then(async () => { await prisma.$disconnect() })
                .then(() => res.status(201).json({ message : 'utilisateur cree !' }))
                .catch(error => {
                    if (error.code === "P2002") {
                        console.log("l'email est deja utilise") || res.status(500).json({ message : "l'email est deja utilise" })
                    } else {
                        console.log(error) || res.status(400).json({message : error})
                    }
                })
            })
            .catch(error => console.log(error) || res.status(500).json({ message : error }));
        }
        //---REJET
        // Email
        else if ((utils.emailValid(req.body.email)) === false && (utils.passwdValid(req.body.password)) === true) {
            return res.status(400).json({ message : "l'email doit etre au format email : jack.nicholson@laposte.fr, sasha93.dupont@yahoo.fr, kanap-service_client@kanap.co.fr ..." })
        }
        // Mot De Passe
        else if ((utils.emailValid(req.body.email)) === true && (utils.passwdValid(req.body.password)) === false) {
            return res.status(400).json({ message : "le mot de passe n'est pas assez fort : il doit contenir au minimum 2 chiffres, 2 minuscules et 2 majuscules; il doit etre d'une longueur minimum de 8 caracteres" })
        }
        // les deux
        else if ((utils.emailValid(req.body.email)) === false && (utils.passwdValid(req.body.password)) === false) {
            return res.status(400).json({ message : "informations incorrectes" })
        }
    })();
};


//========//CONNEXION
exports.login = async (req, res, next) => {
    utils.findUser({email : req.body.email})
    .then(async user => {
        if (user) {
            // Compte actif
            if (user.isActive) {
                // mot de passe
                await bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (valid) {
                        // Connexion
                        res.status(200).json({
                            userId : user.id,
                            isAdmin : user.isAdmin,
                            token : jwt.sign(
                                {
                                    userId : user.id,
                                    isAdmin : user.isAdmin
                                },
                                process.env.RANDOM_TOKEN,
                                { expiresIn : '24h'}
                            )
                        })
                    }
                    else {
                        res.status(401).json({ message : 'Paire login/mot de passe incorrecte' });
                    }
                })
            .catch(error => console.log(error) || res.status(500).json({ message : error }));
            } else {
                return res.status(401).json({ message : 'compte non actif' });
            }
        }
        else {
            return res.status(401).json({ message : 'Paire login/mot de passe incorrecte' });
        }
    })
    .catch(error => console.log(error) || res.status(500).json({ message : error }));
};

//========//DECONNEXION
exports.logout = async (req, res, next) => {
    //
    console.log("logout route :")
    return res.status(200).json({ 'Logout route' : req.auth })
}

//================//MANAGE//================//

/* retirer email */
/* retirer verification mdp*/

//========//MODIFICATIONS
exports.update = async (req, res, next) => {
    // Recherche de l'utilisateur
    utils.findUser({id : req.auth.userId})
    .then(async user => {
        // verification utilisateur
        if ((user.id === req.auth.userId) && (user.isActive)) {
            // verification pass
            await bcrypt.compare(req.body.password, user.password)
            .then(async valid => {
                if (valid) {
                    // Donnees a soumettre
                    const updateUser = {
                        //email : req.body.updates.email,
                        name : req.body.updates.name,
                        surname : req.body.updates.surname,
                        birthday : req.body.updates.birthday
                    }
                    const authToken = req.auth.userId;

                    async function sendUpdates(req, res, next) {
                        // formatage date
                        updateUser.birthday ? updateUser.birthday = new Date(updateUser.birthday) : null

                        // Enregistrement dans la BDD
                        await prisma.user.update({
                            where : { id : authToken },
                            data : updateUser
                        })
                        .then(async () => { await prisma.$disconnect() })
                        .then(() => res.status(200).json({ message : 'utilisateur modifie !' }))
                        .catch(error => console.log(error) || res.status(401).json({ message : error }));
                    }

                    function emailChecker(req, res, next) {
                        if (utils.emailValid(req.body.updates.email)) {
                            sendUpdates(req, res, next)
                        } else {
                            return res.status(400).json({ message : "l'email doit etre au format email : jack.nicholson@laposte.fr, sasha93.dupont@yahoo.fr, kanap-service_client@kanap.co.fr ..." })
                        }
                    }

                    // modification de l'email
                    req.body.updates.email ? emailChecker(req, res, next) : sendUpdates(req, res, next)

                    
                } else {
                    res.status(401).json({ message : 'Acces non authorise' });
                }
            })
            .catch(error => console.log(error) || res.status(500).json({ message : error }));
        } else {
            return res.status(401).json({ message : 'Acces non authorise' });
        }
    })
    .catch(error => console.log(error) || res.status(500).json({ message : error }));
}

//========//CHANGER MDP
exports.password = async (req, res, next) => {
    // Recherche de l'utilisateur
    utils.findUser({id : req.auth.userId})
    //-----VERIFICATION
    .then(async user => {
        // utilisateur
        if ((user.id === req.auth.userId) && (user.isActive)) {
            // ancient pass
            await bcrypt.compare(req.body.password, user.password)
            .then(async valid => {
                if (valid) {
                    // nouveau pass
                    if ((req.body.password != req.body.newPass) && (req.body.newPass === req.body.passConfirm) && (utils.passwdValid(req.body.newPass))) {
                        bcrypt.hash(req.body.passConfirm, 10)
                        .then(async hash => {
                            // enregistrement du nouveau mot de passe
                            await prisma.user.update({
                                where : { id : req.auth.userId },
                                data : { password : hash }
                            })
                            .then(async () => { await prisma.$disconnect() })
                            .then(() => res.status(200).json({ message : 'mot de passe modifie !' }))
                            .catch(error => console.log(error) || res.status(401).json({ message : error }));
                        })
                    }
                    // RENOUVELLEMENT
                    else if (req.body.password === req.body.newPass) {
                        return res.status(400).json({ message : "Le nouveau mot de passe doit differer du nouveau." });
                    }
                    // CONCORDANCE
                    else if (req.body.newPass != req.body.passConfirm) {
                        return res.status(400).json({ message : "Les saisies du mot de passe doivent correspondre." });
                    }
                    // FORCE
                    else if (!(utils.passwdValid(req.body.newPass))) {
                        return res.status(400).json({ message : "Le mot de passe n'est pas assez fort : il doit contenir au minimum 2 chiffres, 2 minuscules et 2 majuscules; il doit etre d'une longueur minimum de 8 caracteres." });
                    }
                } else {
                    res.status(401).json({ message : 'Mot de passe incorrect' })
                }
            })
            .catch(error => console.log(error) || res.status(500).json({ message : error }));
        } else {
            return res.status(401).json({ message : 'Acces non authorise' });
        }
    })
    .catch(error => console.log(error) || res.status(500).json({ message : error }));
}

//========//DESACTIVER
exports.disable = async (req, res, next) => {
    //---Quel utilisateur ?
    //------ADMINISTRATEUR
    if (req.auth.isAdmin === true) {
        utils.findUser({id : req.auth.userId})
        //---Verifications
        .then(async admin => {
            // administrateur
            if ((req.auth.userId === admin.id) && (admin.isAdmin === true) && (admin.isActive === true)) {
                // recherche de l'utilisateur cible
                utils.findUser({id : Number(req.params.id)})
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
                res.status(401).json({ message : 'Acces non authorise' });
            }
        })
        .catch(error => console.log(error) || res.status(500).json({ message : error }));
    }
    //------UTILISATEUR NORMAL

    // supprimer les parametres

    else {
        // Recherche de l'utilisateur
        utils.findUser({id : req.auth.userId})
        //---Verifications
        .then(async user => {
            // utilisateur
            if ((req.auth.userId === user.id ) && (user.isActive)) {
                utils.userManage(user.id, false, req, res)
            } else {
                res.status(401).json({ message : 'Acces non authorise' });
            }
        })
        .catch(error => console.log(error) || res.status(500).json({ message : error }));
    }
}

//================//AVATAR//================//

//========//CHANGER AVATAR
exports.avatar = async (req, res, next) => {
    let url = ''
    req.file ? url = utils.newImageUrl(req) : url = null

    utils.findUser({id : req.auth.userId})
    .then(async user => {
        // Verification
        if ((req.auth.userId === user.id ) && (user.isActive)) {
            //---Suppression fichier
            fileDel(user.avatarUrl)
            utils.avatarUpdate(req.auth.userId, url)
        } else {
            res.status(401).json({ message : 'Acces non authorise' });
        }
    })
    .catch(error => console.log(error) || res.status(500).json({ message : error }));
}
