//---IMPORTS
const router = require('express').Router();
const testCtrl = require('../controllers/test');

//---Endpoints
router.post('/create', testCtrl.create);
router.get('/read', testCtrl.read);

//---EXPORT
module.exports = router;