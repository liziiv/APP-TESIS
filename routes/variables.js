const express = require('express');
const router = express.Router();
const variablesController = require('../controllers/variablesController');

// GET /api/variables - Obtener todas las variables
router.get('/', variablesController.getAllVariables);

// GET /api/variables/:id - Obtener una variable por ID
router.get('/:id', variablesController.getVariableById);

// GET /api/variables/plan/:planId - Obtener variables por plan
router.get('/plan/:planId', variablesController.getVariablesByPlan);

// POST /api/variables - Crear una nueva variable
router.post('/', variablesController.createVariable);

// PUT /api/variables/:id - Actualizar una variable
router.put('/:id', variablesController.updateVariable);

// DELETE /api/variables/:id - Eliminar una variable
router.delete('/:id', variablesController.deleteVariable);

module.exports = router;