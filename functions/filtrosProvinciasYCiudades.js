document.addEventListener('DOMContentLoaded', async () => {
  const provinciaSelect = document.getElementById('provinciaSelect');
  const localidadSelect = document.getElementById('localidadSelect');

  // Función para cargar localidades dado un Id de provincia y seleccionar una localidad (opcional)
  async function cargarLocalidades(provinciaId, localidadSeleccionada = null) {
    localidadSelect.innerHTML = '<option value="">Seleccione una localidad</option>';
    if (!provinciaId) return;

    try {
      const response = await fetch(`/localidades/provincia/${provinciaId}`);
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      const localidades = await response.json();

      localidades.forEach(localidad => {
        const option = document.createElement('option');
        option.value = localidad.Id;
        option.textContent = localidad.Nombre;
        if (localidadSeleccionada && localidad.Id === localidadSeleccionada) {
          option.selected = true;
        }
        localidadSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar localidades:', error);
    }
  }

  // Escuchar cambio de provincia
  provinciaSelect.addEventListener('change', () => {
    cargarLocalidades(provinciaSelect.value);
  });

  // Al cargar la página, si hay provincia y localidad seleccionada, cargar localidades y seleccionar localidad
  const provinciaSeleccionada = provinciaSelect.value;
  // Se puede pasar el id de localidad almacenado en un atributo data del select de localidad o en otro campo oculto
  const localidadSeleccionada = localidadSelect.getAttribute('data-selected') 
    ? parseInt(localidadSelect.getAttribute('data-selected')) 
    : null;

  if (provinciaSeleccionada) {
    await cargarLocalidades(provinciaSeleccionada, localidadSeleccionada);
  }
});
