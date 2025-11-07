const { getConnection } = require('../config/database');

class HypothesesController {
  // GET /api/hypotheses - Obtener todas las hipótesis
  async getAllHypotheses(req, res) {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT h.*, rp.title as plan_title
        FROM hypotheses h
        JOIN research_plans rp ON h.plan_id = rp.id
      `);
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener hipótesis:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/hypotheses/:id - Obtener una hipótesis por ID
  async getHypothesisById(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT h.*, rp.title as plan_title
        FROM hypotheses h
        JOIN research_plans rp ON h.plan_id = rp.id
        WHERE h.id = ?
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Hipótesis no encontrada'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error al obtener hipótesis:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/hypotheses/plan/:planId - Obtener hipótesis por plan
  async getHypothesesByPlan(req, res) {
    try {
      const { planId } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT h.*, rp.title as plan_title
        FROM hypotheses h
        JOIN research_plans rp ON h.plan_id = rp.id
        WHERE h.plan_id = ?
      `, [planId]);

      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener hipótesis del plan:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // POST /api/hypotheses - Crear una nueva hipótesis
  async createHypothesis(req, res) {
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
        'INSERT INTO hypotheses (plan_id, type, description) VALUES (?, ?, ?)',
        [plan_id, type, description]
      );

      res.status(201).json({
        success: true,
        message: 'Hipótesis creada exitosamente',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('Error al crear hipótesis:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/hypotheses/:id - Actualizar una hipótesis
  async updateHypothesis(req, res) {
    try {
      const { id } = req.params;
      const { plan_id, type, description } = req.body;

      const connection = await getConnection();
      const [result] = await connection.execute(
        'UPDATE hypotheses SET plan_id = ?, type = ?, description = ? WHERE id = ?',
        [plan_id, type, description, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Hipótesis no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Hipótesis actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar hipótesis:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/hypotheses/:id - Eliminar una hipótesis
  async deleteHypothesis(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [result] = await connection.execute('DELETE FROM hypotheses WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Hipótesis no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Hipótesis eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar hipótesis:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new HypothesesController();