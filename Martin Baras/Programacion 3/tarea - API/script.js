document.addEventListener("DOMContentLoaded", () => {
    const movie_name = document.querySelector("#movie-name");
    const movie_year = document.querySelector("#movie-year");
    const movie_filter = document.querySelector("#movie-filter");
    const movie_page = document.querySelector("#movie-page");
    const search_button = document.querySelector("#search-button");
    const billboards = document.getElementById("billboards");

    const api_key = "5ef0849d";

    function construirEndpoint() {
        let s = movie_name.value;
        let y = movie_year.value;
        let p = movie_page.value;

        return `https://www.omdbapi.com/?apikey=${api_key}&s=${s}&y=${y}&page=${p}`;
    }
    
    async function obtenerPeliculas() {
        try {
            let url = construirEndpoint();
            let response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            document.querySelector("#total-results").textContent = `Resultados totales: 0`;
            billboards.innerHTML = '<p style="color:white;font-size:140%">Sin resultados</p>';
            console.error(error);
        }
    }

    function crearPortadas(data) {
        if (data.Response === "False") {
            document.querySelector("#total-results").textContent = `Resultados totales: 0`;
            billboards.innerHTML = '<p style="color:white;font-size:140%">Sin resultados</p>';
            return;
        }

        const movies = data.Search;

        billboards.innerHTML = movies.map(m => `
            <div class="billboard bg-purple br8 of-hidden">
            <img src="${m.Poster}" class="b-poster">
            <div class="b-meta bg-gray flex flex-col align-items-flex-start">
            <div class="fz16 font-arial">Titulo: ${m.Title}</div>
            <div class="fz16 font-arial">Tipo: ${m.Type}</div>
            <div class="fz16 font-arial">Año: ${m.Year}</div>
            </div>
            </div>
            `).join('');
    }

    function cantidadResultados(data){
        document.querySelector("#total-results").textContent = `Resultados totales: ${data.totalResults}`;
    }

    search_button.addEventListener("click", async () => {
        let data = await obtenerPeliculas();
        crearPortadas(data);
        cantidadResultados(data);
    });
});