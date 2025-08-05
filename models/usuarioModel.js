const pool = require('../data/data'); 

// Obtener todos los usuarios
async function getUsuarios() {
  try {
    const [rows] = await pool.query('SELECT * FROM Usuario');
    return rows;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

// Obtener un usuario por ID
async function getUsuarioPorId(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM Usuario WHERE Id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    throw error;
  }
}

// Insertar un nuevo usuario
async function insertarUsuario(datos) {
  try {
    const { nombreUsuario, clave, nombre, apellido, mail, fechaNacimiento } = datos;
    const fechaAlta = new Date();
    const activo = true;
    const administrador = false;

    const sql = `
      INSERT INTO Usuario 
      (NombreUsuario, Clave, Nombre, Apellido, Mail, FechaNacimiento, Administrador, FechaAlta, Activo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      nombreUsuario,
      clave,
      nombre,
      apellido,
      mail,
      fechaNacimiento,
      administrador,
      fechaAlta,
      activo
    ];

    await pool.query(sql, params);
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    throw error;
  }
}

// Actualizar un usuario
async function actualizarUsuario(id, datos) {
  try {
    const {
      nombreUsuario,
      clave,
      nombre,
      apellido,
      mail,
      fechaNacimiento,
      administrador,
      activo
    } = datos;

    const sql = `
      UPDATE Usuario SET 
        NombreUsuario = ?,
        Clave = ?,
        Nombre = ?,
        Apellido = ?,
        Mail = ?,
        FechaNacimiento = ?,
        Administrador = ?,
        Activo = ?
      WHERE Id = ?
    `;

    const params = [
      nombreUsuario,
      clave,
      nombre,
      apellido,
      mail,
      fechaNacimiento,
      administrador === '1' || administrador === true,
      activo === '1' || activo === true,
      id
    ];

    await pool.query(sql, params);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}

module.exports = {
  getUsuarios,
  getUsuarioPorId,
  insertarUsuario,
  actualizarUsuario,
};
