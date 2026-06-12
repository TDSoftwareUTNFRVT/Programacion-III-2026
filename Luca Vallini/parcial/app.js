async function cargarAutores(input, selector, paginaActual, resultsContainer, api){
    const query = input.value;
    const page = paginaActual.textContent;
    const limit = selector.value;


    const authors = await api.fetchAuthors(query, page, limit);
    resultsContainer.innerHTML = '';

    authors.forEach(async author => {
        const photoUrl = await api.fetchImg(author.key);
        const authorCardElement = document.createElement('author-card');
        authorCardElement.setAttribute('name', author.name);
        authorCardElement.setAttribute('birth-year', author.birth_date);
        authorCardElement.setAttribute('top-work', author.top_work);
        
        if(photoUrl){
            authorCardElement.setAttribute('photo-url', photoUrl);
        }

        resultsContainer.appendChild(authorCardElement);
    });
}

async function buscar(){
    const input = document.getElementById('buscar');
    const selector = document.getElementById('paginas');
    const paginaActual = document.getElementById('paginaActual');
    const resultsContainer = document.getElementById('results');
    const api = new Api();

    input.addEventListener('input', () => cargarAutores(input, selector, paginaActual, resultsContainer, api));
    selector.addEventListener('change', () => cargarAutores(input, selector, paginaActual, resultsContainer, api));
    paginacion.addEventListener('click', () => cargarAutores(input, selector, paginaActual, resultsContainer, api));
}

buscar();
