/**
*    Project     : Sample Vault
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Marzo 2026
*/

const express = require('express');
const router = express.Router();
const sampleController = require('../controllers/sampleController');

//configuración de Multer para subir archivos de audio:
const uploadMiddleware = require('../config/multerConfig');

const { verifyToken } = require('../middleware/authMiddleware');

// Todas las rutas de samples requieren que el usuario esté logueado
router.use(verifyToken);

// Subir un nuevo audio: POST /api/samples/upload
// 'audioFile' es el nombre que debe tener el campo file en el FormData del frontend
router.post('/upload', uploadMiddleware, sampleController.uploadSample);

// Listar mis samples: GET /api/samples/my-samples
router.get('/my-samples', sampleController.getMySamples);
// Agregado por Bianca
// // Buscar samples por categoría: GET /api/samples/search
// Cuando el usuario pegue en su navegador o herramienta de test algo como: /api/samples/search?category=Drums
// Express va a derivar esa petición a la función segura de nuestro controlador.
router.get('/search', sampleController.searchSamplesByCategory);

// Eliminar un sample: DELETE /api/samples/:id
router.delete('/:id', sampleController.deleteSample);
ss
module.exports = router;