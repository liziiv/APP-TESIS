const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuración de conexión
const isDocker = process.env.NODE_ENV === 'production' || process.env.DOCKER_ENV === 'true';
const dbHost = isDocker ? 'postgres' : (process.env.DB_HOST || 'localhost');

const pool = new Pool({
  host: dbHost,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function initializeDatabase() {
  let client;

  try {
    console.log('🔄 Conectando a PostgreSQL...');
    client = await pool.connect();

    console.log('✅ Conectado exitosamente');

    // Verificar si las tablas ya existen
    const tablesExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `);

    if (tablesExist.rows[0].exists) {
      console.log('✅ Las tablas ya están creadas');
      return;
    }

    // Ejecutar script SQL
    const sqlPath = path.join(__dirname, 'tesis_app.sql');
    if (fs.existsSync(sqlPath)) {
      console.log('📄 Ejecutando script SQL...');
      const sqlScript = fs.readFileSync(sqlPath, 'utf8');

      // Dividir el script por punto y coma para ejecutar sentencias individuales
      const statements = sqlScript
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          await client.query(statement);
        }
      }

      console.log('✅ Script SQL ejecutado exitosamente');
    } else {
      console.log('⚠️  Archivo tesis_app.sql no encontrado');
    }

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Ejecutar inicialización si se llama directamente
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Inicialización completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en inicialización:', error);
      process.exit(1);
    })
    .finally(() => {
      pool.end();
    });
}

module.exports = { initializeDatabase };