import { rangoAltura, debounce } from "./global.js";

const API_URL = "https://api.thedogapi.com";

const busquedaRazas = document.getElementById("buscador");
const ordenarXTamanio = document.getElementById("ordenar");
const listaRazas = document.getElementById("listaRazas");

let razasPerros = [];

async function getImageUrlById(imageId) {
  try {
    const res = await fetch(API_URL + `/v1/images/${imageId}`);
    if (!res.ok) throw new Error("Error al obtener imagen");
    const data = await res.json();
    return data.url;
  } catch {
    return null;
  }
}

async function getAllRazasConImagen() {
  try {
    const res = await fetch(API_URL+"/v1/breeds");
    if (!res.ok) throw new Error("Error al obtener razas");
    const data = await res.json();

    const promises = data.map(async (raza) => {
      if (raza.reference_image_id) {
        const url = await getImageUrlById(raza.reference_image_id);
        return { ...raza, image: { url } };
      }
      return raza;
    });

    return Promise.all(promises);
  } catch {
    return [];
  }
}

getAllRazasConImagen().then((data) => {
  razasPerros = data;
  renderizarRazas(razasPerros);
});

function renderizarRazas(lista) {
  listaRazas.innerHTML = "";

  if (lista.length === 0) {
    listaRazas.innerHTML = `
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
        <p class="text-muted fs-5">No hay resultados.</p>
      </div>`;
    return;
  }

  lista.forEach((raza) => {
    const div = document.createElement("div");
    div.className = "col mb-3";

    const imagenHTML = raza.image?.url
      ? `<img src="${raza.image.url}" class="card-img-top" alt="${raza.name}">`
      : `<div class="text-center text-muted" style="height: 180px; line-height: 180px;">Sin imagen</div>`;

    div.innerHTML = `
      <div class="card h-100">
        ${imagenHTML}
        <div class="card-body">
          <h5 class="card-title">${raza.name}</h5>
          <p class="card-text">${raza.temperament || "No disponible"}</p>
          <p class="card-text"><small class="text-muted">Origen: ${
            raza.origin || "Desconocido"
          }</small></p>
          <p class="card-text"><small class="text-muted">Altura: ${
            raza.height.metric
          } cm</small></p>
          <p class="card-text"><small class="text-muted">Tamaño: ${rangoAltura(
            raza.height.metric
          )}</small></p>
          <p class="card-text"><small class="text-muted">Peso: ${
            raza.weight.metric
          } kg</small></p>
          <p class="card-text"><small class="text-muted">Esperanza de vida: ${
            raza.life_span
          }</small></p>
        </div>
      </div>
    `;
    listaRazas.appendChild(div);
  });
}

function aplicarFiltros() {
  let resultado = [...razasPerros];

  const texto = busquedaRazas.value.trim().toLowerCase();
  if (texto) {
    resultado = resultado.filter(
      (r) =>
        r.name.toLowerCase().includes(texto) ||
        (r.origin && r.origin.toLowerCase().includes(texto)) ||
        (r.temperament && r.temperament.toLowerCase().includes(texto))
    );
  }

  const filtro = ordenarXTamanio.value;
  if (filtro) {
    resultado = resultado.filter((r) => {
      const categoria = rangoAltura(r.height.metric);
      return categoria.toLowerCase() === filtro;
    });
  }

  renderizarRazas(resultado);
}

busquedaRazas.addEventListener("input", debounce(aplicarFiltros, 400));
ordenarXTamanio.addEventListener("change", aplicarFiltros);



