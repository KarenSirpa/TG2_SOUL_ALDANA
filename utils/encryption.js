// backend/utils/encryption.js
const crypto = require('crypto');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno desde .env

// Obtener la clave de encriptación y el IV desde las variables de entorno
const ENCRYPTION_KEY_ENV = process.env.ENCRYPTION_KEY;
const IV_KEY_ENV = process.env.IV_KEY;

// --- Validaciones Críticas al Inicio ---
// Aseguramos que la clave de encriptación sea de 32 bytes (64 caracteres hexadecimales)
if (!ENCRYPTION_KEY_ENV || ENCRYPTION_KEY_ENV.length !== 64) {
    console.error('ERROR CRÍTICO: La variable de entorno ENCRYPTION_KEY no está configurada o no tiene la longitud correcta (debe ser un string hexadecimal de 64 caracteres para AES-256).');
    console.error('Genera una clave con: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    process.exit(1); // Detiene la aplicación si la clave es inválida
}

// Aseguramos que el IV sea de 16 bytes (32 caracteres hexadecimales) para AES-256-CBC
if (!IV_KEY_ENV || IV_KEY_ENV.length !== 32) {
    console.error('ERROR CRÍTICO: La variable de entorno IV_KEY no está configurada o no tiene la longitud correcta (debe ser un string hexadecimal de 32 caracteres para el IV de 16 bytes).');
    console.error('Genera un IV con: node -e "console.log(require(\'crypto\').randomBytes(16).toString(\'hex\'))"');
    process.exit(1); // Detiene la aplicación si el IV es inválido
}

// Convertir las claves hexadecimales a Buffer
const key = Buffer.from(ENCRYPTION_KEY_ENV, 'hex');
const iv = Buffer.from(IV_KEY_ENV, 'hex');
const algorithm = 'aes-256-cbc';

/**
 * Encripta un texto o valor dado.
 * @param {string | number | boolean} text El texto o valor a encriptar.
 * @returns {string | null} El texto encriptado en formato hexadecimal, o null si el input es nulo/indefinido/vacío.
 */
function encrypt(text) {
    // Si el input es nulo, indefinido o una cadena vacía (después de trim), no encriptamos y devolvemos null
    if (text === null || text === undefined || String(text).trim() === '') {
        return null;
    }
    const textToEncrypt = String(text); // Aseguramos que sea un string

    try {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(textToEncrypt, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (e) {
        console.error('Error durante la encriptación:', e.message);
        return null; // En caso de error de encriptación, devuelve null
    }
}

/**
 * Desencripta un texto cifrado.
 * @param {string} encryptedText El texto encriptado en formato hexadecimal.
 * @returns {string | null} El texto desencriptado, o null si el input es nulo/indefinido/vacío o hay un error de desencriptación.
 */
function decrypt(encryptedText) {
    // Si el input es nulo, indefinido o una cadena vacía (después de trim), no desencriptamos y devolvemos null
    if (encryptedText === null || encryptedText === undefined || String(encryptedText).trim() === '') {
        return null;
    }
    const stringEncryptedText = String(encryptedText); // Aseguramos que sea un string

    try {
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(stringEncryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        console.error('Error al desencriptar el valor:', e.message);
        // Cuando el error es 'wrong final block length', significa que la clave/IV no coinciden
        // o el dato está corrupto.
        // Puedes loguear el texto encriptado para depuración si es necesario:
        // console.error('Valor encriptado que causó el error:', stringEncryptedText);
        return null; // En caso de error de desencriptación, devuelve null
    }
}

module.exports = { encrypt, decrypt };