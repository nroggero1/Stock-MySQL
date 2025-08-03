document.addEventListener("DOMContentLoaded", function () {
  const tablas = document.querySelectorAll("table.filtrable");

  tablas.forEach((tabla) => {
    const thead = tabla.querySelector("thead");
    const encabezados = thead.querySelectorAll("th");

    // Crear fila de filtros
    const filaFiltros = document.createElement("tr");

    encabezados.forEach((_, index) => {
      const celdaFiltro = document.createElement("th");
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Filtrar...";
      input.classList.add("filtro-tabla");

      input.addEventListener("input", function () {
        const valorFiltro = this.value.toLowerCase();
        const filas = tabla.querySelectorAll("tbody tr");

        filas.forEach((fila) => {
          const celda = fila.children[index];
          const contenido = celda.textContent.toLowerCase();
          fila.style.display = contenido.includes(valorFiltro) ? "" : "none";
        });
      });

      celdaFiltro.appendChild(input);
      filaFiltros.appendChild(celdaFiltro);
    });

    thead.appendChild(filaFiltros);
  });
});
