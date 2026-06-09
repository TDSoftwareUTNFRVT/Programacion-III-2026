class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(query, page, limit) {
    const queryString = new URLSearchParams(query).toString();
    const response = await fetch(`${this.baseURL}${endpoint}${queryString ? `?${queryString}&page=${page}&limit=${limit}` : `?page=${page}&limit=${limit}`}`);
    if (!response.ok) throw new Error(response.status);
    return response.json();
  }
}
 fetch('https://openlibrary.org/search.json?q=harry+potter&page=1&limit=10')  .then(response => response.json())
  try {
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Ocurrió un error al conectar con la API. Intenta más tarde:', error);
  }
async function mostrarLibros() {
    try {
        const cats = await api.getCategorias();
        const select = document.getElementById('select-categoria');
        select.innerHTML += cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch (e) { console.error("Error categorías"); }
}


async function mostrarLibros() {
  const resultado = await api.get(`?q=${encodeURIComponent(query)}&page=1&limit=5`);
  const libro = resultado.data;
}


  const container = document.getElementById('container');

  libros.forEach(libro => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${libro.covers?.[0]}" alt="${libro.title}">
      <h2>${libro.title}</h2>
      <p>Autor: ${libro.author_name?.[0]}</p>
      <p>Año de publicación: ${libro.first_publish_year}</p>
      <p>URL de la portada: https://covers.openlibrary.org/b/id/${libro.covers?.[0]}-M.jpg</p>
    `;
    container.appendChild(card);
  });

const paginaAnteriorBtn = document.getElementById('paginaAnterior');
const paginaSiguienteBtn = document.getElementById('paginaSiguiente');

paginaAnteriorBtn.addEventListener('click', anteriorPagina);
paginaSiguienteBtn.addEventListener('click', siguientePagina);

const limpiarBtn = document.getElementById('limpiar');
limpiarBtn.addEventListener('click', limpiar);

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    buscar();
  }
  });

  document.getElementById('btn-buscar').addEventListener('click', async () => {
    const view = document.getElementById('dinamico-view');
    const inicio = document.getElementById('inicio-view');
    
    inicio.classList.add('d-none');
    view.classList.remove('d-none');
    view.innerHTML = '<h2>Buscando...</h2>';
    try {
        const query = document.getElementById('searchInput').value;
        const resultado = await api.get(`?q=${encodeURIComponent(query)}&page=1&limit=5`);

        const libros = resultado.docs;
        view.innerHTML = libros.map(libro => `
            <div class="card">
                <img src="${libro.cover_i ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg` : 'placeholder.jpg'}" alt="${libro.title}">
                <h2>${libro.title}</h2>
                <p>Autor: ${libro.author_name ? libro.author_name[0] : 'Desconocido'}</p>
                <p>Año de publicación: ${libro.first_publish_year || 'Desconocido'}</p>
            </div>
        `).join('');
    } catch (e) {
        view.innerHTML = '<h2>Error al buscar libros. Intenta más tarde.</h2>';
        console.error("Error al buscar libros:", e);
        numFound === 0 && (view.innerHTML = '<h2>No se encontraron resultados para esa búsqueda.</h2>');
    }
});

mostrarLibros();


