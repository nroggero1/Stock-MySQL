const pool = require('../data/data');

// Obtener todas las provincias
async function getProvincias() {
  try {
    const [rows] = await pool.query('SELECT * FROM Provincia');
    return rows;
  } catch (err) {
    console.error('Error al obtener provincias:', err);
    throw err;
  }
}

module.exports = {
  getProvincias
};