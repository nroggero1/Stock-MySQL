const pool = require('../data/data');

// Obtener todas las categorías
async function getCategorias() {
  const [rows] = await pool.query('SELECT * FROM Categoria');
  return rows;
}

// Obtener las categorías activas
async function obtenerCategoriasActivas() {
  const [rows] = await pool.query('SELECT * FROM Categoria WHERE Activo = 1');
  return rows;
}

// Agregar una nueva categoría
async function agregarCategoria(nombre) {
  const fechaAlta = new Date();
  const activo = true;
  await pool.query(
    'INSERT INTO Categoria (Nombre, FechaAlta, Activo) VALUES (?, ?, ?)',
    [nombre, fechaAlta, activo]
  );
}

// Modificar una categoría existente
async function modificarCategoria(id, nombre, fechaAlta, activo) {
  await pool.query(
    'UPDATE Categoria SET Nombre = ?, FechaAlta = ?, Activo = ? WHERE Id = ?',
    [nombre, fechaAlta, activo, id]
  );
}


module.exports = {
  getCategorias,
  obtenerCategoriasActivas,
  agregarCategoria,
  modificarCategoria,
};
