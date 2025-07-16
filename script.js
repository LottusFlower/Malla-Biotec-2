let asignaturas = [];
let aprobadas = new Set();

fetch('asignaturas.json')
  .then(res => res.json())
  .then(data => {
    asignaturas = data;
    renderMalla();
  });

function renderMalla() {
  const container = document.getElementById("malla-container");
  container.innerHTML = "";

  const maxSemestre = Math.max(...asignaturas.map(a => a.semestre));
  for (let s = 1; s <= maxSemestre; s++) {
    const columna = document.createElement("div");
    columna.className = "semestre";
    const titulo = document.createElement("h3");
    titulo.textContent = `Semestre ${s}`;
    columna.appendChild(titulo);

    asignaturas
      .filter(a => a.semestre === s)
      .forEach(asig => {
        const div = document.createElement("div");
        div.className = "asignatura";
        div.textContent = asig.nombre;
        div.title = `${asig.creditos} créditos`;

        if (aprobadas.has(asig.id)) {
          div.classList.add("aprobada");
        } else if (asig.prerrequisitos.every(req => aprobadas.has(req))) {
          div.classList.add("desbloqueada");
          div.onclick = () => {
            aprobadas.add(asig.id);
            renderMalla();
          };
        } else {
          div.classList.add("bloqueada");
        }

        columna.appendChild(div);
      });

    container.appendChild(columna);
  }
}

