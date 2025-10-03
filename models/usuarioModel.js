// backend/models/UsuarioModel.js
const db = require('../config/db'); // Ahora 'db' es el 'pool' de conexiones

const Usuario = {
    findByEmail: async (email) => { // <-- Ahora es una función async y ya no necesita 'callback'
        const sql = 'SELECT id, email, password FROM usuarios WHERE email = ?'; // Especifica las columnas necesarias
        console.log('Ejecutando pool.execute para findByEmail con SQL:', sql, 'y email:', email);
        try {
            const [rows] = await db.execute(sql, [email]); // <-- Usa await db.execute() para promesas
            console.log('Resultados de pool.execute (findByEmail):', rows);
            return rows; // Devuelve directamente las filas
        } catch (error) {
            console.error('Error en findByEmail:', error);
            throw error; // Propaga el error
        }
    },

    create: async (email, passwordHash) => { // <-- Asumiendo que create solo necesita email y passwordHash para el login
        const sql = 'INSERT INTO usuarios (email, password) VALUES (?, ?)';
        console.log('Ejecutando pool.execute para create con email:', email);
        try {
            const [result] = await db.execute(sql, [email, passwordHash]); // <-- Usa await db.execute()
            console.log('Resultado de pool.execute (create):', result);
            return result; // Devuelve el resultado de la inserción
        } catch (error) {
            console.error('Error en create de usuario:', error);
            throw error; // Propaga el error
        }
    }
};

module.exports = Usuario;