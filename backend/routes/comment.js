//---IMPORTS
const router = require('express').Router();
const auth = require('../middlewares/auth');
const commentCtrl = require('../controllers/comment');

//---CONFIG
// modifier
router.put('/:id', auth, commentCtrl.modifyComment);
// supprimer
router.delete('/:id', auth, commentCtrl.delComment);


//---EXPORT
module.exports = router;