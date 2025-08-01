let productosCompra = [];

function buscarProductoPorCodigo() {
  const codigo = document.getElementById("codigoBarras").value.trim();
  if (!codigo) return alert("Ingrese un código de barras");

  fetch(`/productos/buscar/${codigo}`)
    .then(res => {
      if (!res.ok) throw new Error("Producto no encontrado");
      return res.json();
    })
    .then(producto => {
      document.getElementById("producto").value = producto.Nombre;
      document.getElementById("marca").value = producto.Marca;
      document.getElementById("categoria").value = producto.Categoria;

      const inputProducto = document.getElementById("producto");
      inputProducto.dataset.id = producto.Id;
      inputProducto.dataset.precio = producto.PrecioCompra;
      inputProducto.dataset.marcaNombre = producto.Marca;
      inputProducto.dataset.categoriaNombre = producto.Categoria;
    })
    .catch(error => {
      limpiarCamposProducto();
      alert(error.message);
    });
}

function limpiarCamposProducto() {
  document.getElementById("producto").value = "";
  document.getElementById("marca").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("cantidad").value = "";

  const inputProducto = document.getElementById("producto");
  delete inputProducto.dataset.id;
  delete inputProducto.dataset.precio;
  delete inputProducto.dataset.marcaNombre;
  delete inputProducto.dataset.categoriaNombre;
}

function agregarProducto() {
  const inputProducto = document.getElementById("producto");

  const idProducto = inputProducto.dataset.id;
  const nombre = inputProducto.value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const precio = parseFloat(inputProducto.dataset.precio);
  const marca = inputProducto.dataset.marcaNombre;
  const categoria = inputProducto.dataset.categoriaNombre;

  if (!idProducto || isNaN(cantidad) || cantidad <= 0) {
    return alert("Datos incompletos o inválidos.");
  }

  if (isNaN(precio) || precio <= 0) {
    return alert("El producto no tiene un precio válido.");
  }

  // Agregar producto a la lista
  productosCompra.push({
    idProducto,
    nombre,
    marca,
    categoria,
    cantidad,
    precioUnitario: precio,
    subTotal: +(cantidad * precio).toFixed(2),
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
  document.getElementById("productos-json").value = JSON.stringify(productosCompra);
}

function prepararEnvioCompra() {
  if (productosCompra.length === 0) {
    alert("Debe agregar al menos un producto");
    return false;
  }
  return true;
}
