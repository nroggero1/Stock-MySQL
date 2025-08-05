const pool = require('../data/data'); 

// Obtener todos los proveedores con datos de provincia y localidad
async function getProveedores() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        Proveedor.Id,
        Proveedor.CodigoTributario,
        Proveedor.Direccion,
        Localidad.Nombre AS Localidad,
        Provincia.Nombre AS Provincia,
        Proveedor.Telefono,
        Proveedor.Mail,
        Proveedor.Denominacion,
        Proveedor.FechaAlta,
        Proveedor.Activo
      FROM Proveedor
      JOIN Localidad ON Proveedor.IdLocalidad = Localidad.Id
      JOIN Provincia ON Proveedor.IdProvincia = Provincia.Id
    `);
    return rows;
  } catch (err) {
    console.error('Error al obtener proveedores:', err);
    throw err;
  }
}

// Obtener proveedor por ID
async function getProveedorPorId(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM Proveedor WHERE Id = ?', [id]);
    return rows[0];
  } catch (err) {
    console.error('Error al obtener proveedor por ID:', err);
    throw err;
  }
}

// Insertar nuevo proveedor
async function insertarProveedor(proveedor) {
  try {
    const sql = `
      INSERT INTO Proveedor 
        (CodigoTributario, Direccion, IdLocalidad, IdProvincia, Telefono, Mail, Denominacion, FechaAlta, Activo)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `;
    const params = [
      proveedor.CodigoTributario,
      proveedor.Direccion,
      proveedor.IdLocalidad,
      proveedor.IdProvincia,
      proveedor.Telefono,
      proveedor.Mail,
      proveedor.Denominacion,
      proveedor.Activo
    ];
    await pool.query(sql, params);
  } catch (err) {
    console.error('Error al insertar proveedor:', err);
    throw err;
  }
}

// Actualizar proveedor existente
async function actualizarProveedor(id, proveedor) {
  try {
    const sql = `
      UPDATE Proveedor SET
        CodigoTributario = ?,
        Direccion = ?,
        IdLocalidad = ?,
        IdProvincia = ?,
        Telefono = ?,
        Mail = ?,
        Denominacion = ?,
        Activo = ?
      WHERE Id = ?
    `;
    const params = [
      proveedor.CodigoTributario,
      proveedor.Direccion,
      proveedor.IdLocalidad,
      proveedor.IdProvincia,
      proveedor.Telefono,
      proveedor.Mail,
      proveedor.Denominacion,
      proveedor.Activo,
      id
    ];
    await pool.query(sql, params);
  } catch (err) {
    console.error('Error al actualizar proveedor:', err);
    throw err;
  }
}

// Obtener proveedores activos
async function getProveedoresActivos() {
  try {
    const [rows] = await pool.query(`
      SELECT Id, CodigoTributario, Denominacion
      FROM Proveedor
      WHERE Activo = 1
    `);
    return rows;
  } catch (err) {
    console.error('Error al obtener proveedores activos:', err);
    throw err;
  }
}

module.exports = {
  getProveedores,
  getProveedorPorId,
  insertarProveedor,
  actualizarProveedor,
  getProveedoresActivos
};
