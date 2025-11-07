const express = require('express');
const router = express.Router();
const bibliographyController = require('../controllers/bibliographyController');

// GET /api/bibliography - Obtener toda la bibliografía
router.get('/', bibliographyController.getAllBibliography);

// GET /api/bibliography/:id - Obtener una entrada de bibliografía por ID
router.get('/:id', bibliographyController.getBibliographyById);

// GET /api/bibliography/plan/:planId - Obtener bibliografía por plan
router.get('/plan/:planId', bibliographyController.getBibliographyByPlan);

// POST /api/bibliography - Crear una nueva entrada de bibliografía
router.post('/', bibliographyController.createBibliography);

// PUT /api/bibliography/:id - Actualizar una entrada de bibliografía
router.put('/:id', bibliographyController.updateBibliography);

// DELETE /api/bibliography/:id - Eliminar una entrada de bibliografía
router.delete('/:id', bibliographyController.deleteBibliography);

module.exports = router;