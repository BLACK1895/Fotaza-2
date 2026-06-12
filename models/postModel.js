const db = require('../config/db');

const PostModel = {
    create: async (usuarioId, titulo, descripcion, rutaArchivo, tipoLicencia) => {
        const [postResult] = await db.query(
            'INSERT INTO publicaciones (usuario_id, titulo, descripcion) VALUES (?, ?, ?)',
            [usuarioId, titulo, descripcion]
        );
        const publicacionId = postResult.insertId;

        await db.query(
            'INSERT INTO imagenes (publicacion_id, ruta_archivo, tipo_licencia) VALUES (?, ?, ?)',
            [publicacionId, `/uploads/${rutaArchivo}`, tipoLicencia]
        );

        return publicacionId;
    },

    getAll: async (search = '') => {
        if (search) {
            // Si hay un término en el buscador, filtramos las publicaciones
            const query = `
                SELECT p.*, u.username 
                FROM publicaciones p 
                JOIN usuarios u ON p.usuario_id = u.id 
                WHERE p.titulo LIKE ? OR p.descripcion LIKE ?
                ORDER BY p.created_at DESC
            `;
            const [rows] = await db.query(query, [`%${search}%`, `%${search}%`]);
            return rows;
        } else {
            // Si el buscador está vacío, trae todo el Muro completo
            const query = `
                SELECT p.*, u.username 
                FROM publicaciones p 
                JOIN usuarios u ON p.usuario_id = u.id 
                ORDER BY p.created_at DESC
            `;
            const [rows] = await db.query(query);
            return rows;
        }
    }
};

module.exports = PostModel;