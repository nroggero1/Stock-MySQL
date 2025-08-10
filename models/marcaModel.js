const pool = require("../data/data");

// Obtener todas las marcas
async function getMarcas() {
  const [rows] = await pool.query("SELECT * FROM Marca");
  return rows;
}

// Obtener marcas activas
async function obtenerMarcasActivas() {
  const [rows] = await pool.query("SELECT * FROM Marca WHERE Activo = 1");
  return rows;
}

// Agregar nueva marca
async function agregarMarca(nombre) {
  const fechaAlta = new Date();
  const activo = true;

  try {
    // Verificar si la marca ya existe
    const [result] = await pool.query(
      "SELECT Activo FROM Marca WHERE Nombre = ?",
      [nombre]
    );

    if (result.length === 0) {
      // No existe, se puede insertar
      await pool.query(
        "INSERT INTO Marca (Nombre, FechaAlta, Activo) VALUES (?, ?, ?)",
        [nombre, fechaAlta, activo]
      );
      return { exito: true, mensaje: "marca registrada" };
    } else {
      // Ya existe, verificar estado
      const marca = result[0];
      if (marca.Activo === 1) {
        return {
          exito: false,
          mensaje: "La marca ya existe y se encuentra activa",
        };
      } else {
        return {
          exito: false,
          mensaje: "La marca ya existe y se encuentra inactiva",
        };
      }
    }
  } catch (error) {
    console.error("Error al agregar marca:", error);
    return { exito: false, mensaje: "Error en el servidor" };
  }
}

// Modificar marca
async function modificarMarca(id, nombre, fechaAlta, activo) {
  await pool.query(
    "UPDATE Marca SET Nombre = ?, FechaAlta = ?, Activo = ? WHERE Id = ?",
    [nombre, fechaAlta, activo, id]
  );
}

module.exports = {
  getMarcas,
  obtenerMarcasActivas,
  agregarMarca,
  modificarMarca,
};
