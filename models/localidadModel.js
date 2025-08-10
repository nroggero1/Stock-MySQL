const pool = require('../data/data');

// Obtener todas las localidades de una provincia
async function getLocalidadesPorProvincia(idProvincia) {
  try {
    const [rows] = await pool.query(
      'SELECT Id, Nombre FROM Localidad WHERE IdProvincia = ? ORDER BY Nombre',
      [idProvincia]
    );
    return rows;
  } catch (err) {
    console.error('Error al obtener localidades:', err);
    throw err;
  }
}

module.exports = {
  getLocalidadesPorProvincia
};