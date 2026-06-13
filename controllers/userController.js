const db = require('../config/db');
const FollowModel = require('../models/followModel');

const UserController = {
    showProfile: async (req, res) => {
        if (!req.session.userId) return res.redirect('/login');

        const seguidoId = req.params.userId;
        const seguidorId = req.session.userId;

        try {
            // 1. Buscamos al usuario dueño del perfil
            const [users] = await db.query('SELECT id, username, created_at FROM usuarios WHERE id = ?', [seguidoId]);
            
            if (users.length === 0) {
                return res.status(404).send('<h1>Usuario no encontrado</h1><a href="/dashboard">Volver al muro</a>');
            }
            const perfilUsuario = users[0];

            // 2. Traemos las publicaciones usando "usuario_id" (corregido el p.autor_id que rompía)
            const queryPosts = `
                SELECT p.id, p.titulo, p.descripcion, p.created_at, img.ruta_archivo, img.tipo_licencia
                FROM publicaciones p
                LEFT JOIN imagenes img ON p.id = img.publicacion_id
                WHERE p.usuario_id = ?
                ORDER BY p.created_at DESC
            `;
            const [userPosts] = await db.query(queryPosts, [seguidoId]);

            // 3. Traemos las métricas de la tabla seguidores
            const followersCount = await FollowModel.getFollowersCount(seguidoId);
            const followingCount = await FollowModel.getFollowingCount(seguidoId);
            const yaLoSigue = await FollowModel.checkFollowing(seguidorId, seguidoId);

            res.render('perfil', {
                username: req.session.username, // Nombre de quien navega para el header
                sesionUsuarioId: seguidorId,
                perfilUsuario,
                posts: userPosts,
                followersCount,
                followingCount,
                yaLoSigue
            });
        } catch (error) {
            console.error('Error crítico al cargar perfil:', error);
            res.status(500).send('<h1>Error interno al cargar el perfil</h1>');
        }
    },

    toggleFollow: async (req, res) => {
        if (!req.session.userId) return res.redirect('/login');

        const seguidoId = req.params.userId;
        const seguidorId = req.session.userId;

        if (seguidorId == seguidoId) return res.redirect('/dashboard');

        try {
            const yaLoSigue = await FollowModel.checkFollowing(seguidorId, seguidoId);

            if (yaLoSigue) {
                await FollowModel.unfollow(seguidorId, seguidoId);
            } else {
                await FollowModel.follow(seguidorId, seguidoId);
            }

            res.redirect(`/usuario/${seguidoId}`);
        } catch (error) {
            console.error('Error en toggleFollow:', error);
            res.status(500).send('<h1>Error al procesar el seguimiento</h1>');
        }
    }
};

module.exports = UserController;