const express = require('express');
const router = express.Router();
const planHistoryController = require('../controllers/planHistoryController');

// GET /api/plan-history - Obtener todo el historial de planes
router.get('/', planHistoryController.getAllPlanHistory);

// GET /api/plan-history/:id - Obtener una entrada de historial por ID
router.get('/:id', planHistoryController.getPlanHistoryById);

// GET /api/plan-history/plan/:planId - Obtener historial por plan
router.get('/plan/:planId', planHistoryController.getPlanHistoryByPlan);

// POST /api/plan-history - Crear una nueva entrada de historial
router.post('/', planHistoryController.createPlanHistory);

// PUT /api/plan-history/:id - Actualizar una entrada de historial
router.put('/:id', planHistoryController.updatePlanHistory);

// DELETE /api/plan-history/:id - Eliminar una entrada de historial
router.delete('/:id', planHistoryController.deletePlanHistory);

module.exports = router;