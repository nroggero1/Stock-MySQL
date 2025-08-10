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

  try {
    // Verificar si la categoría ya existe
    const [result] = await pool.query(
      'SELECT Activo FROM Categoria WHERE Nombre = ?',
      [nombre]
    );

    if (result.length === 0) {
      // No existe, se puede insertar
      await pool.query(
        'INSERT INTO Categoria (Nombre, FechaAlta, Activo) VALUES (?, ?, ?)',
        [nombre, fechaAlta, activo]
      );
      return { exito: true, mensaje: 'Categoría registrada' };
    } else {
      // Ya existe, verificar estado
      const categoria = result[0];
      if (categoria.Activo === 1) {
        return { exito: false, mensaje: 'La categoría ya existe y se encuentra activa' };
      } else {
        return { exito: false, mensaje: 'La categoría ya existe y se encuentra inactiva' };
      }
    }
  } catch (error) {
    console.error('Error al agregar categoría:', error);
    return { exito: false, mensaje: 'Error en el servidor' };
  }
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
