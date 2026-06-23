class ArtistCard extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const name = this.getAttribute('name') || 'Sin Nombre';
        const country = this.getAttribute('country') || 'País desconocido';
        const type = this.getAttribute('type') || 'S/F';
        const score = this.getAttribute('score') || '';

        shadow.innerHTML = `
        <style>
            div {
            border: 2px solid black;
            }
        </style>
        <div>
            <h1>${name}</h1>
            <p>Tipo: ${type}</p>
            <p>País de origen: ${country}</p>
            <p>Puntaje: ${score} </p>
        </div>
        `;
    }
}

customElements.define('artist-card', ArtistCard);

let paginaActual = 1;
let totalPaginas = 1;
let queryActual = '';
let limitActual = 10;


const inputBusqueda = document.getElementById('input-busqueda');
const selectCantidad = document.getElementById('select-cantidad');
const btnBuscar = document.getElementById('btn-buscar');
const btnLimpiar = document.getElementById('btn-limpiar');
const divResults = document.getElementById('results');
const divPagination = document.getElementById('pagination');

async function buscar() {
    console.log('estoy buscando..');
    divResults.innerHTML = '<p>Buscando...</p>';
    divPagination.innerHTML = '';
    const offset = (paginaActual - 1) * limitActual;

    const url = `https://musicbrainz.org/ws/2/artist/?query=${queryActual}&offset=${offset}&limit=${limitActual}&fmt=json`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const data = await res.json();
        const numFound = data.count || 0;
        const artists = data.artists || [];

        if (numFound === 0) {
            divResults.innerHTML = '<p> No se encontraron resultados</p>';
            return;
        }

        divResults.innerHTML = '';

        artists.forEach(artists => {
            const card = document.createElement('artist-card');
            card.setAttribute('name', artists.name || '');
            card.setAttribute('country', artists.country || '');
            card.setAttribute('type', artists.type || '');
            card.setAttribute('score', artists.score || '');
            divResults.appendChild(card);
        });
        totalPaginas = Math.ceil(numFound / limitActual);
        actualizarPaginacion();
    } catch (err) {
        divResults.innerHTML = '<p>Ocurrió un error al conectar con la API. Intentá más tarde.</p>';
    }
}

function actualizarPaginacion() {
    divPagination.innerHTML = '';

    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = 'Anterior';
    btnAnterior.disabled = (paginaActual === 1);
    btnAnterior.addEventListener('click', () => {
        paginaActual--;
        buscar();
    });

    const infoPagina = document.createElement('span');
    infoPagina.textContent = `Pagina ${paginaActual} de ${totalPaginas} `;

    const btnSiguiente = document.createElement('button');
    btnSiguiente.textContent = 'Siguiente';
    btnSiguiente.disabled = (paginaActual === totalPaginas);
    btnSiguiente.addEventListener('click', () => {
        paginaActual++;
        buscar();
    });
    divPagination.appendChild(btnAnterior);
    divPagination.appendChild(infoPagina);
    divPagination.appendChild(btnSiguiente);
}

btnBuscar.addEventListener('click', () => {
    queryActual = inputBusqueda.value.trim();
    limitActual = parseInt(selectCantidad.value);
    paginaActual = 1;

    if (!queryActual) {
        divResults.innerHTML = '<p> Ingresa un término de busqueda.</p>';
        return;
    }
    buscar();
});

selectCantidad.addEventListener('change', () => {
    if (!queryActual) return;
    limitActual = parseInt(selectCantidad.value);
    paginaActual = 1;
    buscar();
});

btnLimpiar.addEventListener('click', () => {
    divResults.innerHTML = '';
    divPagination.innerHTML = '';
    inputBusqueda.value = '';
    paginaActual = 1;
    totalPaginas = 1;
    queryActual = '';
    limitActual = parseInt(selectCantidad.value);
});



