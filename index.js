const express = require('express');
const path = require('path');
const app = express();
const rutas = require('./routes/routes');

// Configuraciones
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', rutas);

// Servir carpeta functions para JS estático
app.use('/functions', express.static(path.join(__dirname, 'functions')));

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});