const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const marcaController = require('../controllers/marcaController'); 
const provinciaController = require('../controllers/provinciaController');
const localidadController = require('../controllers/localidadController');
const usuarioController = require('../controllers/usuarioController'); 
const proveedorController = require('../controllers/proveedorController');
const clienteController = require('../controllers/clienteController');
const productoController = require('../controllers/productoController');

// Rutas de inicio
router.get('/', (req, res) => {
    res.render('index', { title: 'Sistema de Gestión de Stock' });
});

// Rutas de categoría
router.get('/categorias', categoriaController.listarCategorias);
router.get('/categorias/agregar', categoriaController.formAgregarCategoria);
router.post('/categorias/agregar', categoriaController.agregarCategoria);
router.get('/categorias/editar/:id', categoriaController.formModificarCategoria);
router.post('/categorias/editar/:id', categoriaController.modificarCategoria);

// Rutas de marca
router.get('/marcas', marcaController.listarMarcas);
router.get('/marcas/agregar', marcaController.formAgregarMarca);
router.post('/marcas/agregar', marcaController.agregarMarca);
router.get('/marcas/editar/:id', marcaController.formModificarMarca);
router.post('/marcas/editar/:id', marcaController.modificarMarca);

// Rutas de provincia
router.get('/provincias', provinciaController.listarProvincias);

// Ruta para obtener localidades por provincia (AJAX)
router.get('/localidades/:idProvincia', localidadController.listarLocalidadesPorProvincia);

// Ruta para traer localidades por provincia
router.get('/localidades/provincia/:idProvincia', localidadController.listarLocalidadesPorProvincia);


// Rutas de usuario
router.get('/usuarios', usuarioController.listarUsuarios);
router.get('/usuarios/agregar', usuarioController.formAgregarUsuario);
router.post('/usuarios/agregar', usuarioController.agregarUsuario);
router.get('/usuarios/editar/:id', usuarioController.formModificarUsuario);
router.post('/usuarios/editar/:id', usuarioController.modificarUsuario);

// Rutas de proveedor
router.get('/proveedores', proveedorController.listarProveedores);
router.get('/proveedores/agregar', proveedorController.formAgregarProveedor);
router.post('/proveedores/agregar', proveedorController.agregarProveedor);
router.get('/proveedores/editar/:id', proveedorController.formModificarProveedor);
router.post('/proveedores/editar/:id', proveedorController.modificarProveedor);

// Rutas de cliente
router.get('/clientes', clienteController.listarClientes);
router.get('/clientes/agregar', clienteController.formAgregarCliente);
router.post('/clientes/agregar', clienteController.agregarCliente);
router.get('/clientes/editar/:id', clienteController.formModificarCliente);
router.post('/clientes/editar/:id', clienteController.modificarCliente);

// Rutas de producto
router.get('/productos', productoController.listarProductos);
router.get('/productos/agregar', productoController.mostrarFormularioAgregar);
router.post('/productos/agregar', productoController.agregarProducto);
router.get('/productos/editar/:id', productoController.mostrarFormularioEditar);
router.post('/productos/editar/:id', productoController.modificarProducto);
router.get('/productos/bajo-stock', productoController.listarProductosBajoStock);


module.exports = router;