// clase re bonita crear las tarjetas de autor 
class AutorCard extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'birth-year', 'top-work', 'photo-url'];
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
    const name = this.getAttribute('name') || 'Autor desconocido';
    const birthYear = this.getAttribute('birth-year') || 'Desconocido';
    const topWork = this.getAttribute('top-work') || 'No disponible';
    const photoUrl = this.getAttribute('photo-url') || '';
    // metedor de style re bonito para las tarjetas de autor
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: min(100%, 220px);
          color: #f7f1c7;
          font-family: Arial, sans-serif;
        }

        .card {
          border-radius: 24px;
          background: #2f3235;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
          overflow: hidden;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 36px rgba(0, 0, 0, 0.32);
        }

        .cover {
          width: 100%;
          min-height: 220px;
          object-fit: cover;
          background: linear-gradient(135deg, #3f4d67, #1f2226);
        }

        .content {
          padding: 1rem 1.2rem 1.4rem;
        }

        .name {
          margin: 0;
          font-size: 1.35rem;
          line-height: 1.1;
          color: #f8f4d2;
        }

        .meta {
          margin: 0.45rem 0 1rem;
          color: #cfc4a1;
          font-size: 0.95rem;
        }

        .label {
          display: inline-block;
          margin-bottom: 0.35rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #8c8d9b;
        }

        .top-work {
          margin: 0;
          color: #e9e3c9;
          font-size: 1rem;
          line-height: 1.4;
        }

        .fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 220px;
          background: #232528 url('img/utn.png') center / cover no-repeat;
          color: #a8a496;
          font-size: 0.95rem;
          text-align: center;
          padding: 1rem;
        }
      </style>
      <article class="card">
        <img class="cover" src="${photoUrl || 'img/.png'}" alt="Foto de ${name}" loading="lazy" onerror="if(this.src !== 'img/utn.png') { this.src='img/utn.png'; } else { this.style.display='none'; this.parentElement.querySelector('.fallback') && (this.parentElement.querySelector('.fallback').style.display='flex'); }" />
        ${!photoUrl ? '<div class="fallback"></div>' : ''}
        <div class="content">
          <h2 class="name">${name}</h2>
          <p class="meta"><span class="label">Año de nacimiento</span><br>${birthYear}</p>
          <p class="label">Trabajo destacado</p>
          <p class="top-work">${topWork}</p>
        </div>
      </article>
    `;
  }
}

customElements.define('autor-card', AutorCard);

// variables globales importantes para que funcione todo esto y no explote todo 
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

// función para extraer el año de nacimiento de esta gente
function parseBirthYear(dateString) {
    if (!dateString) return ''
    const match = dateString.match(/(\d{4})/)
    return match ? match[1] : dateString
}

function buildPhotoUrl(author) {
    if (Array.isArray(author.photos) && author.photos.length > 0) {
        return `https://covers.openlibrary.org/a/id/${author.photos[0]}-M.jpg`
    }

    if (author.key) {
        const olid = author.key.replace('/authors/', '').trim()
        return `https://covers.openlibrary.org/a/olid/${olid}-M.jpg`
    }

    return ''
}

function createAutorCard(author) {
    const card = document.createElement('autor-card')
    card.setAttribute('name', author.name || 'Autor desconocido')
    const birthYear = parseBirthYear(author.birth_date || author.birth_year)
    if (birthYear) card.setAttribute('birth-year', birthYear)
    if (author.top_work) card.setAttribute('top-work', author.top_work)
    const photoUrl = buildPhotoUrl(author)
    if (photoUrl) card.setAttribute('photo-url', photoUrl)
    return card
}

function showMessage(text) {
    resultsContainer.innerHTML = `<p class="loading">${text}</p>`
}

// funcioens para buscar autores en la API 
async function fetchAuthors(query, limit = 5, page = 1) {
    const url = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Open Library API error: ${response.status}`)
    const data = await response.json()
    return {
        docs: data.docs || [],
        numFound: data.numFound || 0
    }
}

function updatePageInfo() {
    pageInfo.textContent = `Página ${currentPage}`
    previousButton.disabled = currentPage <= 1
    nextButton.disabled = currentPage * currentLimit >= totalResults || totalResults === 0
}

async function searchAuthors(page = 1) {
    const query = searchInput.value.trim()
    if (!query) {
        showMessage('Ingrese un nombre o palabra clave para buscar autores')
        return
    }

    currentQuery = query
    currentLimit = Number(limitSelect.value) || 5
    currentPage = page

    showMessage('Buscando autores en Open Library...')
    try {
        const { docs, numFound } = await fetchAuthors(currentQuery, currentLimit, currentPage)
        totalResults = numFound

        if (!docs.length) {
            resultsContainer.innerHTML = ''
            showMessage('No se encontraron autores para esa búsqueda.')
            updatePageInfo()
            return
        }

        resultsContainer.innerHTML = ''
        docs.forEach(author => {
            resultsContainer.appendChild(createAutorCard(author))
        })
        updatePageInfo()
    } catch (error) {
        console.error(error)
        showMessage('Error al consultar Open Library. Revisa la consola.')
    }
}

// listeners re copados para que todo funcione al toque y no termine como river contra belgrano
searchButton.addEventListener('click', () => searchAuthors(1))
searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') searchAuthors(1)
})
previousButton.addEventListener('click', () => {
    if (currentPage > 1) searchAuthors(currentPage - 1)
})
nextButton.addEventListener('click', () => {
    if (currentPage * currentLimit < totalResults) searchAuthors(currentPage + 1)
})

limitSelect.addEventListener('change', () => {
    if (currentQuery) searchAuthors(1)
})
