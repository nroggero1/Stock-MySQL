const sql = require('mssql');
const config = require('../data/data'); 

// Obtener todas las categorías
async function getCategorias() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM Categoria');
    return result.recordset;
  } catch (err) {
    throw err;
  }
}

// Obtener las categorías activas
async function obtenerCategoriasActivas() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM Categoria WHERE Activo = 1');
    return result.recordset;
  } catch (err) {
    throw err;
  }
}

// Agregar una nueva categoría
async function agregarCategoria(nombre) {
  try {
    let pool = await sql.connect(config);
    const fechaAlta = new Date();
    const activo = true;
    await pool.request()
      .input('Nombre', sql.NVarChar(50), nombre)
      .input('FechaAlta', sql.DateTime, fechaAlta)
      .input('Activo', sql.Bit, activo)
      .query('INSERT INTO Categoria (Nombre, FechaAlta, Activo) VALUES (@Nombre, @FechaAlta, @Activo)');
  } catch (err) {
    throw err;
  }
}

// Modificar una categoría existente
async function modificarCategoria(id, nombre, fechaAlta, activo) {
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('Id', sql.Int, id)
      .input('Nombre', sql.NVarChar(50), nombre)
      .input('FechaAlta', sql.DateTime, fechaAlta)
      .input('Activo', sql.Bit, activo)
      .query('UPDATE Categoria SET Nombre = @Nombre, FechaAlta = @FechaAlta, Activo = @Activo WHERE Id = @Id');
  } catch (err) {
    throw err;
  }
}

// Eliminar una categoría
async function eliminarCategoria(id) {
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('Id', sql.Int, id)
      .query('DELETE FROM Categoria WHERE Id = @Id');
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getCategorias,
  obtenerCategoriasActivas,
  agregarCategoria,
  modificarCategoria,
  eliminarCategoria,
};
