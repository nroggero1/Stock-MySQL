const sql = require("mssql");
const config = require("../data/data");

// Insertar los detalles de la compra
async function insertarDetallesCompra(idCompra, detalles) {
  try {
    const pool = await sql.connect(config);
    for (const item of detalles) {
      await pool.request()
        .input("IdCompra", sql.Int, idCompra)
        .input("IdProducto", sql.Int, item.IdProducto)
        .input("Cantidad", sql.Int, item.Cantidad)
        .input("PrecioUnitario", sql.Decimal(12, 2), item.PrecioUnitario)
        .query(`
          INSERT INTO DetalleCompra (IdCompra, IdProducto, Cantidad, PrecioUnitario)
          VALUES (@IdCompra, @IdProducto, @Cantidad, @PrecioUnitario)
        `);

      // Actualizar stock del producto
      await pool.request()
        .input("IdProducto", sql.Int, item.IdProducto)
        .input("Cantidad", sql.Int, item.Cantidad)
        .query(`
          UPDATE Producto
          SET Stock = Stock + @Cantidad
          WHERE Id = @IdProducto
        `);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  insertarDetallesCompra,
};
