class Api{
    constructor(){
        this.authorBaseUrl = `https://openlibrary.org/search/authors.json`;
        this.imageBaseUrl = `https://covers.openlibrary.org/a/olid/`;
    }
    async fetchAuthors(query, page, limit){
        try {
            const url = `${this.authorBaseUrl}?q=${query}}&page=${page}&limit=${limit}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.docs;
        } catch (error) {
            console.error('Error fetching authors:', error);
            return [];
        }
    }

    async fetchImg(key){
        const url = `${this.imageBaseUrl}${key}-M.jpg`;
        return url;
    }
}
const paginacion = document.getElementById('pagination');
let contador = 1;
paginacion.innerHTML = `
    <button id='btnAtras' class="btn">Anterior</button>
    <p>Página <span id='paginaActual'>${contador}</span></p>
    <button class="btn">Siguiente</button>
    `;

const btnAnterior = document.getElementById('btnAtras')

function actualizarPaginacion(){
    const span = document.getElementById('paginaActual');
    span.textContent = contador;
    btnAnterior.disabled = contador === 1;
}
actualizarPaginacion();

paginacion.addEventListener('click', (e)=>{
    if(e.target.classList.contains('btn')){
        if(e.target.textContent === 'Siguiente'){
            contador++;
        } else {
            contador--;
        }
        if(contador < 1){
            contador = 1;
        }
        actualizarPaginacion();
    }
})
