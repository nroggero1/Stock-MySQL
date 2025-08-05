const marcaModel = require('../models/marcaModel');

// Mostrar todas las marcas
exports.listarMarcas = async (req, res) => {
    try {
        const marcas = await marcaModel.getMarcas();
        res.render('marca/indexMarca', { marcas, usuario: req.session.usuario });
    } catch (err) {
        console.error('Error al obtener marcas:', err);
        res.status(500).send('Error al obtener marcas');
    }
};

// Mostrar formulario para agregar marca
exports.formAgregarMarca = (req, res) => {
    res.render('marca/agregarMarca', { usuario: req.session.usuario });
};

// Agregar una nueva marca
exports.agregarMarca = async (req, res) => {
    try {
        const { nombre } = req.body;
        await marcaModel.agregarMarca(nombre);
        res.redirect('/marcas');
    } catch (err) {
        res.status(500).send('Error al agregar marca');
    }
};

// Mostrar formulario para modificar marca
exports.formModificarMarca = async (req, res) => {
    try {
        const id = req.params.id;
        const marcas = await marcaModel.getMarcas();
        const marca = marcas.find(mar => mar.Id == id);
        res.render('marca/modificarMarca', { marca, usuario: req.session.usuario });
    } catch (err) {
        res.status(500).send('Error al cargar marca');
    }
};

// Modificar una marca
exports.modificarMarca = async (req, res) => {
    try {
        const { id, nombre, activo } = req.body;
        const marcas = await marcaModel.getMarcas();
        const marca = marcas.find(mar => mar.Id == id);
        const fechaAlta = marca.FechaAlta;
        const activoBool = activo === "1";
        await marcaModel.modificarMarca(id, nombre, fechaAlta, activoBool);
        res.redirect('/marcas');
    } catch (err) {
        console.error('Error al modificar marca:', err);
        res.status(500).send('Error al modificar marca');
    }
};
