// backend/controllers/modeloController.js

const ModeloModel = require('../models/ModeloModel'); // Asegúrate de que la ruta sea correcta.
// Si realmente tienes estos modelos importados aquí, asegúrate de que las rutas sean correctas.
const DatosAntropometricosModel = require('../models/datosAntropometricosModel'); // Podría no ser necesario si no los usas directamente en este archivo.
const ExperienciaModel = require('../models/experienciaModel'); // Podría no ser necesario.

// ----------------------------------------------------
// CONTROLADORES PARA MODELOS
// ----------------------------------------------------

// Controlador para crear un nuevo modelo
const createModelo = async (req, res) => {
    try {
        const { nombre_completo, fecha_nacimiento, edad, celular, genero, email_contacto, redes_sociales, fotos_book } = req.body;

        const modeloData = {
            nombre_completo,
            fecha_nacimiento: fecha_nacimiento || null,
            edad: parseInt(edad),
            celular,
            genero,
            email_contacto,
            redes_sociales: redes_sociales || null,
            fotos_book: fotos_book || null,
        };

        const modeloId = await ModeloModel.create(modeloData);
        res.status(201).json({ id: modeloId, ...modeloData });
    } catch (error) {
        console.error('Error en createModelo:', error);
        res.status(500).json({ message: 'Error al crear el modelo', error: error.message });
    }
};

// Controlador para obtener todos los modelos
const getAllModelos = async (req, res) => {
    try {
        const modelos = await ModeloModel.getAll();
        res.status(200).json(modelos);
    } catch (error) {
        console.error('Error en getAllModelos:', error);
        res.status(500).json({ message: 'Error al obtener los modelos', error: error.message });
    }
};

// Controlador para obtener un modelo por ID
const getModeloById = async (req, res) => {
    try {
        const { id } = req.params;
        const modelo = await ModeloModel.getById(id);
        if (modelo) {
            res.status(200).json(modelo);
        } else {
            res.status(404).json({ message: 'Modelo no encontrado' });
        }
    } catch (error) {
        console.error('Error en getModeloById:', error);
        res.status(500).json({ message: 'Error al obtener el modelo', error: error.message });
    }
};

// Controlador para actualizar un modelo
const updateModelo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_completo, fecha_nacimiento, edad, celular, genero, email_contacto, redes_sociales, fotos_book } = req.body;

        const modeloData = {
            nombre_completo,
            fecha_nacimiento: fecha_nacimiento || null,
            edad: parseInt(edad),
            celular,
            genero,
            email_contacto,
            redes_sociales: redes_sociales || null,
            fotos_book: fotos_book || null,
        };

        const updated = await ModeloModel.update(id, modeloData);
        if (updated) {
            res.status(200).json({ message: 'Modelo actualizado con éxito' });
        } else {
            res.status(404).json({ message: 'Modelo no encontrado' });
        }
    } catch (error) {
        console.error('Error en updateModelo:', error);
        res.status(500).json({ message: 'Error al actualizar el modelo', error: error.message });
    }
};

// Controlador para eliminar un modelo
const deleteModelo = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ModeloModel.delete(id);
        if (deleted) {
            res.status(200).json({ message: 'Modelo eliminado con éxito' });
        } else {
            res.status(404).json({ message: 'Modelo no encontrado' });
        }
    } catch (error) {
        console.error('Error en deleteModelo:', error);
        res.status(500).json({ message: 'Error al eliminar el modelo', error: error.message });
    }
};

// <--- NUEVA FUNCIÓN: Controlador para la subida de MÚLTIPLES imágenes
// NOTA: Esta función DEBERÍA usarse con Multer en la ruta.
// Se asume que Multer ya guardó los archivos y 'req.files' está poblado.
const uploadModelProfileImages = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No se han seleccionado archivos de imagen.' });
    }

    // Ajusta la URL base según cómo Multer guarde las imágenes
    // Si Multer guarda en 'backend/public/uploads/nombre.jpg' y lo sirves en '/uploads'
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    console.log(`Imágenes de perfil subidas exitosamente: ${imageUrls}`);

    res.status(200).json({
        message: 'Imágenes subidas con éxito',
        imageUrls: imageUrls
    });
};

// --- NUEVO CONTROLADOR: Establecer la Imagen de Perfil ---
const setProfileImage = async (req, res) => {
    const { id } = req.params; // ID del modelo
    const { newImageUrl } = req.body; // La URL de la imagen que el frontend quiere establecer como perfil

    if (!newImageUrl) {
        return res.status(400).json({ message: 'URL de imagen de perfil es requerida.' });
    }

    try {
        const success = await ModeloModel.updateProfileImage(id, newImageUrl);
        if (success) {
            res.status(200).json({ message: 'Imagen de perfil actualizada correctamente.' });
        } else {
            res.status(404).json({ message: 'Modelo no encontrado o no se pudo actualizar la imagen de perfil.' });
        }
    } catch (error) {
        console.error("Error en setProfileImage:", error);
        res.status(500).json({ message: 'Error interno del servidor al establecer la imagen de perfil.', error: error.message });
    }
};


// ----------------------------------------------------
// CONTROLADORES PARA DATOS ANTROPOMÉTRICOS (en el mismo archivo)
// ----------------------------------------------------

const createDatosAntropometricos = async (req, res) => {
    try {
        const { modeloId } = req.params;
        const data = req.body;
        const antropometricoId = await DatosAntropometricosModel.create({ modelo_id: modeloId, ...data });
        res.status(201).json({ id: antropometricoId, modelo_id: modeloId, ...data });
    } catch (error) {
        console.error('Error en createDatosAntropometricos:', error);
        res.status(500).json({ message: 'Error al guardar datos antropométricos', error: error.message });
    }
};

const updateDatosAntropometricos = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = await DatosAntropometricosModel.update(id, data);
        if (updated) {
            res.status(200).json({ message: 'Datos antropométricos actualizados con éxito' });
        } else {
            res.status(404).json({ message: 'Datos antropométricos no encontrados' });
        }
    } catch (error) {
        console.error('Error en updateDatosAntropometricos:', error);
        res.status(500).json({ message: 'Error al actualizar datos antropométricos', error: error.message });
    }
};

const deleteDatosAntropometricos = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await DatosAntropometricosModel.delete(id);
        if (deleted) {
            res.status(200).json({ message: 'Datos antropométricos eliminados con éxito' });
        } else {
            res.status(404).json({ message: 'Datos antropométricos no encontrados' });
        }
    } catch (error) {
        console.error('Error en deleteDatosAntropometricos:', error);
        res.status(500).json({ message: 'Error al eliminar datos antropométricos', error: error.message });
    }
};

// ----------------------------------------------------
// CONTROLADORES PARA EXPERIENCIAS (en el mismo archivo)
// ----------------------------------------------------

const createExperiencia = async (req, res) => {
    try {
        const { modeloId } = req.params;
        const data = req.body;
        const experienciaId = await ExperienciaModel.create({ modelo_id: modeloId, ...data });
        res.status(201).json({ id: experienciaId, modelo_id: modeloId, ...data });
    } catch (error) {
        console.error('Error en createExperiencia:', error);
        res.status(500).json({ message: 'Error al guardar experiencia', error: error.message });
    }
};

const updateExperiencia = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = await ExperienciaModel.update(id, data);
        if (updated) {
            res.status(200).json({ message: 'Experiencia actualizada con éxito' });
        } else {
            res.status(404).json({ message: 'Experiencia no encontrada' });
        }
    } catch (error) {
        console.error('Error en updateExperiencia:', error);
        res.status(500).json({ message: 'Error al actualizar experiencia', error: error.message });
    }
};

const deleteExperiencia = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ExperienciaModel.delete(id);
        if (deleted) {
            res.status(200).json({ message: 'Experiencia eliminada con éxito' });
        } else {
            res.status(404).json({ message: 'Experiencia no encontrada' });
        }
    } catch (error) {
        console.error('Error en deleteExperiencia:', error);
        res.status(500).json({ message: 'Error al eliminar experiencia', error: error.message });
    }
};

// ¡MUY IMPORTANTE! Exporta todas las funciones que usas en tus rutas.
module.exports = {
    createModelo,
    getAllModelos,
    getModeloById,
    updateModelo,
    deleteModelo,
    uploadModelProfileImages,
    setProfileImage, // <--- EXPORTA EL NUEVO CONTROLADOR
    createDatosAntropometricos,
    updateDatosAntropometricos,
    deleteDatosAntropometricos,
    createExperiencia,
    updateExperiencia,
    deleteExperiencia
};