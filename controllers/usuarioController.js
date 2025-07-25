const usuarioModel = require('../models/usuarioModel');

// Listar usuarios
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.getUsuarios();
        res.render('usuario/indexUsuario', { usuarios, usuario: req.session.usuario });
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).send('Error al obtener usuarios');
    }
};

// Mostrar formulario para agregar usuario
exports.formAgregarUsuario = (req, res) => {
    res.render('usuario/agregarUsuario', { usuario: req.session.usuario });
};

// Agregar usuario
exports.agregarUsuario = async (req, res) => {
    try {
        const datos = req.body;
        await usuarioModel.insertarUsuario(datos);
        res.redirect('/usuarios');
    } catch (err) {
        console.error('Error al agregar usuario:', err);
        res.status(500).send('Error al agregar usuario');
    }
};

// Mostrar formulario para modificar usuario
exports.formModificarUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const usuarioMod = await usuarioModel.getUsuarioPorId(id);
        res.render('usuario/modificarUsuario', { usuarioMod, usuario: req.session.usuario });
    } catch (err) {
        console.error('Error al obtener usuario:', err);
        res.status(500).send('Error al obtener usuario');
    }
};

// Modificar usuario
exports.modificarUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const datos = req.body;
        await usuarioModel.actualizarUsuario(id, datos);
        res.redirect('/usuarios');
    } catch (err) {
        console.error('Error al modificar usuario:', err);
        res.status(500).send('Error al modificar usuario');
    }
};
