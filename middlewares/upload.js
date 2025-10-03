const multer = require('multer');
const path = require('path');
const fs = require('fs'); // <--- ¡IMPORTA EL MÓDULO FS!

// Define la carpeta donde se guardarán los archivos
const UPLOAD_DESTINATION = path.join(__dirname, '../public/uploads/');

// Configuración de Multer para el almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Asegúrate de que la carpeta de destino exista. Si no, créala.
    if (!fs.existsSync(UPLOAD_DESTINATION)) {
      fs.mkdirSync(UPLOAD_DESTINATION, { recursive: true }); // `recursive: true` permite crear subcarpetas anidadas
    }
    cb(null, UPLOAD_DESTINATION); // La ruta es relativa a este archivo de middleware
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif)!'));
  }
});

module.exports = upload;