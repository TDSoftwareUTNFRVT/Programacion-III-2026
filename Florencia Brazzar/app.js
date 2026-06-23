const URL = 'https://musicbrainz.org/ws/2/artist/?query={query}&offset={offset}&limit={limit}&fmt=json';
const resultsContainer = document.getElementById('results');
const searchInput = document.getElementById('busqueda');
const searchButton = document.getElementById('buscar');
const limitSelect = document.getElementById('opciones');
const previousButton = document.getElementById('anterior');
const nextButton = document.getElementById('siguiente');
const pageInfo = document.getElementById('page-info');

let currentPage = 1;
let currentQuery = '';
let currentLimit = Number(limitSelect.value) || 5;
let totalResults = 0;




class ArtistCard extends HTMLElement {
    static get observedAttributes() {
        return ['name', 'country', 'type', 'score'];
    }
    constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const name = this.getAttribute('name') || 'Unknown Artist';
    const country = this.getAttribute('country') || 'Unknown Country';
    const type = this.getAttribute('type') || 'Unknown Type';
    const score = this.getAttribute('score') || 'No Score';
    };
}
    this.shadowRoot.innerHTML = ` <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
        <div><stong>Name:</strong> ${name}</div>
        <div><strong>Country:</strong> ${country}</div>
        <div><strong>Type:</strong> ${type}</div>
        <div><strong>Score:</strong> ${score}</div>
        </div>
        `;
    
customElements.define('artist-card', ArtistCard);


async function searchArtists(query, limit = 5, offset = 0) {
    
    const url = URL.replace('{query}', encodeURIComponent(query))
                    .replace('{limit}', limit)
                    .replace('{offset}', offset);
    const response = await fetch(url);
    const data = await response.json();
    return data.artists;
}

class artistapi {
    async getapi(query, offset = 0, limit = 5) {
        contenedor_resultados.textContent = 'Buscando...';

        try {

            const response = await fetch(`https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}&fmt=json`);

            if (!response.ok) {
                throw new Error(`Error ${response.statusText}: ${response.status}`);
            }

            const data = await response.json();

            contenedor_resultados.textContent = '';

            return data;

        } catch (error) {
            console.error(`Falló la petición: ${error.message}`);
            contenedor_resultados.textContent = `Ha ocurrido un fallo durante la búsqueda: [${error.message}]`;
            throw error;
        }
    }
}


async function searchArtists() {
    resultsContainer.innerHTML = '';
    
    currentLimit = Number(limitSelect.value);

    const artists = await searchArtists(currentQuery, currentLimit, (currentPage - 1) * currentLimit);  

    artists.forEach(artist => {
        const artistCard = document.createElement('artist-card');

        artistCard.setAttribute('name', artist.name || 'Nombre no encontrado');
        artistCard.setAttribute('country', artist.country || 'País no encontrado');
        artistCard.setAttribute('type', artist.type || 'Tipo no encontrado');
        artistCard.setAttribute('score', artist.score || 'Puntaje no disponible');
        resultsContainer.appendChild(artistCard);
    });

    const total_pages = Math.ceil(totalResults / currentLimit);
        if (total_pages > 0) {
            pageInfo.textContent = `Página ${currentPage} de ${total_pages}`;
        }

searchButton.addEventListener('click', async () => {
    currentPage = 1;
    await searchArtists(currentPage);
});

previousButton.addEventListener('click', async () => {
    if (currentPage > 1) {
        currentPage--;
        await searchArtists(currentPage);
    }
});

nextButton.addEventListener('click', async () => {
    if (currentPage * currentLimit < totalResults) {
        currentPage++;
        await searchArtists(currentPage);
    }
});

} 