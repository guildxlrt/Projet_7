//---IMPORTS
const router = require('express').Router();
const userCtrl = require('../controllers/user');

//---Endpoints
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
// mise a jour infos
// modification mot de passe
//--- saisie mot de passe classsique
// bloquer(desactiver) un utilisateur



//---EXPORT
module.exports = router;