const categoriaModel = require('../models/categoriaModel');

// Mostrar todas las categorías
exports.listarCategorias = async (req, res) => {
    try {
        const categorias = await categoriaModel.getCategorias();
        res.render('categoria/indexCategoria', { categorias, usuario: req.session.usuario });
    } catch (err) {
        console.error('Error al obtener categorías:', err);
        res.status(500).send('Error al obtener categorías');
    }
};

// Mostrar formulario para agregar categoría
exports.formAgregarCategoria = (req, res) => {
    res.render('categoria/agregarCategoria', { usuario: req.session.usuario });
};

// Agregar una nueva categoría
exports.agregarCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        await categoriaModel.agregarCategoria(nombre);
        res.redirect('/categorias');
    } catch (err) {
        res.status(500).send('Error al agregar categoría');
    }
};

// Mostrar formulario para modificar categoría
exports.formModificarCategoria = async (req, res) => {
    try {
        const id = req.params.id;
        const categorias = await categoriaModel.getCategorias();
        const categoria = categorias.find(cat => cat.Id == id);
        res.render('categoria/modificarCategoria', { categoria, usuario: req.session.usuario });
    } catch (err) {
        res.status(500).send('Error al cargar categoría');
    }
};

// Modificar una categoría
exports.modificarCategoria = async (req, res) => {
    try {
        const { id, nombre, activo } = req.body;
        const categorias = await categoriaModel.getCategorias();
        const categoria = categorias.find(cat => cat.Id == id);
        const fechaAlta = categoria.FechaAlta;
        const activoBool = activo === "1";
        await categoriaModel.modificarCategoria(id, nombre, fechaAlta, activoBool);
        res.redirect('/categorias');
    } catch (err) {
        console.error('Error al modificar categoría:', err);
        res.status(500).send('Error al modificar categoría');
    }
};

