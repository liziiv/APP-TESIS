const { getConnection } = require('../config/database');

class ObjectivesController {
  // GET /api/objectives - Obtener todos los objetivos
  async getAllObjectives(req, res) {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT o.*, rp.title as plan_title
        FROM objectives o
        JOIN research_plans rp ON o.plan_id = rp.id
      `);
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener objetivos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/objectives/:id - Obtener un objetivo por ID
  async getObjectiveById(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT o.*, rp.title as plan_title
        FROM objectives o
        JOIN research_plans rp ON o.plan_id = rp.id
        WHERE o.id = ?
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Objetivo no encontrado'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error al obtener objetivo:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/objectives/plan/:planId - Obtener objetivos por plan
  async getObjectivesByPlan(req, res) {
    try {
      const { planId } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT o.*, rp.title as plan_title
        FROM objectives o
        JOIN research_plans rp ON o.plan_id = rp.id
        WHERE o.plan_id = ?
      `, [planId]);

      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener objetivos del plan:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // POST /api/objectives - Crear un nuevo objetivo
  async createObjective(req, res) {
    try {
      const { plan_id, type, description } = req.body;

      if (!plan_id || !type || !description) {
        return res.status(400).json({
          success: false,
          error: 'ID del plan, tipo y descripción son requeridos'
        });
      }

      const connection = await getConnection();
      const [result] = await connection.execute(
        'INSERT INTO objectives (plan_id, type, description) VALUES (?, ?, ?)',
        [plan_id, type, description]
      );

      res.status(201).json({
        success: true,
        message: 'Objetivo creado exitosamente',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('Error al crear objetivo:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/objectives/:id - Actualizar un objetivo
  async updateObjective(req, res) {
    try {
      const { id } = req.params;
      const { plan_id, type, description } = req.body;

      const connection = await getConnection();
      const [result] = await connection.execute(
        'UPDATE objectives SET plan_id = ?, type = ?, description = ? WHERE id = ?',
        [plan_id, type, description, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Objetivo no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Objetivo actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar objetivo:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/objectives/:id - Eliminar un objetivo
  async deleteObjective(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [result] = await connection.execute('DELETE FROM objectives WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Objetivo no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Objetivo eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar objetivo:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new ObjectivesController();