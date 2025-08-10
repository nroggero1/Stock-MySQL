const proveedorModel = require('../models/proveedorModel');
const provinciaModel = require('../models/provinciaModel');

// Mostrar todos los proveedores
exports.listarProveedores = async (req, res) => {
    try {
        const proveedores = await proveedorModel.getProveedores();
        res.render('proveedor/indexProveedor', { proveedores, usuario: req.session.usuario });
    } catch (err) {
        console.error('Error al obtener proveedores:', err);
        res.status(500).send('Error al obtener proveedores');
    }
};

// Mostrar formulario para agregar proveedor con lista de provincias
exports.formAgregarProveedor = async (req, res) => {
  try {
    const provincias = await provinciaModel.getProvincias();
    res.render('proveedor/agregarProveedor', { provincias, proveedor: {}, usuario: req.session.usuario });
  } catch (err) {
    console.error('Error al cargar formulario de agregar proveedor:', err);
    res.status(500).send('Error al cargar formulario');
  }
};

// Agregar proveedor
exports.agregarProveedor = async (req, res) => {
  try {
    const datos = req.body;
    const codigoTributario = BigInt(datos.codigoTributario);

    const proveedorExistente = await proveedorModel.getProveedorPorCodigoTributario(codigoTributario);

    if (proveedorExistente) {
      const provincias = await provinciaModel.getProvincias();
      const mensaje = proveedorExistente.Activo === 1
        ? 'Proveedor ya registrado y activo'
        : 'Proveedor ya registrado y no activo';

      return res.render('proveedor/agregarProveedor', {
        provincias,
        proveedor: datos, // repoblar campos si querés
        mensaje,
        usuario: req.session.usuario
      });
    }

    await proveedorModel.insertarProveedor({
      CodigoTributario: codigoTributario,
      Denominacion: datos.denominacion,
      Direccion: datos.direccion,
      IdLocalidad: parseInt(datos.localidad),
      Telefono: datos.telefono,
      Mail: datos.mail,
      Activo: 1, // Siempre se inserta como activo
      IdProvincia: parseInt(datos.provincia)
    });

    const provincias = await provinciaModel.getProvincias();
    res.render('proveedor/agregarProveedor', {
      provincias,
      proveedor: {},
      mensaje: 'Proveedor registrado exitosamente',
      usuario: req.session.usuario
    });
  } catch (err) {
    console.error('Error al agregar proveedor:', err);
    res.status(500).send('Error al agregar proveedor');
  }
};

// Mostrar formulario para modificar proveedor
exports.formModificarProveedor = async (req, res) => {
    try {
        const id = req.params.id;
        const proveedor = await proveedorModel.getProveedorPorId(id);
        const provincias = await provinciaModel.getProvincias();
        res.render('proveedor/modificarProveedor', { proveedor, provincias, usuario: req.session.usuario });
    } catch (err) {
        console.error('Error al obtener proveedor:', err);
        res.status(500).send('Error al obtener proveedor');
    }
};

// Modificar proveedor
exports.modificarProveedor = async (req, res) => {
    try {
        const id = req.params.id;
        const datos = req.body;
        await proveedorModel.actualizarProveedor(id, {
            CodigoTributario: BigInt(datos.codigoTributario),
            Denominacion: datos.denominacion,
            Direccion: datos.direccion,
            IdLocalidad: parseInt(datos.localidad),
            Telefono: datos.telefono,
            Mail: datos.mail,
            Activo: datos.activo === '1' ? 1 : 0,
            IdProvincia: parseInt(datos.provincia)
        });
        res.redirect('/proveedores');
    } catch (err) {
        console.error('Error al modificar proveedor:', err);
        res.status(500).send('Error al modificar proveedor');
    }
};
