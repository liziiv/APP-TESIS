const { getConnection } = require('../config/database');

class SectionsController {
  // GET /api/sections - Obtener todas las secciones
  async getAllSections(req, res) {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT s.*, rp.title as plan_title
        FROM sections s
        JOIN research_plans rp ON s.plan_id = rp.id
      `);
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener secciones:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/sections/:id - Obtener una sección por ID
  async getSectionById(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT s.*, rp.title as plan_title
        FROM sections s
        JOIN research_plans rp ON s.plan_id = rp.id
        WHERE s.id = ?
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Sección no encontrada'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error al obtener sección:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/sections/plan/:planId - Obtener secciones por plan
  async getSectionsByPlan(req, res) {
    try {
      const { planId } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT s.*, rp.title as plan_title
        FROM sections s
        JOIN research_plans rp ON s.plan_id = rp.id
        WHERE s.plan_id = ?
      `, [planId]);

      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener secciones del plan:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // POST /api/sections - Crear una nueva sección
  async createSection(req, res) {
    try {
      const { plan_id, type, content, status, last_review_comment } = req.body;

      if (!plan_id || !type) {
        return res.status(400).json({
          success: false,
          error: 'ID del plan y tipo de sección son requeridos'
        });
      }

      const connection = await getConnection();
      const sql = 'INSERT INTO sections (plan_id, type, content, status, last_review_comment) VALUES (?, ?, ?, ?, ?)';
      const params = [
        plan_id,
        type,
        content !== undefined ? content : null,
        status !== undefined ? status : 'pending',
        last_review_comment !== undefined ? last_review_comment : null
      ];
      console.log('SQL:', sql);
      console.log('Params:', params);
      const [result] = await connection.execute(sql, params);

      res.status(201).json({
        success: true,
        message: 'Sección creada exitosamente',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('Error al crear sección:', error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
          success: false,
          error: 'El plan de investigación especificado no existe'
        });
      }
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/sections/:id - Actualizar una sección
  async updateSection(req, res) {
    try {
      const { id } = req.params;
      const { plan_id, type, content, status, last_review_comment } = req.body;

      const connection = await getConnection();
      const [result] = await connection.execute(
        'UPDATE sections SET plan_id = ?, type = ?, content = ?, status = ?, last_review_comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [plan_id, type, content, status, last_review_comment, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Sección no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Sección actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar sección:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/sections/:id - Eliminar una sección
  async deleteSection(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [result] = await connection.execute('DELETE FROM sections WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Sección no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Sección eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar sección:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new SectionsController();