const compraModel = require("../models/compraModel");
const proveedorModel = require("../models/proveedorModel");
const productoModel = require("../models/productoModel");

exports.listarCompras = async (req, res) => {
  try {
    const compras = await compraModel.obtenerCompras();
    res.render("compra/indexCompra", {
      compras,
      usuario: req.session.usuario,
    });
  } catch (error) {
    console.error("Error al listar compras:", error);
    res.status(500).send("Error al listar compras.");
  }
};

exports.formAgregarCompra = async (req, res) => {
  try {
    const proveedores = await proveedorModel.getProveedoresActivos();
    res.render("compra/agregarCompra", {
      proveedores,
      usuario: req.session.usuario,
    });
  } catch (error) {
    console.error("Error al cargar formulario de compra:", error);
    res.status(500).send("Error al cargar el formulario de compra.");
  }
};

exports.agregarCompra = async (req, res) => {
  try {
    const idUsuario = req.session.usuario.id;
    if (!idUsuario) return res.status(403).send("No autorizado");

    const { idProveedor, productos, importe } = req.body;

    if (!idProveedor || !productos || !importe) {
      return res.status(400).send("Datos incompletos");
    }

    const productosLista = JSON.parse(productos);

    if (!Array.isArray(productosLista) || productosLista.length === 0) {
      return res.status(400).send("Lista de productos vacía");
    }

    await compraModel.insertarCompra({
      idProveedor: parseInt(idProveedor),
      idUsuario: parseInt(idUsuario),
      importe: parseFloat(importe),
      productos: productosLista,
    });

    res.redirect("/compras");
  } catch (error) {
    console.error("Error registrando la compra:", error);
    res.status(500).send("Error al registrar la compra.");
  }
};

exports.buscarProductoPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const producto = await productoModel.buscarPorCodigoBarras(codigo);

    if (!producto) {
      return res.status(404).json({ error: "Producto no registrado" });
    }

    if (!producto.Activo) {
      return res.status(400).json({ error: "Producto inactivo" });
    }

    if (!producto.PrecioCompra || parseFloat(producto.PrecioCompra) <= 0) {
      return res
        .status(400)
        .json({ error: "El producto no tiene un precio de compra válido." });
    }

    res.json({
      Id: producto.Id,
      Nombre: producto.Nombre,
      Marca: producto.Marca,
      Categoria: producto.Categoria,
      PrecioCompra: parseFloat(producto.PrecioCompra),
      Stock: producto.Stock,
    });
  } catch (err) {
    console.error("Error buscando producto:", err);
    res.status(500).json({ error: "Error al buscar el producto." });
  }
};

exports.consultarCompra = async (req, res) => {
  const id = parseInt(req.params.idCompra, 10);

  if (isNaN(id)) {
    console.error("ID de compra inválido:", req.params.idCompra);
    return res.status(400).send("ID inválido");
  }

  try {
    const compra = await compraModel.consultarCompra(id);

    if (!compra) {
      return res.status(404).send("Compra no encontrada");
    }

    // Convertir importe a número
    compra.Importe = parseFloat(compra.Importe);
    if (isNaN(compra.Importe)) compra.Importe = 0;

    // Convertir precioUnitario de cada producto a número
    compra.productos = compra.productos.map((p) => {
      return {
        ...p,
        precioUnitario: parseFloat(p.precioUnitario) || 0,
        cantidad: parseInt(p.cantidad) || 0,
      };
    });

    res.render("compra/consultarCompra", {
      compra,
      usuario: req.session.usuario,
    });
  } catch (error) {
    console.error("Error al consultar compra:", error);
    res.status(500).send("Error al consultar compra");
  }
};

