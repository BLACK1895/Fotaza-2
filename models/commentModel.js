const db = require('../config/db');

const CommentModel = {
    // ✍️ Guarda un comentario nuevo en la base de datos
    create: async (publicacionId, usuarioId, contenido) => {
        const [result] = await db.query(
            'INSERT INTO comentarios (publicacion_id, usuario_id, contenido) VALUES (?, ?, ?)',
            [publicacionId, usuarioId, contenido]
        );
        return result.insertId;
    },

    // 📖 Trae todos los comentarios de una publicación específica, incluyendo quién lo escribió
    getByPostId: async (publicacionId) => {
        const query = `
            SELECT c.*, u.username 
            FROM comentarios c
            JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.publicacion_id = ?
            ORDER BY c.created_at ASC
        `;
        const [rows] = await db.query(query, [publicacionId]);
        return rows;
    }
};

module.exports = CommentModel;