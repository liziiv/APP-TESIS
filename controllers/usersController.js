const { getConnection } = require('../config/database');

class UsersController {
  // GET /api/users - Obtener todos los usuarios
  async getAllUsers(req, res) {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute('SELECT * FROM users');
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/users/:id - Obtener un usuario por ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // POST /api/users - Crear un nuevo usuario
  async createUser(req, res) {
    try {
      const { name, email, password_hash, role, status } = req.body;

      if (!name || !email || !password_hash) {
        return res.status(400).json({
          success: false,
          error: 'Nombre, email y contraseña son requeridos'
        });
      }

      const connection = await getConnection();
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
        [name, email, password_hash, role || 'student', status || 'active']
      );

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          error: 'El email ya está registrado'
        });
      }
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/users/:id - Actualizar un usuario
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password_hash, role, status } = req.body;

      const connection = await getConnection();
      const [result] = await connection.execute(
        'UPDATE users SET name = ?, email = ?, password_hash = ?, role = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, email, password_hash, role, status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          error: 'El email ya está registrado'
        });
      }
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/users/:id - Eliminar un usuario
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new UsersController();