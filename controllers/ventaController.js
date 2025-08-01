const ventaModel = require('../models/ventaModel');
const clienteModel = require('../models/clienteModel');
const productoModel = require('../models/productoModel');

exports.listarVentas = async (req, res) => {
  try {
    const ventas = await ventaModel.obtenerVentas();
    res.render('venta/indexVenta', {
      ventas,
      usuario: req.session.usuario
    });
  } catch (error) {
    console.error('Error al listar ventas:', error);
    res.status(500).send('Error al listar ventas.');
  }
};

exports.formAgregarVenta = async (req, res) => {
  try {
    const clientes = await clienteModel.getClientesActivos();
    const productos = await productoModel.getProductosActivos();

    if (!clientes || !productos || clientes.length === 0 || productos.length === 0) {
      return res.status(400).send('Datos incompletos');
    }

    res.render('venta/agregarVenta', { clientes, productos });
  } catch (error) {
    console.error('Error al cargar formulario de venta:', error);
    res.status(500).send('Error al cargar el formulario de venta');
  }
};

exports.agregarVenta = async (req, res) => {
  try {
    const idUsuario = req.session.usuario.id;
    if (!idUsuario) return res.status(403).send('No autorizado');

    const { idCliente, productos, importe } = req.body;

    if (!idCliente || !productos || !importe) {
      return res.status(400).send('Datos incompletos');
    }

    const productosLista = JSON.parse(productos);

    if (!Array.isArray(productosLista) || productosLista.length === 0) {
      return res.status(400).send('Lista de productos vacía');
    }

    await ventaModel.insertarVenta({
      idCliente: parseInt(idCliente),
      idUsuario: parseInt(idUsuario),
      importe: parseFloat(importe),
      productos: productosLista
    });

    res.redirect('/ventas');
  } catch (error) {
    console.error('Error registrando la venta:', error);
    res.status(500).send('Error al registrar la venta.');
  }
};

exports.buscarProductoPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const producto = await productoModel.buscarPorCodigoBarras(codigo);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no registrado' });
    }

    if (!producto.Activo) {
      return res.status(400).json({ error: 'Producto inactivo' });
    }

    if (!producto.PrecioVenta || parseFloat(producto.PrecioVenta) <= 0) {
      return res.status(400).json({ error: 'El producto no tiene un precio de venta válido.' });
    }

    res.json({
      Id: producto.Id,
      Nombre: producto.Nombre,
      Marca: producto.Marca,
      Categoria: producto.Categoria,
      PrecioVenta: parseFloat(producto.PrecioVenta),
      Stock: producto.Stock
    });
  } catch (err) {
    console.error('Error buscando producto:', err);
    res.status(500).json({ error: 'Error al buscar el producto.' });
  }
};

exports.consultarVenta = async (req, res) => {
  const id = parseInt(req.params.idVenta, 10);

  if (isNaN(id)) {
    console.error('ID de venta inválido:', req.params.idVenta);
    return res.status(400).send('ID inválido');
  }

  try {
    const venta = await ventaModel.consultarVenta(id);

    if (!venta) {
      return res.status(404).send('Venta no encontrada');
    }

    res.render('venta/consultarVenta', {
      venta,
      usuario: req.session.usuario,
    });
  } catch (error) {
    console.error('Error al consultar venta:', error);
    res.status(500).send('Error al consultar venta');
  }
};
