let productosCompra = [];

function buscarProductoPorCodigo() {
  const codigo = document.getElementById("codigoBarras").value.trim();
  if (!codigo) return alert("Ingrese un código de barras");

  fetch(`/productos/buscar/${codigo}`)
    .then((res) => {
      if (!res.ok) throw new Error("Producto no encontrado");
      return res.json();
    })
    .then((producto) => {
      document.getElementById("producto").value = producto.Nombre;
      document.getElementById("marca").value = producto.Marca;
      document.getElementById("categoria").value = producto.Categoria;
      document.getElementById("stock").value = producto.Stock;
      document.getElementById("precioUnitario").value =
        producto.PrecioCompra.toFixed(2);
      document.getElementById("porcentajeGanancia").value =
        producto.PorcentajeGanancia.toFixed(2);
      document.getElementById("precioVenta").value =
        producto.PrecioVenta.toFixed(2);
      document.getElementById("precioVentaSugerido").value =
        producto.PrecioVentaSugerido.toFixed(2);

      const inputProducto = document.getElementById("producto");
      inputProducto.dataset.id = producto.Id;
      inputProducto.dataset.precioOriginal = producto.PrecioCompra;
      inputProducto.dataset.porcentajeGananciaOriginal =
        producto.PorcentajeGanancia;
      inputProducto.dataset.precioVentaOriginal = producto.PrecioVenta;
      inputProducto.dataset.marcaNombre = producto.Marca;
      inputProducto.dataset.categoriaNombre = producto.Categoria;
    })
    .catch((error) => {
      limpiarCamposProducto();
      alert(error.message);
    });
}

function limpiarCamposProducto() {
  document.getElementById("producto").value = "";
  document.getElementById("marca").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("precioUnitario").value = "";
  document.getElementById("porcentajeGanancia").value = "";
  document.getElementById("precioVentaSugerido").value = "";
  document.getElementById("precioVenta").value = "";

  const inputProducto = document.getElementById("producto");
  delete inputProducto.dataset.id;
  delete inputProducto.dataset.precio;
  delete inputProducto.dataset.marcaNombre;
  delete inputProducto.dataset.categoriaNombre;
  delete inputProducto.dataset.precioVenta;
}

function agregarProducto() {
  const inputProducto = document.getElementById("producto");

  const idProducto = inputProducto.dataset.id;
  const nombre = inputProducto.value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const precioUnitario = parseFloat(
    document.getElementById("precioUnitario").value
  );
  const porcentajeGanancia = parseFloat(
    document.getElementById("porcentajeGanancia").value
  );
  const precioVenta = parseFloat(document.getElementById("precioVenta").value);
  const precioVentaSugerido = parseFloat(
    document.getElementById("precioVentaSugerido").value
  );

  const precioOriginal = parseFloat(inputProducto.dataset.precioOriginal);
  const porcentajeGananciaOriginal = parseFloat(
    inputProducto.dataset.porcentajeGananciaOriginal
  );
  const precioVentaOriginal = parseFloat(
    inputProducto.dataset.precioVentaOriginal
  );

  const marca = inputProducto.dataset.marcaNombre;
  const categoria = inputProducto.dataset.categoriaNombre;

  if (
    !idProducto ||
    isNaN(cantidad) ||
    cantidad <= 0 ||
    isNaN(precioUnitario)
  ) {
    return alert("Datos incompletos o inválidos.");
  }

  productosCompra.push({
    idProducto,
    nombre,
    marca,
    categoria,
    cantidad,
    precioUnitario,
    porcentajeGanancia,
    precioVenta,
    precioVentaSugerido,
    precioOriginal,
    porcentajeGananciaOriginal,
    precioVentaOriginal,
    subTotal: +(cantidad * precioUnitario).toFixed(2),
  });

  limpiarCamposProducto();
  actualizarTabla();
}

function eliminarProducto(index) {
  productosCompra.splice(index, 1);
  actualizarTabla();
}

function actualizarTabla() {
  const tbody = document.querySelector("#tabla-compra tbody");
  const tfootExistente = document.querySelector("#tabla-compra tfoot");
  if (tfootExistente) tfootExistente.remove();

  tbody.innerHTML = "";

  let totalItems = 0;
  let totalCantidad = 0;
  let totalImporte = 0;

  productosCompra.forEach((prod, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${prod.nombre}</td>
      <td>${prod.marca}</td>
      <td>${prod.categoria}</td>
      <td>${prod.cantidad}</td>
      <td>$${prod.precioUnitario.toFixed(2)}</td>
      <td>$${prod.subTotal.toFixed(2)}</td>
      <td><button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">Eliminar</button></td>
    `;
    tbody.appendChild(tr);

    totalItems++;
    totalCantidad += prod.cantidad;
    totalImporte += prod.subTotal;
  });

  const tfoot = document.createElement("tfoot");
  tfoot.innerHTML = `
    <tr>
      <th colspan="4">Cantidad de items</th>
      <td>${totalItems}</td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <th colspan="4">Total unidades</th>
      <td>${totalCantidad}</td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <th colspan="6">Total a pagar</th>
      <th colspan="2">$${totalImporte.toFixed(2)}</th>
    </tr>
  `;
  tbody.parentElement.appendChild(tfoot);

  // Actualizar campos ocultos
  document.getElementById("importe-total").value = totalImporte.toFixed(2);
  document.getElementById("productos-json").value =
    JSON.stringify(productosCompra);
}

function prepararEnvioCompra() {
  if (productosCompra.length === 0) {
    alert("Debe agregar al menos un producto.");
    return false;
  }

  // Validar si algún producto fue modificado
  const modificados = productosCompra.filter((p) => {
    const productoInput = document.createElement("input");
    productoInput.dataset.precioOriginal = p.precioOriginal;
    productoInput.dataset.porcentajeGananciaOriginal =
      p.porcentajeGananciaOriginal;
    productoInput.dataset.precioVentaOriginal = p.precioVentaOriginal;

    return (
      parseFloat(p.precioUnitario) !== parseFloat(p.precioOriginal) ||
      parseFloat(p.porcentajeGanancia) !==
        parseFloat(p.porcentajeGananciaOriginal) ||
      parseFloat(p.precioVenta) !== parseFloat(p.precioVentaOriginal)
    );
  });

  if (modificados.length > 0) {
    const confirmacion = confirm(
      "Precio de compra y/o porcentaje de ganancia y/o precio de venta modificados. ¿Desea continuar?"
    );
    if (!confirmacion) return false;
  }

  // Convertir la lista a JSON y enviarla
  document.getElementById("productos-json").value =
    JSON.stringify(productosCompra);

  // Calcular total
  const total = productosCompra.reduce((sum, p) => sum + p.subTotal, 0);
  document.getElementById("importe-total").value = total.toFixed(2);

  return true;
}
