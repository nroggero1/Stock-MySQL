let productosVenta = [];

// --- Validar stock antes de registrar la venta ---
function validarStockProductos(productos) {
  const errores = [];

  productos.forEach((p) => {
    if (!p.activo) {
      errores.push(`Producto "${p.nombre}" está inactivo.`);
    } else if (p.stock <= 0) {
      errores.push(`Producto "${p.nombre}" no tiene stock disponible.`);
    } else if (p.cantidad > p.stock) {
      errores.push(
        `Producto "${p.nombre}" excede el stock disponible (${p.stock}).`
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
        alert("Producto no disponible: inactivo o sin stock.");
        limpiarCamposProducto();
        return;
      }

      const precio = Number(producto.PrecioVenta);

      const input = document.getElementById("producto");
      input.value = producto.Nombre;
      input.dataset.id = producto.Id;
      input.dataset.precio = precio;
      input.dataset.marcaNombre = producto.Marca;
      input.dataset.categoriaNombre = producto.Categoria;
      input.dataset.stock = producto.Stock;
      input.dataset.activo = producto.Activo ? "true" : "false";

      document.getElementById("marca").value = producto.Marca;
      document.getElementById("categoria").value = producto.Categoria;
      document.getElementById("stock").value = producto.Stock;
      document.getElementById("precioUnitario").value = precio.toFixed(2);
      document.getElementById("bonificacion").value = "0";
    })
    .catch((err) => {
      limpiarCamposProducto();
      alert(err.message);
    });
}

// --- Limpiar campos del formulario ---
function limpiarCamposProducto() {
  const ids = [
    "producto",
    "marca",
    "categoria",
    "stock",
    "cantidad",
    "precioUnitario",
    "bonificacion",
  ];
  ids.forEach((id) => (document.getElementById(id).value = ""));

  const input = document.getElementById("producto");
  ["id", "precio", "marcaNombre", "categoriaNombre", "stock", "activo"].forEach(
    (attr) => delete input.dataset[attr]
  );
}

// --- Agregar producto a la lista ---
function agregarProducto() {
  const input = document.getElementById("producto");

  const idProducto = input.dataset.id;
  const nombre = input.value.trim();
  const cantidad = parseInt(document.getElementById("cantidad").value, 10);
  const precio = parseFloat(input.dataset.precio);
  const marca = input.dataset.marcaNombre;
  const categoria = input.dataset.categoriaNombre;
  const stock = parseInt(input.dataset.stock, 10);
  const bonificacion =
    parseFloat(document.getElementById("bonificacion").value) || 0;
  const activo = input.dataset.activo === "true";

  if (
    !idProducto ||
    !nombre ||
    isNaN(cantidad) ||
    cantidad <= 0 ||
    isNaN(precio)
  ) {
    return alert("Datos incompletos o inválidos.");
  }

  if (!activo) {
    return alert(`El producto "${nombre}" está inactivo y no puede venderse.`);
  }

  if (stock <= 0) {
    return alert(`El producto "${nombre}" no tiene stock disponible.`);
  }

  if (cantidad > stock) {
    return alert(
      `Cantidad solicitada (${cantidad}) supera el stock disponible (${stock}) del producto "${nombre}".`
    );
  }

  const existente = productosVenta.find(
    (p) => p.idProducto === idProducto && p.bonificacion === bonificacion
  );

  if (existente) {
    existente.cantidad += cantidad;
    existente.subTotal =
      existente.precioUnitario *
      existente.cantidad *
      (1 - existente.bonificacion / 100);
  } else {
    productosVenta.push({
      idProducto,
      nombre,
      marca,
      categoria,
      cantidad,
      precioUnitario: precio,
      bonificacion,
      subTotal: precio * cantidad * (1 - bonificacion / 100),
      stock,
      activo,
    });
  }

  limpiarCamposProducto();
  actualizarTabla();
}

// --- Eliminar producto de la tabla ---
function eliminarProducto(index) {
  productosVenta.splice(index, 1);
  actualizarTabla();
}

// --- Actualizar tabla de productos agregados ---
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
  document.getElementById("productos-json").value = JSON.stringify(productosVenta);
}

// --- Validar antes de enviar venta ---
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
  const tabla = document.querySelector("#tabla-detalle tbody");

  if (!detalle || !tabla) {
    console.error("No se encontró el contenido de venta o la tabla.");
    return;
  }

  let y = 10;
  const ventaId = document.getElementById("venta-id")?.textContent;

  // Título
  doc.setFontSize(14);
  doc.text("Detalle de Venta", 10, y);
  y += 10;

  // Exportar solo los <p> dentro de #detalle-venta
  detalle.querySelectorAll("p").forEach((p) => {
    doc.setFontSize(10);
    doc.text(p.textContent.trim(), 10, y);
    y += 7;
  });

  // Subtítulo tabla
  y += 5;
  doc.setFontSize(12);
  doc.text("Detalle de productos", 10, y);
  y += 8;

  // Encabezado tabla
  doc.setFontSize(10);
  doc.text("Producto", 10, y);
  doc.text("Cant.", 50, y);
  doc.text("P.Unit.", 70, y);
  doc.text("Bonif.", 100, y);
  doc.text("Subtotal", 130, y);
  y += 6;

  // Filas de la tabla
  tabla.querySelectorAll("tr").forEach((fila) => {
    const celdas = fila.querySelectorAll("td");
    if (celdas.length >= 5) {
      const [producto, cantidad, precioUnit, bonificacion, subtotal] = [
        celdas[0]?.textContent.trim(),
        celdas[1]?.textContent.trim(),
        celdas[2]?.textContent.trim(),
        celdas[3]?.textContent.trim(),
        celdas[4]?.textContent.trim(),
      ];

      if (y > 280) {
        doc.addPage();
        y = 10;
      }

      doc.text(producto || "", 10, y);
      doc.text(cantidad || "", 50, y);
      doc.text(precioUnit || "", 70, y);
      doc.text(bonificacion || "", 100, y);
      doc.text(subtotal || "", 130, y);
      y += 6;
    }
  });

  // Crear blob del PDF
  const pdfBlob = doc.output("blob");
  const pdfURL = URL.createObjectURL(pdfBlob);

  // Abrir una nueva pestaña vacía SIN header/footer
  const nuevaVentana = window.open("", "_blank");

  if (nuevaVentana) {
    nuevaVentana.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <title>Distribuidora Negri - PDF</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              margin: 40px;
            }
            iframe {
              margin-top: 20px;
              border: none;
            }
          </style>
        </head>
        <body>
          <h2>Distribuidora Negri</h2>
          <iframe src="${pdfURL}" width="90%" height="600px"></iframe>
        </body>
      </html>
    `);
    nuevaVentana.document.close();
  } else {
    alert("Por favor, habilitá las ventanas emergentes para ver el PDF.");
  }
}

// --- Imprimir detalle de venta ---
  function imprimirDetalleVenta() {
    const contenido = document.getElementById("detalle-venta").innerHTML;

    const ventana = window.open("", "_blank");

    if (!ventana) {
      alert("Por favor, habilitá las ventanas emergentes para imprimir.");
      return;
    }

    ventana.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <title>Impresión Detalle de Venta</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
          }
          h2, h3 {
            margin-top: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #444;
            padding: 8px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <h2>Distribuidora Negri</h2>
        <h3>Tel: 3562-508288</h3>
        ${contenido}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `);
    ventana.document.close();
  }