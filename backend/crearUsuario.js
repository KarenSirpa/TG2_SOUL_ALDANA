// backend/crearUsuario.js
const bcrypt = require('bcrypt');
const db = require('./config/db');

async function crearUsuario() {
  const email = 'admin@gmail.com';
  const passwordPlano = '123456';

  try {
    const hashedPassword = await bcrypt.hash(passwordPlano, 10);
    const sql = 'INSERT INTO usuarios (email, password) VALUES (?, ?)';
    db.query(sql, [email, hashedPassword], (err, result) => {
      if (err) throw err;
      console.log('✅ Usuario creado con éxito');
      process.exit(); // Salir del script
    });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
  }
}

crearUsuario();
