/**
 * Valida los productos seleccionados para una venta.
 * @param {Array<{activo: boolean, stock: number, cantidad: number, nombre: string}>} productos
 * @returns {{esValido: boolean, errores: Array<string>}}
 */
export function validarStockProductos(productos) {
  const errores = [];

  productos.forEach((producto, i) => {
    if (!producto.activo) {
      errores.push(`Producto "${producto.nombre}" está inactivo.`);
    } else if (producto.stock <= 0) {
      errores.push(`Producto "${producto.nombre}" no tiene stock disponible.`);
    } else if (producto.cantidad > producto.stock) {
      errores.push(`Producto "${producto.nombre}" excede el stock disponible (${producto.stock}).`);
    }
  });

  return {
    esValido: errores.length === 0,
    errores,
  };
}
