const db = require('./db');

async function initDb() {
    try {
    console.log('Inicializando la base de datos...');

    await db.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                rol ENUM('usuario', 'validador') DEFAULT 'usuario',
                activo BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS publicaciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                titulo VARCHAR(150) NOT NULL,
                descripcion TEXT NULL,
                comentarios_abiertos BOOLEAN DEFAULT TRUE,
                modificable BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS imagenes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                publicacion_id INT NOT NULL,
                ruta_archivo VARCHAR(255) NOT NULL,
                tipo_licencia ENUM('copyright', 'sin_copyright') NOT NULL,
                texto_marca_agua VARCHAR(100) NULL,
                estado ENUM('activa', 'en_revision', 'bajada') DEFAULT 'activa',
                FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE
            )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS denuncias_imagenes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                imagen_id INT NOT NULL,
                usuario_id INT NOT NULL,
                motivo VARCHAR(100) NOT NULL,
                justificacion TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unq_usuario_imagen (imagen_id, usuario_id),
                FOREIGN KEY (imagen_id) REFERENCES imagenes(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS comentarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                publicacion_id INT NOT NULL,
                usuario_id INT NOT NULL,
                contenido TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS denuncias_comentarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                comentario_id INT NOT NULL,
                usuario_id INT NOT NULL,
                motivo VARCHAR(100) NOT NULL,
                justificacion TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (comentario_id) REFERENCES comentarios(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);
    await db.query(` 
        CREATE TABLE IF NOT EXISTS seguidores (
                seguidor_id INT NOT NULL,
                seguido_id INT NOT NULL,
                PRIMARY KEY (seguidor_id, seguido_id),
                FOREIGN KEY (seguidor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (seguido_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                CONSTRAINT chk_no_self_follow CHECK (seguidor_id <> seguido_id)
            )
        `);
    
    await db.query(`
        CREATE TABLE IF NOT EXISTS valoraciones (
                imagen_id INT NOT NULL,
                usuario_id INT NOT NULL,
                puntaje TINYINT NOT NULL CHECK (puntaje BETWEEN 1 AND 5),
                PRIMARY KEY (imagen_id, usuario_id),
                FOREIGN KEY (imagen_id) REFERENCES imagenes(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS notificaciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_destino_id INT NOT NULL,
                usuario_origen_id INT NOT NULL,
                tipo_evento ENUM('comentario', 'valoracion', 'interes', 'follow') NOT NULL,
                leida BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_destino_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_origen_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);
    await db.query(`
            CREATE TABLE IF NOT EXISTS mensajeria_privada (
                id INT AUTO_INCREMENT PRIMARY KEY,
                emisor_id INT NOT NULL,
                receptor_id INT NOT NULL,
                imagen_id INT NOT NULL,
                mensaje TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (emisor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (receptor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (imagen_id) REFERENCES imagenes(id) ON DELETE CASCADE
            )
        `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS colecciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                nombre VARCHAR(100) NOT NULL,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS coleccion_publicaciones (
                coleccion_id INT NOT NULL,
                publicacion_id INT NOT NULL,
                PRIMARY KEY (coleccion_id, publicacion_id),
                FOREIGN KEY (coleccion_id) REFERENCES colecciones(id) ON DELETE CASCADE,
                FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE
            )
        `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS etiquetas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(50) NOT NULL UNIQUE
            )
        `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS publicacion_etiquetas (
                publicacion_id INT NOT NULL,
                etiqueta_id INT NOT NULL,
                PRIMARY KEY (publicacion_id, etiqueta_id),
                FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
                FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id) ON DELETE CASCADE
            )
        `);
    await db.query(`SET FOREIGN_KEY_CHECKS = 1;`);

   console.log('✅ ¡Base de datos e integridad referencial creadas con éxito!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error inicializando la base de datos:', error);
        process.exit(1);
    }   
}
initDb();