const db = require('../config/db');

const LikeModel = {
    // Se fija si el usuario ya le dio like a esa foto en particular
    checkLike: async (usuarioId, publicacionId) => {
        const [rows] = await db.query(
            'SELECT * FROM likes WHERE usuario_id = ? AND publicacion_id = ?',
            [usuarioId, publicacionId]
        );
        return rows.length > 0;
    },

    // Agrega el me gusta
    addLike: async (usuarioId, publicacionId) => {
        return await db.query(
            'INSERT INTO likes (usuario_id, publicacion_id) VALUES (?, ?)',
            [usuarioId, publicacionId]
        );
    },

    // Quita el me gusta (Dislike)
    removeLike: async (usuarioId, publicacionId) => {
        return await db.query(
            'DELETE FROM likes WHERE usuario_id = ? AND publicacion_id = ?',
            [usuarioId, publicacionId]
        );
    }
};

module.exports = LikeModel;