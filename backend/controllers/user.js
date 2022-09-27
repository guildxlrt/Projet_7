//========//IMPORTS//========//
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utils = require('../utils/utils');
//----prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

        
//================//UTILISATEURS//================//

//----Error messages


//========//NOUVEAU
exports.signup = (req, res, next) => {
    (function reqValidation() {
        // formatage date
        const birthday = utils.birthday(req.body.birthday)
        req.body.birthday = birthday

        //---ACCEPT
        if ((utils.emailValid(req.body.email)) && (utils.passwdValid(req.body.password)) && (utils.surnameValid(req.body.surname)) && (utils.nameValid(req.body.name))) {
            bcrypt.hash(req.body.password, 10)
            .then(async hash => {
                // mot de pass
                req.body.password = hash;

                console.log(req.body)
                
                
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
                        console.log("l'email est deja utilise") || res.status(500).json({ error : "l'email est deja utilise" })
                    } else {
                        console.log(error) || res.status(400).json({error : error})
                    }
                })
            })
            .catch(error => console.log(error) || res.status(500).json(error));
        }
        //---REJET
        // Email
        else if ((utils.emailValid(req.body.email)) === false && (utils.passwdValid(req.body.password)) === true) {
            return res.status(400).json({ error : utils.emailErr })
        }
        // Mot De Passe
        else if ((utils.emailValid(req.body.email)) === true && (utils.passwdValid(req.body.password)) === false) {
            return res.status(400).json({ error : utils.passErr })
        }
        // les deux
        else if ((utils.emailValid(req.body.email)) === false && (utils.passwdValid(req.body.password)) === false) {
            return res.status(400).json({ error : "informations incorrectes" })
        }
        // les noms
        else if ((utils.surnameValid(req.body.surname)) === false) {
            return res.status(400).json({ error : utils.surnameErr })
        }
        else if ((utils.nameValid(req.body.name)) === false) {
            return res.status(400).json({ error : utils.nameErr })
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
                        const token = jwt.sign(
                            {
                                userId : user.id,
                                isAdmin : user.isAdmin
                            },
                            process.env.RANDOM_TOKEN,
                            { expiresIn : '24h'}
                        )

                        // cookie expiration : ms * sec * min * hr * days
                        const maxAge = 1000 * 60 * 60 * 24

                        // Connexion
                        res
                        .cookie('jwt', token, { maxAge : maxAge, httpOnly : true, sameSite: 'strict', secure: false })
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
    return res
    .clearCookie('jwt')
    .status(200).json({ message : "Deconnexion utilisateur reussie" })
}

//========//DECODE TOKEN
exports.getUserId = async (req, res, next) => {
    return res.status(200).json(req.auth.userId)
}

//================//MANAGE//================//

//========//MODIFICATIONS
exports.update = async (req, res, next) => {
    // Recherche de l'utilisateur
    utils.findUser({id : req.auth.userId})
    .then(async user => {
        // verification utilisateur
        if ((user.id === req.auth.userId) && (user.isActive)) {
            // Donnees a soumettre
            const updateUser = {
                name : req.body.name,
                surname : req.body.surname,
                birthday : utils.birthday(req.body.birthday)
            }

            // Enregistrement dans la BDD
            await prisma.user.update({
                where : { id : req.auth.userId },
                data : updateUser
            })
            .then(async () => { await prisma.$disconnect() })
            .then(() => res.status(200).json({ message : 'utilisateur modifie !' }))
            .catch(error => console.log(error) || res.status(401).json(error))
        } else {
            return res.status(401).json({ error : 'Acces non authorise' });
        }
    })
    .catch(error => console.log(error) || res.status(500).json(error));
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
                            .catch(error => console.log(error) || res.status(401).json(error));
                        })
                    }
                    // RENOUVELLEMENT
                    else if (req.body.password === req.body.newPass) {
                        return res.status(400).json({ error : "Le nouveau mot de passe doit differer du nouveau." });
                    }
                    // CONCORDANCE
                    else if (req.body.newPass != req.body.passConfirm) {
                        return res.status(400).json({ error : "Les saisies du mot de passe doivent correspondre." });
                    }
                    // FORCE
                    else if (!(utils.passwdValid(req.body.newPass))) {
                        return res.status(400).json({ error : "Le mot de passe n'est pas assez fort : il doit contenir au minimum 2 chiffres, 2 minuscules et 2 majuscules; il doit etre d'une longueur minimum de 8 caracteres." });
                    }
                } else {
                    res.status(401).json({ error : 'Mot de passe incorrect' })
                }
            })
            .catch(error => console.log(error) || res.status(500).json(error));
        } else {
            return res.status(401).json({ error : 'Acces non authorise' });
        }
    })
    .catch(error => console.log(error) || res.status(500).json(error));
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
                res.status(401).json({ error : 'Acces non authorise' });
            }
        })
        .catch(error => console.log(error) || res.status(500).json(error));
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
                res.status(401).json({ error : 'Acces non authorise' });
            }
        })
        .catch(error => console.log(error) || res.status(500).json(error));
    }
}

//================//AVATAR//================//

//========//CHANGER AVATAR
exports.avatar = async (req, res, next) => {
    utils.findUser({id : req.auth.userId})
    .then(async user => {
        //----Verification
        if ((req.auth.userId === user.id ) && (user.isActive)) {
            //----Suppression fichier
            if (user.imageUrl != null) {
                utils.fileDel(user.imageUrl)
            }

            // Mise a jour BDD
            let url = '';
            let message = '';

            function newURL(a, b) {
                url = a;
                message = b;
                return {url, message};
            }

            req.file ? newURL(utils.newImageUrl(req), 'Avatar change !') : newURL(null, 'Avatar supprime !');
            
            // Enregistrer
            await prisma.user.update({
                where : { id : req.auth.userId },
                data : { avatarUrl : url }
            })
            .then(async () => { await prisma.$disconnect() })
            .then(() => res.status(200).json({ message : message }))
            .catch(error => console.log(error) || res.status(401).json(error))
        } else {
            res.status(401).json({ error : 'Acces non authorise' });
        }
    })
    .catch(error => console.log(error) || res.status(500).json(error));
}
