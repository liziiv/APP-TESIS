const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activitiesController');

// GET /api/activities - Obtener todas las actividades
router.get('/', activitiesController.getAllActivities);

// GET /api/activities/:id - Obtener una actividad por ID
router.get('/:id', activitiesController.getActivityById);

// GET /api/activities/plan/:planId - Obtener actividades por plan
router.get('/plan/:planId', activitiesController.getActivitiesByPlan);

// POST /api/activities - Crear una nueva actividad
router.post('/', activitiesController.createActivity);

// PUT /api/activities/:id - Actualizar una actividad
router.put('/:id', activitiesController.updateActivity);

// DELETE /api/activities/:id - Eliminar una actividad
router.delete('/:id', activitiesController.deleteActivity);

module.exports = router;