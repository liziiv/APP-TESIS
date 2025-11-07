const { getConnection } = require('../config/database');

class BibliographyController {
  // GET /api/bibliography - Obtener toda la bibliografía
  async getAllBibliography(req, res) {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT b.*, rp.title as plan_title
        FROM bibliography b
        JOIN research_plans rp ON b.plan_id = rp.id
      `);
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener bibliografía:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/bibliography/:id - Obtener una entrada de bibliografía por ID
  async getBibliographyById(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT b.*, rp.title as plan_title
        FROM bibliography b
        JOIN research_plans rp ON b.plan_id = rp.id
        WHERE b.id = ?
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Entrada de bibliografía no encontrada'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error al obtener entrada de bibliografía:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/bibliography/plan/:planId - Obtener bibliografía por plan
  async getBibliographyByPlan(req, res) {
    try {
      const { planId } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT b.*, rp.title as plan_title
        FROM bibliography b
        JOIN research_plans rp ON b.plan_id = rp.id
        WHERE b.plan_id = ?
      `, [planId]);

      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener bibliografía del plan:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // POST /api/bibliography - Crear una nueva entrada de bibliografía
  async createBibliography(req, res) {
    try {
      const { plan_id, citation } = req.body;

      if (!plan_id || !citation) {
        return res.status(400).json({
          success: false,
          error: 'ID del plan y cita son requeridos'
        });
      }

      const connection = await getConnection();
      const [result] = await connection.execute(
        'INSERT INTO bibliography (plan_id, citation) VALUES (?, ?)',
        [plan_id, citation]
      );

      res.status(201).json({
        success: true,
        message: 'Entrada de bibliografía creada exitosamente',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('Error al crear entrada de bibliografía:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/bibliography/:id - Actualizar una entrada de bibliografía
  async updateBibliography(req, res) {
    try {
      const { id } = req.params;
      const { plan_id, citation } = req.body;

      const connection = await getConnection();
      const [result] = await connection.execute(
        'UPDATE bibliography SET plan_id = ?, citation = ? WHERE id = ?',
        [plan_id, citation, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Entrada de bibliografía no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Entrada de bibliografía actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar entrada de bibliografía:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/bibliography/:id - Eliminar una entrada de bibliografía
  async deleteBibliography(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [result] = await connection.execute('DELETE FROM bibliography WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Entrada de bibliografía no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Entrada de bibliografía eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar entrada de bibliografía:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new BibliographyController();