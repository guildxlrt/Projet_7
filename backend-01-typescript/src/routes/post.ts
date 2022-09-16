import express from 'express';
const router = express.Router();

import {auth} from '../middlewares/auth';
import {upload} from '../middlewares/multer-config';

// utiliser le controlleur
import * as postsCtrl from '../controllers/post';

// Afficher tout les posts
router.get('/', auth, postsCtrl.getAllPosts);
// afficher une post
router.get('/:id', auth, postsCtrl.getOnePost);
// enregistrer une post
router.post('/', auth, upload, postsCtrl.createPost);
// modifier une post
router.put('/:id', auth, upload, postsCtrl.modifyPost);
// supprimer la post
router.delete('/:id', auth, postsCtrl.deletePost);
// like & dislike
router.post('/:id/like', auth, postsCtrl.likePost);

export {router};