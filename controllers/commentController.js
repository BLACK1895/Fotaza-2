const CommentModel = require('../models/commentModel');

const CommentController = {
    addComment: async (req, res) => {
        // Si no está logueado, rebota
        if (!req.session.userId) return res.redirect('/login');

        const { contenido } = req.body;
        const publicacionId = req.params.postId;
        const usuarioId = req.session.userId;

        // Validar que no mande un comentario vacío
        if (!contenido || contenido.trim() === '') {
            return res.redirect('/dashboard');
        }

        try {
            await CommentModel.create(publicacionId, usuarioId, contenido);
            res.redirect('/dashboard'); // Redirecciona para ver el comentario al toque
        } catch (error) {
            console.error('Error al crear comentario:', error);
            res.status(500).send('<h1>Error al publicar el comentario</h1>');
        }
    }
};

module.exports = CommentController;