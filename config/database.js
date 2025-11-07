const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'tesis_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

async function getConnection() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

async function testConnection() {
  try {
    const connection = await getConnection();
    await connection.execute('SELECT 1');
    console.log('✅ Conexión a MySQL exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error.message);
    return false;
  }
}

module.exports = {
  getConnection,
  testConnection
};