//========//IMPORTS//========//
const router = require('express').Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const postsCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');


//========//ENDPOINTS//========//
//========//Posts
router.post('/', auth, multer, postsCtrl.createPost);
router.get('/', auth, postsCtrl.getAllPosts);
router.get('/:id', auth, postsCtrl.getOnePost);
router.put('/:id', auth, multer, postsCtrl.modifyPost);
router.delete('/:id', auth, postsCtrl.deletePost);

//========//Likes
router.post('/:id/like', auth, postsCtrl.likePost);
router.get('/:id/count', auth, postsCtrl.likesCount);

//========//Commentaires
router.post('/:id/comment', auth, commentCtrl.commentPost);
router.get('/:id/comment', auth, commentCtrl.getPostComments);


//========//EXPORT//========//
module.exports = router;