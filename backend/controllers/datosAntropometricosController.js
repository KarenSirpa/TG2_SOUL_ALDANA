// backend/controllers/datosAntropometricosController.js
const DatosAntropometricosModel = require('../models/datosAntropometricosModel');

const createDatosAntropometricos = async (req, res) => {
    try {
        // En esta ruta, asumo que modelo_id vendrá en el cuerpo de la solicitud o en los parámetros si la ruta es diferente
        const { modelo_id, cintura, cadera, busto, talla_camisa, talla_general, talla_zapato, color_ojos, tatuajes_marcas, altura, peso } = req.body;
        
        const dataToCreate = {
            modelo_id, cintura, cadera, busto, talla_camisa, talla_general, talla_zapato, 
            color_ojos, tatuajes_marcas, altura, peso
        };

        const newId = await DatosAntropometricosModel.create(dataToCreate);
        res.status(201).json({ id: newId, message: 'Datos antropométricos registrados y cifrados.' });
    } catch (error) {
        console.error('Error en createDatosAntropometricos:', error);
        res.status(500).json({ error: 'Error del servidor al registrar datos antropométricos.' });
    }
};

const updateDatosAntropometricos = async (req, res) => {
    try {
        const { id } = req.params; // ID del dato antropométrico
        const { cintura, cadera, busto, talla_camisa, talla_general, talla_zapato, color_ojos, tatuajes_marcas, altura, peso } = req.body;
        
        const dataToUpdate = {
            cintura, cadera, busto, talla_camisa, talla_general, talla_zapato, 
            color_ojos, tatuajes_marcas, altura, peso
        };

        const updated = await DatosAntropometricosModel.update(id, dataToUpdate);
        
        if (updated) {
            res.status(200).json({ message: 'Datos antropométricos actualizados.' });
        } else {
            res.status(404).json({ message: 'Datos antropométricos no encontrados o no se realizaron cambios.' });
        }
    } catch (error) {
        console.error('Error en updateDatosAntropometricos:', error);
        res.status(500).json({ error: 'Error del servidor al actualizar datos antropométricos.' });
    }
};

// --- ESTA ES LA FUNCIÓN CLAVE PARA TU ERROR ACTUAL ---
const getDatosAntropometricosById = async (req, res) => { // ¡ASEGÚRATE DE QUE ESTE NOMBRE COINCIDE CON LA RUTA!
    try {
        const { id } = req.params; // Esto es para obtener un dato antropométrico por SU PROPIO ID
        const datos = await DatosAntropometricosModel.getById(id); // Asegúrate de que tu modelo tiene un método 'getById'
        if (datos) {
            res.status(200).json(datos);
        } else {
            res.status(404).json({ message: 'Datos antropométricos no encontrados.' });
        }
    } catch (error) {
        console.error('Error en getDatosAntropometricosById:', error);
        res.status(500).json({ error: 'Error del servidor al obtener datos antropométricos.' });
    }
};

// Si la línea 13 de datosAntropometricosRoutes.js es para obtener por modeloId, entonces necesitas esta función:
const getDatosAntropometricosByModeloId = async (req, res) => {
    try {
        const { modeloId } = req.params; // Esto es para obtener datos antropométricos asociados a un MODELO
        const datos = await DatosAntropometricosModel.getByModeloId(modeloId); // Asegúrate de que tu modelo tiene un método 'getByModeloId'
        if (datos) {
            res.status(200).json(datos);
        } else {
            res.status(404).json({ message: 'Datos antropométricos no encontrados para este modelo.' });
        }
    } catch (error) {
        console.error('Error en getDatosAntropometricosByModeloId:', error);
        res.status(500).json({ error: 'Error del servidor al obtener datos antropométricos por ID de modelo.' });
    }
};


const deleteDatosAntropometricos = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await DatosAntropometricosModel.delete(id); // Asumiendo que tu modelo tiene un método 'delete'
        if (deleted) {
            res.status(200).json({ message: 'Datos antropométricos eliminados.' });
        } else {
            res.status(404).json({ message: 'Datos antropométricos no encontrados.' });
        }
    } catch (error) {
        console.error('Error en deleteDatosAntropometricos:', error);
        res.status(500).json({ error: 'Error al eliminar datos antropométricos.' });
    }
};

// ¡MUY IMPORTANTE! Exporta todas las funciones que usas en tus rutas.
module.exports = {
    createDatosAntropometricos,
    updateDatosAntropometricos,
    getDatosAntropometricosById,      // <--- Asegúrate de que esta o la siguiente estén exportadas.
    getDatosAntropometricosByModeloId, // <--- Si la usas en la línea 13, ¡debe estar aquí!
    deleteDatosAntropometricos,
};