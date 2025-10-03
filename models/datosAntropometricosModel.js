// backend/models/datosAntropometricosModel.js
const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

const DatosAntropometricosModel = {
    create: async (data) => {
        const { modelo_id, cintura, cadera, busto, talla_camisa, talla_general, talla_zapato, color_ojos, tatuajes_marcas, altura, peso } = data;

        const [result] = await db.execute(
            'INSERT INTO datos_antropometricos (modelo_id, cintura, cadera, busto, talla_camisa, talla_general, talla_zapato, color_ojos, tatuajes_marcas, altura, peso) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                modelo_id,
                encrypt(cintura),
                encrypt(cadera),
                encrypt(busto),
                encrypt(talla_camisa),
                encrypt(talla_general),
                encrypt(talla_zapato),
                encrypt(color_ojos),
                encrypt(tatuajes_marcas),
                encrypt(altura),
                encrypt(peso)
            ]
        );
        return result.insertId;
    },

    update: async (id, data) => {
        const { cintura, cadera, busto, talla_camisa, talla_general, talla_zapato, color_ojos, tatuajes_marcas, altura, peso } = data;

        const [result] = await db.execute(
            'UPDATE datos_antropometricos SET cintura=?, cadera=?, busto=?, talla_camisa=?, talla_general=?, talla_zapato=?, color_ojos=?, tatuajes_marcas=?, altura=?, peso=? WHERE id=?',
            [
                encrypt(cintura),
                encrypt(cadera),
                encrypt(busto),
                encrypt(talla_camisa),
                encrypt(talla_general),
                encrypt(talla_zapato),
                encrypt(color_ojos),
                encrypt(tatuajes_marcas),
                encrypt(altura),
                encrypt(peso),
                id
            ]
        );
        return result.affectedRows > 0;
    },

    // AÑADE O COMPLETA ESTAS FUNCIONES:
    getById: async (id) => { // <-- Esta es la función que necesitas si tu ruta es '/:id'
        const [rows] = await db.execute('SELECT * FROM datos_antropometricos WHERE id = ?', [id]);
        if (rows.length > 0) {
            // Asegúrate de desencriptar todos los datos necesarios al obtenerlos
            const decryptedData = {};
            for (const key in rows[0]) {
                if (key !== 'id' && key !== 'modelo_id') { // No desencriptar 'id' y 'modelo_id'
                    decryptedData[key] = decrypt(rows[0][key]);
                } else {
                    decryptedData[key] = rows[0][key];
                }
            }
            return decryptedData;
        }
        return null;
    },

    getByModeloId: async (modeloId) => { // <-- Esta es la función que necesitas si tu ruta es '/:modeloId'
        const [rows] = await db.execute('SELECT * FROM datos_antropometricos WHERE modelo_id = ?', [modeloId]);
        if (rows.length > 0) {
            const decryptedData = {};
            for (const key in rows[0]) {
                if (key !== 'id' && key !== 'modelo_id') {
                    decryptedData[key] = decrypt(rows[0][key]);
                } else {
                    decryptedData[key] = rows[0][key];
                }
            }
            return decryptedData;
        }
        return null;
    },

    delete: async (id) => { // <-- Esta es la función para eliminar un dato antropométrico por su propio ID
        const [result] = await db.execute('DELETE FROM datos_antropometricos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
};

module.exports = DatosAntropometricosModel;