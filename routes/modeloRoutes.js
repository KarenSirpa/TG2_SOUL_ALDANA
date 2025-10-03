// backend/routes/modeloRoutes.js
const express = require('express');
const router = express.Router();

// Importaciones de Controladores
const modeloController = require('../controllers/modeloController');
const datosAntropometricosController = require('../controllers/datosAntropometricosController'); // Asegúrate de que existan
const experienciaController = require('../controllers/experienciaController'); // Asegúrate de que existan

// <--- NUEVA IMPORTACIÓN: Middleware de Multer
const upload = require('../middlewares/upload'); // Correcto: importa tu middleware de Multer

// ----------------------------------------------------
// RUTAS PARA MODELOS
// ----------------------------------------------------

// Ruta para crear un nuevo modelo
// Si el frontend envía archivos junto con los datos del modelo en esta misma ruta,
// DEBES usar `upload.array` o `upload.single` AQUÍ.
// Si no, `req.body.fotos_book` debería ser un array de URLs que el frontend envía (o vacío).
router.post('/', async (req, res, next) => {
    // Si tu `createModelo` espera que `fotos_book` venga ya procesado (ej. URLs de S3 o CDN),
    // entonces no necesitas Multer aquí.
    // Si quieres que esta ruta maneje la subida inicial de fotos, DESCOMENTA Y AJUSTA ESTO:
    // upload.array('fotos', 10)(req, res, async (err) => { // 'fotos' es el nombre del campo del archivo en el frontend
    //     if (err) {
    //         return res.status(400).json({ message: 'Error al subir imágenes', error: err.message });
    //     }
    //     // Si hay archivos subidos, mapea sus rutas para incluirlas en modeloData
    //     if (req.files && req.files.length > 0) {
    //         req.body.fotos_book = req.files.map(file => `/uploads/${file.filename}`);
    //         // Si usaste una subcarpeta como 'profileImages' en el destino de multer en upload.js:
    //         // req.body.fotos_book = req.files.map(file => `/uploads/profileImages/${file.filename}`);
    //     } else {
    //         req.body.fotos_book = []; // Si no se suben fotos, inicializa como un array vacío
    //     }
    //     modeloController.createModelo(req, res, next);
    // });

    // Por ahora, asumiremos que `createModelo` recibe `fotos_book` como un array de URLs
    // (ya sea vacío o con URLs preexistentes/subidas por otra ruta).
    modeloController.createModelo(req, res, next);
});


router.get('/', modeloController.getAllModelos);
router.get('/:id', modeloController.getModeloById);
router.put('/:id', modeloController.updateModelo);
router.delete('/:id', modeloController.deleteModelo);

// --- RUTA PARA SUBIR UNA O MÚLTIPLES IMÁGENES AL SERVIDOR (no las asigna directamente como perfil) ---
// Esta ruta SÍ usa el middleware de Multer para manejar la subida de archivos.
// 'profileImages' debe coincidir con el `name` del input file en tu frontend.
router.post('/upload-profile-images', upload.array('profileImages'), modeloController.uploadModelProfileImages);


// --- NUEVA RUTA: Establecer una imagen existente como imagen de perfil principal ---
// Esta ruta NO necesita Multer porque el frontend ya enviará la URL COMPLETA de la imagen
// que ya ha sido subida previamente (por ejemplo, a través de '/upload-profile-images').
router.put('/:id/set-profile-image', modeloController.setProfileImage);


// ----------------------------------------------------
// RUTAS PARA DATOS ANTROPOMÉTRICOS (asociados a un modelo)
// ----------------------------------------------------
router.post('/:modeloId/antropometricos', datosAntropometricosController.createDatosAntropometricos);
router.put('/:modeloId/antropometricos/:id', datosAntropometricosController.updateDatosAntropometricos);
router.delete('/:modeloId/antropometricos/:id', datosAntropometricosController.deleteDatosAntropometricos);


// ----------------------------------------------------
// RUTAS PARA EXPERIENCIAS (asociadas a un modelo)
// ----------------------------------------------------
router.post('/:modeloId/experiencias', experienciaController.createExperiencia);
router.put('/:modeloId/experiencias/:id', experienciaController.updateExperiencia);
router.delete('/:modeloId/experiencias/:id', experienciaController.deleteExperiencia);

module.exports = router;