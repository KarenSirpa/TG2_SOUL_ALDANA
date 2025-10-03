const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// TEST DE CONEXIÓN: Agrega esto
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión a la base de datos exitosa.');
        connection.release(); // Libera la conexión de vuelta al pool
    })
    .catch(err => {
        console.error('❌ Error al conectar a la base de datos:', err.message);
        // Opcional: Terminar el proceso si la conexión a la DB es crítica
        // process.exit(1);
    });

module.exports = pool;