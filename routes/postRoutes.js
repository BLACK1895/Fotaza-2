const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const PostController = require('../controllers/postController');
const CommentController = require('../controllers/commentController'); 
const UserController = require('../controllers/userController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'public/uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

router.get('/dashboard', PostController.showDashboard);
router.post('/publicar', upload.single('foto'), PostController.createPost);
router.post('/publicacion/:postId/like', PostController.toggleLike);
router.post('/publicacion/:postId/comentario', CommentController.addComment);
router.get('/usuario/:userId', UserController.showProfile);
router.post('/usuario/:userId/follow', UserController.toggleFollow);

module.exports = router;