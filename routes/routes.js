const express = require('express');
const router = express.Router();
const verificarAutenticacion = require('../middlewares/authMiddleware');

const loginController = require('../controllers/loginController');
const categoriaController = require('../controllers/categoriaController');
const marcaController = require('../controllers/marcaController'); 
const provinciaController = require('../controllers/provinciaController');
const localidadController = require('../controllers/localidadController');
const usuarioController = require('../controllers/usuarioController'); 
const proveedorController = require('../controllers/proveedorController');
const clienteController = require('../controllers/clienteController');
const productoController = require('../controllers/productoController');
const compraController = require('../controllers/compraController');

// Rutas de login/logout (sin protección)
router.get('/login', loginController.mostrarLogin);
router.post('/login', loginController.procesarLogin);
router.get('/logout', loginController.logout);

// Ruta de inicio protegida
router.get('/', verificarAutenticacion, (req, res) => {
  res.render('index', {
    title: 'Sistema de Gestión de Stock',
    usuario: req.session.usuario
  });
});

// Rutas de categoría
router.get('/categorias', verificarAutenticacion, categoriaController.listarCategorias);
router.get('/categorias/agregar', verificarAutenticacion, categoriaController.formAgregarCategoria);
router.post('/categorias/agregar', verificarAutenticacion, categoriaController.agregarCategoria);
router.get('/categorias/editar/:id', verificarAutenticacion, categoriaController.formModificarCategoria);
router.post('/categorias/editar/:id', verificarAutenticacion, categoriaController.modificarCategoria);

// Rutas de marca
router.get('/marcas', verificarAutenticacion, marcaController.listarMarcas);
router.get('/marcas/agregar', verificarAutenticacion, marcaController.formAgregarMarca);
router.post('/marcas/agregar', verificarAutenticacion, marcaController.agregarMarca);
router.get('/marcas/editar/:id', verificarAutenticacion, marcaController.formModificarMarca);
router.post('/marcas/editar/:id', verificarAutenticacion, marcaController.modificarMarca);

// Rutas de provincia
router.get('/provincias', verificarAutenticacion, provinciaController.listarProvincias);

// Rutas para localidades por provincia (AJAX)
router.get('/localidades/:idProvincia', verificarAutenticacion, localidadController.listarLocalidadesPorProvincia);
router.get('/localidades/provincia/:idProvincia', verificarAutenticacion, localidadController.listarLocalidadesPorProvincia);

// Rutas de usuario
router.get('/usuarios', verificarAutenticacion, usuarioController.listarUsuarios);
router.get('/usuarios/agregar', verificarAutenticacion, usuarioController.formAgregarUsuario);
router.post('/usuarios/agregar', verificarAutenticacion, usuarioController.agregarUsuario);
router.get('/usuarios/editar/:id', verificarAutenticacion, usuarioController.formModificarUsuario);
router.post('/usuarios/editar/:id', verificarAutenticacion, usuarioController.modificarUsuario);

// Rutas de proveedor
router.get('/proveedores', verificarAutenticacion, proveedorController.listarProveedores);
router.get('/proveedores/agregar', verificarAutenticacion, proveedorController.formAgregarProveedor);
router.post('/proveedores/agregar', verificarAutenticacion, proveedorController.agregarProveedor);
router.get('/proveedores/editar/:id', verificarAutenticacion, proveedorController.formModificarProveedor);
router.post('/proveedores/editar/:id', verificarAutenticacion, proveedorController.modificarProveedor);

// Rutas de cliente
router.get('/clientes', verificarAutenticacion, clienteController.listarClientes);
router.get('/clientes/agregar', verificarAutenticacion, clienteController.formAgregarCliente);
router.post('/clientes/agregar', verificarAutenticacion, clienteController.agregarCliente);
router.get('/clientes/editar/:id', verificarAutenticacion, clienteController.formModificarCliente);
router.post('/clientes/editar/:id', verificarAutenticacion, clienteController.modificarCliente);

// Rutas de producto
router.get('/productos', verificarAutenticacion, productoController.listarProductos);
router.get('/productos/agregar', verificarAutenticacion, productoController.mostrarFormularioAgregar);
router.post('/productos/agregar', verificarAutenticacion, productoController.agregarProducto);
router.get('/productos/editar/:id', verificarAutenticacion, productoController.mostrarFormularioEditar);
router.post('/productos/editar/:id', verificarAutenticacion, productoController.modificarProducto);
router.get('/productos/stock-bajo', verificarAutenticacion, productoController.listarProductosBajoStock);

// Ruta para buscar producto por código de barras con autenticación
router.get('/productos/buscar/:codigoBarras', verificarAutenticacion, productoController.buscarPorCodigoBarras);

// Rutas de compra
router.get('/compras', verificarAutenticacion, compraController.listarCompras);
router.get('/compras/agregar', verificarAutenticacion, compraController.formAgregarCompra);
router.post('/compras/agregar', verificarAutenticacion, compraController.agregarCompra);
router.get('/compras/consultar/:idCompra', verificarAutenticacion, compraController.consultarCompra);

module.exports = router;
