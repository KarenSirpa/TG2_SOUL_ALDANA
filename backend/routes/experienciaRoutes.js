// backend/routes/experienciaRoutes.js
const express = require('express');
const router = express.Router();

// Importar el controlador de experiencia
// ¡MUY IMPORTANTE! Asegúrate de que la ruta a tu controlador sea correcta
const experienciaController = require('../controllers/experienciaController');

// Rutas para Experiencias
// Si la línea 7 es para obtener una experiencia por su propio ID
router.get('/:id', experienciaController.getExperienciaById); // <-- Esta es probablemente tu línea 7

// Si tu línea 7 es para obtener experiencias asociadas a un modelo específico:
// router.get('/modelo/:modeloId', experienciaController.getExperienciasByModeloId); // <--- O esta si tienes una ruta GET dedicada para modeloId

router.post('/', experienciaController.createExperiencia); // Si tienes una ruta POST directa aquí (sin :modeloId en el URL de la ruta)
router.put('/:id', experienciaController.updateExperiencia);
router.delete('/:id', experienciaController.deleteExperiencia);


module.exports = router;