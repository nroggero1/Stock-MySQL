const mysql = require('mysql2/promise');
const config = require('../data/data');

// Obtener todas las localidades de una provincia
async function getLocalidadesPorProvincia(idProvincia) {
  try {
    const connection = await mysql.createConnection(config);
    const [rows] = await connection.execute(
      'SELECT Id, Nombre FROM Localidad WHERE IdProvincia = ? ORDER BY Nombre',
      [idProvincia]
    );
    await connection.end();
    return rows;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getLocalidadesPorProvincia
};
