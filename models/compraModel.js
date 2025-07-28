const sql = require('mssql');
const config = require('../data/data');

// Obtener todas las compras
async function obtenerCompras() {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT c.Id, c.Fecha, c.Importe AS Importe, 
             p.CodigoTributario, p.Denominacion, 
             u.NombreUsuario AS Usuario
      FROM Compra c
      JOIN Proveedor p ON c.IdProveedor = p.Id
      JOIN Usuario u ON c.IdUsuario = u.Id
      ORDER BY c.Fecha DESC
    `);
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener compras:', error.message);
    throw error;
  }
}

// Insertar nueva compra y detalle
async function insertarCompra({ idProveedor, idUsuario, importe, productos }) {
  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // Insertar compra
    const result = await new sql.Request(transaction)
      .input('IdProveedor', sql.Int, idProveedor)
      .input('IdUsuario', sql.Int, idUsuario)
      .input('Importe', sql.Decimal(10, 2), parseFloat(importe))
      .input('Fecha', sql.DateTime, new Date())
      .query(`
        INSERT INTO Compra (IdProveedor, IdUsuario, Importe, Fecha)
        OUTPUT INSERTED.Id
        VALUES (@IdProveedor, @IdUsuario, @Importe, @Fecha)
      `);

    const idCompra = result.recordset[0].Id;

    for (const producto of productos) {
      const { Id, Cantidad, PrecioCompra } = producto;

      await new sql.Request(transaction)
        .input('IdCompra', sql.Int, idCompra)
        .input('IdProducto', sql.Int, Id)
        .input('Cantidad', sql.Int, Cantidad)
        .input('PrecioUnitario', sql.Decimal(10, 2), parseFloat(PrecioCompra))
        .query(`
          INSERT INTO DetalleCompra (IdCompra, IdProducto, Cantidad, PrecioUnitario)
          VALUES (@IdCompra, @IdProducto, @Cantidad, @PrecioUnitario)
        `);

      // Actualizar stock del producto
      await new sql.Request(transaction)
        .input('IdProducto', sql.Int, Id)
        .input('Cantidad', sql.Int, Cantidad)
        .query(`
          UPDATE Producto
          SET Stock = Stock + @Cantidad
          WHERE Id = @IdProducto
        `);
    }

    await transaction.commit();
  } catch (error) {
    console.error('Error al insertar compra:', error.message);
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  obtenerCompras,
  insertarCompra,
};