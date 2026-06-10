const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Rutas de Registro
router.get('/register', AuthController.showRegister);
router.post('/register', AuthController.register);

// Rutas de Login
router.get('/login', AuthController.showLogin);
router.post('/login', AuthController.login);

// Ruta de Logout
router.get('/logout', AuthController.logout);

module.exports = router;