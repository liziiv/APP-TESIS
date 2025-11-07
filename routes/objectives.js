const express = require('express');
const router = express.Router();
const objectivesController = require('../controllers/objectivesController');

// GET /api/objectives - Obtener todos los objetivos
router.get('/', objectivesController.getAllObjectives);

// GET /api/objectives/:id - Obtener un objetivo por ID
router.get('/:id', objectivesController.getObjectiveById);

// GET /api/objectives/plan/:planId - Obtener objetivos por plan
router.get('/plan/:planId', objectivesController.getObjectivesByPlan);

// POST /api/objectives - Crear un nuevo objetivo
router.post('/', objectivesController.createObjective);

// PUT /api/objectives/:id - Actualizar un objetivo
router.put('/:id', objectivesController.updateObjective);

// DELETE /api/objectives/:id - Eliminar un objetivo
router.delete('/:id', objectivesController.deleteObjective);

module.exports = router;