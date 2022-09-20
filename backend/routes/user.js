//========//IMPORTS//========//
const router = require('express').Router();
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');


//========//ENDPOINTS//========//
router.post('/signup', multer, userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/logout', auth, userCtrl.logout); // not 
//========//Manage
router.put('/update', auth, userCtrl.update);
router.put('/password', auth, userCtrl.password);
router.put('/:id/disable', auth, userCtrl.disable);
//========//Avatar
router.put('/avatar', auth, multer, userCtrl.avatar);

//========//EXPORT//========//
module.exports = router;