//========//IMPORTS//========//
const router = require('express').Router();
const auth = require('../middlewares/auth');
const commentCtrl = require('../controllers/comment');


//========//ENDPOINTS//========//
router.get('/:id', auth, commentCtrl.getOneComment);
router.put('/:id', auth, commentCtrl.modifyComment);
router.delete('/:id', auth, commentCtrl.delComment);

//========//Commentaires
router.post('/:id_post', auth, commentCtrl.commentPost);
router.get('/:id_post/comments', auth, commentCtrl.getPostComments);

//========//EXPORT//========//
module.exports = router;