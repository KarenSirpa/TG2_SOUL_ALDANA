// backend/models/experienciaModel.js
const db = require('../config/db');

const ExperienciaModel = {
    create: async (data) => {
        const { modelo_id, titulo, descripcion, fecha_evento } = data;

        // Log para ver los datos justo antes de la ejecución de la consulta
        console.log('Datos recibidos en ExperienciaModel.create para db.execute:', { modelo_id, titulo, descripcion, fecha_evento });

        // Convierte explicitamente a null si un campo es vacío o null, para evitar 'undefined'
        // Esto es útil si el frontend envía un string vacío en lugar de no enviar el campo
        const finalTitulo = titulo || null;
        const finalDescripcion = descripcion || null;
        const finalFechaEvento = fecha_evento || null; // O ajusta si 'fecha_evento' no puede ser NULL en DB

        const [result] = await db.execute(
            'INSERT INTO experiencias (modelo_id, titulo, descripcion, fecha_evento) VALUES (?, ?, ?, ?)',
            [modelo_id, finalTitulo, finalDescripcion, finalFechaEvento] // Asegúrate de que ninguno de estos es undefined
        );
        return result.insertId;
    },

    getById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM experiencias WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    },

    getByModeloId: async (modeloId) => {
        const [rows] = await db.execute('SELECT * FROM experiencias WHERE modelo_id = ?', [modeloId]);
        return rows.length > 0 ? rows : []; // Devuelve un array de experiencias
    },

    update: async (id, data) => {
        const { titulo, descripcion, fecha_evento } = data;
        
        // Puedes construir la consulta dinámicamente o validar más estrictamente
        // Asegúrate de que los campos no sean undefined si se van a actualizar
        const updates = [];
        const params = [];

        if (titulo !== undefined) {
            updates.push('titulo = ?');
            params.push(titulo);
        }
        if (descripcion !== undefined) {
            updates.push('descripcion = ?');
            params.push(descripcion);
        }
        if (fecha_evento !== undefined) {
            updates.push('fecha_evento = ?');
            params.push(fecha_evento);
        }

        if (updates.length === 0) {
            return false; // No hay nada que actualizar
        }

        params.push(id); // El ID siempre va al final para la cláusula WHERE

        const [result] = await db.execute(
            `UPDATE experiencias SET ${updates.join(', ')} WHERE id = ?`,
            params
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM experiencias WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
};

module.exports = ExperienciaModel;