const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const PostController = require('../controllers/postController');

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Apunta a la carpeta public/uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Rutas de las publicaciones
router.get('/dashboard', PostController.showDashboard);
router.post('/publicar', upload.single('foto'), PostController.createPost);

// 💙 CAMBIAMOS ESTA LÍNEA PARA QUE USE POSTCONTROLLER:
router.post('/publicacion/:postId/like', PostController.toggleLike);

module.exports = router;