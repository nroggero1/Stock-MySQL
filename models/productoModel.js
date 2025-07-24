const sql = require('mssql');
const config = require('../data/data');

// Obtener todos los productos con nombre de marca y categoría
async function getProductos() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(`
      SELECT 
        Producto.Id,
        Producto.Nombre,
        Producto.Descripcion,
        Producto.CodigoBarras,
        Producto.PrecioCompra,
        Producto.PorcentajeGanancia,
        Producto.PrecioVentaSugerido,
        Producto.PrecioVenta,
        Producto.Stock,
        Producto.StockMinimo,
        Producto.Activo,
        Producto.FechaAlta,
        Marca.Nombre AS Marca,
        Categoria.Nombre AS Categoria
      FROM Producto
      JOIN Marca ON Producto.IdMarca = Marca.Id
      JOIN Categoria ON Producto.IdCategoria = Categoria.Id
    `);
    return result.recordset;
  } catch (err) {
    throw err;
  }
}

// Obtener un producto por ID
async function getProductoPorId(id) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('Id', sql.Int, id)
      .query('SELECT * FROM Producto WHERE Id = @Id');
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
}

// Insertar nuevo producto
async function insertarProducto(producto) {
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('Nombre', sql.NVarChar, producto.Nombre)
      .input('Descripcion', sql.NVarChar, producto.Descripcion)
      .input('CodigoBarras', sql.NVarChar, producto.CodigoBarras)
      .input('IdCategoria', sql.Int, producto.IdCategoria)
      .input('IdMarca', sql.Int, producto.IdMarca)
      .input('PrecioCompra', sql.Decimal(12, 2), producto.PrecioCompra)
      .input('PorcentajeGanancia', sql.Int, producto.PorcentajeGanancia)
      .input('PrecioVentaSugerido', sql.Decimal(12, 2), producto.PrecioVentaSugerido)
      .input('PrecioVenta', sql.Decimal(12, 2), producto.PrecioVenta)
      .input('Stock', sql.Int, producto.Stock)
      .input('StockMinimo', sql.Int, producto.StockMinimo)
      .input('Activo', sql.Bit, producto.Activo)
      .input('FechaAlta', sql.DateTime, new Date())
      .query(`
        INSERT INTO Producto 
        (Nombre, Descripcion, CodigoBarras, IdCategoria, IdMarca, PrecioCompra, PorcentajeGanancia, PrecioVentaSugerido, PrecioVenta, Stock, StockMinimo, Activo, FechaAlta)
        VALUES 
        (@Nombre, @Descripcion, @CodigoBarras, @IdCategoria, @IdMarca, @PrecioCompra, @PorcentajeGanancia, @PrecioVentaSugerido, @PrecioVenta, @Stock, @StockMinimo, @Activo, @FechaAlta)
      `);
  } catch (err) {
    throw err;
  }
}

// Actualizar producto existente
async function actualizarProducto(id, producto) {
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('Id', sql.Int, id)
      .input('Nombre', sql.NVarChar, producto.Nombre)
      .input('Descripcion', sql.NVarChar, producto.Descripcion)
      .input('CodigoBarras', sql.NVarChar, producto.CodigoBarras)
      .input('IdCategoria', sql.Int, producto.IdCategoria)
      .input('IdMarca', sql.Int, producto.IdMarca)
      .input('PrecioCompra', sql.Decimal(12, 2), producto.PrecioCompra)
      .input('PorcentajeGanancia', sql.Int, producto.PorcentajeGanancia)
      .input('PrecioVentaSugerido', sql.Decimal(12, 2), producto.PrecioVentaSugerido)
      .input('PrecioVenta', sql.Decimal(12, 2), producto.PrecioVenta)
      .input('Stock', sql.Int, producto.Stock)
      .input('StockMinimo', sql.Int, producto.StockMinimo)
      .input('Activo', sql.Bit, producto.Activo)
      .query(`
        UPDATE Producto SET
          Nombre = @Nombre,
          Descripcion = @Descripcion,
          CodigoBarras = @CodigoBarras,
          IdCategoria = @IdCategoria,
          IdMarca = @IdMarca,
          PrecioCompra = @PrecioCompra,
          PorcentajeGanancia = @PorcentajeGanancia,
          PrecioVentaSugerido = @PrecioVentaSugerido,
          PrecioVenta = @PrecioVenta,
          Stock = @Stock,
          StockMinimo = @StockMinimo,
          Activo = @Activo
        WHERE Id = @Id
      `);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getProductos,
  getProductoPorId,
  insertarProducto,
  actualizarProducto
};
