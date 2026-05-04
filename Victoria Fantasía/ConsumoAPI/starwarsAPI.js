document.addEventListener('DOMContentLoaded', function () {
    async function fetchContent(categoria) {
        try {
            const response = await fetch(`https://swapi.online/api/${categoria}`);

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            console.log(data);

            return data;
        } catch (error) {
            console.error(`Error fetching ${categoria}:`, error);
            return null;
        }
    }

    async function searchFilms() {
        const contenedor = document.getElementById('results-container');
        contenedor.innerHTML = "Cargando películas...";

        try {
            const data = await fetchContent('films');

            console.log("Estructura de datos de películas:", data);

            const films = Array.isArray(data) ? data : data.results;

            contenedor.innerHTML = "";

            films.forEach(film => {
                const cardCharacter = document.createElement('div');

                cardCharacter.classList.add('result-card');
                cardCharacter.classList.add('text-nunito');
                cardCharacter.classList.add('text-white');
                cardCharacter.classList.add('grey-background');

                cardCharacter.innerHTML += `
                    <div>
                        <h2>${film.title}</h2>
                        <p>Episodio: ${film.episode_id === 0 ? "Película extra, no cuenta como episodio" : film.episode_id}</p>
                        <p>Director: ${film.director}</p>
                        <p>Fecha de estreno: ${film.release_date}</p>
                        <p>Mensaje de apertura: ${film.opening_crawl}</p>
                    </div>
                `;

                contenedor.appendChild(cardCharacter);
            });

        } catch (error) {
            contenedor.innerHTML = "Error al cargar las películas.";
            console.error("Error buscando películas:", error);
        }
    }

    document.querySelector('#films-button').addEventListener('click', searchFilms);

});