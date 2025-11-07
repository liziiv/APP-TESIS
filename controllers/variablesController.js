const { getConnection } = require('../config/database');

class VariablesController {
  // GET /api/variables - Obtener todas las variables
  async getAllVariables(req, res) {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT v.*, rp.title as plan_title
        FROM variables v
        JOIN research_plans rp ON v.plan_id = rp.id
      `);
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener variables:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/variables/:id - Obtener una variable por ID
  async getVariableById(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT v.*, rp.title as plan_title
        FROM variables v
        JOIN research_plans rp ON v.plan_id = rp.id
        WHERE v.id = ?
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Variable no encontrada'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error al obtener variable:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/variables/plan/:planId - Obtener variables por plan
  async getVariablesByPlan(req, res) {
    try {
      const { planId } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT v.*, rp.title as plan_title
        FROM variables v
        JOIN research_plans rp ON v.plan_id = rp.id
        WHERE v.plan_id = ?
      `, [planId]);

      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener variables del plan:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // POST /api/variables - Crear una nueva variable
  async createVariable(req, res) {
    try {
      const { plan_id, name, conceptual_definition, operational_definition } = req.body;

      if (!plan_id || !name) {
        return res.status(400).json({
          success: false,
          error: 'ID del plan y nombre son requeridos'
        });
      }

      const connection = await getConnection();
      const [result] = await connection.execute(
        'INSERT INTO variables (plan_id, name, conceptual_definition, operational_definition) VALUES (?, ?, ?, ?)',
        [plan_id, name, conceptual_definition, operational_definition]
      );

      res.status(201).json({
        success: true,
        message: 'Variable creada exitosamente',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('Error al crear variable:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/variables/:id - Actualizar una variable
  async updateVariable(req, res) {
    try {
      const { id } = req.params;
      const { plan_id, name, conceptual_definition, operational_definition } = req.body;

      const connection = await getConnection();
      const [result] = await connection.execute(
        'UPDATE variables SET plan_id = ?, name = ?, conceptual_definition = ?, operational_definition = ? WHERE id = ?',
        [plan_id, name, conceptual_definition, operational_definition, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Variable no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Variable actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar variable:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/variables/:id - Eliminar una variable
  async deleteVariable(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [result] = await connection.execute('DELETE FROM variables WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Variable no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Variable eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar variable:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new VariablesController();