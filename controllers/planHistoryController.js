const { getConnection } = require('../config/database');

class PlanHistoryController {
  // GET /api/plan-history - Obtener todo el historial de planes
  async getAllPlanHistory(req, res) {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT ph.*, rp.title as plan_title, u.name as user_name
        FROM plan_history ph
        JOIN research_plans rp ON ph.plan_id = rp.id
        JOIN users u ON ph.user_id = u.id
        ORDER BY ph.created_at DESC
      `);
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener historial de planes:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/plan-history/:id - Obtener una entrada de historial por ID
  async getPlanHistoryById(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT ph.*, rp.title as plan_title, u.name as user_name
        FROM plan_history ph
        JOIN research_plans rp ON ph.plan_id = rp.id
        JOIN users u ON ph.user_id = u.id
        WHERE ph.id = ?
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Entrada de historial no encontrada'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error al obtener entrada de historial:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/plan-history/plan/:planId - Obtener historial por plan
  async getPlanHistoryByPlan(req, res) {
    try {
      const { planId } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT ph.*, rp.title as plan_title, u.name as user_name
        FROM plan_history ph
        JOIN research_plans rp ON ph.plan_id = rp.id
        JOIN users u ON ph.user_id = u.id
        WHERE ph.plan_id = ?
        ORDER BY ph.created_at DESC
      `, [planId]);

      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener historial del plan:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // POST /api/plan-history - Crear una nueva entrada de historial
  async createPlanHistory(req, res) {
    try {
      const { plan_id, user_id, action, description } = req.body;

      if (!plan_id || !user_id || !action) {
        return res.status(400).json({
          success: false,
          error: 'ID del plan, usuario y acción son requeridos'
        });
      }

      const connection = await getConnection();
      const [result] = await connection.execute(
        'INSERT INTO plan_history (plan_id, user_id, action, description) VALUES (?, ?, ?, ?)',
        [plan_id, user_id, action, description]
      );

      res.status(201).json({
        success: true,
        message: 'Entrada de historial creada exitosamente',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('Error al crear entrada de historial:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/plan-history/:id - Actualizar una entrada de historial
  async updatePlanHistory(req, res) {
    try {
      const { id } = req.params;
      const { plan_id, user_id, action, description } = req.body;

      const connection = await getConnection();
      const [result] = await connection.execute(
        'UPDATE plan_history SET plan_id = ?, user_id = ?, action = ?, description = ? WHERE id = ?',
        [plan_id, user_id, action, description, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Entrada de historial no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Entrada de historial actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar entrada de historial:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/plan-history/:id - Eliminar una entrada de historial
  async deletePlanHistory(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [result] = await connection.execute('DELETE FROM plan_history WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Entrada de historial no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Entrada de historial eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar entrada de historial:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new PlanHistoryController();