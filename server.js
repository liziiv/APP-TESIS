const express = require('express');
const { testConnection } = require('./config/database');
const userRoutes = require('./routes/users');
const researchPlansRoutes = require('./routes/researchPlans');
const sectionsRoutes = require('./routes/sections');
const objectivesRoutes = require('./routes/objectives');
const hypothesesRoutes = require('./routes/hypotheses');
const variablesRoutes = require('./routes/variables');
const bibliographyRoutes = require('./routes/bibliography');
const activitiesRoutes = require('./routes/activities');
const reviewsRoutes = require('./routes/reviews');
const planHistoryRoutes = require('./routes/planHistory');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/research-plans', researchPlansRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/objectives', objectivesRoutes);
app.use('/api/hypotheses', hypothesesRoutes);
app.use('/api/variables', variablesRoutes);
app.use('/api/bibliography', bibliographyRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/plan-history', planHistoryRoutes);


// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    details: error.message
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);

  // Test database connection on startup
  const dbConnected = await testConnection();
  if (dbConnected) {
    console.log('✅ Base de datos conectada');
  } else {
    console.log('❌ Error al conectar a la base de datos');
    console.log('Asegúrate de que Docker esté corriendo: docker-compose up -d');
  }
});

module.exports = app;