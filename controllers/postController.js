const PostModel = require('../models/postModel');

const PostController = {
showDashboard: async (req, res) => {
        if (!req.session.userId) return res.redirect('/login');

        try {
            // 🔍 Capturamos lo que el usuario escribe en la barra de búsqueda (?search=...)
            const search = req.query.search || '';

            // Le pasamos el parámetro de búsqueda al modelo para que filtre
            const posts = await PostModel.getAll(search);

            res.render('dashboard', { username: req.session.username, posts });
        } catch (error) {
            console.error(error);
            res.send('<h1>Error al cargar las publicaciones</h1>');
        }
    },
    createPost: async (req, res) => {
        if (!req.session.userId) return res.redirect('/login');
        
        const { titulo, descripcion, tipo_licencia } = req.body;
        
        if (!req.file) {
            return res.send('<h1>Por favor, seleccioná una imagen para subir.</h1>');
        }

        try {
            await PostModel.create(req.session.userId, titulo, descripcion, req.file.filename, tipo_licencia);
            res.redirect('/dashboard');
        } catch (error) {
            console.error(error);
            res.send('<h1>Error al guardar la publicación</h1>');
        }
    }
};

module.exports = PostController;