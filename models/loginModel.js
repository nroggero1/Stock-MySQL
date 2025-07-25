const sql = require('mssql');
const config = require('../data/data');

async function validarUsuario(nombreUsuario, clave) {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('nombreUsuario', sql.VarChar, nombreUsuario)
      .input('clave', sql.VarChar, clave)
      .query(`
        SELECT Id, NombreUsuario, Nombre, Apellido, Administrador, Activo
        FROM Usuario
        WHERE NombreUsuario = @nombreUsuario AND Clave = @clave
      `);

    if (result.recordset.length === 0) return null;
    return result.recordset[0];
  } catch (err) {
    console.error('Error en validarUsuario:', err);
    throw err;
  }
}

module.exports = { validarUsuario };
