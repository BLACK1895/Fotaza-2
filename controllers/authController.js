const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const AuthController = {
    // Mostrar formulario de registro
    showRegister: (req, res) => {
        res.render('register');
    },

    // Procesar el registro
    register: async (req, res) => {
        const { username, email, password } = req.body;
        try {
            // Encriptar contraseña (requisito de seguridad implícito)
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            await UserModel.create(username, email, passwordHash);
            res.redirect('/login'); // Redirige al login tras registrarse con éxito
        } catch (error) {
            console.error(error);
            res.render('register', { error: 'Error al registrar usuario. El email o username ya pueden existir.' });
        }
    },

    // Mostrar formulario de login
    showLogin: (req, res) => {
        res.render('login');
    },

    // Procesar el login
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.render('login', { error: 'El correo electrónico no está registrado.' });
            }

            // Comparar contraseña encriptada
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.render('login', { error: 'La contraseña es incorrecta.' });
            }

            // Guardar al usuario en la sesión de Express
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.rol = user.rol;

            res.redirect('/dashboard'); 
        } catch (error) {
            console.error(error);
            res.render('login', { error: 'Ocurrió un error en el servidor. Intentá más tarde.' });
        }
    },

    // Cerrar sesión
    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }
};

module.exports = AuthController;