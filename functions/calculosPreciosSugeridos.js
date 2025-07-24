document.addEventListener('DOMContentLoaded', () => {
  const precioCompraInput = document.querySelector('input[name="precioCompra"]');
  const porcentajeGananciaInput = document.querySelector('input[name="porcentajeGanancia"]');
  const precioVentaSugeridoInput = document.querySelector('input[name="precioVentaSugerido"]');

  function calcularPrecioVentaSugerido() {
    const precioCompra = parseFloat(precioCompraInput.value) || 0;
    const porcentaje = parseFloat(porcentajeGananciaInput.value) || 0;
    const sugerido = precioCompra + (precioCompra * porcentaje / 100);
    precioVentaSugeridoInput.value = sugerido.toFixed(2);
  }

  precioCompraInput.addEventListener('input', calcularPrecioVentaSugerido);
  porcentajeGananciaInput.addEventListener('input', calcularPrecioVentaSugerido);

  // Inicializar al cargar la página
  calcularPrecioVentaSugerido();
});
