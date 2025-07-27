const compraModel = require('../models/compraModel');
const proveedorModel = require('../models/proveedorModel');
const productoModel = require('../models/productoModel');

exports.listarCompras = async (req, res) => {
  try {
    const compras = await compraModel.obtenerCompras();
    res.render('compra/indexCompra', {
      compras,
      usuario: req.session.usuario
    });
  } catch (error) {
    console.error('Error al listar compras:', error);
    res.status(500).send('Error al listar compras');
  }
};

exports.formAgregarCompra = async (req, res) => {
  try {
    const proveedores = await proveedorModel.obtenerProveedoresActivos();
    res.render('compra/agregarCompra', {
      proveedores,
      usuario: req.session.usuario
    });
  } catch (error) {
    console.error('Error al cargar formulario de compra:', error);
    res.status(500).send('Error al cargar formulario');
  }
};

exports.agregarCompra = async (req, res) => {
  try {
    const { idProveedor, productos, importe } = req.body;
    const idUsuario = req.session.usuario?.id;

    if (!idUsuario) {
      return res.status(403).send('No autorizado');
    }

    const listaProductos = JSON.parse(productos);

    await compraModel.insertarCompra({
      idProveedor,
      idUsuario,
      importe,
      productos: listaProductos,
    });

    res.redirect('/compras');
  } catch (error) {
    console.error('Error al registrar compra:', error);
    res.status(500).send('Error al registrar compra');
  }
};

exports.buscarProductoPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params; // usar req.params si la ruta es /productos/buscar/:codigo
    const producto = await productoModel.buscarPorCodigoBarras(codigo);

    if (!producto) {
      console.log('Código no encontrado:', codigo);
      return res.json({ error: 'Producto no registrado' });
    }

    const activo = producto.Activo === true || producto.Activo === 1;

    if (!activo) {
      console.log('Producto inactivo:', producto);
      return res.json({ error: 'Producto inactivo' });
    }

    res.json({
      Id: producto.Id,
      Nombre: producto.Nombre,
      Marca: producto.Marca,
      Categoria: producto.Categoria,
      PrecioCompra: producto.PrecioCompra,
      PrecioVenta: producto.PrecioVenta,
      Stock: producto.Stock
    });

  } catch (error) {
    console.error('Error buscando producto por código de barras:', error);
    res.json({ error: 'Error buscando el producto. Intente nuevamente.' });
  }
};
  