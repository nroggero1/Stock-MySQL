const express = require('express');
const router = express.Router();
const { verificarAutenticacion, verificarAdministrador } = require('../middlewares/authMiddleware');


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
const ventaController = require('../controllers/ventaController');

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
router.get('/categorias', verificarAutenticacion, verificarAdministrador, categoriaController.listarCategorias);
router.get('/categorias/agregar', verificarAutenticacion, verificarAdministrador, categoriaController.formAgregarCategoria);
router.post('/categorias/agregar', verificarAutenticacion, verificarAdministrador, categoriaController.agregarCategoria);
router.get('/categorias/editar/:id', verificarAutenticacion, verificarAdministrador, categoriaController.formModificarCategoria);
router.post('/categorias/editar/:id', verificarAutenticacion, verificarAdministrador, categoriaController.modificarCategoria);

// Rutas de marca
router.get('/marcas', verificarAutenticacion, verificarAdministrador, marcaController.listarMarcas);
router.get('/marcas/agregar', verificarAutenticacion, verificarAdministrador, marcaController.formAgregarMarca);
router.post('/marcas/agregar', verificarAutenticacion, verificarAdministrador, marcaController.agregarMarca);
router.get('/marcas/editar/:id', verificarAutenticacion, verificarAdministrador, marcaController.formModificarMarca);
router.post('/marcas/editar/:id', verificarAutenticacion, verificarAdministrador, marcaController.modificarMarca);

// Rutas de provincia
router.get('/provincias', verificarAutenticacion, verificarAdministrador, provinciaController.listarProvincias);

// Rutas para localidades por provincia (AJAX)
router.get('/localidades/:idProvincia', verificarAutenticacion, verificarAdministrador, localidadController.listarLocalidadesPorProvincia);
router.get('/localidades/provincia/:idProvincia', verificarAutenticacion, verificarAdministrador, localidadController.listarLocalidadesPorProvincia);

// Rutas de usuario
router.get('/usuarios', verificarAutenticacion, verificarAdministrador, usuarioController.listarUsuarios);
router.get('/usuarios/agregar', verificarAutenticacion, verificarAdministrador, usuarioController.formAgregarUsuario);
router.post('/usuarios/agregar', verificarAutenticacion, verificarAdministrador, usuarioController.agregarUsuario);
router.get('/usuarios/editar/:id', verificarAutenticacion, verificarAdministrador, usuarioController.formModificarUsuario);
router.post('/usuarios/editar/:id', verificarAutenticacion, verificarAdministrador, usuarioController.modificarUsuario);

// Rutas de proveedor
router.get('/proveedores', verificarAutenticacion, verificarAdministrador, proveedorController.listarProveedores);
router.get('/proveedores/agregar', verificarAutenticacion, verificarAdministrador, proveedorController.formAgregarProveedor);
router.post('/proveedores/agregar', verificarAutenticacion, verificarAdministrador, proveedorController.agregarProveedor);
router.get('/proveedores/editar/:id', verificarAutenticacion, verificarAdministrador, proveedorController.formModificarProveedor);
router.post('/proveedores/editar/:id', verificarAutenticacion, verificarAdministrador, proveedorController.modificarProveedor);

// Rutas de cliente
router.get('/clientes', verificarAutenticacion, verificarAdministrador, clienteController.listarClientes);
router.get('/clientes/agregar', verificarAutenticacion, verificarAdministrador, clienteController.formAgregarCliente);
router.post('/clientes/agregar', verificarAutenticacion, verificarAdministrador, clienteController.agregarCliente);
router.get('/clientes/editar/:id', verificarAutenticacion, verificarAdministrador, clienteController.formModificarCliente);
router.post('/clientes/editar/:id', verificarAutenticacion, verificarAdministrador, clienteController.modificarCliente);

// Rutas de producto
router.get('/productos', verificarAutenticacion, verificarAdministrador, productoController.listarProductos);
router.get('/productos/agregar', verificarAutenticacion, verificarAdministrador, productoController.mostrarFormularioAgregar);
router.post('/productos/agregar', verificarAutenticacion, verificarAdministrador, productoController.agregarProducto);
router.get('/productos/editar/:id', verificarAutenticacion, verificarAdministrador, productoController.mostrarFormularioEditar);
router.post('/productos/editar/:id', verificarAutenticacion, verificarAdministrador, productoController.modificarProducto);
router.get('/productos/stock-bajo', verificarAutenticacion, productoController.listarProductosBajoStock);

// Ruta para buscar producto por código de barras con autenticación
router.get('/productos/buscar/:codigoBarras', verificarAutenticacion, productoController.buscarPorCodigoBarras);

// Rutas de compra
router.get('/compras', verificarAutenticacion, verificarAdministrador, compraController.listarCompras);
router.get('/compras/agregar', verificarAutenticacion, verificarAdministrador, compraController.formAgregarCompra);
router.post('/compras/agregar', verificarAutenticacion, verificarAdministrador, compraController.agregarCompra);
router.get('/compras/consultar/:idCompra', verificarAutenticacion, verificarAdministrador, compraController.consultarCompra);

// Rutas de venta
router.get('/ventas', verificarAutenticacion, ventaController.listarVentas);
router.get('/ventas/agregar', verificarAutenticacion, ventaController.formAgregarVenta);
router.post('/ventas/agregar', verificarAutenticacion, ventaController.agregarVenta);
router.get('/ventas/consultar/:idVenta', verificarAutenticacion, ventaController.consultarVenta);


module.exports = router;