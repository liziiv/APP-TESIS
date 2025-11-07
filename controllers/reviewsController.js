const { getConnection } = require('../config/database');

class ReviewsController {
  // GET /api/reviews - Obtener todas las revisiones
  async getAllReviews(req, res) {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT r.*, rp.title as plan_title, u_reviewer.name as reviewer_name, s.type as section_type
        FROM reviews r
        JOIN research_plans rp ON r.plan_id = rp.id
        JOIN users u_reviewer ON r.reviewer_id = u_reviewer.id
        LEFT JOIN sections s ON r.section_id = s.id
      `);
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener revisiones:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/reviews/:id - Obtener una revisión por ID
  async getReviewById(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT r.*, rp.title as plan_title, u_reviewer.name as reviewer_name, s.type as section_type
        FROM reviews r
        JOIN research_plans rp ON r.plan_id = rp.id
        JOIN users u_reviewer ON r.reviewer_id = u_reviewer.id
        LEFT JOIN sections s ON r.section_id = s.id
        WHERE r.id = ?
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Revisión no encontrada'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error al obtener revisión:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/reviews/plan/:planId - Obtener revisiones por plan
  async getReviewsByPlan(req, res) {
    try {
      const { planId } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT r.*, rp.title as plan_title, u_reviewer.name as reviewer_name, s.type as section_type
        FROM reviews r
        JOIN research_plans rp ON r.plan_id = rp.id
        JOIN users u_reviewer ON r.reviewer_id = u_reviewer.id
        LEFT JOIN sections s ON r.section_id = s.id
        WHERE r.plan_id = ?
      `, [planId]);

      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener revisiones del plan:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // POST /api/reviews - Crear una nueva revisión
  async createReview(req, res) {
    try {
      const { plan_id, section_id, reviewer_id, comment, status } = req.body;

      if (!plan_id || !reviewer_id || !comment) {
        return res.status(400).json({
          success: false,
          error: 'ID del plan, revisor y comentario son requeridos'
        });
      }

      const connection = await getConnection();
      const [result] = await connection.execute(
        'INSERT INTO reviews (plan_id, section_id, reviewer_id, comment, status) VALUES (?, ?, ?, ?, ?)',
        [plan_id, section_id, reviewer_id, comment, status || 'pending']
      );

      res.status(201).json({
        success: true,
        message: 'Revisión creada exitosamente',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('Error al crear revisión:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/reviews/:id - Actualizar una revisión
  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { plan_id, section_id, reviewer_id, comment, status } = req.body;

      const connection = await getConnection();
      const [result] = await connection.execute(
        'UPDATE reviews SET plan_id = ?, section_id = ?, reviewer_id = ?, comment = ?, status = ? WHERE id = ?',
        [plan_id, section_id, reviewer_id, comment, status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Revisión no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Revisión actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar revisión:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/reviews/:id - Eliminar una revisión
  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [result] = await connection.execute('DELETE FROM reviews WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Revisión no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Revisión eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar revisión:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new ReviewsController();