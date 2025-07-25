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

module.exports = {
  obtenerCompras
};
