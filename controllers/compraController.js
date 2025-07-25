// controllers/compraController.js
const compraModel = require('../models/compraModel');

exports.listarCompras = async (req, res) => {
  try {
    const compras = await compraModel.obtenerCompras();
    res.render('compra/indexCompra', { compras });
  } catch (error) {
    console.error('Error al listar compras:', error);
    res.status(500).send('Error al listar compras');
  }
};
