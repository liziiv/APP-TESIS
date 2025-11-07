const express = require('express');
const router = express.Router();
const hypothesesController = require('../controllers/hypothesesController');

// GET /api/hypotheses - Obtener todas las hipótesis
router.get('/', hypothesesController.getAllHypotheses);

// GET /api/hypotheses/:id - Obtener una hipótesis por ID
router.get('/:id', hypothesesController.getHypothesisById);

// GET /api/hypotheses/plan/:planId - Obtener hipótesis por plan
router.get('/plan/:planId', hypothesesController.getHypothesesByPlan);

// POST /api/hypotheses - Crear una nueva hipótesis
router.post('/', hypothesesController.createHypothesis);

// PUT /api/hypotheses/:id - Actualizar una hipótesis
router.put('/:id', hypothesesController.updateHypothesis);

// DELETE /api/hypotheses/:id - Eliminar una hipótesis
router.delete('/:id', hypothesesController.deleteHypothesis);

module.exports = router;