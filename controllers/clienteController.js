const clienteModel = require('../models/clienteModel');
const provinciaModel = require('../models/provinciaModel');

// Mostrar todos los clientes
exports.listarClientes = async (req, res) => {
    try {
        const clientes = await clienteModel.getClientes();
        res.render('cliente/indexCliente', { clientes });
    } catch (err) {
        console.error('Error al obtener clientes:', err);
        res.status(500).send('Error al obtener clientes');
    }
};

// Mostrar formulario para agregar cliente con lista de provincias
exports.formAgregarCliente = async (req, res) => {
    try {
        const provincias = await provinciaModel.getProvincias();
        res.render('cliente/agregarCliente', { provincias, cliente: {} });
    } catch (err) {
        console.error('Error al cargar formulario de agregar cliente:', err);
        res.status(500).send('Error al cargar formulario');
    }
};

// Agregar cliente
exports.agregarCliente = async (req, res) => {
    try {
        const datos = req.body;

        await clienteModel.insertarCliente({
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
        res.render('cliente/modificarCliente', { cliente, provincias });
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
