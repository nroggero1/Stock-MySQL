// models/compraModel.js
const sql = require('mssql');
const config = require('../data/config');

async function obtenerCompras() {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT c.Id, c.Fecha, c.Importe, 
             p.CodigoTributario, p.Denominacion, 
             u.NombreUsuario AS Usuario
      FROM Compra c
      JOIN Proveedor p ON c.IdProveedor = p.Id
      JOIN Usuario u ON c.IdUsuario = u.Id
    `);
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener compras:', error);
    throw error;
  }
}

async function insertarCompra({ idProveedor, idUsuario, importe, productos }) {
  const pool = await sql.connect(config);
  const transaction = pool.transaction();  

  let transactionStarted = false;
  try {
    await transaction.begin();
    transactionStarted = true;

    const request = transaction.request(); 
    request.input('IdProveedor', sql.Int, idProveedor);
    request.input('IdUsuario', sql.Int, idUsuario);
    request.input('Importe', sql.Decimal(18, 2), importe);

    const result = await request.query(`
      INSERT INTO Compra (IdProveedor, IdUsuario, Importe, Fecha)
      OUTPUT INSERTED.Id
      VALUES (@IdProveedor, @IdUsuario, @Importe, GETDATE())
    `);

    const idCompra = result.recordset[0].Id;

    for (const prod of productos) {
      const detalleRequest = transaction.request();
      detalleRequest.input('IdCompra', sql.Int, idCompra);
      detalleRequest.input('IdProducto', sql.Int, prod.idProducto);
      detalleRequest.input('Cantidad', sql.Int, prod.cantidad);
      detalleRequest.input('PrecioUnitario', sql.Decimal(18, 2), prod.precio);
      detalleRequest.input('Total', sql.Decimal(18, 2), prod.precio * prod.cantidad);

      await detalleRequest.query(`
        INSERT INTO DetalleCompra (IdCompra, IdProducto, Cantidad, PrecioUnitario)
        VALUES (@IdCompra, @IdProducto, @Cantidad, @PrecioUnitario)
      `);

      await detalleRequest.query(`
        UPDATE Producto
        SET Stock = Stock + @Cantidad
        WHERE Id = @IdProducto
      `);
    }

    await transaction.commit();
  } catch (error) {
    if (transactionStarted) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Error durante rollback:', rollbackError);
      }
    }
    console.error('Error al insertar compra:', error);
    throw error;
  }
}

module.exports = {
  obtenerCompras,
  insertarCompra,
};
