const { getConnection } = require('../config/database');

class ResearchPlansController {
  // GET /api/research-plans - Obtener todos los planes de investigación
  async getAllResearchPlans(req, res) {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT rp.*, u_student.name as student_name, u_advisor.name as advisor_name
        FROM research_plans rp
        LEFT JOIN users u_student ON rp.student_id = u_student.id
        LEFT JOIN users u_advisor ON rp.advisor_id = u_advisor.id
      `);
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener planes de investigación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/research-plans/:id - Obtener un plan de investigación por ID
  async getResearchPlanById(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT rp.*, u_student.name as student_name, u_advisor.name as advisor_name
        FROM research_plans rp
        LEFT JOIN users u_student ON rp.student_id = u_student.id
        LEFT JOIN users u_advisor ON rp.advisor_id = u_advisor.id
        WHERE rp.id = ?
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Plan de investigación no encontrado'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error al obtener plan de investigación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // POST /api/research-plans - Crear un nuevo plan de investigación
  async createResearchPlan(req, res) {
    try {
      const { student_id, advisor_id, title, description, status, progress } = req.body;

      if (!student_id || !title) {
        return res.status(400).json({
          success: false,
          error: 'ID del estudiante y título son requeridos'
        });
      }

      const connection = await getConnection();
      const [result] = await connection.execute(
        'INSERT INTO research_plans (student_id, advisor_id, title, description, status, progress) VALUES (?, ?, ?, ?, ?, ?)',
        [student_id, advisor_id, title, description, status || 'draft', progress || 0.00]
      );

      res.status(201).json({
        success: true,
        message: 'Plan de investigación creado exitosamente',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('Error al crear plan de investigación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/research-plans/:id - Actualizar un plan de investigación
  async updateResearchPlan(req, res) {
    try {
      const { id } = req.params;
      const { student_id, advisor_id, title, description, status, progress } = req.body;

      const connection = await getConnection();
      const [result] = await connection.execute(
        'UPDATE research_plans SET student_id = ?, advisor_id = ?, title = ?, description = ?, status = ?, progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [student_id, advisor_id, title, description, status, progress, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Plan de investigación no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Plan de investigación actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar plan de investigación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/research-plans/:id - Eliminar un plan de investigación
  async deleteResearchPlan(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [result] = await connection.execute('DELETE FROM research_plans WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Plan de investigación no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Plan de investigación eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar plan de investigación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new ResearchPlansController();