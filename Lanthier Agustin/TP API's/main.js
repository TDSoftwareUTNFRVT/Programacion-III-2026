const API_KEY = 'f6af7168abac49cfa86357bf278a6b3a';
const URL_BASE = 'https://api.rawg.io/api';

const categorias = [
    { nombre: 'Acción', slug: 'action' },
    { nombre: 'Aventura', slug: 'adventure' },
    { nombre: 'Deportes', slug: 'sports' },
    { nombre: 'Shooter', slug: 'shooter' },
    { nombre: 'Carreras', slug: 'racing' },
    { nombre: 'RPG', slug: 'role-playing-games-rpg' },
    { nombre: 'Estrategia', slug: 'strategy' },
];

function generarEstrellas(rating) {
    const totalEstrellas = 5;
    let estrellas = '';
    for (let i = 1; i <= totalEstrellas; i++) {
        if (i <= Math.floor(rating)) {
            estrellas += '★';
        } else if (i === Math.ceil(rating) && rating % 1 >= 0.5) {
            estrellas += '½';
        } else {
            estrellas += '☆';
        }
    }
    return estrellas;
}

async function obtenerJuegosPorCategoria(slug) {
    const respuesta = await fetch(`${URL_BASE}/games?key=${API_KEY}&genres=${slug}&page_size=20`);
    const datos = await respuesta.json();
    return datos.results;
}

async function obtenerDetalleJuego(id) {
    const respuesta = await fetch(`${URL_BASE}/games/${id}?key=${API_KEY}`);
    const datos = await respuesta.json();
    return datos;
}

async function obtenerJuegoDestacado() {
    const respuesta = await fetch(`${URL_BASE}/games?key=${API_KEY}&ordering=-rating&page_size=1`);
    const datos = await respuesta.json();
    return datos.results[0];
}

async function mostrarBanner() {
    const juego = await obtenerJuegoDestacado();

    document.getElementById('banner').style.backgroundImage = `url(${juego.background_image})`;
    document.getElementById('bannerNombre').textContent = juego.name;
    document.getElementById('bannerEstrellas').textContent = generarEstrellas(juego.rating);
    document.getElementById('bannerDescripcion').textContent = juego.description_raw || '';

    document.getElementById('bannerBoton').addEventListener('click', () => {
        mostrarDetalle(juego);
    });
}

function mostrarCategoria(nombre, juegos) {
    const contenido = document.getElementById('contenido');

    const fila = document.createElement('div');
    fila.classList.add('fila');

    fila.innerHTML = `<h2 class="tituloCategoria">${nombre}</h2>`;

    const contenedorCarrusel = document.createElement('div');
    contenedorCarrusel.classList.add('contenedorCarrusel');

    const btnIzquierda = document.createElement('button');
    btnIzquierda.classList.add('flechaScroll', 'izquierda');
    btnIzquierda.textContent = '❮';

    const btnDerecha = document.createElement('button');
    btnDerecha.classList.add('flechaScroll', 'derecha');
    btnDerecha.textContent = '❯';

    const carrusel = document.createElement('div');
    carrusel.classList.add('carrusel');

    juegos.forEach(juego => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${juego.background_image}" alt="${juego.name}" />
            <p>${juego.name}</p>
            <span class="estrellas">${generarEstrellas(juego.rating)}</span>
        `;
        card.addEventListener('click', () => mostrarDetalle(juego));
        carrusel.appendChild(card);
    });

    btnIzquierda.addEventListener('click', () => {
        carrusel.scrollBy({ left: -600, behavior: 'smooth' });
    });

    btnDerecha.addEventListener('click', () => {
        carrusel.scrollBy({ left: 600, behavior: 'smooth' });
    });

    contenedorCarrusel.appendChild(btnIzquierda);
    contenedorCarrusel.appendChild(carrusel);
    contenedorCarrusel.appendChild(btnDerecha);
    fila.appendChild(contenedorCarrusel);
    contenido.appendChild(fila);
}

async function mostrarDetalle(juego) {
    document.getElementById('cargando').classList.remove('oculto');

    const detalle = await obtenerDetalleJuego(juego.id);

    document.getElementById('imagenJuego').src = detalle.background_image || '';
    document.getElementById('nombreJuego').textContent = detalle.name;

    const info = document.getElementById('info');
    info.innerHTML = `
        <h4>Fecha de lanzamiento</h4>
        <p>${detalle.released || 'Sin fecha'}</p>

        <h4>Rating</h4>
        <p>${generarEstrellas(detalle.rating)} (${detalle.rating} / 5)</p>

        <h4>Géneros</h4>
        <p>${detalle.genres.map(g => g.name).join(', ')}</p>

        <h4>Plataformas</h4>
        <p>${detalle.platforms.map(p => p.platform.name).join(', ')}</p>

        <h4>Descripción</h4>
        <p>${detalle.description_raw || 'Sin descripción'}</p>
    `;

    document.getElementById('cargando').classList.add('oculto');
    document.getElementById('infoJuego').classList.add('activo');
}

const botonBuscar = document.getElementById('botonBuscar');
const inputBusqueda = document.getElementById('inputBusqueda');

botonBuscar.addEventListener('click', async () => {
    const nombre = inputBusqueda.value.trim();
    if (nombre === '') {
        document.getElementById('contenido').innerHTML = '';
        iniciar();
    } else {
        document.getElementById('cargando').classList.remove('oculto');
        const juegos = await buscarJuegos(nombre);
        document.getElementById('cargando').classList.add('oculto');
        document.getElementById('contenido').innerHTML = '';
        mostrarCategoria('Resultados de búsqueda', juegos);
    }
});

inputBusqueda.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') botonBuscar.click();
});

document.getElementById('botonCerrar').addEventListener('click', () => {
    document.getElementById('infoJuego').classList.remove('activo');
});

async function buscarJuegos(nombre) {
    const respuesta = await fetch(`${URL_BASE}/games?key=${API_KEY}&search=${encodeURIComponent(nombre)}&page_size=20`);
    const datos = await respuesta.json();
    return datos.results;
}

async function iniciar() {
    await mostrarBanner();
    for (const categoria of categorias) {
        const juegos = await obtenerJuegosPorCategoria(categoria.slug);
        mostrarCategoria(categoria.nombre, juegos);
    }
}

iniciar();