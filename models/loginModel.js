const sql = require('mssql');
const config = require('../data/data');

async function validarUsuario(nombreUsuario, clave) {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('nombreUsuario', sql.VarChar, nombreUsuario)
      .input('clave', sql.VarChar, clave)
      .query(`
        SELECT 
          Id,
          NombreUsuario,
          Nombre,
          Apellido,
          Administrador,
          Activo
        FROM Usuario
        WHERE NombreUsuario = @nombreUsuario AND Clave = @clave
      `);

    if (result.recordset.length === 0) {
      return null;
    }

    const usuario = result.recordset[0];

    // Normalizar campos booleanos por si vienen como 0/1
    usuario.Administrador = usuario.Administrador === true || usuario.Administrador === 1;
    usuario.Activo = usuario.Activo === true || usuario.Activo === 1;

    return usuario;
  } catch (err) {
    console.error('Error en validarUsuario:', err);
    throw err;
  }
}

module.exports = { validarUsuario };
