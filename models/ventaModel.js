const pool = require('../data/data');

// Obtener todas las ventas
async function obtenerVentas() {
  try {
    const [rows] = await pool.query(`
      SELECT v.Id, v.Fecha, v.Importe,
             c.CodigoTributario, c.Denominacion,
             u.NombreUsuario AS Usuario,
             v.IdUsuario
      FROM Venta v
      JOIN Cliente c ON v.IdCliente = c.Id
      JOIN Usuario u ON v.IdUsuario = u.Id
      ORDER BY v.Fecha DESC
    `);

    // Convertir Importe a número
    return rows.map(row => ({
      ...row,
      Importe: parseFloat(row.Importe)
    }));
  } catch (error) {
    console.error("Error al obtener ventas:", error.message);
    throw error;
  }
}

// Obtener ventas filtradas por usuario
async function obtenerVentasPorUsuario(idUsuario) {
  try {
    const [rows] = await pool.query(`
      SELECT v.Id, v.Fecha, v.Importe,
             c.CodigoTributario, c.Denominacion,
             u.NombreUsuario AS Usuario,
             v.IdUsuario
      FROM Venta v
      JOIN Cliente c ON v.IdCliente = c.Id
      JOIN Usuario u ON v.IdUsuario = u.Id
      WHERE v.IdUsuario = ?
      ORDER BY v.Fecha DESC
    `, [idUsuario]);

    return rows.map(row => ({
      ...row,
      Importe: parseFloat(row.Importe)
    }));
  } catch (error) {
    console.error("Error al obtener ventas por usuario:", error.message);
    throw error;
  }
}

// Insertar una nueva venta (con detalles y actualización de stock)
async function insertarVenta({ idUsuario, idCliente, productos }) {
  if (!Array.isArray(productos) || productos.length === 0) {
    throw new Error('La lista de productos no puede estar vacía.');
  }

  // Agrupar productos por id + bonificación
  const agrupados = productos.reduce((acc, p) => {
    const key = `${p.idProducto}_${p.bonificacion || 0}`;
    if (!acc[key]) {
      acc[key] = { ...p, cantidad: Number(p.cantidad) };
    } else {
      acc[key].cantidad += Number(p.cantidad);
    }
    return acc;
  }, {});

  const normalizados = Object.values(agrupados).map(p => ({
    idProducto: Number(p.idProducto),
    cantidad: Number(p.cantidad),
    precioUnitario: Number(p.precioUnitario),
    bonificacion: Number(p.bonificacion || 0)
  }));

  // Calcular importe total con bonificación
  const totalImporte = normalizados.reduce((acc, p) => {
    const subTotal = p.precioUnitario * p.cantidad * (1 - p.bonificacion / 100);
    return acc + subTotal;
  }, 0);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insertar venta
    const [ventaResult] = await conn.query(`
      INSERT INTO Venta (Fecha, IdUsuario, IdCliente, Importe)
      VALUES (NOW(), ?, ?, ?)
    `, [idUsuario, idCliente, totalImporte.toFixed(2)]);
    const idVenta = ventaResult.insertId;

    // Insertar detalles y descontar stock
    for (const p of normalizados) {
      const [[{ Stock }]] = await conn.query(
        `SELECT Stock FROM Producto WHERE Id = ?`,
        [p.idProducto]
      );

      if (Stock < p.cantidad) {
        throw new Error(`Stock insuficiente para el producto con ID ${p.idProducto}.`);
      }

      await conn.query(`
        INSERT INTO DetalleVenta (IdVenta, IdProducto, Cantidad, PrecioUnitario, Bonificacion)
        VALUES (?, ?, ?, ?, ?)
      `, [idVenta, p.idProducto, p.cantidad, p.precioUnitario.toFixed(2), p.bonificacion]);

      await conn.query(`
        UPDATE Producto
        SET Stock = Stock - ?
        WHERE Id = ?
      `, [p.cantidad, p.idProducto]);
    }

    await conn.commit();
    return idVenta;
  } catch (error) {
    await conn.rollback();
    console.error("Error al insertar venta:", error.message);
    throw error;
  } finally {
    conn.release();
  }
}

// Consultar venta completa (encabezado + detalle)
async function consultarVenta(idVenta) {
  try {
    const [ventaRows] = await pool.query(`
      SELECT v.Id, v.Fecha, v.Importe,
             c.Denominacion AS Cliente,
             c.CodigoTributario,
             u.NombreUsuario AS Usuario,
             v.IdUsuario
      FROM Venta v
      JOIN Cliente c ON v.IdCliente = c.Id
      JOIN Usuario u ON v.IdUsuario = u.Id
      WHERE v.Id = ?
    `, [idVenta]);

    const ventaRow = ventaRows[0];
    if (!ventaRow) return null;

    // Convertir Importe a número
    const venta = {
      ...ventaRow,
      Importe: parseFloat(ventaRow.Importe)
    };

    const [detalleRows] = await pool.query(`
      SELECT pr.Nombre AS NombreProducto,
             dv.Cantidad,
             dv.PrecioUnitario,
             dv.Bonificacion
      FROM DetalleVenta dv
      JOIN Producto pr ON dv.IdProducto = pr.Id
      WHERE dv.IdVenta = ?
    `, [idVenta]);

    venta.productos = detalleRows.map(p => ({
      nombre: p.NombreProducto,
      cantidad: p.Cantidad,
      precioUnitario: parseFloat(p.PrecioUnitario),
      bonificacion: parseFloat(p.Bonificacion)
    }));

    return venta;
  } catch (error) {
    console.error("Error al consultar venta:", error.message);
    throw error;
  }
}

module.exports = {
  obtenerVentas,
  obtenerVentasPorUsuario,
  insertarVenta,
  consultarVenta
};
