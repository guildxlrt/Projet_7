//---IMPORTS
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pwVal = require("password-validator");
// prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.signup = (req, res, next) => {
    (function reqValidation() {
        //--------CONFIG
        // EMAIL
        const emailValidator = new RegExp(/^([a-z0-9._-]+)@([a-z0-9]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/, 'g');
        
        // PASSWORD
        const pwValSchema = new pwVal();
        pwValSchema
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase(2)                              // Must have uppercase letters
        .has().lowercase(2)                              // Must have lowercase letters
        .has().digits(2)                                // Must have at least 2 digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

        //------VERIFICATION
        //---VALIDE
        if ((emailValidator.test(req.body.email)) && (pwValSchema.validate(req.body.password))) {
            bcrypt.hash(req.body.password, 10)
            .then(async hash => {
                // enregistrement
                try {
                    await prisma.user.create({
                        data : {
                            email : req.body.email,
                            password : hash,
                            name : req.body.name,
                            surname : req.body.surname,
                            birthday : req.body.birthday,
                            avatarUrl :  req.body.avatarUrl
                        }
                    })
                    .then(async () => {
                        await prisma.$disconnect()
                    })
                    .then(() => res.status(201).json({ message : 'utilisateur cree !' }))
                }
                catch (e) {
                    console.error(e) || res.status(400).json({error : e})
                    await prisma.$disconnect()
                    process.exit(1)
                }
            })
            .catch(error => res.status(500).json({error}));
        }
        
        //---REJET
        // Email
        else if ((emailValidator.test(req.body.email)) === false && (pwValSchema.validate(req.body.password)) === true) {
            return res.status(400).json({ message : "l'email doit etre au format email : jack.nicholson@laposte.fr, sasha93.dupont@yahoo.fr, kanap-service_client@kanap.co.fr ..." })
        }
        // Mot De Passe
        else if ((emailValidator.test(req.body.email)) === true && (pwValSchema.validate(req.body.password)) === false) {
            return res.status(400).json({ message : "le mot de passe n'est pas assez fort : il doit contenir au minimum 2 chiffres, 2 minuscules et 2 majuscules; il doit etre d'une longueur minimum de 8 caracteres" })
        }
        // les deux
        else if ((emailValidator.test(req.body.email)) === false && (pwValSchema.validate(req.body.password)) === false) {
            return res.status(400).json({ message : "informations incorrectes" })
        }
    })();
};

exports.login = async (req, res, next) => {
    await prisma.user.findUnique({ 
        where : {
            email : req.body.email
        }
    })
    .then(user => {
        // mauvais utilisateur
        if (!user) {
            // le message d'erreur est volontairement flou (fuite d'erreur)
            return res.status(401).json({ message : 'Paire login/mot de passe incorrecte' });
        }
        else {
            // bon utilisateur
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({ message : 'Paire login/mot de passe incorrecte' });
                }
                else {
                    res.status(200).json({
                        userId : user.id,
                        token : jwt.sign(
                            {userId : user.id},
                            process.env.RANDOM_TOKEN,
                            { expiresIn : '24h'}
                        )
                    })
                }
            })
            .catch(error => res.status(500).json({error}));
        }
    })
    .catch(error => res.status(500).json({error}));
};

exports.update = async (req, res, next) => {
    res.status(400).json({message : "Test Update"})
}

exports.disable = async (req, res, next) => {
    res.status(400).json({message : "Test Disable"})
}