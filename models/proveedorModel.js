const sql = require('mssql');
const config = require('../data/data'); 

// Obtener todos los proveedores
async function getProveedores() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('select Proveedor.Id AS Id, Proveedor.CodigoTributario AS CodigoTributario, Proveedor.Direccion AS Direccion, Localidad.Nombre AS Localidad, Provincia.Nombre AS Provincia, Proveedor.Telefono AS Telefono,  Proveedor.Mail AS Mail,  Proveedor.Denominacion AS Denominacion,  Proveedor.FechaAlta AS FechaAlta,  Proveedor.Activo AS Activo from Proveedor, Provincia, Localidad where Provincia.Id = Localidad.IdProvincia AND Proveedor.IdProvincia = Provincia.Id AND Proveedor.IdLocalidad = Localidad.Id');
        return result.recordset;
    } catch (err) {
        throw err;
    }
}

// Obtener proveedor por ID
async function getProveedorPorId(id) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('Id', sql.Int, id)
            .query('SELECT * FROM Proveedor WHERE Id = @Id');
        return result.recordset[0];
    } catch (err) {
        throw err;
    }
}

// Insertar nuevo proveedor
async function insertarProveedor(proveedor) {
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('CodigoTributario', sql.BigInt, proveedor.CodigoTributario)
      .input('Direccion', sql.NVarChar, proveedor.Direccion)
      .input('IdLocalidad', sql.Int, proveedor.IdLocalidad)
      .input('IdProvincia', sql.Int, proveedor.IdProvincia)
      .input('Telefono', sql.NVarChar, proveedor.Telefono)
      .input('Mail', sql.NVarChar, proveedor.Mail)
      .input('Denominacion', sql.NVarChar, proveedor.Denominacion)
      .input('FechaAlta', sql.DateTime, new Date())
      .input('Activo', sql.Bit, proveedor.Activo)
      .query(`
        INSERT INTO Proveedor 
        (CodigoTributario, Direccion, IdLocalidad, IdProvincia, Telefono, Mail, Denominacion, FechaAlta, Activo)
        VALUES 
        (@CodigoTributario, @Direccion, @IdLocalidad, @IdProvincia, @Telefono, @Mail, @Denominacion, @FechaAlta, @Activo)
      `);
  } catch (err) {
    throw err;
  }
}

// Actualizar proveedor existente
async function actualizarProveedor(id, proveedor) {
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('Id', sql.Int, id)
      .input('CodigoTributario', sql.BigInt, proveedor.CodigoTributario)
      .input('Direccion', sql.NVarChar, proveedor.Direccion)
      .input('IdLocalidad', sql.Int, proveedor.IdLocalidad)
      .input('IdProvincia', sql.Int, proveedor.IdProvincia)
      .input('Telefono', sql.NVarChar, proveedor.Telefono)
      .input('Mail', sql.NVarChar, proveedor.Mail)
      .input('Denominacion', sql.NVarChar, proveedor.Denominacion)
      .input('Activo', sql.Bit, proveedor.Activo)
      .query(`
        UPDATE Proveedor SET
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

//Obtener proveedores activos
async function getProveedoresActivos() {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT Id, CodigoTributario, Denominacion
      FROM Proveedor
      WHERE Activo = 1
    `);
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    throw error;
  }
}


module.exports = {
    getProveedores,
    getProveedorPorId,
    insertarProveedor,
    actualizarProveedor,
    getProveedoresActivos
};
