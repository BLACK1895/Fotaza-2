const express = require('express');
const path = require('path');
const session = require('express-session'); // <-- NUEVO
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones (NUEVO)
app.use(session({
    secret: 'clave_secreta_para_fotaza',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Poné true si usás HTTPS, para localhost va false
}));

// Importar Rutas
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
app.use('/', authRoutes); // Conectamos las rutas de login/registro
app.use('/', postRoutes);// Conectamos las rutas de posts (crear, listar, etc.)

app.get('/', (req, res) => {
    res.redirect('/login');
});

// Ruta de inicio redirige al login temporalmente
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Servidor activo en: http://localhost:${PORT}`);
});