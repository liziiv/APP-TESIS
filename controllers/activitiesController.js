const { getConnection } = require('../config/database');

class ActivitiesController {
  // GET /api/activities - Obtener todas las actividades
  async getAllActivities(req, res) {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT a.*, rp.title as plan_title
        FROM activities a
        JOIN research_plans rp ON a.plan_id = rp.id
      `);
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/activities/:id - Obtener una actividad por ID
  async getActivityById(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT a.*, rp.title as plan_title
        FROM activities a
        JOIN research_plans rp ON a.plan_id = rp.id
        WHERE a.id = ?
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Actividad no encontrada'
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });
    } catch (error) {
      console.error('Error al obtener actividad:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // GET /api/activities/plan/:planId - Obtener actividades por plan
  async getActivitiesByPlan(req, res) {
    try {
      const { planId } = req.params;
      const connection = await getConnection();
      const [rows] = await connection.execute(`
        SELECT a.*, rp.title as plan_title
        FROM activities a
        JOIN research_plans rp ON a.plan_id = rp.id
        WHERE a.plan_id = ?
      `, [planId]);

      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al obtener actividades del plan:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // POST /api/activities - Crear una nueva actividad
  async createActivity(req, res) {
    try {
      const { plan_id, activity_name, description, start_date, end_date, progress, status } = req.body;

      if (!plan_id || !activity_name) {
        return res.status(400).json({
          success: false,
          error: 'ID del plan y nombre de actividad son requeridos'
        });
      }

      const connection = await getConnection();
      const [result] = await connection.execute(
        'INSERT INTO activities (plan_id, activity_name, description, start_date, end_date, progress, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [plan_id, activity_name, description, start_date, end_date, progress || 0.00, status || 'pending']
      );

      res.status(201).json({
        success: true,
        message: 'Actividad creada exitosamente',
        data: { id: result.insertId }
      });
    } catch (error) {
      console.error('Error al crear actividad:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // PUT /api/activities/:id - Actualizar una actividad
  async updateActivity(req, res) {
    try {
      const { id } = req.params;
      const { plan_id, activity_name, description, start_date, end_date, progress, status } = req.body;

      const connection = await getConnection();
      const [result] = await connection.execute(
        'UPDATE activities SET plan_id = ?, activity_name = ?, description = ?, start_date = ?, end_date = ?, progress = ?, status = ? WHERE id = ?',
        [plan_id, activity_name, description, start_date, end_date, progress, status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Actividad no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Actividad actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // DELETE /api/activities/:id - Eliminar una actividad
  async deleteActivity(req, res) {
    try {
      const { id } = req.params;
      const connection = await getConnection();
      const [result] = await connection.execute('DELETE FROM activities WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          error: 'Actividad no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Actividad eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new ActivitiesController();