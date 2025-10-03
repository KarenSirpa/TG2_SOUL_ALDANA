// backend/controllers/experienciaController.js
const ExperienciaModel = require('../models/experienciaModel'); // Asegúrate de que la ruta sea correcta

const createExperiencia = async (req, res) => {
    try {
        // Opción 1: Si modelo_id viene en el cuerpo de la solicitud (JSON)
        // Esto es lo más común si tu ruta POST es simplemente '/api/experiencias'
        const { modelo_id, titulo, descripcion, fecha_evento } = req.body;

        // Opción 2: Si modeloId viene de los parámetros de la URL (ej. /api/modelos/:modeloId/experiencias)
        // Descomenta y usa esta línea si tu ruta es así y quieres priorizar el modeloId de la URL
        // const modelo_id_from_params = req.params.modeloId; 
        // const modelo_id = modelo_id_from_params || req.body.modelo_id; // Prioriza URL o fallback a body

        // --- VALIDACIÓN CRÍTICA: Verifica que ningún campo sea undefined ---
        console.log('Datos recibidos en el controlador (createExperiencia):', { modelo_id, titulo, descripcion, fecha_evento });

        if (!modelo_id || !titulo || !descripcion || !fecha_evento) {
            // Envía un error 400 Bad Request si falta algún dato
            return res.status(400).json({ 
                error: 'Faltan datos obligatorios para registrar la experiencia.',
                details: { 
                    modelo_id: modelo_id !== undefined,
                    titulo: titulo !== undefined,
                    descripcion: descripcion !== undefined,
                    fecha_evento: fecha_evento !== undefined
                }
            });
        }

        const dataToCreate = {
            modelo_id: modelo_id, // Usamos el modelo_id ya verificado
            titulo,
            descripcion,
            fecha_evento,
        };

        const newId = await ExperienciaModel.create(dataToCreate); // Línea 16 original del error
        res.status(201).json({ id: newId, message: 'Experiencia registrada exitosamente.' });

    } catch (error) {
        console.error('Error en createExperiencia:', error);
        // Puedes refinar el mensaje de error aquí si sabes que puede ser de la DB
        if (error.code === 'ER_NO_REFERENCED_ROW_2') { // Ejemplo de código de error de MySQL si modelo_id no existe
            res.status(409).json({ error: 'El ID de modelo proporcionado no existe.', details: error.message });
        } else {
            res.status(500).json({ error: 'Error del servidor al registrar experiencia.', details: error.message });
        }
    }
};

const updateExperiencia = async (req, res) => {
    try {
        const { id } = req.params; // ID de la experiencia específica a actualizar
        const { titulo, descripcion, fecha_evento } = req.body;

        // Validar datos para actualizar
        if (!id || (!titulo && !descripcion && !fecha_evento)) {
            return res.status(400).json({ error: 'Datos incompletos para actualizar la experiencia.' });
        }

        const dataToUpdate = {
            titulo,
            descripcion,
            fecha_evento,
        };

        const updated = await ExperienciaModel.update(id, dataToUpdate);
        if (updated) {
            res.status(200).json({ message: 'Experiencia actualizada.' });
        } else {
            res.status(404).json({ message: 'Experiencia no encontrada o no se realizaron cambios.' });
        }
    } catch (error) {
        console.error('Error en updateExperiencia:', error);
        res.status(500).json({ error: 'Error del servidor al actualizar experiencia.', details: error.message });
    }
};

const getExperienciaById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de experiencia requerido.' });
        }
        const experiencia = await ExperienciaModel.getById(id);
        if (experiencia) {
            res.status(200).json(experiencia);
        } else {
            res.status(404).json({ message: 'Experiencia no encontrada.' });
        }
    } catch (error) {
        console.error('Error en getExperienciaById:', error);
        res.status(500).json({ error: 'Error del servidor al obtener experiencia.', details: error.message });
    }
};

const getExperienciasByModeloId = async (req, res) => {
    try {
        const { modeloId } = req.params;
        if (!modeloId) {
            return res.status(400).json({ error: 'ID de modelo requerido.' });
        }
        const experiencias = await ExperienciaModel.getByModeloId(modeloId);
        if (experiencias.length > 0) {
            res.status(200).json(experiencias);
        } else {
            res.status(404).json({ message: 'Experiencias no encontradas para este modelo.' });
        }
    } catch (error) {
        console.error('Error en getExperienciasByModeloId:', error);
        res.status(500).json({ error: 'Error del servidor al obtener experiencias por ID de modelo.', details: error.message });
    }
};

const deleteExperiencia = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID de experiencia requerido para eliminar.' });
        }
        const deleted = await ExperienciaModel.delete(id);
        if (deleted) {
            res.status(200).json({ message: 'Experiencia eliminada.' });
        } else {
            res.status(404).json({ message: 'Experiencia no encontrada.' });
        }
    } catch (error) {
        console.error('Error en deleteExperiencia:', error);
        res.status(500).json({ error: 'Error del servidor al eliminar experiencia.', details: error.message });
    }
};

module.exports = {
    createExperiencia,
    updateExperiencia,
    getExperienciaById,
    getExperienciasByModeloId,
    deleteExperiencia,
};