const usuarioModel = require('../models/usuarioModel');

// Mostrar todos los usuarios
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.getUsuarios();
        res.render('usuario/indexUsuario', { usuarios });
    } catch (err) {
        console.error('Error al obtener usuarios:', err); 
        res.status(500).send('Error al obtener usuarios');
    }
};

// Mostrar formulario para agregar usuario
exports.formAgregarUsuario = (req, res) => {
    res.render('usuario/agregarUsuario');
};

// Agregar un nuevo usuario
exports.agregarUsuario = async (req, res) => {
    try {
        const { nombreUsuario, clave, nombre, apellido, mail, fechaNacimiento } = req.body;
        await usuarioModel.agregarUsuario(nombreUsuario, clave, nombre, apellido, mail, fechaNacimiento);
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
        const usuarios = await usuarioModel.getUsuarios();
        const usuario = usuarios.find(u => u.Id == id);
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.render('usuario/modificarUsuario', { usuario });
    } catch (err) {
        console.error('Error al cargar usuario:', err);
        res.status(500).send('Error al cargar usuario');
    }
};

// Modificar un usuario
exports.modificarUsuario = async (req, res) => {
    try {
        const { id, nombreUsuario, clave, nombre, apellido, mail, fechaNacimiento, administrador, activo } = req.body;
        const usuarios = await usuarioModel.getUsuarios();
        const usuario = usuarios.find(usu => usu.Id == id);
        const fechaAlta = usuario.FechaAlta;
        const administradorBool = administrador === "1" ? true : false;
        const activoBool = activo === "1" ? true : false;
        await usuarioModel.modificarUsuario(
            id,
            nombreUsuario,
            clave,
            nombre,
            apellido,
            mail,
            fechaNacimiento,
            administradorBool,
            fechaAlta,
            activoBool
        );
        res.redirect('/usuarios');
    } catch (err) {
        console.error('Error al modificar usuario:', err);
        res.status(500).send('Error al modificar usuario');
    }
};

// Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        await usuarioModel.eliminarUsuario(id);
        res.redirect('/usuarios');
    } catch (err) {
        res.status(500).send('Error al eliminar usuario');
    }
  }