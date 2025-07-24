const productoModel = require('../models/productoModel');
const marcaModel = require('../models/marcaModel');
const categoriaModel = require('../models/categoriaModel');

// Listar todos los productos
async function listarProductos(req, res) {
  try {
    const productos = await productoModel.getProductos();
    res.render('producto/indexProducto', { productos });
  } catch (error) {
    res.status(500).send('Error al obtener productos: ' + error.message);
  }
}

// Mostrar formulario para agregar producto
async function mostrarFormularioAgregar(req, res) {
  try {
    const marcas = await marcaModel.getMarcasActivas();
    const categorias = await categoriaModel.getCategoriasActivas();
    res.render('producto/agregarProducto', { marcas, categorias });
  } catch (error) {
    res.status(500).send('Error al cargar formulario de producto: ' + error.message);
  }
}

// Agregar nuevo producto
async function agregarProducto(req, res) {
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
      Activo: req.body.activo === '1' ? 1 : 0
    };
    await productoModel.insertarProducto(nuevoProducto);
    res.redirect('/productos');
  } catch (error) {
    res.status(500).send('Error al agregar producto: ' + error.message);
  }
}

// Mostrar formulario para modificar producto
async function mostrarFormularioEditar(req, res) {
  try {
    const id = parseInt(req.params.id);
    const producto = await productoModel.getProductoPorId(id);
    const marcas = await marcaModel.getMarcas();
    const categorias = await categoriaModel.getCategorias();
    res.render('producto/modificarProducto', { producto, marcas, categorias });
  } catch (error) {
    res.status(500).send('Error al cargar producto: ' + error.message);
  }
}

// Modificar producto existente
async function modificarProducto(req, res) {
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
      Activo: req.body.activo === '1' ? 1 : 0
    };
    await productoModel.actualizarProducto(id, productoModificado);
    res.redirect('/productos');
  } catch (error) {
    res.status(500).send('Error al modificar producto: ' + error.message);
  }
}

module.exports = {
  listarProductos,
  mostrarFormularioAgregar,
  agregarProducto,
  mostrarFormularioEditar,
  modificarProducto
};
