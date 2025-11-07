const express = require('express');
const router = express.Router();
const researchPlansController = require('../controllers/researchPlansController');

// GET /api/research-plans - Obtener todos los planes de investigación
router.get('/', researchPlansController.getAllResearchPlans);

// GET /api/research-plans/:id - Obtener un plan de investigación por ID
router.get('/:id', researchPlansController.getResearchPlanById);

// POST /api/research-plans - Crear un nuevo plan de investigación
router.post('/', researchPlansController.createResearchPlan);

// PUT /api/research-plans/:id - Actualizar un plan de investigación
router.put('/:id', researchPlansController.updateResearchPlan);

// DELETE /api/research-plans/:id - Eliminar un plan de investigación
router.delete('/:id', researchPlansController.deleteResearchPlan);

module.exports = router;