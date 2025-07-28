const productoModel = require("../models/productoModel");
const marcaModel = require("../models/marcaModel");
const categoriaModel = require("../models/categoriaModel");

// Listar todos los productos
exports.listarProductos = async (req, res) => {
  try {
    const productos = await productoModel.getProductos();
    res.render("producto/indexProducto", {
      productos,
      usuario: req.session.usuario,
    });
  } catch (error) {
    res.status(500).send("Error al obtener productos: " + error.message);
  }
};

// Mostrar formulario para agregar producto
exports.mostrarFormularioAgregar = async (req, res) => {
  try {
    const marcas = await marcaModel.obtenerMarcasActivas();
    const categorias = await categoriaModel.obtenerCategoriasActivas();
    res.render("producto/agregarProducto", {
      marcas,
      categorias,
      usuario: req.session.usuario,
    });
  } catch (error) {
    res
      .status(500)
      .send("Error al cargar formulario de producto: " + error.message);
  }
};

// Agregar nuevo producto
exports.agregarProducto = async (req, res) => {
  try {
    const nuevoProducto = {
      Nombre: req.body.nombre,
      Descripcion: req.body.descripcion,
      CodigoBarras: req.body.codigoBarras,
      IdCategoria: parseInt(req.body.categoria),
      IdMarca: parseInt(req.body.marca),
      PrecioCompra: parseFloat(req.body.precioCompra),
      PorcentajeGanancia: parseInt(req.body.porcentajeGanancia),
      PrecioVentaSugerido: parseFloat(req.body.precioVentaSugerido) || 0,
      PrecioVenta: parseFloat(req.body.precioVenta),
      Stock: parseInt(req.body.stock),
      StockMinimo: parseInt(req.body.stockMinimo),
      Activo: req.body.activo === "1" ? 1 : 0,
    };
    await productoModel.insertarProducto(nuevoProducto);
    res.redirect("/productos");
  } catch (error) {
    res.status(500).send("Error al agregar producto: " + error.message);
  }
};

// Mostrar formulario para modificar producto
exports.mostrarFormularioEditar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const producto = await productoModel.getProductoPorId(id);
    const marcas = await marcaModel.getMarcas();
    const categorias = await categoriaModel.getCategorias();
    res.render("producto/modificarProducto", {
      producto,
      marcas,
      categorias,
      usuario: req.session.usuario,
    });
  } catch (error) {
    res.status(500).send("Error al cargar producto: " + error.message);
  }
};

// Modificar producto existente
exports.modificarProducto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productoModificado = {
      Nombre: req.body.nombre,
      Descripcion: req.body.descripcion,
      CodigoBarras: req.body.codigoBarras,
      IdCategoria: parseInt(req.body.categoria),
      IdMarca: parseInt(req.body.marca),
      PrecioCompra: parseFloat(req.body.precioCompra),
      PorcentajeGanancia: parseInt(req.body.porcentajeGanancia),
      PrecioVentaSugerido: parseFloat(req.body.precioVentaSugerido) || 0,
      PrecioVenta: parseFloat(req.body.precioVenta),
      Stock: parseInt(req.body.stock),
      StockMinimo: parseInt(req.body.stockMinimo),
      Activo: req.body.activo === "1" ? 1 : 0,
    };
    await productoModel.actualizarProducto(id, productoModificado);
    res.redirect("/productos");
  } catch (error) {
    res.status(500).send("Error al modificar producto: " + error.message);
  }
};

// Listar productos con stock menor o igual al mínimo
exports.listarProductosBajoStock = async (req, res) => {
  try {
    const productos = await productoModel.getProductosBajoStock();
    res.render("producto/productoBajoStock", {
      productos,
      usuario: req.session.usuario,
    });
  } catch (error) {
    res
      .status(500)
      .send("Error al obtener productos con bajo stock: " + error.message);
  }
};

// Buscar producto por código de barras
exports.buscarPorCodigoBarras = async (req, res) => {
  try {
    const codigo = req.params.codigoBarras;
    const producto = await productoModel.obtenerPorCodigoBarras(codigo);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    if (!producto.activo) {
      return res.status(400).json({ mensaje: "Producto inactivo" });
    }
    if (!producto.precioCompra || producto.precioCompra <= 0) {
      return res
        .status(400)
        .json({ mensaje: "El producto no tiene un precio de compra válido." });
    }
    res.json(producto);
  } catch (error) {
    console.error("Error buscando el producto:", error);
    res
      .status(500)
      .json({ mensaje: "Error buscando el producto. Intente nuevamente." });
  }
};
