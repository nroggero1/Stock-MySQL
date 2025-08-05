const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const rutas = require('./routes/routes');

// Configuraciones
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares generales
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/functions', express.static(path.join(__dirname, 'functions')));

// Configurar sesión
app.use(session({
  secret: 'clave_secreta_segura',
  resave: false,
  saveUninitialized: false,
}));

// Middleware para compartir usuario a todas las vistas EJS
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// Middleware para proteger rutas (excepto login)
app.use((req, res, next) => {
  const rutasPublicas = ['/login'];
  if (rutasPublicas.includes(req.path) || req.path.startsWith('/functions') || req.path.startsWith('/public')) {
    return next();
  }
  if (!req.session.usuario && req.path !== '/login') {
    return res.redirect('/login');
  }
  next();
});

// Rutas principales
app.use('/', rutas);

// Servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
