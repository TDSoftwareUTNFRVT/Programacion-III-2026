let todosLosAnimes = [];
let debounceTimer = null;

async function getAnimes(query = 'top') {
    try {
        const url = query === 'top'
            ? 'https://api.jikan.moe/v4/top/anime?limit=5'
            : `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5&sfw=true`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        todosLosAnimes = data.data;
        mostrarAnimes(todosLosAnimes);
    } catch (error) {
        console.error('Algo salió mal:', error);
        document.getElementById('card').innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

function mostrarAnimes(lista) {
    const container = document.getElementById('card');

    if (lista.length === 0) {
        container.innerHTML = '<p class="vacio">No se encontraron resultados.</p>';
        return;
    }

    container.innerHTML = lista
        .map(anime => `
            <div class="card">
                <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
                <div class="card-body">
                    <h2>${anime.title}</h2>
                    <p><span class="label">Tipo:</span> ${anime.type ?? 'N/D'}</p>
                    <p><span class="label">Episodios:</span> ${anime.episodes ?? 'N/D'}</p>
                    <p><span class="label">Puntuación:</span> ${anime.score ? '⭐ ' + anime.score : 'N/D'}</p>
                    <p><span class="label">Estado:</span> ${anime.status ?? 'N/D'}</p>
                </div>
            </div>
        `)
        .join('');
}

document.getElementById('buscador').addEventListener('input', (e) => {
    const texto = e.target.value.trim();

    clearTimeout(debounceTimer);

    if (texto === '') {
        getAnimes('top');
        return;
    }

    debounceTimer = setTimeout(() => {
        getAnimes(texto);
    }, 500);
});

getAnimes();