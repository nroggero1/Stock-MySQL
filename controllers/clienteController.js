const clienteModel = require('../models/clienteModel');
const provinciaModel = require('../models/provinciaModel');

// Mostrar todos los clientes
exports.listarClientes = async (req, res) => {
    try {
        const clientes = await clienteModel.getClientes();
        res.render('cliente/indexCliente', { clientes, usuario: req.session.usuario });
    } catch (err) {
        console.error('Error al obtener clientes:', err);
        res.status(500).send('Error al obtener clientes');
    }
};

// Mostrar formulario para agregar cliente con lista de provincias
exports.formAgregarCliente = async (req, res) => {
    try {
        const provincias = await provinciaModel.getProvincias();
        res.render('cliente/agregarCliente', { provincias, cliente: {}, usuario: req.session.usuario });
    } catch (err) {
        console.error('Error al cargar formulario de agregar cliente:', err);
        res.status(500).send('Error al cargar formulario');
    }
};

// Agregar cliente
exports.agregarCliente = async (req, res) => {
  try {
    const datos = req.body;
    const codigoTributario = BigInt(datos.codigoTributario);

    const clienteExistente = await clienteModel.getClientePorCodigoTributario(codigoTributario);

    if (clienteExistente) {
      const provincias = await provinciaModel.getProvincias();
      const mensaje = clienteExistente.Activo === 1
        ? 'Cliente ya registrado y activo'
        : 'Cliente ya registrado y no activo';

      return res.render('cliente/agregarCliente', {
        provincias,
        cliente: datos, // para repoblar el formulario si querés
        mensaje,
        usuario: req.session.usuario
      });
    }

    await clienteModel.insertarCliente({
      CodigoTributario: codigoTributario,
      Denominacion: datos.denominacion,
      Direccion: datos.direccion,
      IdLocalidad: parseInt(datos.localidad),
      Telefono: datos.telefono,
      Mail: datos.mail,
      Activo: 1,
      IdProvincia: parseInt(datos.provincia)
    });

    const provincias = await provinciaModel.getProvincias();
    res.render('cliente/agregarCliente', {
      provincias,
      cliente: {},
      mensaje: 'Cliente registrado exitosamente',
      usuario: req.session.usuario
    });
  } catch (err) {
    console.error('Error al agregar cliente:', err);
    res.status(500).send('Error al agregar cliente');
  }
};

// Mostrar formulario para modificar cliente
exports.formModificarCliente = async (req, res) => {
    try {
        const id = req.params.id;
        const cliente = await clienteModel.getClientePorId(id);
        const provincias = await provinciaModel.getProvincias();
        res.render('cliente/modificarCliente', { cliente, provincias, usuario: req.session.usuario });
    } catch (err) {
        console.error('Error al obtener cliente:', err);
        res.status(500).send('Error al obtener cliente');
    }
};

// Modificar cliente
exports.modificarCliente = async (req, res) => {
    try {
        const id = req.params.id;
        const datos = req.body;
        await clienteModel.actualizarCliente(id, {
            CodigoTributario: BigInt(datos.codigoTributario),
            Denominacion: datos.denominacion,
            Direccion: datos.direccion,
            IdLocalidad: parseInt(datos.localidad),
            Telefono: datos.telefono,
            Mail: datos.mail,
            Activo: datos.activo === '1' ? 1 : 0,
            IdProvincia: parseInt(datos.provincia)
        });
        res.redirect('/clientes');
    } catch (err) {
        console.error('Error al modificar cliente:', err);
        res.status(500).send('Error al modificar cliente');
    }
};
