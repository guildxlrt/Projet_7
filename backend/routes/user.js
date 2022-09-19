//========//IMPORTS//========//
const router = require('express').Router();
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

//========//ENDPOINTS//========//
router.post('/signup', userCtrl.signup); // FILE
router.post('/login', userCtrl.login);
router.put('/update', auth, userCtrl.update);
router.put('/password', auth, userCtrl.password);
router.put('/avatar', auth, multer, userCtrl.avatar); // FILE
router.put('/:id/disable', auth, userCtrl.disable);



//========//EXPORT//========//
module.exports = router;