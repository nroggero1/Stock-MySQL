// public/functions/general.js

// Espera que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
  // Selecciona todos los campos de texto dentro de formularios
  const camposTexto = document.querySelectorAll('form input[type="text"]');

  camposTexto.forEach(campo => {
    // Al salir del campo, convierte el contenido a mayúsculas
    campo.addEventListener('blur', function () {
      this.value = this.value.toUpperCase();
    });

    // Opcional: convierte a mayúsculas mientras se escribe (en vivo)
    campo.addEventListener('input', function () {
      this.value = this.value.toUpperCase();
    });
  });
});
