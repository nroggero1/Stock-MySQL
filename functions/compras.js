const productosCompra = [];

async function buscarProductoPorCodigo() {
  const codigo = document.getElementById("codigoBarras").value;

  if (!codigo.trim()) {
    alert("Ingrese un código de barras.");
    return;
  }

  try {
    const response = await fetch(`/productos/buscar/${codigo}`);
    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    document.getElementById("producto").value = data.Nombre || "";
    document.getElementById("marca").value = data.Marca || "";
    document.getElementById("categoria").value = data.Categoria || "";

    window.productoSeleccionado = data;

  } catch (err) {
    console.error("Error:", err);
    alert("Ocurrió un error al buscar el producto.");
  }
}

function agregarProducto() {
  const cantidadInput = document.getElementById("cantidad");
  const cantidad = parseInt(cantidadInput.value);

  if (!window.productoSeleccionado) {
    alert("Primero debe buscar y seleccionar un producto.");
    return;
  }

  if (!cantidad || cantidad < 1) {
    alert("Ingrese una cantidad válida.");
    return;
  }

  const producto = { ...window.productoSeleccionado };
  producto.Cantidad = cantidad;
  
  producto.Total = parseFloat((producto.PrecioCompra * cantidad).toFixed(2));

  const existente = productosCompra.find(p => p.Id === producto.Id);
  if (existente) {
    existente.Cantidad += cantidad;
    existente.Total = parseFloat((existente.PrecioCompra * existente.Cantidad).toFixed(2));
  } else {
    productosCompra.push(producto);
  }

  actualizarTablaCompra();

  cantidadInput.value = "";
  document.getElementById("codigoBarras").value = "";
  document.getElementById("producto").value = "";
  document.getElementById("marca").value = "";
  document.getElementById("categoria").value = "";
  window.productoSeleccionado = null;
}

function actualizarTablaCompra() {
  const tablaBody = document.querySelector("#tabla-compra tbody");
  tablaBody.innerHTML = "";

  let totalCompra = 0;

  productosCompra.forEach((producto) => {
    const cantidad = producto.Cantidad || 1;
    const precio = parseFloat(producto.PrecioCompra);

    if (isNaN(precio)) {
      console.error(`Precio inválido para producto ${producto.Nombre}:`, producto.PrecioCompra);
    }

    const totalProducto = cantidad * precio;
    totalCompra += totalProducto;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.Nombre}</td>
      <td>${cantidad}</td>
      <td>$${isNaN(totalProducto) ? "0.00" : totalProducto.toFixed(2)}</td>
    `;
    tablaBody.appendChild(fila);
  });

  document.getElementById("importe-total").value = totalCompra.toFixed(2);
  document.getElementById("productos-json").value = JSON.stringify(productosCompra);
}



function prepararEnvioCompra() {
  if (productosCompra.length === 0) {
    alert("Debe agregar al menos un producto a la compra.");
    return false;
  }

  // Forzar el cálculo final del total e inputs ocultos justo antes del envíos
  actualizarTablaCompra();
  return true;
}

window.agregarProducto = agregarProducto;
window.buscarProductoPorCodigo = buscarProductoPorCodigo;
window.prepararEnvioCompra = prepararEnvioCompra;
