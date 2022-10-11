//========//IMPORTS//========//
const router = require('express').Router();
const auth = require('../middlewares/auth');
const commentCtrl = require('../controllers/comment');


//========//ENDPOINTS//========//
router.get('/:id', auth, commentCtrl.getOneComment);
router.put('/:id', auth, commentCtrl.modifyComment);
router.delete('/:id', auth, commentCtrl.delComment);

//========//create from post
router.post('/:id_post', auth, commentCtrl.commentPost);

//========//EXPORT//========//
module.exports = router;