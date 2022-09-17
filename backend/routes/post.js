//---IMPORTS
const router = require('express').Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const postsCtrl = require('../controllers/post');

//---CONFIG
//---sur les posts
router.get('/', auth, postsCtrl.getAllPosts);
router.get('/:id', auth, postsCtrl.getOnePost);
router.post('/', auth, multer, postsCtrl.createPost);
router.put('/:id', auth, multer, postsCtrl.modifyPost);
router.delete('/:id', auth, postsCtrl.deletePost);
// sur les likes
router.post('/:id/like', auth, postsCtrl.likePost);
// sur les commentaires
router.post('/:id/comment', auth, postsCtrl.commentPost);


//---EXPORT
module.exports = router;