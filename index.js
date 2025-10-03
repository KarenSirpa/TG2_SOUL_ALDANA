// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // <--- ¡Importa 'path' aquí!

// Importar todas tus rutas
const authRoutes = require('./routes/authRoutes');
const modeloRoutes = require('./routes/modeloRoutes');
const datosAntropometricosRoutes = require('./routes/datosAntropometricosRoutes');
const experienciaRoutes = require('./routes/experienciaRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// La URL para acceder a ellos será http://localhost:3001/uploads/nombre-de-imagen.png
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'))); // <--- Línea CRÍTICA


const port = process.env.PORT || 3001; // Si no hay .env, usará 5000. Si .env=3001, usará 3001.


// Montar las rutas en sus respectivos prefijos de API
app.use('/api', authRoutes);
app.use('/api/modelos', modeloRoutes);
app.use('/api/datos-antropometricos', datosAntropometricosRoutes);
app.use('/api/experiencias', experienciaRoutes);

// Ruta de prueba (opcional, para verificar que el servidor está corriendo)
app.get('/', (req, res) => {
    res.send('API de Soul Aldana está funcionando correctamente!');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`🚀 Servidor en http://localhost:${port}`);
});