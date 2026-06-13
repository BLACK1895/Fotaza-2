const PostModel = require('../models/postModel');
const LikeModel = require('../models/likeModel'); 
const CommentModel = require('../models/commentModel'); 

const PostController = {
    showDashboard: async (req, res) => {
        if (!req.session.userId) return res.redirect('/login');

        try {
            const search = req.query.search || '';
            const posts = await PostModel.getAll(search);

            // 🔄 RECORREMOS CADA POST PARA TRAERLE SUS COMENTARIOS DESDE XAMPP
            for (let post of posts) {
                post.comentarios = await CommentModel.getByPostId(post.id);
            }

            // DIAGNÓSTICO: Para ver en la terminal si los comentarios se están adjuntando bien
            console.log("DATOS CON COMENTARIOS:", JSON.stringify(posts, null, 2));

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

    toggleLike: async (req, res) => {
        if (!req.session.userId) return res.redirect('/login');
        try {
            const usuarioId = req.session.userId;
            const publicacionId = req.params.postId;
            const yaTieneLike = await LikeModel.checkLike(usuarioId, publicacionId);

            if (yaTieneLike) {
                await LikeModel.removeLike(usuarioId, publicacionId);
            } else {
                await LikeModel.addLike(usuarioId, publicacionId);
            }
            res.redirect('/dashboard');
        } catch (error) {
            console.error("Error en toggleLike:", error);
            res.status(500).send('<h1>Error al procesar el Like</h1>');
        }
    }
};

module.exports = PostController;