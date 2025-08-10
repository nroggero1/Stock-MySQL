const pool = require('../data/data');

// Obtener todas las compras
async function obtenerCompras() {
  try {
    const [rows] = await pool.query(`
      SELECT c.Id, c.Fecha, c.Importe,
             p.CodigoTributario, p.Denominacion,
             u.NombreUsuario AS Usuario
      FROM Compra c
      JOIN Proveedor p ON c.IdProveedor = p.Id
      JOIN Usuario u ON c.IdUsuario = u.Id
      ORDER BY c.Fecha DESC
    `);
    return rows;
  } catch (error) {
    console.error('Error al obtener compras:', error.message);
    throw error;
  }
}

// Insertar nueva compra (con detalles y actualización de stock)
async function insertarCompra({ idProveedor, idUsuario, productos }) {
  if (!Array.isArray(productos) || productos.length === 0) {
    throw new Error('La lista de productos no puede estar vacía.');
  }

const productosNormalizados = productos.map(p => {
  const precioUnitario = parseFloat(p.precioUnitario) || 0;
  const porcentajeGanancia = parseFloat(p.porcentajeGanancia) || 0;
  const precioVenta = parseFloat(p.precioVenta) || 0;

  return {
    idProducto: Number(p.idProducto),
    cantidad: Number(p.cantidad),
    precioUnitario,
    porcentajeGanancia,
    precioVenta
  };
});

  const totalImporte = productosNormalizados.reduce(
    (acc, p) => acc + p.cantidad * p.precioUnitario,
    0
  );

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insertar compra
    const [resultCompra] = await conn.query(`
      INSERT INTO Compra (Fecha, IdUsuario, IdProveedor, Importe)
      VALUES (NOW(), ?, ?, ?)
    `, [idUsuario, idProveedor, totalImporte.toFixed(2)]);

    const idCompra = resultCompra.insertId;

    for (const p of productosNormalizados) {
      // Insertar en DetalleCompra
      await conn.query(`
        INSERT INTO DetalleCompra (IdCompra, IdProducto, Cantidad, PrecioUnitario)
        VALUES (?, ?, ?, ?)
      `, [idCompra, p.idProducto, p.cantidad, p.precioUnitario.toFixed(2)]);

      // Actualizar stock
      await conn.query(`
        UPDATE Producto SET Stock = Stock + ? WHERE Id = ?
      `, [p.cantidad, p.idProducto]);

      // Calcular precio sugerido y actualizar precios
      const precioVentaSugerido = parseFloat(
        (p.precioUnitario * (1 + p.porcentajeGanancia / 100)).toFixed(2)
      );

      await conn.query(`
        UPDATE Producto SET 
          PrecioCompra = ?, 
          PorcentajeGanancia = ?, 
          PrecioVenta = ?, 
          PrecioVentaSugerido = ?
        WHERE Id = ?
      `, [
        p.precioUnitario,
        p.porcentajeGanancia,
        p.precioVenta,
        precioVentaSugerido,
        p.idProducto
      ]);
    }

    await conn.commit();
    return idCompra;
  } catch (error) {
    await conn.rollback();
    console.error('Error al insertar compra:', error.message);
    throw error;
  } finally {
    conn.release();
  }
}

// Consultar una compra por ID (con detalle)
async function consultarCompra(idCompra) {
  try {
    const [datosCompra] = await pool.query(`
      SELECT c.Id, c.Fecha, c.Importe,
             p.Denominacion AS Proveedor
      FROM Compra c
      JOIN Proveedor p ON c.IdProveedor = p.Id
      WHERE c.Id = ?
    `, [idCompra]);

    const compra = datosCompra[0];
    if (!compra) return null;

    const [detalles] = await pool.query(`
      SELECT pr.Nombre AS NombreProducto,
             dc.Cantidad,
             dc.PrecioUnitario
      FROM DetalleCompra dc
      JOIN Producto pr ON dc.IdProducto = pr.Id
      WHERE dc.IdCompra = ?
    `, [idCompra]);

    compra.productos = detalles.map(p => ({
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
