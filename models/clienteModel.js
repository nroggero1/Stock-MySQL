const pool = require('../data/data');

async function getClientes() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        Cliente.Id,
        Cliente.CodigoTributario,
        Cliente.Direccion,
        Localidad.Nombre AS Localidad,
        Provincia.Nombre AS Provincia,
        Cliente.Telefono,
        Cliente.Mail,
        Cliente.Denominacion,
        Cliente.FechaAlta,
        Cliente.Activo
      FROM Cliente
      JOIN Localidad ON Cliente.IdLocalidad = Localidad.Id
      JOIN Provincia ON Cliente.IdProvincia = Provincia.Id
    `);
    return rows;
  } catch (err) {
    console.error('Error al obtener clientes:', err);
    throw err;
  }
}

async function getClientePorId(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM Cliente WHERE Id = ?', [id]);
    return rows[0];
  } catch (err) {
    console.error('Error al obtener cliente por ID:', err);
    throw err;
  }
}

async function insertarCliente(cliente) {
  try {
    await pool.query(`
      INSERT INTO Cliente (
        CodigoTributario, Direccion, IdLocalidad, IdProvincia, 
        Telefono, Mail, Denominacion, FechaAlta, Activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`, [
      cliente.CodigoTributario,
      cliente.Direccion,
      cliente.IdLocalidad,
      cliente.IdProvincia,
      cliente.Telefono,
      cliente.Mail,
      cliente.Denominacion,
      cliente.Activo
    ]);
  } catch (err) {
    console.error('Error al insertar cliente:', err);
    throw err;
  }
}

async function actualizarCliente(id, cliente) {
  try {
    await pool.query(`
      UPDATE Cliente SET
        CodigoTributario = ?,
        Direccion = ?,
        IdLocalidad = ?,
        IdProvincia = ?,
        Telefono = ?,
        Mail = ?,
        Denominacion = ?,
        Activo = ?
      WHERE Id = ?`, [
      cliente.CodigoTributario,
      cliente.Direccion,
      cliente.IdLocalidad,
      cliente.IdProvincia,
      cliente.Telefono,
      cliente.Mail,
      cliente.Denominacion,
      cliente.Activo,
      id
    ]);
  } catch (err) {
    console.error('Error al actualizar cliente:', err);
    throw err;
  }
}

async function getClientesActivos() {
  try {
    const [rows] = await pool.query(
      'SELECT Id, Denominacion, CodigoTributario, Activo FROM Cliente WHERE Activo = 1'
    );
    return rows;
  } catch (err) {
    console.error('Error al obtener clientes activos:', err);
    throw err;
  }
}

module.exports = {
  getClientes,
  getClientePorId,
  insertarCliente,
  actualizarCliente,
  getClientesActivos
};
