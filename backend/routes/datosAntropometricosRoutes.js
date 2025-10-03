// backend/routes/datosAntropometricosRoutes.js
const express = require('express');
const router = express.Router();

const datosAntropometricosController = require('../controllers/datosAntropometricosController');

// Rutas para Datos Antropométricos
router.post('/', datosAntropometricosController.createDatosAntropometricos);

// ¡PRESTA ATENCIÓN AQUÍ, ESTA ES TU LÍNEA 13!
// Si quieres obtener un dato antropométrico por su ID (ej: /api/datos-antropometricos/123)
router.get('/:id', datosAntropometricosController.getDatosAntropometricosById); // <-- SI ESTA ES TU LÍNEA 13

// O si quieres obtener datos antropométricos asociados a un modelo (ej: /api/datos-antropometricos/modelo/456)
// router.get('/modelo/:modeloId', datosAntropometricosController.getDatosAntropometricosByModeloId); // <-- SI ESTA ES TU LÍNEA 13 Y NECESITAS UNA RUTA DIFERENTE

router.put('/:id', datosAntropometricosController.updateDatosAntropometricos);
router.delete('/:id', datosAntropometricosController.deleteDatosAntropometricos);

module.exports = router;