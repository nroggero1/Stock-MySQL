const mysql = require('mysql2/promise');
const config = require('../data/data');

// Obtener todos los productos con Marca y Categoría
async function getProductos() {
  const connection = await mysql.createConnection(config);
  const [rows] = await connection.execute(`
    SELECT 
      Producto.Id, Producto.Nombre, Producto.Descripcion, Producto.CodigoBarras,
      Producto.PrecioCompra, Producto.PorcentajeGanancia, Producto.PrecioVentaSugerido,
      Producto.PrecioVenta, Producto.Stock, Producto.StockMinimo,
      Producto.Activo, Producto.FechaAlta,
      Marca.Nombre AS Marca, Categoria.Nombre AS Categoria
    FROM Producto
    JOIN Marca ON Producto.IdMarca = Marca.Id
    JOIN Categoria ON Producto.IdCategoria = Categoria.Id
  `);
  await connection.end();
  return rows;
}

// Obtener un producto por su ID
async function getProductoPorId(id) {
  const connection = await mysql.createConnection(config);
  const [rows] = await connection.execute(
    'SELECT * FROM Producto WHERE Id = ?',
    [id]
  );
  await connection.end();
  return rows[0];
}

// Insertar un nuevo producto
async function insertarProducto(producto) {
  const precioVentaSugerido = parseFloat(
    (producto.PrecioCompra * (1 + producto.PorcentajeGanancia / 100)).toFixed(2)
  );

  const connection = await mysql.createConnection(config);
  await connection.execute(`
    INSERT INTO Producto 
    (Nombre, Descripcion, CodigoBarras, IdCategoria, IdMarca, PrecioCompra, PorcentajeGanancia,
     PrecioVentaSugerido, PrecioVenta, Stock, StockMinimo, Activo, FechaAlta)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `, [
    producto.Nombre,
    producto.Descripcion,
    producto.CodigoBarras,
    producto.IdCategoria,
    producto.IdMarca,
    producto.PrecioCompra,
    producto.PorcentajeGanancia,
    precioVentaSugerido,
    producto.PrecioVenta,
    producto.Stock,
    producto.StockMinimo,
    producto.Activo
  ]);
  await connection.end();
}

// Actualizar un producto existente
async function actualizarProducto(id, producto) {
  const precioVentaSugerido = parseFloat(
    (producto.PrecioCompra * (1 + producto.PorcentajeGanancia / 100)).toFixed(2)
  );

  const connection = await mysql.createConnection(config);
  await connection.execute(`
    UPDATE Producto SET
      Nombre = ?, Descripcion = ?, CodigoBarras = ?, IdCategoria = ?, IdMarca = ?,
      PrecioCompra = ?, PorcentajeGanancia = ?, PrecioVentaSugerido = ?, PrecioVenta = ?,
      Stock = ?, StockMinimo = ?, Activo = ?
    WHERE Id = ?
  `, [
    producto.Nombre,
    producto.Descripcion,
    producto.CodigoBarras,
    producto.IdCategoria,
    producto.IdMarca,
    producto.PrecioCompra,
    producto.PorcentajeGanancia,
    precioVentaSugerido,
    producto.PrecioVenta,
    producto.Stock,
    producto.StockMinimo,
    producto.Activo,
    id
  ]);
  await connection.end();
}

// Obtener productos con stock bajo
async function getProductosBajoStock() {
  const [rows] = await pool.query(`
    SELECT Producto.Id, Producto.Nombre, Producto.Descripcion, Producto.Stock, Producto.StockMinimo,
           Marca.Nombre AS Marca, Categoria.Nombre AS Categoria
    FROM Producto
    JOIN Marca ON Producto.IdMarca = Marca.Id
    JOIN Categoria ON Producto.IdCategoria = Categoria.Id
    WHERE Producto.Stock <= Producto.StockMinimo
  `);
  return rows;
}

// Obtener productos activos
async function getProductosActivos() {
  const connection = await mysql.createConnection(config);
  const [rows] = await connection.execute(`
    SELECT Producto.Id, Producto.Nombre, Producto.PrecioCompra, Producto.Stock,
           Marca.Nombre AS Marca, Categoria.Nombre AS Categoria
    FROM Producto
    JOIN Marca ON Producto.IdMarca = Marca.Id
    JOIN Categoria ON Producto.IdCategoria = Categoria.Id
    WHERE Producto.Activo = 1
  `);
  await connection.end();
  return rows;
}

// Buscar producto por código de barras
async function obtenerPorCodigoBarras(codigoBarras) {
  try {
    const connection = await mysql.createConnection(config);
    const [rows] = await connection.execute(`
      SELECT Producto.*, Marca.Nombre AS Marca, Categoria.Nombre AS Categoria
      FROM Producto
      JOIN Marca ON Producto.IdMarca = Marca.Id
      JOIN Categoria ON Producto.IdCategoria = Categoria.Id
      WHERE CodigoBarras = ?
    `, [codigoBarras]);
    await connection.end();
    return rows[0];
  } catch (error) {
    console.error('Error al buscar producto por código de barras:', error);
    throw error;
  }
}

module.exports = {
  getProductos,
  getProductoPorId,
  insertarProducto,
  actualizarProducto,
  getProductosBajoStock,
  getProductosActivos,
  obtenerPorCodigoBarras,
};
