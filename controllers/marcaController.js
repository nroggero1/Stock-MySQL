const marcaModel = require('../models/marcaModel');

// Mostrar todas las marcas
exports.listarMarcas = async (req, res) => {
    try {
        const marcas = await marcaModel.getMarcas();
        res.render('marca/indexMarca', { marcas });
    } catch (err) {
        console.error('Error al obtener marcas:', err); // <-- Agrega esto
        res.status(500).send('Error al obtener marcas');
    }
};

// Mostrar formulario para agregar marca
exports.formAgregarMarca = (req, res) => {
    res.render('marca/agregarMarca');
};

// Agregar una nueva marca
exports.agregarMarca = async (req, res) => {
    try {
        const { nombre } = req.body;
        await marcaModel.agregarMarca(nombre); // <-- Corrige aquí
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
        res.render('marca/modificarMarca', { marca });
    } catch (err) {
        res.status(500).send('Error al cargar marca');
    }
};


// Modificar una marca
exports.modificarMarca = async (req, res) => {
    try {
        const { id, nombre, activo } = req.body;
        const marcas = await marcaModel.getMarcas(); // <-- Usa marcaModel aquí
        const marca = marcas.find(mar => mar.Id == id);
        const fechaAlta = marca.FechaAlta;
        const activoBool = activo === "1" ? true : false;
        await marcaModel.modificarMarca(id, nombre, fechaAlta, activoBool);
        res.redirect('/marcas');
    } catch (err) {
        console.error('Error al modificar marca:', err);
        res.status(500).send('Error al modificar marca');
    }
};

// Eliminar una marca
exports.eliminarMarca = async (req, res) => {
    try {
        const id = req.params.id;
        await marcaModel.eliminarMarca(id);
        res.redirect('/marcas');
    } catch (err) {
        res.status(500).send('Error al eliminar marca');
    }
  }