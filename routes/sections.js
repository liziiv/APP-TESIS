const express = require('express');
const router = express.Router();
const sectionsController = require('../controllers/sectionsController');

// GET /api/sections - Obtener todas las secciones
router.get('/', sectionsController.getAllSections);

// GET /api/sections/:id - Obtener una sección por ID
router.get('/:id', sectionsController.getSectionById);

// GET /api/sections/plan/:planId - Obtener secciones por plan
router.get('/plan/:planId', sectionsController.getSectionsByPlan);

// POST /api/sections - Crear una nueva sección
router.post('/', sectionsController.createSection);

// PUT /api/sections/:id - Actualizar una sección
router.put('/:id', sectionsController.updateSection);

// DELETE /api/sections/:id - Eliminar una sección
router.delete('/:id', sectionsController.deleteSection);

module.exports = router;