import "../css/style.css";

const API_URL = "https://api.thedogapi.com/";

const randomContenedor = document.getElementById("random");
const botonRandom = document.getElementById("regenerar");

const randomDiv = document.getElementById("fichaPerro");
const botonFicha = document.getElementById("generar");

async function getPerritosRandom() {
  try {
    // Hago una peticion de TODAS las imagenes
    const res = await fetch(API_URL + "v1/images/search");
    const data = await res.json();

    console.log(data);
    const imagenPerrito = data[0].url;

    randomContenedor.innerHTML = `
      <div class="card mx-auto" style="max-width: 400px;">
        <img src="${imagenPerrito}" class="card-img-top" alt="Imagen-random-de-perro" />
      </div>
    `;
  } catch (error) {
    randomContenedor.textContent = "Error cargando el perrito :(";
    console.error("Error cargando perrito", error);
  }
}

botonRandom.addEventListener("click", getPerritosRandom);
getPerritosRandom();

async function getFichaPerrito() {
  try {
    const res = await fetch(API_URL + "/v1/breeds");
    const data = await res.json();
    console.log(data);

    const fichaRandom = data[Math.floor(Math.random() * data.length)];

    // En el DOM
    randomDiv.innerHTML = `
  <div class="card mx-auto" style="max-width: 400px;">
    <div class="card-body">
      <h5 class="card-title">${fichaRandom.name}</h5>
      <p class="card-text">${fichaRandom.temperament || "No disponible"}</p>
      <p class="card-text">
        <small class="text-muted">
          Origen: ${fichaRandom.origin || "Desconocido"}
        </small>
      </p>
    </div>
  </div>
`;
  } catch (error) {
    randomDiv.textContent = "Error al cargar ficha :(";
    console.error("Error al cargar ficha", error);
  }
}

botonFicha.addEventListener("click", getFichaPerrito);
