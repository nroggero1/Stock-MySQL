const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Host de la base de datos
  port: process.env.DB_PORT,       // Puerto (3306)
  user: process.env.DB_USER,       // Usuario MySQL
  password: process.env.DB_PASSWORD, // Contraseña MySQL
  database: process.env.DB_NAME,   // Nombre de la base
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

