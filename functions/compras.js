let productosCompra = [];

function buscarProductoPorCodigo() {
  const codigo = document.getElementById("codigoBarras").value.trim();
  if (!codigo) return alert("Ingrese un código de barras");

  fetch(`/productos/buscar/${codigo}`)
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Producto no encontrado");
      return data;
    })
    .then((producto) => {
      if (!producto.Activo) throw new Error("Producto inactivo");

      document.getElementById("producto").value = producto.Nombre;
      document.getElementById("marca").value = producto.Marca;
      document.getElementById("categoria").value = producto.Categoria;
      document.getElementById("stock").value = producto.Stock;
      document.getElementById("precioUnitario").value = !isNaN(Number(producto.PrecioCompra))
        ? Number(producto.PrecioCompra).toFixed(2)
        : "";
      document.getElementById("porcentajeGanancia").value = !isNaN(Number(producto.PorcentajeGanancia))
        ? Number(producto.PorcentajeGanancia).toFixed(2)
        : "";
      document.getElementById("precioVenta").value = !isNaN(Number(producto.PrecioVenta))
        ? Number(producto.PrecioVenta).toFixed(2)
        : "";
      document.getElementById("precioVentaSugerido").value = !isNaN(Number(producto.PrecioVentaSugerido))
        ? Number(producto.PrecioVentaSugerido).toFixed(2)
        : "";

      const inputProducto = document.getElementById("producto");
      inputProducto.dataset.id = producto.Id;
      inputProducto.dataset.precioOriginal = producto.PrecioCompra;
      inputProducto.dataset.porcentajeGananciaOriginal = producto.PorcentajeGanancia;
      inputProducto.dataset.precioVentaOriginal = producto.PrecioVenta;
      inputProducto.dataset.marcaNombre = producto.Marca;
      inputProducto.dataset.categoriaNombre = producto.Categoria;

      if (!producto.PrecioCompra || producto.PrecioCompra <= 0) {
        alert("Este producto no tiene precio de compra. Debe ingresarlo ahora.");
      }
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
  delete inputProducto.dataset.precioOriginal;
  delete inputProducto.dataset.porcentajeGananciaOriginal;
  delete inputProducto.dataset.precioVentaOriginal;
  delete inputProducto.dataset.marcaNombre;
  delete inputProducto.dataset.categoriaNombre;
}

function agregarProducto() {
  const inputProducto = document.getElementById("producto");
  const idProducto = inputProducto.dataset.id;
  const nombre = inputProducto.value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const precioUnitario = parseFloat(document.getElementById("precioUnitario").value);
  const porcentajeGanancia = parseFloat(document.getElementById("porcentajeGanancia").value);
  const precioVenta = parseFloat(document.getElementById("precioVenta").value);
  const precioVentaSugerido = parseFloat(document.getElementById("precioVentaSugerido").value);

  const precioOriginal = parseFloat(inputProducto.dataset.precioOriginal);
  const porcentajeGananciaOriginal = parseFloat(inputProducto.dataset.porcentajeGananciaOriginal);
  const precioVentaOriginal = parseFloat(inputProducto.dataset.precioVentaOriginal);

  const marca = inputProducto.dataset.marcaNombre;
  const categoria = inputProducto.dataset.categoriaNombre;

  if (
    !idProducto ||
    isNaN(cantidad) ||
    cantidad <= 0 ||
    isNaN(precioUnitario) ||
    precioUnitario <= 0
  ) {
    return alert("Datos incompletos o inválidos. Asegúrese de ingresar un precio válido.");
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

function actualizarTabla() {
  const tbody = document.querySelector("#tabla-compra tbody");
  tbody.innerHTML = "";

  productosCompra.forEach((producto, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${producto.nombre}</td>
      <td>${producto.marca}</td>
      <td>${producto.categoria}</td>
      <td>${producto.cantidad}</td>
      <td>${producto.precioUnitario.toFixed(2)}</td>
      <td>${producto.subTotal.toFixed(2)}</td>
      <td>
        <button type="button" class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const importeTotal = productosCompra.reduce((acc, p) => acc + p.subTotal, 0);
  document.getElementById("importe-total").value = importeTotal.toFixed(2);
}


function eliminarProducto(index) {
  productosCompra.splice(index, 1);
  actualizarTabla();
}

function prepararEnvioCompra() {
  if (productosCompra.length === 0) {
    alert("Debe agregar al menos un producto a la compra.");
    return false; // Evita enviar el formulario
  }

  // Actualizar el campo oculto con la lista de productos
  document.getElementById("productos-json").value = JSON.stringify(productosCompra);

  // Actualizar el importe total (por si se modificó fuera de actualizarTabla)
  const importeTotal = productosCompra.reduce((acc, p) => acc + p.subTotal, 0);
  document.getElementById("importe-total").value = importeTotal.toFixed(2);

  return true; // Permite enviar el formulario
}
