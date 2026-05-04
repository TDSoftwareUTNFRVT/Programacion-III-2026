const API_KEY = '3cc9285589111a0383962f7b4614a47a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let debounceTimer = null;

async function getPeliculas(query = null) {
    const container = document.getElementById('card');
    container.innerHTML = '<p class="vacio">Cargando...</p>';

    try {
        const url = query
            ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=es-AR`
            : `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-AR`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();

        mostrarPeliculas(data.results.slice(0, 5));
    } catch (error) {
        console.error('Algo salió mal:', error);
        container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

function mostrarPeliculas(lista) {
    const container = document.getElementById('card');

    if (!lista || lista.length === 0) {
        container.innerHTML = '<p class="vacio">No se encontraron resultados.</p>';
        return;
    }

    container.innerHTML = lista.map(pelicula => {
        const poster = pelicula.poster_path
            ? `${IMG_URL}${pelicula.poster_path}`
            : 'https://via.placeholder.com/300x450?text=Sin+imagen';

        const fecha = pelicula.release_date
            ? pelicula.release_date.split('-')[0]
            : 'N/D';

        const puntuacion = pelicula.vote_average
            ? `⭐ ${pelicula.vote_average.toFixed(1)}`
            : 'N/D';

        return `
            <div class="card">
                <img src="${poster}" alt="${pelicula.title}">
                <div class="card-body">
                    <h2>${pelicula.title}</h2>
                    <p><span class="label">Año:</span> ${fecha}</p>
                    <p><span class="label">Puntuación:</span> ${puntuacion}</p>
                    <p class="overview">${pelicula.overview ? pelicula.overview.slice(0, 100) + '...' : 'Sin descripción.'}</p>
                </div>
            </div>
        `;
    }).join('');
}

document.getElementById('buscador').addEventListener('input', (e) => {
    const texto = e.target.value.trim();
    clearTimeout(debounceTimer);

    if (texto === '') {
        getPeliculas();
        return;
    }

    debounceTimer = setTimeout(() => {
        getPeliculas(texto);
    }, 500);
});

getPeliculas();