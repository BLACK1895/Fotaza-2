const db = require('../config/db');

const PostModel = {
    // Crea una publicación y su imagen asociada
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

    // Trae todas las publicaciones (con o sin búsqueda) + conteo de Likes real
    getAll: async (search = '') => {
        if (search) {
            // Buscador + Conteo de Likes aislados con DISTINCT (Con alias autor_id y tipo_licencia)
            const query = `
                SELECT p.*, p.usuario_id AS autor_id, u.username, img.ruta_archivo, img.tipo_licencia, COUNT(DISTINCT l.id) AS total_likes
                FROM publicaciones p 
                JOIN usuarios u ON p.usuario_id = u.id 
                LEFT JOIN imagenes img ON p.id = img.publicacion_id
                LEFT JOIN likes l ON p.id = l.publicacion_id
                WHERE p.titulo LIKE ? OR p.descripcion LIKE ?
                GROUP BY p.id, img.id
                ORDER BY p.created_at DESC
            `;
            const [rows] = await db.query(query, [`%${search}%`, `%${search}%`]);
            return rows;
        } else {
            // Muro completo + Conteo de Likes aislados con DISTINCT (Con alias autor_id y tipo_licencia)
            const query = `
                SELECT p.*, p.usuario_id AS autor_id, u.username, img.ruta_archivo, img.tipo_licencia, COUNT(DISTINCT l.id) AS total_likes
                FROM publicaciones p 
                JOIN usuarios u ON p.usuario_id = u.id 
                LEFT JOIN imagenes img ON p.id = img.publicacion_id
                LEFT JOIN likes l ON p.id = l.publicacion_id
                GROUP BY p.id, img.id
                ORDER BY p.created_at DESC
            `;
            const [rows] = await db.query(query);
            return rows;
        }
    },
};

module.exports = PostModel;