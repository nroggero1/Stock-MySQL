let productosVenta = [];

// --- Validación de stock antes de registrar la venta ---
function validarStockProductos(productos) {
  const errores = [];

  productos.forEach((producto) => {
    if (!producto.activo) {
      errores.push(`Producto "${producto.nombre}" está inactivo.`);
    } else if (producto.stock <= 0) {
      errores.push(`Producto "${producto.nombre}" no tiene stock disponible.`);
    } else if (producto.cantidad > producto.stock) {
      errores.push(
        `Producto "${producto.nombre}" excede el stock disponible (${producto.stock}).`
      );
    }
  });

  return {
    esValido: errores.length === 0,
    errores,
  };
}

// --- Buscar producto por código de barras ---
function buscarProductoPorCodigo() {
  const codigo = document.getElementById("codigoBarras").value.trim();
  if (!codigo) return alert("Ingrese un código de barras");

  fetch(`/productos/buscar/${codigo}`)
    .then((res) => {
      if (!res.ok) throw new Error("Producto no encontrado");
      return res.json();
    })
    .then((producto) => {
      if (!producto.Activo || producto.Stock <= 0) {
        alert(`Producto no disponible: inactivo o sin stock.`);
        return limpiarCamposProducto();
      }

      document.getElementById("producto").value = producto.Nombre;
      document.getElementById("marca").value = producto.Marca;
      document.getElementById("categoria").value = producto.Categoria;
      document.getElementById("stock").value = producto.Stock;
      document.getElementById("precioUnitario").value = producto.PrecioVenta.toFixed(2);
      document.getElementById("bonificacion").value = "0"; 

      const input = document.getElementById("producto");
      input.dataset.id = producto.Id;
      input.dataset.precio = producto.PrecioVenta;
      input.dataset.marcaNombre = producto.Marca;
      input.dataset.categoriaNombre = producto.Categoria;
      input.dataset.stock = producto.Stock;
      input.dataset.activo = producto.Activo;
    })
    .catch((err) => {
      limpiarCamposProducto();
      alert(err.message);
    });
}

// --- Limpiar campos ---
function limpiarCamposProducto() {
  const campos = ["producto", "marca", "categoria", "stock", "cantidad", "precioUnitario", "bonificacion"];
  campos.forEach((id) => (document.getElementById(id).value = ""));

  const input = document.getElementById("producto");
  ["id", "precio", "marcaNombre", "categoriaNombre", "stock", "activo", "precioUnitario", "bonificacion"].forEach(
    (attr) => delete input.dataset[attr]
  );
}

// --- Agregar producto a la lista ---
function agregarProducto() {
  const input = document.getElementById("producto");
  const idProducto = input.dataset.id;
  const nombre = input.value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const precio = parseFloat(input.dataset.precio);
  const marca = input.dataset.marcaNombre;
  const categoria = input.dataset.categoriaNombre;
  const stock = parseInt(input.dataset.stock);
  const bonificacion = parseFloat(document.getElementById("bonificacion").value) || 0;
  const activo = input.dataset.activo === "true";

  if (!idProducto || isNaN(cantidad) || cantidad <= 0) {
    return alert("Datos incompletos o inválidos.");
  }

  if (!activo || stock <= 0 || cantidad > stock) {
    return alert(
      `No se puede agregar producto: condiciones de stock no válidas.`
    );
  }

  // Buscar si ya existe el mismo producto con la misma bonificación
  const existente = productosVenta.find(
    (p) => p.idProducto === idProducto && p.bonificacion === bonificacion
  );

  if (existente) {
    // Sumar cantidades
    existente.cantidad += cantidad;
    existente.subTotal = (existente.precioUnitario * existente.cantidad) * (1 - existente.bonificacion / 100);
  } else {
    // Agregar como nuevo registro
    productosVenta.push({
      idProducto,
      nombre,
      marca,
      categoria,
      cantidad,
      precioUnitario: precio,
      bonificacion,
      subTotal: (precio * cantidad) * (1 - (bonificacion / 100)),
      stock,
      activo,
    });
  }

  limpiarCamposProducto();
  actualizarTabla();
}


// --- Eliminar producto ---
function eliminarProducto(index) {
  productosVenta.splice(index, 1);
  actualizarTabla();
}

// --- Actualizar tabla y totales ---
function actualizarTabla() {
  const tbody = document.querySelector("#tabla-venta tbody");
  const tfootExistente = document.querySelector("#tabla-venta tfoot");
  if (tfootExistente) tfootExistente.remove();

  tbody.innerHTML = "";

  let totalItems = 0,
    totalCantidad = 0,
    totalImporte = 0;

  productosVenta.forEach((prod, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${prod.nombre}</td>
      <td>${prod.marca}</td>
      <td>${prod.categoria}</td>
      <td>${prod.cantidad}</td>
      <td>$${prod.precioUnitario.toFixed(2)}</td>
      <td>${prod.bonificacion.toFixed(2)}%</td>
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

  document.getElementById("importe-total").value = totalImporte.toFixed(2);
  document.getElementById("productos-json").value =
    JSON.stringify(productosVenta);
}

// --- Validar antes de enviar ---
function prepararEnvioVenta() {
  if (productosVenta.length === 0) {
    alert("Debe agregar al menos un producto.");
    return false;
  }

  const { esValido, errores } = validarStockProductos(productosVenta);
  if (!esValido) {
    alert("Error de validación:\n\n" + errores.join("\n"));
    return false;
  }

  return true;
}

// --- Exportar detalle de venta a PDF ---
function exportarVentaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const detalle = document.getElementById("detalle-venta");
  
  let y = 10;

  const ventaId = document.getElementById("venta-id")?.textContent;

  doc.setFontSize(14);
  doc.text("Detalle de Venta", 10, y);
  y += 10;

  detalle.querySelectorAll("p").forEach(p => {
    const text = p.textContent;
    doc.setFontSize(10);
    doc.text(text, 10, y);
    y += 7;
  });

  y += 5;
  doc.setFontSize(12);
  doc.text("Detalle de productos", 10, y);
  y += 8;

  doc.setFontSize(10);
  doc.text("Producto", 10, y);
  doc.text("Cant.", 50, y);
  doc.text("P.Unit.", 70, y);
  doc.text("Bonif.", 100, y);
  doc.text("Subtotal", 130, y);
  y += 6;

  const filas = document.querySelectorAll("#tabla-detalle tbody tr");

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll("td");
    const producto = celdas[0].textContent;
    const cantidad = celdas[1].textContent;
    const precioUnit = celdas[2].textContent;
    const bonificacion = celdas[3].textContent;
    const subtotal = celdas[4].textContent;

    if (y > 280) {
      doc.addPage();
      y = 10;
    }

    doc.text(producto, 10, y);
    doc.text(cantidad, 50, y);
    doc.text(precioUnit, 70, y);
    doc.text(bonificacion, 100, y);
    doc.text(subtotal, 130, y);
    y += 6;
  });

  doc.save(`Venta_${ventaId || 'detalle'}.pdf`);
}
