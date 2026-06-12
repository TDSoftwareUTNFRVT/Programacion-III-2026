
class BookCard extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['title', 'author', 'year', 'cover-url'];
  }

  attributeChangedCallback() { 
    this.render(); 
  }
  connectedCallback()        { 
    this.render(); 
  }

  render() {
    const title = this.getAttribute('title') || 'Sin título';
    const author = this.getAttribute('author') || 'Desconocido';
    const year = this.getAttribute('year') || 'S/F';
    const coverUrl = this.getAttribute('cover-url') || 'https://via.placeholder.com/100x140?text=N/A';

    this._shadow.innerHTML = `
      <style>
        .card { border: 1px solid #ccc; border-radius: 6px; padding: 0.5rem; width: 150px; }
        img   { width: 100%; height: 140px; object-fit: cover; }
        p     { margin: 0.25rem 0; font-size: 0.85rem; }
        .title { font-weight: bold; }
      </style>
      <div class="card">
        <img src="${coverUrl}" alt="${title}" />
        <p class="title">${title}</p>
        <p>${author}</p>
        <p>${year}</p>
      </div>
    `;
  }
}

customElements.define('book-card', BookCard);

let currentPage  = 1;
let totalPages   = 1;
let currentQuery = '';
let currentLimit = 10;


const buscadorInput = document.getElementById('query');
const limitSelect = document.getElementById('limit');
const btnSearch  = document.getElementById('btn-search');

const resultsDiv = document.getElementById('results');
const btnPrev    = document.getElementById('btn-prev');
const btnNext    = document.getElementById('btn-next');
const pageInfo   = document.getElementById('page-info');


btnSearch.addEventListener('click', () => {
  currentPage  = 1;
  currentQuery = buscadorInput.value.trim();
  currentLimit = parseInt(limitSelect.value);
  fetchBooks();
});

btnClear.addEventListener('click', () => {
  buscadorInput.value     = '';
  resultsDiv.innerHTML = '';
  pageInfo.textContent = '';
  btnPrev.disabled = true;
  btnNext.disabled = true;
});

btnPrev.addEventListener('click', () => { 
  currentPage--; fetchBooks(); 
});
btnNext.addEventListener('click', () => {
   currentPage++; fetchBooks(); 
});

limitSelect.addEventListener('change', () => {
  if (!currentQuery) return;
  currentPage  = 1;
  currentLimit = parseInt(limitSelect.value);
  fetchBooks();
});


async function fetchBooks() {
  if (!currentQuery) return;

  resultsDiv.innerHTML = '<p>Buscando...</p>';
  btnPrev.disabled = true;
  btnNext.disabled = true;
  pageInfo.textContent = '';

  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(currentQuery)}&page=${currentPage}&limit=${currentLimit}`;

  try {
    const res  = await fetch(url);
    const data = await res.json();
    const { docs, numFound } = data;

    if (numFound === 0) {
      resultsDiv.innerHTML = '<p>No se encontraron resultados para esa búsqueda.</p>';
      return;
    }

    totalPages = Math.ceil(numFound / currentLimit);
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    btnPrev.disabled = currentPage <= 1;
    btnNext.disabled = currentPage >= totalPages;

    resultsDiv.innerHTML = '';
    for (const doc of docs) {
      const card = document.createElement('book-card');
      card.setAttribute('title', doc.title || '');
      card.setAttribute('author', doc.author_name?.[0] || '');
      card.setAttribute('year', doc.first_publish_year || '');
      card.setAttribute('cover-url', doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : '');
      resultsDiv.appendChild(card);
    }

  } catch (error) {
    resultsDiv.innerHTML = '<p>Ocurrió un error al consultar la API. Intentá más tarde.</p>';
  }
}
