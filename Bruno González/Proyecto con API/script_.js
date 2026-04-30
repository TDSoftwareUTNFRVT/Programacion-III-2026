document.addEventListener("DOMContentLoaded", async () => {
    const header_1 = document.querySelector('#header-1');

    header_1.classList.add('header');

    const contenedor_general = document.querySelector('#contenedor-general');

    contenedor_general.classList.add('wrapper', 'fdc');

    const contenedor_escudo = document.querySelector('#contenedor-escudo');

    contenedor_escudo.classList.add('contenedor', 'custom-size-1');

    const contenedor_info_desc = document.querySelector('#contenedor-info-desc');

    contenedor_info_desc.classList.add('contenedor', 'fdc');

    const contenedor_info = document.querySelector('#contenedor-info');

    contenedor_info.classList.add('contenedor', 'custom-size-3');

    const contenedor_descripcion = document.querySelector('#contenedor-desc');

    contenedor_descripcion.classList.add('contenedor', 'info-box', 'fdr');

    const contenedor_pagina = document.querySelector('#contenedor-page');

    contenedor_pagina.classList.add('contenedor', 'custom-size-2', 'fdc');

    const contenedor_redes_sociales = document.querySelector('#contenedor-rs');

    contenedor_redes_sociales.classList.add('contenedor', 'custom-size-2', 'fdr');

    const contenedor_titulo_jugadores = document.querySelector('#contenedor-titulo-jugadores');

    contenedor_titulo_jugadores.classList.add('contenedor');

    const contenedor_jugadores = document.querySelector('#contenedor-jugadores');

    contenedor_jugadores.classList.add('contenedor', 'fdc', 'small-gap');

    const titulo_jugadores = document.querySelector('#titulo-jugadores');

    titulo_jugadores.classList.add('title', 'title-glow');

    async function ObtenerEquipos() {
        const url = 'https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=Boca%20Juniors';

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Falló la petición:', error.message);
            throw error;
        }
    }

    const equipos_boca = await ObtenerEquipos();
    const data_boca = equipos_boca.teams[0];

    function MostrarNombreDelEquipo() {
        const nombre_equipo = data_boca.strTeamAlternate;
        header_1.innerHTML = `<h1 class="title">${nombre_equipo}</h1>`;
    }

    function MostrarEscudo() {
        const escudo_imagen = data_boca.strBadge;
        contenedor_escudo.innerHTML = `<img src="${escudo_imagen}">`;
    }

    function MostrarInfo() {
        const descripcion = data_boca.strDescriptionES;
        const fundacion = data_boca.intFormedYear;
        const estadio = data_boca.strStadium;
        const capacidad_estadio = data_boca.intStadiumCapacity;
        const ubicacion = data_boca.strLocation;
        contenedor_descripcion.innerHTML = `<p class="p">${descripcion}</p>`;

        contenedor_info.innerHTML = `<h2 class="title title-glow">Fundado en: ${fundacion}</h2>
                                    <h2 class="title title-glow">Estadio: ${estadio}</h2>
                                    <h2 class="title title-glow">Capacidad: ${capacidad_estadio} personas</h2>
                                    <h2 class="title title-glow">Ubicación: ${ubicacion}, Argentina</h2>`;
        
    }

    function MostrarPagina() {
        const pagina = data_boca.strWebsite;
        const boca_logo = data_boca.strBadge;

        contenedor_pagina.innerHTML = `<h2 class="title title-glow">Página oficial</h2>
                                        <button class="button">
                                            <a href="https://${pagina}" target="_blank">
                                                <img src="${boca_logo}">
                                            </a>
                                        </button>`;
    }

    function MostrarRedesSociales() {
        const facebook = data_boca.strFacebook;
        const twitter = data_boca.strTwitter;

        contenedor_redes_sociales.innerHTML = `<div class="contenedor fdc small-gap">
                                                <h2 class="title title-glow">Redes Sociales</h2>
                                                <div class="contenedor fdr">
                                                    <button class="button custom-margin">
                                                    <a href="https://${facebook}" target="_blank">
                                                        <img src="imagenes/facebook_logo.png">
                                                    </a></button>
                                                    <button class="button custom-margin">
                                                    <a href="https://${twitter}" target="_blank">
                                                        <img src="imagenes/twitter_logo.png">
                                                    </a></button>
                                                </div>
                                            </div>`;
    }

    async function MostrarJugadores() {
        const url = 'https://www.thesportsdb.com/api/v1/json/123/lookup_all_players.php?id=135156';

        const response = await fetch(url);

        const data = await response.json();

        const jugadores = data.player.slice(0, 8)

        contenedor_jugadores.innerHTML = jugadores.map(j => `
                                                        <div class="contenedor fdr small-gap">
                                                            <div class="contenedor player-size fdc small-gap">
                                                                <img src="${j.strCutout}" class="player-img">
                                                                <div class="contenedor fdc small-gap">
                                                                    <h2 class="title title-glow">Nombre: ${j.strPlayer}</h2>
                                                                    <h2 class="title title-glow">Nacimiento: ${j.dateBorn}</h2>
                                                                    <h2 class="title title-glow">Nacionalidad: ${j.strNationality}</h2>
                                                                </div>
                                                            </div>
                                                        </div>`).join('');
    }

    MostrarNombreDelEquipo();
    MostrarEscudo();
    MostrarInfo();
    MostrarPagina();
    MostrarRedesSociales();

    MostrarJugadores();
});