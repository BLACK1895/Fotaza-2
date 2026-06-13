const db = require('../config/db');

const FollowModel = {
    // Seguir a un usuario
    follow: async (seguidorId, seguidoId) => {
        await db.query(
            'INSERT INTO seguidores (seguidor_id, seguido_id) VALUES (?, ?)',
            [seguidorId, seguidoId]
        );
    },

    // Dejar de seguir
    unfollow: async (seguidorId, seguidoId) => {
        await db.query(
            'DELETE FROM seguidores WHERE seguidor_id = ? AND seguido_id = ?',
            [seguidorId, seguidoId]
        );
    },

    // Verificar si ya lo sigue
    checkFollowing: async (seguidorId, seguidoId) => {
        const [rows] = await db.query(
            'SELECT * FROM seguidores WHERE seguidor_id = ? AND seguido_id = ?',
            [seguidorId, seguidoId]
        );
        return rows.length > 0;
    },

    // Contador: Seguidores
    getFollowersCount: async (usuarioId) => {
        const [rows] = await db.query(
            'SELECT COUNT(*) AS total FROM seguidores WHERE seguido_id = ?',
            [usuarioId]
        );
        return rows[0].total;
    },

    // Contador: Seguidos
    getFollowingCount: async (usuarioId) => {
        const [rows] = await db.query(
            'SELECT COUNT(*) AS total FROM seguidores WHERE seguidor_id = ?',
            [usuarioId]
        );
        return rows[0].total;
    }
};

module.exports = FollowModel;