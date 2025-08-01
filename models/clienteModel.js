const sql = require('mssql');
const config = require('../data/data'); 

// Obtener todos los clientes
async function getClientes() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('select Cliente.Id AS Id, Cliente.CodigoTributario AS CodigoTributario, Cliente.Direccion AS Direccion, Localidad.Nombre AS Localidad, Provincia.Nombre AS Provincia, Cliente.Telefono AS Telefono,  Cliente.Mail AS Mail,  Cliente.Denominacion AS Denominacion,  Cliente.FechaAlta AS FechaAlta,  Cliente.Activo AS Activo from Cliente, Provincia, Localidad where Provincia.Id = Localidad.IdProvincia AND Cliente.IdProvincia = Provincia.Id AND Cliente.IdLocalidad = Localidad.Id');
        return result.recordset;
    } catch (err) {
        throw err;
    }
}

// Obtener cliente por ID
async function getClientePorId(id) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('Id', sql.Int, id)
            .query('SELECT * FROM Cliente WHERE Id = @Id');
        return result.recordset[0];
    } catch (err) {
        throw err;
    }
}

// Insertar nuevo cliente
async function insertarCliente(cliente) {
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('CodigoTributario', sql.BigInt, cliente.CodigoTributario)
      .input('Direccion', sql.NVarChar, cliente.Direccion)
      .input('IdLocalidad', sql.Int, cliente.IdLocalidad)
      .input('IdProvincia', sql.Int, cliente.IdProvincia)
      .input('Telefono', sql.NVarChar, cliente.Telefono)
      .input('Mail', sql.NVarChar, cliente.Mail)
      .input('Denominacion', sql.NVarChar, cliente.Denominacion)
      .input('FechaAlta', sql.DateTime, new Date())
      .input('Activo', sql.Bit, cliente.Activo)
      .query(`
        INSERT INTO Cliente 
        (CodigoTributario, Direccion, IdLocalidad, IdProvincia, Telefono, Mail, Denominacion, FechaAlta, Activo)
        VALUES 
        (@CodigoTributario, @Direccion, @IdLocalidad, @IdProvincia, @Telefono, @Mail, @Denominacion, @FechaAlta, @Activo)
      `);
  } catch (err) {
    throw err;
  }
}

// Actualizar cliente existente
async function actualizarCliente(id, cliente) {
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('Id', sql.Int, id)
      .input('CodigoTributario', sql.BigInt, cliente.CodigoTributario)
      .input('Direccion', sql.NVarChar, cliente.Direccion)
      .input('IdLocalidad', sql.Int, cliente.IdLocalidad)
      .input('IdProvincia', sql.Int, cliente.IdProvincia)
      .input('Telefono', sql.NVarChar, cliente.Telefono)
      .input('Mail', sql.NVarChar, cliente.Mail)
      .input('Denominacion', sql.NVarChar, cliente.Denominacion)
      .input('Activo', sql.Bit, cliente.Activo)
      .query(`
        UPDATE cliente SET
          CodigoTributario = @CodigoTributario,
          Direccion = @Direccion,
          IdLocalidad = @IdLocalidad,
          IdProvincia = @IdProvincia,
          Telefono = @Telefono,
          Mail = @Mail,
          Denominacion = @Denominacion,
          Activo = @Activo
        WHERE Id = @Id
      `);
  } catch (err) {
    throw err;
  }
}

// Obtener clientes activos
async function getClientesActivos() {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT Id, Denominacion, CodigoTributario, Activo FROM Cliente WHERE Activo = 1`);
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener clientes activos:', error);
    throw error;
  }
}

module.exports = {
    getClientes,
    getClientePorId,
    insertarCliente,
    actualizarCliente,
    getClientesActivos
};
