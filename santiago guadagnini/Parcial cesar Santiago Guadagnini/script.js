const resultados = document.getElementById('resultados');
const botonBuscar = document.getElementById('botonBuscar');
const busqueda = document.getElementById('busqueda');
const cantidad = document.getElementById('cantidad');
const paginacion = document.getElementById('paginacion');
const paginaInfo = document.getElementById('paginaInfo');

let paginaActual = 1;
let totalPaginas = 1;
let ultimoTextoBuscado = '';

function crearTarjeta(libro) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';

    let imagenUrl = 'https://via.placeholder.com/150x220?text=No+image';
    if (libro.cover_i) {
        imagenUrl = 'https://covers.openlibrary.org/b/id/' + libro.cover_i + '-M.jpg';
    }

    let autorTexto = 'Autor desconocido';
    if (libro.author_name && libro.author_name.length > 0) {
        autorTexto = libro.author_name[0];
    }

    let yearTexto = 'No disponible';
    if (libro.first_publish_year) {
        yearTexto = libro.first_publish_year;
    }

    const contenido = document.createElement('div');
    contenido.className = 'card';
    contenido.innerHTML =
        '<img src="' + imagenUrl + '" alt="Portada">' +
        '<h3>' + libro.title + '</h3>' +
        '<div>Autor: ' + autorTexto + '</div>' +
        '<div>Año: ' + yearTexto + '</div>';

    tarjeta.appendChild(contenido);
    return tarjeta;
}

function mostrarMensaje(texto) {
    resultados.innerHTML = '';
    paginacion.innerHTML = '';
    paginaInfo.textContent = '';
    const mensaje = document.createElement('div');
    mensaje.textContent = texto;
    resultados.appendChild(mensaje);
}

function actualizarPaginacion() {
    paginacion.innerHTML = '';
    paginaInfo.textContent = '';

    if (totalPaginas <= 1) {
        return;
    }

    const anteriorLi = document.createElement('li');
    const anteriorLink = document.createElement('a');
    anteriorLink.href = '#';
    anteriorLink.textContent = 'Anterior';
    if (paginaActual === 1) {
        anteriorLi.className = 'disabled';
    } else {
        anteriorLink.addEventListener('click', function(event) {
            event.preventDefault();
            irAPagina(paginaActual - 1);
        });
    }
    anteriorLi.appendChild(anteriorLink);
    paginacion.appendChild(anteriorLi);

    const siguienteLi = document.createElement('li');
    const siguienteLink = document.createElement('a');
    siguienteLink.href = '#';
    siguienteLink.textContent = 'Siguiente';
    if (paginaActual === totalPaginas) {
        siguienteLi.className = 'disabled';
    } else {
        siguienteLink.addEventListener('click', function(event) {
            event.preventDefault();
            irAPagina(paginaActual + 1);
        });
    }
    siguienteLi.appendChild(siguienteLink);
    paginacion.appendChild(siguienteLi);

    paginaInfo.textContent = 'Página ' + paginaActual + ' de ' + totalPaginas;
}

function irAPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    const cantidadValor = Number(cantidad.value);
    if (ultimoTextoBuscado) {
        obtenerLibros(ultimoTextoBuscado, cantidadValor, paginaActual);
    }
}

async function obtenerLibros(texto, cantidadValor, pagina = 1) {
    const url = 'https://openlibrary.org/search.json?q=' + encodeURIComponent(texto) + '&page=' + pagina + '&limit=' + cantidadValor;
    const response = await fetch(url);
    const data = await response.json();
    const libros = data.docs;

    const primeros = libros.slice(0, cantidadValor);
    
    let total = libros.length;
    
    let itemsContados = 0;
    let paginasCalculadas = 0;
    while (itemsContados < total) {
        paginasCalculadas = paginasCalculadas + 1;
        itemsContados = itemsContados + cantidadValor;
    }
    totalPaginas = paginasCalculadas;
    if (totalPaginas < 1) {
        totalPaginas = 1;
    }
    
    paginaActual = pagina;
    resultados.innerHTML = '';
    primeros.forEach(function(libro) {
        resultados.appendChild(crearTarjeta(libro));
    });
    actualizarPaginacion();
}

botonBuscar.addEventListener('click', function() {
    resultados.innerHTML = '';
    const texto = busqueda.value;
    paginaActual = 1;
    ultimoTextoBuscado = texto;
    const cantidadValor = Number(cantidad.value);
    obtenerLibros(texto, cantidadValor, paginaActual);
});

cantidad.addEventListener('change', function() {
    paginaActual = 1;
    const texto = busqueda.value;
    const cantidadValor = Number(cantidad.value);
    if (texto) {
        ultimoTextoBuscado = texto;
        obtenerLibros(texto, cantidadValor, paginaActual);
    }
});
