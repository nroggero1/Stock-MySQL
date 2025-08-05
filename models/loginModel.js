const pool = require('../data/data');

async function validarUsuario(nombreUsuario, clave) {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        Id,
        NombreUsuario,
        Nombre,
        Apellido,
        Administrador,
        Activo
      FROM Usuario
      WHERE NombreUsuario = ? AND Clave = ?
    `, [nombreUsuario, clave]);

    if (rows.length === 0) return null;

    const usuario = rows[0];

    // Normalizar campos booleanos
    usuario.Administrador = usuario.Administrador === true || usuario.Administrador === 1;
    usuario.Activo = usuario.Activo === true || usuario.Activo === 1;

    return usuario;
  } catch (err) {
    console.error('Error en validarUsuario:', err);
    throw err;
  }
}

module.exports = { validarUsuario };
