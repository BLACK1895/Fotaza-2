const LikeModel = require('../models/likeModel');

const LikeController = {
    toggleLike: async (req, res) => {
        if (!req.session.userId) return res.redirect('/login');

        try {
            const usuarioId = req.session.userId;
            const publicacionId = req.params.postId;

            // Verificamos el estado actual del like
            const yaTieneLike = await LikeModel.checkLike(usuarioId, publicacionId);

            if (yaTieneLike) {
                await LikeModel.removeLike(usuarioId, publicacionId);
            } else {
                await LikeModel.addLike(usuarioId, publicacionId);
            }

            // Redirige al muro para ver el cambio reflejado
            res.redirect('/dashboard');
        } catch (error) {
            console.error('Error en el controlador de likes:', error);
            res.status(500).send('<h1>Error al procesar el Like</h1>');
        }
    }
};

module.exports = LikeController;