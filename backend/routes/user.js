//========//IMPORTS//========//
const router = require('express').Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const userCtrl = require('../controllers/user');
const updateUser = require('../controllers/updateUser');

//========//ENDPOINTS//========//
router.post('/signup', multer, userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/logout', userCtrl.logout);
router.get('/token', auth, userCtrl.userToken)
router.get('/:id', userCtrl.userInfos)

router.get('/', auth, userCtrl.getAllUsers)

//========//Manage
router.put('/update', auth, updateUser.update);
router.put('/password', auth, updateUser.password);
router.put('/:id/disable', auth, updateUser.disable);
//========//Avatar
router.put('/avatar', auth, multer, updateUser.avatar);

//========//EXPORT//========//
module.exports = router;