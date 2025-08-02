const sql = require("mssql");
const config = require("../data/data");

// Obtener todas las ventas
async function obtenerVentas() {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT v.Id, v.Fecha, v.Importe,
             c.CodigoTributario, c.Denominacion,
             u.NombreUsuario AS Usuario
      FROM Venta v
      JOIN Cliente c ON v.IdCliente = c.Id
      JOIN Usuario u ON v.IdUsuario = u.Id
      ORDER BY v.Fecha DESC
    `);
    return result.recordset;
  } catch (error) {
    console.error("Error al obtener ventas:", error.message);
    throw error;
  }
}

/**
 * Insertar nueva venta y sus detalles.
 * @param {Object} params
 * @param {number} params.idCliente
 * @param {number} params.idUsuario
 * @param {Array<{idProducto:number|string, cantidad:number|string, precioUnitario:number|string, bonificacion?: number|string}>} params.productos
 * @returns {Promise<number>} Id de la venta insertada
 */
async function insertarVenta({ idUsuario, idCliente, productos }) {
  if (!Array.isArray(productos) || productos.length === 0) {
    throw new Error('La lista de productos no puede estar vacía.');
  }

  const normalizados = productos.map(p => ({
    idProducto: Number(p.idProducto),
    cantidad: Number(p.cantidad),
    precioUnitario: Number(p.precioUnitario),
    bonificacion: Number(p.bonificacion || 0)
  }));

  const totalImporte = normalizados.reduce((acc, p) => {
    const bonif = (p.precioUnitario * p.bonificacion) / 100;
    const subTotal = (p.precioUnitario - bonif) * p.cantidad;
    return acc + subTotal;
  }, 0);

  const pool = await sql.connect(config);
  const request = pool.request();

  request
    .input("Fecha", sql.DateTime, new Date())
    .input("IdUsuario", sql.Int, Number(idUsuario))
    .input("IdCliente", sql.Int, Number(idCliente))
    .input("Importe", sql.Decimal(10, 2), Number(totalImporte.toFixed(2)));

  const values = [];
  normalizados.forEach((p, i) => {
    request
      .input(`IdProducto_${i}`, sql.Int, p.idProducto)
      .input(`Cantidad_${i}`, sql.Int, p.cantidad)
      .input(`PrecioUnitario_${i}`, sql.Decimal(10, 2), Number(p.precioUnitario.toFixed(2)))
      .input(`Bonificacion_${i}`, sql.Int, p.bonificacion);

    values.push(`(@IdVenta, @IdProducto_${i}, @Cantidad_${i}, @PrecioUnitario_${i}, @Bonificacion_${i})`);
  });

  const detalleValuesClause = values.join(',\n      ');

  const updateStockStatements = normalizados.map((_, i) => `
    UPDATE Producto
    SET Stock = Stock - @Cantidad_${i}
    WHERE Id = @IdProducto_${i};
  `).join('\n');

  const sqlBatch = `
BEGIN TRY
  BEGIN TRAN;

    INSERT INTO Venta (Fecha, IdUsuario, IdCliente, Importe)
    VALUES (@Fecha, @IdUsuario, @IdCliente, @Importe);

    DECLARE @IdVenta INT = SCOPE_IDENTITY();

    INSERT INTO DetalleVenta (IdVenta, IdProducto, Cantidad, PrecioUnitario, Bonificacion)
    VALUES
      ${detalleValuesClause};

    ${updateStockStatements}

  COMMIT TRAN;

  SELECT @IdVenta AS IdVenta;
END TRY
BEGIN CATCH
  IF (XACT_STATE()) <> 0 ROLLBACK TRAN;
  DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
  RAISERROR(@ErrMsg, 16, 1);
END CATCH;
`;

  try {
    const result = await request.query(sqlBatch);
    const idVenta = result.recordset && result.recordset[0] ? result.recordset[0].IdVenta : null;
    return idVenta;
  } catch (error) {
    console.error("Error al insertar venta:", error.message);
    throw error;
  }
}

async function consultarVenta(idVenta) {
  try {
    const pool = await sql.connect(config);

    const resultVenta = await pool.request()
      .input("idVenta", sql.Int, idVenta)
      .query(`
        SELECT v.Id, v.Fecha, v.Importe,
               c.Denominacion AS Cliente
        FROM Venta v
        JOIN Cliente c ON v.IdCliente = c.Id
        WHERE v.Id = @idVenta
      `);

    const venta = resultVenta.recordset[0];
    if (!venta) return null;

    const resultDetalle = await pool.request()
      .input("idVenta", sql.Int, idVenta)
      .query(`
        SELECT pr.Nombre AS NombreProducto,
               dv.Cantidad,
               dv.PrecioUnitario,
               dv.Bonificacion
        FROM DetalleVenta dv
        JOIN Producto pr ON dv.IdProducto = pr.Id
        WHERE dv.IdVenta = @idVenta
      `);

    venta.productos = resultDetalle.recordset.map(p => ({
      nombre: p.NombreProducto,
      cantidad: p.Cantidad,
      precioUnitario: p.PrecioUnitario,
      bonificacion: p.Bonificacion
    }));

    return venta;
  } catch (error) {
    console.error("Error al consultar venta:", error.message);
    throw error;
  }
}

module.exports = {
  obtenerVentas,
  insertarVenta,
  consultarVenta
};
