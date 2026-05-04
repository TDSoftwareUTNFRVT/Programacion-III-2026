document.addEventListener("DOMContentLoaded", () => {
    const contenedor_general = document.querySelector('#general-wrapper');

    contenedor_general.classList.add('general-wrapper');

    const contenedor_menu = document.querySelector('#contenedor-menu');

    contenedor_menu.classList.add('contenedor', 'background-settings', 'fdc', 'full-size', 'bg-img-1');

    const titulo_1 = document.querySelector('#titulo-1');

    titulo_1.classList.add('title');

    const titulo_2 = document.querySelector('#titulo-2');

    titulo_2.classList.add('title');

    const contenedor_jugador_resultados = document.querySelector('#contenedor-jugador-resultados');

    contenedor_jugador_resultados.classList.add('contenedor', 'background-settings', 'full-size', 'fdr', 'bg-img-1');

    const contenedor_buscar_jugador = document.querySelector('#contenedor-buscar-jugador');

    contenedor_buscar_jugador.classList.add('contenedor', 'fdc', 'medium-panel');

    const entrada_texto_1 = document.querySelector('#input-text-1');

    entrada_texto_1.classList.add('input-text');

    const contenedor_resultado_jugador = document.querySelector('#contenedor-resultado-jugador');

    contenedor_resultado_jugador.classList.add('contenedor', 'fdc', 'medium-panel');

    const resultado_jugador = document.querySelector('#resultado-jugador');

    resultado_jugador.classList.add('contenedor', 'result-displayer', 'fdc');

    let timeout;

    async function BuscarJugador() {
        const nombre = entrada_texto_1.value;
        if(nombre){
            const url = `https://www.thesportsdb.com/api/v1/json/123/searchplayers.php?p=${nombre}`;

            try {
                const response = await fetch(url);

                if(!response.ok){
                    throw new Error(`${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                const jugador = data.player[0];

                console.log(jugador);

                if(jugador) {
                    resultado_jugador.innerHTML = `<img class="img-1" src="${jugador.strCutout}">
                                                    <h2 class="title">Nombre: ${jugador.strPlayer}</h2>
                                                    <h2 class="title">Nacionalidad: ${jugador.strNationality}</h2>
                                                    <h2 class="title">Nacimiento: ${jugador.dateBorn}</h2>
                                                    <h2 class="title">Equipo: ${jugador.strTeam}</h2>`;
                }

            } catch (error) {
                console.error('Falló la petición:', error.message);
                throw error;
            }
        }
    }

    entrada_texto_1.addEventListener('input', () => {
        clearTimeout(timeout);
        // (clearTimeout(timeout);): Cancela el temporizador si el usuario sigue escribiendo.
        timeout = setTimeout(BuscarJugador, 500);
        // (timeout = setTimeout(BuscarJugador, 500);): Programa un temporizador que ejecuta la función SOLO si el usuario deja de escribir por 500 milisegundos.
    });
});