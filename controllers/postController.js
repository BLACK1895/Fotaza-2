const PostModel = require('../models/postModel');
// 💙 IMPORTAMOS EL MODELO DE LIKES PARA QUE EL BOTÓN FUNCIONE
const LikeModel = require('../models/likeModel'); 

const PostController = {
    showDashboard: async (req, res) => {
        if (!req.session.userId) return res.redirect('/login');

        try {
            const search = req.query.search || '';
            const posts = await PostModel.getAll(search);

            // 🔍 DIAGNÓSTICO: Esto te va a mostrar en la terminal de VS Code si viene la columna total_likes
            console.log("=========================================");
            console.log("DATOS QUE TRAE EL MODELO:", JSON.stringify(posts, null, 2));
            console.log("=========================================");

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
    },

    // 💙 ACCIÓN DEL BOTÓN: Procesa el click del corazón azul (Me gusta / Quitar Me gusta)
    toggleLike: async (req, res) => {
        if (!req.session.userId) return res.redirect('/login');

        try {
            const usuarioId = req.session.userId;
            const publicacionId = req.params.postId;

            // Revisamos si el usuario ya le dio like a esta publicación
            const yaTieneLike = await LikeModel.checkLike(usuarioId, publicacionId);

            if (yaTieneLike) {
                // Si ya existía, se lo sacamos
                await LikeModel.removeLike(usuarioId, publicacionId);
            } else {
                // Si no existía, lo agregamos
                await LikeModel.addLike(usuarioId, publicacionId);
            }

            // Redireccionamos al dashboard para que se recargue con el número actualizado
            res.redirect('/dashboard');
        } catch (error) {
            console.error("Error en toggleLike:", error);
            res.status(500).send('<h1>Error al procesar el Like</h1>');
        }
    }
};

module.exports = PostController;