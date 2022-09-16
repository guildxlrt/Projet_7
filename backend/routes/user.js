//---IMPORTS
const router = require('express').Router();
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

//---Endpoints
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/update', auth, userCtrl.update);
router.put('/avatar', auth, multer, userCtrl.avatar);
router.put('/disable', auth, userCtrl.disable);



//---EXPORT
module.exports = router;