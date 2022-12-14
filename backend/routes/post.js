//========//IMPORTS//========//
const router = require('express').Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const postsCtrl = require('../controllers/post');
const likesCtrl = require('../controllers/like');

//========//ENDPOINTS//========//
//========//Publications
router.post('/', auth, multer, postsCtrl.createPost);
router.get('/', auth, postsCtrl.getAllPosts);
router.get('/:id', auth, postsCtrl.getOnePost);
router.put('/:id', auth, multer, postsCtrl.modifyPost);
router.delete('/:id', auth, postsCtrl.deletePost);

//========//Likes
router.patch('/:id_post/like', auth, likesCtrl.likePost);
router.patch('/:id_post/unlike', auth, likesCtrl.unlikePost);

//========//EXPORT//========//
module.exports = router;