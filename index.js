require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de conexión a PostgreSQL usando variables de entorno
// Detectar automáticamente si estamos en Docker o desarrollo local
const isDocker = process.env.NODE_ENV === 'production' || process.env.DOCKER_ENV === 'true';
const dbHost = isDocker ? 'postgres' : (process.env.DB_HOST || 'localhost');

const pool = new Pool({
  host: dbHost,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Función para conectar a la base de datos
async function connectDatabase() {
  try {
    const client = await pool.connect();
    console.log('✅ Conectado exitosamente a PostgreSQL');

    // Usar el script de inicialización separado
    const { initializeDatabase } = require('./init-db');
    await initializeDatabase();

    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    return false;
  }
}

// Ruta de prueba para verificar conexión
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'success',
      message: 'Conexión a PostgreSQL exitosa',
      timestamp: result.rows[0].now,
      database: process.env.DB_NAME
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error de conexión a PostgreSQL',
      error: error.message
    });
  }
});

// Ruta para obtener usuarios (ejemplo)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, created_at FROM users');
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error obteniendo usuarios',
      error: error.message
    });
  }
});

// Ruta para crear usuario (ejemplo)
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    // Encriptar contraseña (deberías usar bcryptjs en producción)
    const passwordHash = require('crypto').createHash('sha256').update(password).digest('hex');

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, passwordHash, role]
    );

    res.status(201).json({
      status: 'success',
      message: 'Usuario creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creando usuario',
      error: error.message
    });
  }
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 Intentando conectar a PostgreSQL...`);

  const connected = await connectDatabase();
  if (connected) {
    console.log(`✅ Base de datos ${process.env.DB_NAME} lista`);
  } else {
    console.log(`❌ No se pudo conectar a la base de datos`);
  }
});

// Manejo de errores de conexión
pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de conexiones:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Cerrando conexiones...');
  await pool.end();
  console.log('✅ Conexiones cerradas');
  process.exit(0);
});

module.exports = app;