import express from 'express';
const router = express.Router();

// utiliser le controlleur
import * as userCtrl from '../controllers/user';

//---importer les methodes
// creation du compte
router.post('/signup', userCtrl.signUp);
// connexion
router.post('/login', userCtrl.login);

//exporter le routeur
export {router};