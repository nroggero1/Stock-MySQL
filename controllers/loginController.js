const loginModel = require('../models/loginModel');

async function mostrarLogin(req, res) {
  res.render('login', { error: null, usuario: null });
}

async function procesarLogin(req, res) {
  const { nombreUsuario, clave } = req.body;

  try {
    const usuario = await loginModel.validarUsuario(nombreUsuario, clave);

    // Validar credenciales incorrectas
    if (!usuario) {
      return res.render('login', {
        error: 'Nombre de usuario o clave incorrectos.',
        usuario: null
      });
    }

    // Validar si el usuario está inactivo
    if (!usuario.Activo) {
      return res.render('login', {
        error: 'El usuario está inactivo.',
        usuario: null
      });
    }

    // Usuario válido y activo (Administrador o No)
    req.session.usuario = {
      id: usuario.Id,
      nombreUsuario: usuario.NombreUsuario,
      nombre: usuario.Nombre,
      apellido: usuario.Apellido,
      administrador: usuario.Administrador
    };

    return res.redirect('/');
  } catch (error) {
    console.error('Error al procesar login:', error);
    return res.render('login', {
      error: 'Error interno del servidor al iniciar sesión.',
      usuario: null
    });
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/login');
  });
}

module.exports = {
  mostrarLogin,
  procesarLogin,
  logout
};
