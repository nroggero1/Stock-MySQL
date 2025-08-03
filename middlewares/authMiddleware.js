// middlewares/authMiddleware.js

function verificarAutenticacion(req, res, next) {
  if (req.session.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
}

function verificarAdministrador(req, res, next) {
  if (req.session.usuario && req.session.usuario.administrador) {
    next();
  } else {
    res.status(403).send('Acceso denegado. Solo administradores.');
  }
}

module.exports = {
  verificarAutenticacion,
  verificarAdministrador
};
