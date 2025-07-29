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
async function insertarCompra({ idProveedor, idUsuario, productos }) {
  // Obtener la fecha actual en formato DDMMYYYY
  const fechaCompra = new Date();
  const dia = String(fechaCompra.getDate()).padStart(2, '0');
  const mes = String(fechaCompra.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
  const anio = fechaCompra.getFullYear();
  const fechaFormateada = `${dia}${mes}${anio}`;

  // Imprimir en consola los datos requeridos
  console.log('Usuario:', idUsuario);
  console.log('Proveedor:', idProveedor);
  console.log('Fecha:', fechaFormateada);

  // Calcular el importe total
  const listaProductos = productos.map(producto => ({
    IdProducto: producto.idProducto,
    Cantidad: producto.cantidad,
    PrecioUnitario: producto.precioUnitario
  }));

  const totalImporte = listaProductos.reduce((total, producto) => {
    return total + (producto.Cantidad * producto.PrecioUnitario);
  }, 0);

  console.log('Lista de productos:', JSON.stringify(listaProductos, null, 2));
  console.log('Importe total:', totalImporte.toFixed(2));
}

module.exports = {
  obtenerCompras,
  insertarCompra,
};
