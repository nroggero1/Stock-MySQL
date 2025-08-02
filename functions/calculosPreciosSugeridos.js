function calcularPrecioVentaSugerido() {
  const precioCompraInput = document.querySelector('input[name="precioCompra"]') || document.getElementById("precioUnitario");
  const porcentajeGananciaInput = document.querySelector('input[name="porcentajeGanancia"]') || document.getElementById("porcentajeGanancia");
  const precioVentaSugeridoInput = document.querySelector('input[name="precioVentaSugerido"]') || document.getElementById("precioVentaSugerido");

  const precioCompra = parseFloat(precioCompraInput.value) || 0;
  const porcentaje = parseFloat(porcentajeGananciaInput.value) || 0;
  const sugerido = precioCompra + (precioCompra * porcentaje / 100);
  precioVentaSugeridoInput.value = sugerido.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
  const precioCompraInput = document.querySelector('input[name="precioCompra"]') || document.getElementById("precioUnitario");
  const porcentajeGananciaInput = document.querySelector('input[name="porcentajeGanancia"]') || document.getElementById("porcentajeGanancia");

  if (precioCompraInput && porcentajeGananciaInput) {
    precioCompraInput.addEventListener('input', calcularPrecioVentaSugerido);
    porcentajeGananciaInput.addEventListener('input', calcularPrecioVentaSugerido);
    calcularPrecioVentaSugerido(); // Cálculo inicial
  }
});
