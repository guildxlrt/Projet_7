//========//IMPORTS//========//
const router = require('express').Router();
const auth = require('../middlewares/auth');
const commentCtrl = require('../controllers/comment');


//========//ENDPOINTS//========//
router.get('/:id', auth, commentCtrl.getOneComment);
router.patch('/:id/edit', auth, commentCtrl.modifyComment);
router.patch('/:id/del', auth, commentCtrl.delComment);

//========//create from post
router.patch('/new/:id_post', auth, commentCtrl.commentPost);

//========//EXPORT//========//
module.exports = router;