const db = require('../config/db');

const UserModel = {
    // Buscar un usuario por email (para el Login)
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    },

    // Crear un nuevo usuario (para el Registro)
    create: async (username, email, passwordHash) => {
        const [result] = await db.query(
            'INSERT INTO usuarios (username, email, password, rol) VALUES (?, ?, ?, "usuario")',
            [username, email, passwordHash]
        );
        return result.insertId;
    }
};

module.exports = UserModel;