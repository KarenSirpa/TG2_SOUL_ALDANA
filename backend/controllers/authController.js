// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

exports.login = async (req, res) => { // <-- Haz la función 'async'
    const { email, password } = req.body;

    console.log('--- Intento de Login ---');
    console.log('Email recibido:', email);
    console.log('Password recibido (frontend):', password);

    try {
        console.log('Llamando a Usuario.findByEmail...');
        const results = await Usuario.findByEmail(email); // <-- Usa await directamente

        if (results.length === 0) {
            console.log('Usuario no encontrado para el email:', email);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario = results[0];
        console.log('Usuario encontrado en DB (solo email y id):', { id: usuario.id, email: usuario.email });
        console.log('Contraseña hasheada de la DB (usuario.password):', usuario.password);

        const valid = await bcrypt.compare(password, usuario.password);
        console.log('Resultado de bcrypt.compare (valid):', valid);

        if (!valid) {
            console.log('Contraseña ingresada NO coincide con el hash de DB.');
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login exitoso, token JWT generado.');
        res.json({ mensaje: 'Login exitoso', token });

    } catch (error) {
        console.error('Error en el proceso de login:', error); // Esto capturará errores de DB o bcrypt
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};