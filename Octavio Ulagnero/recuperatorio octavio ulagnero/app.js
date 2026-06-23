class ArtistCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }

  render() {
    const name = this.getAttribute("name") || "Nombre desconocido";
    const countryArt = this.getAttribute("country") || "Pais desconocido";
    const typeArt = this.getAttribute("type") || "Sin dato";
    const scoreArt = this.getAttribute("score") || "";


    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, Helvetica, sans-serif;
        }

        .card {
          background-color: #fff;
          border: 1px solid #b6b3b3;
          border-radius: 4px;
          padding: 15px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        h3 {
          margin: 0 0 5px 0;
          font-size: 1.05rem;
          color: #060708;
        }

        p {
          margin: 3px 0;
          font-size: 0.9rem;
          color: #0a0a0a;
        }

        .label {
          font-weight: bold;
          color: #070707;
        }
      </style>

      <div class="card">
        <h3>${name}</h3>
        <p><span class="label">Pais de origen:</span> ${countryArt}</p>
        <p><span class="label">Tipo:</span> ${typeArt}</p>
        <p><span class="label">Relevancia:</span> ${scoreArt}</p>
      </div>
    `;
  }
}

customElements.define("artist-card", ArtistCard);

const busquedaTexto = document.getElementById("busqueda-texto");
const limitSelector = document.getElementById("selector");
const buscarBtn = document.getElementById("btn-buscar");
const limpiarBtn = document.getElementById("btn-limpiar");
const resultsDiv = document.getElementById("results");
const paginationDiv = document.getElementById("pagination");


let currentPage = 1;
let currentQuery = "";
let totalPages = 1;

buscarBtn.addEventListener("click", () => {
  currentQuery = busquedaTexto.value.trim();
  currentPage = 1;

  if (currentQuery === "") {
    resultsDiv.innerHTML = `<p class="status-message">Escribí el nombre de un artista para buscar.</p>`;
    paginationDiv.innerHTML = "";
    return;
  }

  buscarArtistas();
});


limpiarBtn.addEventListener("click", () => {
  busquedaTexto.value = "";
  resultsDiv.innerHTML = "";
  paginationDiv.innerHTML = "";
  currentQuery = "";
  currentPage = 1;
});

limitSelector.addEventListener("change", () => {
  if (currentQuery !== "") {
    currentPage = 1;
    buscarArtistas();
  }
});

async function buscarArtistas() {
  const limit = limitSelector.value;
  const offset = (currentPage - 1) * limit;

  resultsDiv.innerHTML = `<p class="status-message">Buscando...</p>`;
  paginationDiv.innerHTML = "";

  const url = `https://musicbrainz.org/ws/2/artist/?query=${currentQuery}&offset=${offset}&limit=${limit}&fmt=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

   
    renderResultados(data.artists);
    calcularPaginacion(data.count || 0, limit);

  } catch (error) {
    resultsDiv.innerHTML = `<p class="status-message">Ocurrió un error al conectar con la API. Intentá más tarde.</p>`;
  }
}

function renderResultados(artistas) {
  resultsDiv.innerHTML = "";

  if (!artistas || artistas.length === 0) {
    resultsDiv.innerHTML = `<p class="status-message">No se encontraron resultados para esa búsqueda.</p>`;
    return;
  }

  artistas.forEach((artista) => {
    const card = document.createElement("artist-card");

    card.setAttribute("name", artista.name || "Sin nombre");
    card.setAttribute("country", artista.country || "Sin dato");
    card.setAttribute("type", artista.type || "Sin dato");
    card.setAttribute("score", artista.score || "Sin dato");
    resultsDiv.appendChild(card);
  });
}

function calcularPaginacion(numFound, limit) {
  totalPages = Math.max(1, Math.ceil(numFound / limit));

  paginationDiv.innerHTML = "";

  if (numFound === 0) {
    return;
  }

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Anterior";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      buscarArtistas();
    }
  });

  const pageInfo = document.createElement("span");
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Siguiente";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      buscarArtistas();
    }
  });

  paginationDiv.appendChild(prevBtn);
  paginationDiv.appendChild(pageInfo);
  paginationDiv.appendChild(nextBtn);
}