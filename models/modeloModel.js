// backend/models/ModeloModel.js (Actualizado)

const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

const ModeloModel = {
    create: async (modeloData) => {
        const { nombre_completo, fecha_nacimiento, edad, celular, genero, email_contacto, redes_sociales, fotos_book } = modeloData;

        const rs = redes_sociales ? JSON.stringify(redes_sociales) : null;
        const fb = fotos_book && fotos_book.length > 0 ? JSON.stringify(fotos_book) : null;

        const query = 'INSERT INTO modelos (nombre_completo, fecha_nacimiento, edad, celular, genero, email_contacto, redes_sociales, fotos_book) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.execute(query, [nombre_completo, fecha_nacimiento, edad, celular, genero, email_contacto, rs, fb]);
        return result.insertId;
    },
    
    getAll: async () => {
        const query = `
            SELECT
                m.*,
                da.id AS da_id, da.cintura, da.cadera, da.busto, da.talla_camisa, da.talla_general, da.talla_zapato, da.color_ojos, da.altura, da.peso, da.tatuajes_marcas,
                e.id AS exp_id, e.titulo, e.descripcion, e.fecha_evento
            FROM modelos m
            LEFT JOIN datos_antropometricos da ON m.id = da.modelo_id
            LEFT JOIN experiencias e ON m.id = e.modelo_id
            ORDER BY m.id, e.fecha_evento DESC, e.id DESC
        `;
        const [rows] = await db.execute(query);

        const modelosMap = new Map();

        rows.forEach(row => {
            if (!modelosMap.has(row.id)) {
                modelosMap.set(row.id, {
                    id: row.id,
                    nombre_completo: row.nombre_completo,
                    fecha_nacimiento: row.fecha_nacimiento,
                    genero: row.genero,
                    edad: row.edad,
                    celular: row.celular,
                    email_contacto: row.email_contacto,
                    redes_sociales: row.redes_sociales ? JSON.parse(row.redes_sociales) : null,
                    fotos_book: row.fotos_book ? JSON.parse(row.fotos_book) : [],
                    datos_antropometricos: null,
                    experiencias: []
                });
            }
            const model = modelosMap.get(row.id);

            if (row.da_id && !model.datos_antropometricos) {
                model.datos_antropometricos = {
                    id: row.da_id,
                    cintura: row.cintura ? decrypt(row.cintura) : null,
                    cadera: row.cadera ? decrypt(row.cadera) : null,
                    busto: row.busto ? decrypt(row.busto) : null,
                    talla_camisa: row.talla_camisa ? decrypt(row.talla_camisa) : null,
                    talla_general: row.talla_general ? decrypt(row.talla_general) : null,
                    talla_zapato: row.talla_zapato ? decrypt(row.talla_zapato) : null,
                    color_ojos: row.color_ojos ? decrypt(row.color_ojos) : null,
                    altura: row.altura ? parseFloat(decrypt(row.altura)) : null,
                    peso: row.peso ? parseFloat(decrypt(row.peso)) : null,
                    tatuajes_marcas: row.tatuajes_marcas ? decrypt(row.tatuajes_marcas) : null,
                };
            }

            if (row.exp_id) {
                const experienceExists = model.experiencias.some(exp => exp.id === row.exp_id);
                if (!experienceExists) {
                    model.experiencias.push({
                        id: row.exp_id,
                        titulo: row.titulo,
                        descripcion: row.descripcion,
                        fecha_evento: row.fecha_evento,
                    });
                }
            }
        });
        return Array.from(modelosMap.values());
    },

    getById: async (id) => {
        const query = `
            SELECT
                m.*,
                da.id AS da_id, da.cintura, da.cadera, da.busto, da.talla_camisa, da.talla_general, da.talla_zapato, da.color_ojos, da.altura, da.peso, da.tatuajes_marcas,
                e.id AS exp_id, e.titulo, e.descripcion, e.fecha_evento
            FROM modelos m
            LEFT JOIN datos_antropometricos da ON m.id = da.modelo_id
            LEFT JOIN experiencias e ON m.id = e.modelo_id
            WHERE m.id = ?
            ORDER BY e.fecha_evento DESC, e.id DESC
        `;
        const [rows] = await db.execute(query, [id]);

        if (rows.length === 0) return null;

        const model = {
            id: rows[0].id,
            nombre_completo: rows[0].nombre_completo,
            fecha_nacimiento: rows[0].fecha_nacimiento,
            genero: rows[0].genero,
            edad: rows[0].edad,
            celular: rows[0].celular,
            email_contacto: rows[0].email_contacto,
            redes_sociales: rows[0].redes_sociales ? JSON.parse(rows[0].redes_sociales) : null,
            fotos_book: rows[0].fotos_book ? JSON.parse(rows[0].fotos_book) : [],
            datos_antropometricos: null,
            experiencias: []
        };

        if (rows[0].da_id) {
            model.datos_antropometricos = {
                id: rows[0].da_id,
                cintura: rows[0].cintura ? decrypt(rows[0].cintura) : null,
                cadera: rows[0].cadera ? decrypt(rows[0].cadera) : null,
                busto: rows[0].busto ? decrypt(rows[0].busto) : null,
                talla_camisa: rows[0].talla_camisa ? decrypt(rows[0].talla_camisa) : null,
                talla_general: rows[0].talla_general ? decrypt(rows[0].talla_general) : null,
                talla_zapato: rows[0].talla_zapato ? decrypt(rows[0].talla_zapato) : null,
                color_ojos: rows[0].color_ojos ? decrypt(rows[0].color_ojos) : null,
                altura: rows[0].altura ? parseFloat(decrypt(rows[0].altura)) : null,
                peso: rows[0].peso ? parseFloat(decrypt(rows[0].peso)) : null,
                tatuajes_marcas: rows[0].tatuajes_marcas ? decrypt(rows[0].tatuajes_marcas) : null,
            };
        }

        rows.forEach(row => {
            if (row.exp_id) {
                const experienceExists = model.experiencias.some(exp => exp.id === row.exp_id);
                if (!experienceExists) {
                    model.experiencias.push({
                        id: row.exp_id,
                        titulo: row.titulo,
                        descripcion: row.descripcion,
                        fecha_evento: row.fecha_evento,
                    });
                }
            }
        });

        return model;
    },

    update: async (id, modeloData) => {
        const { nombre_completo, fecha_nacimiento, edad, celular, genero, email_contacto, redes_sociales, fotos_book } = modeloData;

        const rs = redes_sociales ? JSON.stringify(redes_sociales) : null;
        const fb = fotos_book && fotos_book.length > 0 ? JSON.stringify(fotos_book) : null;

        const query = 'UPDATE modelos SET nombre_completo=?, fecha_nacimiento=?, edad=?, celular=?, genero=?, email_contacto=?, redes_sociales=?, fotos_book=? WHERE id=?';
        const [result] = await db.execute(query, [nombre_completo, fecha_nacimiento, edad, celular, genero, email_contacto, rs, fb, id]);
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const query = 'DELETE FROM modelos WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result.affectedRows > 0;
    },

    // --- NUEVO MÉTODO: updateProfileImage ---
    updateProfileImage: async (modelId, newImageUrl) => {
        // Primero, obtenemos el modelo para manipular su fotos_book actual
        const getQuery = 'SELECT fotos_book FROM modelos WHERE id = ?';
        const [rows] = await db.execute(getQuery, [modelId]);

        if (rows.length === 0) {
            return false; // Modelo no encontrado
        }

        let currentFotosBook = rows[0].fotos_book ? JSON.parse(rows[0].fotos_book) : [];

        // Lógica para mover newImageUrl al principio del array
        let updatedFotosBook = [];
        const filteredPhotos = currentFotosBook.filter(url => url !== newImageUrl); // Elimina la imagen de su posición actual

        updatedFotosBook.push(newImageUrl); // Añade la nueva imagen como la primera
        updatedFotosBook = updatedFotosBook.concat(filteredPhotos); // Concatena el resto de las imágenes

        const updatedFotosBookJson = JSON.stringify(updatedFotosBook);

        // Actualiza solo el campo fotos_book
        const updateQuery = 'UPDATE modelos SET fotos_book = ? WHERE id = ?';
        const [result] = await db.execute(updateQuery, [updatedFotosBookJson, modelId]);

        return result.affectedRows > 0;
    }
};

module.exports = ModeloModel;