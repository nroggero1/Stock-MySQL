const proveedorModel = require('../models/proveedorModel');
const provinciaModel = require('../models/provinciaModel');

// Mostrar todos los proveedores
exports.listarProveedores = async (req, res) => {
    try {
        const proveedores = await proveedorModel.getProveedores();
        res.render('proveedor/indexProveedor', { proveedores });
    } catch (err) {
        console.error('Error al obtener proveedores:', err);
        res.status(500).send('Error al obtener proveedores');
    }
};

// Mostrar formulario para agregar proveedor con lista de provincias
exports.formAgregarProveedor = async (req, res) => {
    try {
        const provincias = await provinciaModel.getProvincias();
        res.render('proveedor/agregarProveedor', { provincias, proveedor: {} });
    } catch (err) {
        console.error('Error al cargar formulario de agregar proveedor:', err);
        res.status(500).send('Error al cargar formulario');
    }
};

// Agregar proveedor
exports.agregarProveedor = async (req, res) => {
    try {
        const datos = req.body;

        await proveedorModel.insertarProveedor({
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
        res.render('proveedor/modificarProveedor', { proveedor, provincias });
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
