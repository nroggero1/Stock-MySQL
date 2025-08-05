const mysql = require('mysql2/promise');
const config = require('../data/data');

// Obtener todas las provincias
async function getProvincias() {
  try {
    const connection = await mysql.createConnection(config);
    const [rows] = await connection.execute('SELECT * FROM Provincia');
    await connection.end();
    return rows;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getProvincias
};
