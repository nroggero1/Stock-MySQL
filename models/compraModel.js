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

/**
 * Insertar nueva compra y sus detalles.
 * @param {Object} params
 * @param {number} params.idProveedor
 * @param {number} params.idUsuario
 * @param {Array<{idProducto:number|string, cantidad:number|string, precioUnitario:number|string, porcentajeGanancia:number|string, precioVenta:number|string}>} params.productos
 * @returns {Promise<number>} Id de la compra insertada
 */
async function insertarCompra({ idProveedor, idUsuario, productos }) {
  if (!Array.isArray(productos) || productos.length === 0) {
    throw new Error('La lista de productos no puede estar vacía.');
  }

  const normalizados = productos.map(p => ({
    idProducto: Number(p.idProducto),
    cantidad: Number(p.cantidad),
    precioUnitario: Number(p.precioUnitario),
    porcentajeGanancia: Number(p.porcentajeGanancia),
    precioVenta: Number(p.precioVenta)
  }));

  const totalImporte = normalizados.reduce(
    (acc, p) => acc + (p.cantidad * p.precioUnitario),
    0
  );

  const pool = await sql.connect(config);
  const request = pool.request();

  request
    .input('Fecha', sql.DateTime, new Date())
    .input('IdUsuario', sql.Int, Number(idUsuario))
    .input('IdProveedor', sql.Int, Number(idProveedor))
    .input('Importe', sql.Decimal(10, 2), Number(totalImporte.toFixed(2)));

  const values = [];
  normalizados.forEach((p, i) => {
    const precioVentaSugerido = Number((p.precioUnitario * (1 + p.porcentajeGanancia / 100)).toFixed(2));

    request
      .input(`IdProducto_${i}`, sql.Int, p.idProducto)
      .input(`Cantidad_${i}`, sql.Int, p.cantidad)
      .input(`PrecioUnitario_${i}`, sql.Decimal(10, 2), Number(p.precioUnitario.toFixed(2)))
      .input(`PorcentajeGanancia_${i}`, sql.Decimal(5, 2), p.porcentajeGanancia)
      .input(`PrecioVenta_${i}`, sql.Decimal(10, 2), p.precioVenta)
      .input(`PrecioVentaSugerido_${i}`, sql.Decimal(10, 2), precioVentaSugerido);

    values.push(`(@IdCompra, @IdProducto_${i}, @Cantidad_${i}, @PrecioUnitario_${i})`);
  });

  const detalleValuesClause = values.join(',\n      ');

  const updateProductoStatements = normalizados.map((_, i) => `
    UPDATE Producto
    SET PrecioCompra = @PrecioUnitario_${i},
        PorcentajeGanancia = @PorcentajeGanancia_${i},
        PrecioVenta = @PrecioVenta_${i},
        PrecioVentaSugerido = @PrecioVentaSugerido_${i}
    WHERE Id = @IdProducto_${i};
  `).join('\n');

  const sqlBatch = `
BEGIN TRY
  BEGIN TRAN;

    INSERT INTO Compra (Fecha, IdUsuario, IdProveedor, Importe)
    VALUES (@Fecha, @IdUsuario, @IdProveedor, @Importe);

    DECLARE @IdCompra INT = SCOPE_IDENTITY();

    INSERT INTO DetalleCompra (IdCompra, IdProducto, Cantidad, PrecioUnitario)
    VALUES
      ${detalleValuesClause};

    -- ACTUALIZAR STOCK (sumar)
    UPDATE p
    SET p.Stock = p.Stock + dc.Cantidad
    FROM Producto p
    JOIN DetalleCompra dc ON p.Id = dc.IdProducto
    WHERE dc.IdCompra = @IdCompra;

    -- ACTUALIZAR datos del producto si cambiaron
    ${updateProductoStatements}

  COMMIT TRAN;

  SELECT @IdCompra AS IdCompra;
END TRY
BEGIN CATCH
  IF (XACT_STATE()) <> 0 ROLLBACK TRAN;
  DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
  RAISERROR(@ErrMsg, 16, 1);
END CATCH;
`;

  try {
    const result = await request.query(sqlBatch);
    const idCompra = result.recordset && result.recordset[0] ? result.recordset[0].IdCompra : null;
    return idCompra;
  } catch (error) {
    console.error('Error al insertar compra:', error.message);
    throw error;
  }
}

async function consultarCompra(idCompra) {
  try {
    const pool = await sql.connect(config);

    // Consulta de la cabecera de la compra
    const resultCompra = await pool.request()
      .input('idCompra', sql.Int, idCompra)
      .query(`
        SELECT c.Id, c.Fecha, c.Importe,
               p.Denominacion AS Proveedor
        FROM Compra c
        JOIN Proveedor p ON c.IdProveedor = p.Id
        WHERE c.Id = @idCompra
      `);

    const compra = resultCompra.recordset[0];

    if (!compra) return null;

    // Consulta de los productos de la compra
    const resultDetalle = await pool.request()
      .input('idCompra', sql.Int, idCompra)
      .query(`
        SELECT pr.Nombre AS NombreProducto,
               dc.Cantidad,
               dc.PrecioUnitario
        FROM DetalleCompra dc
        JOIN Producto pr ON dc.IdProducto = pr.Id
        WHERE dc.IdCompra = @idCompra
      `);

    compra.productos = resultDetalle.recordset.map(p => ({
      nombre: p.NombreProducto,
      cantidad: p.Cantidad,
      precioUnitario: p.PrecioUnitario
    }));

    return compra;
  } catch (error) {
    console.error('Error al consultar compra:', error.message);
    throw error;
  }
}

module.exports = {
  obtenerCompras,
  insertarCompra,
  consultarCompra
};
