document.addEventListener("DOMContentLoaded", function () {
  const tablas = document.querySelectorAll("table.filtrable");

  tablas.forEach((tabla) => {
    const thead = tabla.querySelector("thead");
    const encabezados = thead.querySelectorAll("tr:first-child th");
    const cuerpo = tabla.querySelector("tbody");
    const filaFiltros = document.createElement("tr");
    const filtros = [];

    encabezados.forEach((th, index) => {
      const celdaFiltro = document.createElement("th");
      const nombreColumna = th.textContent.trim();
      const nombreColumnaLower = nombreColumna.toLowerCase();
      const esID = nombreColumna === "ID";
      const esBooleano =
        nombreColumnaLower === "activo" ||
        nombreColumnaLower === "administrador";
      const esFecha = nombreColumnaLower.includes("fecha");
      const esPrecio = nombreColumnaLower.includes("precio");
      const esStock = nombreColumnaLower.includes("stock");

      // Excluir columnas específicas
      if (esID || esPrecio || esStock) {
        filtros[index] = "";
        filaFiltros.appendChild(celdaFiltro);
        return;
      }

      if (esBooleano) {
        const select = document.createElement("select");
        select.classList.add("filtro-tabla");

        ["Todos", "Sí", "No"].forEach((val) => {
          const option = document.createElement("option");
          option.value = val.toLowerCase();
          option.textContent = val;
          select.appendChild(option);
        });

        filtros[index] = "";

        select.addEventListener("change", function () {
          filtros[index] = this.value === "todos" ? "" : this.value;
          aplicarFiltros();
        });

        celdaFiltro.appendChild(select);
      } else if (esFecha) {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.flexDirection = "column";

        const inputDesde = document.createElement("input");
        inputDesde.type = "date";
        inputDesde.classList.add("filtro-tabla");

        const inputHasta = document.createElement("input");
        inputHasta.type = "date";
        inputHasta.classList.add("filtro-tabla");

        filtros[index] = { desde: "", hasta: "" };

        inputDesde.addEventListener("change", function () {
          filtros[index].desde = this.value;
          aplicarFiltros();
        });

        inputHasta.addEventListener("change", function () {
          filtros[index].hasta = this.value;
          aplicarFiltros();
        });

        div.appendChild(inputDesde);
        div.appendChild(inputHasta);
        celdaFiltro.appendChild(div);
      } else {
        const valoresUnicos = new Set();
        cuerpo.querySelectorAll("tr").forEach((fila) => {
          const celda = fila.children[index];
          if (celda) valoresUnicos.add(celda.textContent.trim());
        });

        const select = document.createElement("select");
        select.classList.add("filtro-tabla");

        const optionTodos = document.createElement("option");
        optionTodos.value = "";
        optionTodos.textContent = "Todos";
        select.appendChild(optionTodos);

        Array.from(valoresUnicos)
          .sort((a, b) => a.localeCompare(b))
          .forEach((valor) => {
            const option = document.createElement("option");
            option.value = valor.toLowerCase();
            option.textContent = valor;
            select.appendChild(option);
          });

        filtros[index] = "";

        select.addEventListener("change", function () {
          filtros[index] = this.value;
          aplicarFiltros();
        });

        celdaFiltro.appendChild(select);
      }

      filaFiltros.appendChild(celdaFiltro);
    });

    thead.appendChild(filaFiltros);

    // Botón limpiar filtros
    const botonLimpiar = document.createElement("button");
    botonLimpiar.textContent = "Limpiar Filtros";
    botonLimpiar.style.margin = "10px 0";
    botonLimpiar.addEventListener("click", function () {
      filtros.forEach((filtro, i) => {
        const celda = filaFiltros.children[i];
        const input = celda?.querySelector("input");
        const inputs = celda?.querySelectorAll("input");
        const select = celda?.querySelector("select");

        if (typeof filtro === "string") {
          filtros[i] = "";
          if (select) select.value = "";
        } else if (typeof filtro === "object" && filtro.desde !== undefined) {
          filtros[i] = { desde: "", hasta: "" };
          if (inputs) {
            inputs.forEach((inp) => (inp.value = ""));
          }
        }
      });

      aplicarFiltros();
    });

    tabla.parentElement.insertBefore(botonLimpiar, tabla);

    function aplicarFiltros() {
      const filas = cuerpo.querySelectorAll("tr");

      filas.forEach((fila) => {
        const celdas = fila.querySelectorAll("td");
        let visible = true;

        filtros.forEach((filtro, i) => {
          if (!visible || !celdas[i]) return;

          const texto = celdas[i].textContent.trim().toLowerCase();

          if (typeof filtro === "string") {
            if (filtro && texto !== filtro) {
              visible = false;
            }
          } else if (typeof filtro === "object" && filtro.desde !== undefined) {
            const fechaCelda = texto.replace(/\//g, "-");
            const fecha = new Date(fechaCelda);
            const desde = filtro.desde ? new Date(filtro.desde) : null;
            const hasta = filtro.hasta ? new Date(filtro.hasta) : null;

            if ((desde && fecha < desde) || (hasta && fecha > hasta)) {
              visible = false;
            }
          }
        });

        fila.style.display = visible ? "" : "none";
      });
    }
  });
});
