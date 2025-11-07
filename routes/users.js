const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// GET /api/users - Obtener todos los usuarios
router.get('/', usersController.getAllUsers);

// GET /api/users/:id - Obtener un usuario por ID
router.get('/:id', usersController.getUserById);

// POST /api/users - Crear un nuevo usuario
router.post('/', usersController.createUser);

// PUT /api/users/:id - Actualizar un usuario
router.put('/:id', usersController.updateUser);

// DELETE /api/users/:id - Eliminar un usuario
router.delete('/:id', usersController.deleteUser);

module.exports = router;