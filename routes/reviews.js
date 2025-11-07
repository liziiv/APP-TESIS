const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

// GET /api/reviews - Obtener todas las revisiones
router.get('/', reviewsController.getAllReviews);

// GET /api/reviews/:id - Obtener una revisión por ID
router.get('/:id', reviewsController.getReviewById);

// GET /api/reviews/plan/:planId - Obtener revisiones por plan
router.get('/plan/:planId', reviewsController.getReviewsByPlan);

// POST /api/reviews - Crear una nueva revisión
router.post('/', reviewsController.createReview);

// PUT /api/reviews/:id - Actualizar una revisión
router.put('/:id', reviewsController.updateReview);

// DELETE /api/reviews/:id - Eliminar una revisión
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;