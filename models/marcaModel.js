const db = require('../data/data'); 

// Obtener todas las marcas
async function getMarcas() {
  const [rows] = await db.query('SELECT * FROM Marca');
  return rows;
}

// Obtener marcas activas
async function obtenerMarcasActivas() {
  const [rows] = await db.query('SELECT * FROM Marca WHERE Activo = 1');
  return rows;
}

// Agregar nueva marca
async function agregarMarca(nombre) {
  const fechaAlta = new Date();
  const activo = true;
  await db.query(
    'INSERT INTO Marca (Nombre, FechaAlta, Activo) VALUES (?, ?, ?)',
    [nombre, fechaAlta, activo]
  );
}

// Modificar marca
async function modificarMarca(id, nombre, fechaAlta, activo) {
  await db.query(
    'UPDATE Marca SET Nombre = ?, FechaAlta = ?, Activo = ? WHERE Id = ?',
    [nombre, fechaAlta, activo, id]
  );
}

module.exports = {
  getMarcas,
  obtenerMarcasActivas,
  agregarMarca,
  modificarMarca
};
