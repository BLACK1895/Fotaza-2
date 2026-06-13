const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const PostController = require('../controllers/postController');
// 💬 Importamos el nuevo controlador de comentarios
const CommentController = require('../controllers/commentController'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'public/uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

router.get('/dashboard', PostController.showDashboard);
router.post('/publicar', upload.single('foto'), PostController.createPost);
router.post('/publicacion/:postId/like', PostController.toggleLike);

// 💬 NUEVA RUTA: Procesa el envío del cajón de comentarios
router.post('/publicacion/:postId/comentario', CommentController.addComment);

module.exports = router;