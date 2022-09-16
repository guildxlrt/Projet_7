//---IMPORTS
const router = require('express').Router();
const userCtrl = require('../controllers/user');

//---Endpoints
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/update', userCtrl.update);
router.post('/disable', userCtrl.disable);



//---EXPORT
module.exports = router;