// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

console.log('Tipo de authController.login:', typeof authController.login); // Esta línea
router.post('/login', authController.login);

module.exports = router;