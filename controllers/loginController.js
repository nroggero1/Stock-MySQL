// controllers/loginController.js
const loginModel = require('../models/loginModel');

async function mostrarLogin(req, res) {
  try {
    res.render('login', {
      title: 'Iniciar Sesión',
      error: null,
      usuario: null
    });
  } catch (error) {
    console.error('Error al mostrar formulario de login:', error);
    res.status(500).render('login', {
      title: 'Iniciar Sesión',
      error: 'Error interno al cargar el formulario de login.',
      usuario: null
    });
  }
}

async function procesarLogin(req, res) {
  const { nombreUsuario, clave } = req.body;

  try {
    const usuario = await loginModel.validarUsuario(nombreUsuario, clave);

    if (!usuario) {
      return res.status(401).render('login', {
        title: 'Iniciar Sesión',
        error: 'Nombre de usuario o clave incorrectos.',
        usuario: null
      });
    }

    if (!usuario.Activo) {
      return res.status(403).render('login', {
        title: 'Iniciar Sesión',
        error: 'El usuario está inactivo.',
        usuario: null
      });
    }

    // Autenticación exitosa
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
    return res.status(500).render('login', {
      title: 'Iniciar Sesión',
      error: 'Error interno del servidor al iniciar sesión.',
      usuario: null
    });
  }
}

function logout(req, res) {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.status(500).send('Error al cerrar sesión');
      }
      res.redirect('/login');
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).send('Error al cerrar sesión');
  }
}

module.exports = {
  mostrarLogin,
  procesarLogin,
  logout
};
