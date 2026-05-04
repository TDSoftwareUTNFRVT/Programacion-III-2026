let todosLosPaises = [];

async function getPaises() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        todosLosPaises = data;
        mostrarPaises(data.slice(0, 8)); 

    } catch (error) {
        console.error('Algo salió mal:', error);
        document.getElementById('card').innerHTML = `<p>Error: ${error.message}</p>`;
    }

}

function mostrarPaises(lista) {
    const container = document.getElementById('card');
    container.innerHTML = lista
            .map(pais => `
                <div class="card">
                    <h2>${pais.name.common}</h2>
                    <img src="${pais.flags.png}" alt="Bandera de ${pais.name.common}">
                    <p>Capital: ${pais.capital?.[0] ?? 'N/D'}</p>
                    <p>Continente: ${pais.region}</p>
                    <p>Población: ${pais.population}</p>
                </div>
            `)
            .join('');

    }


document.getElementById('buscador').addEventListener('input', (letra) => {
    const texto = letra.target.value.toLowerCase();
    const filtrados = todosLosPaises.filter(resp =>
        resp.name.common.toLowerCase().includes(texto)
    );
    mostrarPaises(filtrados);
});

getPaises();
