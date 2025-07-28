const sql = require('mssql');
const config = require('../data/data');
// Obtener todas las marcas
async function getMarcas() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM Marca');
    return result.recordset;
  } catch (err) {
    throw err;
  }
}

// Obtener las marcas activas
async function obtenerMarcasActivas() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM Marca WHERE Activo = 1');
    return result.recordset;
  } catch (err) {
    throw err;
  }
}

// Agregar una nueva marca
async function agregarMarca(nombre) {
  try {
    let pool = await sql.connect(config);
    const fechaAlta = new Date();
    const activo = true;
    await pool.request()
      .input('Nombre', sql.NVarChar(50), nombre)
      .input('FechaAlta', sql.DateTime, fechaAlta)
      .input('Activo', sql.Bit, activo)
      .query('INSERT INTO Marca (Nombre, FechaAlta, Activo) VALUES (@Nombre, @FechaAlta, @Activo)');
  } catch (err) {
    throw err;
  }
}

// Modificar una marca existente
async function modificarMarca(id, nombre, fechaAlta, activo) {
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('Id', sql.Int, id)
      .input('Nombre', sql.NVarChar(50), nombre)
      .input('FechaAlta', sql.DateTime, fechaAlta)
      .input('Activo', sql.Bit, activo)
      .query('UPDATE Marca SET Nombre = @Nombre, FechaAlta = @FechaAlta, Activo = @Activo WHERE Id = @Id');
  } catch (err) {
    throw err;
  }
}

// Eliminar una marca
async function eliminarMarca(id) {
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('Id', sql.Int, id)
      .query('DELETE FROM Marca WHERE Id = @Id');
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getMarcas,
  obtenerMarcasActivas,
  agregarMarca,
  modificarMarca,
  eliminarMarca,
};
