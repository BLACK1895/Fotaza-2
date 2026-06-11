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
        // Le pone un nombre único usando la fecha actual para que no se pisen archivos iguales
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Rutas de las publicaciones
router.get('/dashboard', PostController.showDashboard);
// upload.single('foto') le dice a multer que procese el campo del archivo llamado "foto"
router.post('/publicar', upload.single('foto'), PostController.createPost);

module.exports = router;