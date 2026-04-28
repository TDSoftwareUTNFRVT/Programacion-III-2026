// Imagen de fondo predeterminada que siempre se muestra al cargar la página
const IMAGEN_DEFAULT = "https://images.steamusercontent.com/ugc/2413438784260932139/B7FED6EFAF6A48757C6B310A3E94FAB8CD422365/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true";

// Variable para controlar si la imagen de fondo está activa
let imagenActiva = true;

function cambiarColor(color) {
    const boton = document.getElementById('botonPrincipal');
    boton.style.backgroundColor = color;
    boton.setAttribute('data-color-base', color);
    if (document.getElementById('activarDegradado').checked) {
        actualizarDegradado();
    }
}

function actualizarSombra() {
    const boton = document.getElementById('botonPrincipal');
    const valor = document.getElementById('sombra').value;
    document.getElementById('valorSombra').textContent = valor + 'px';
    boton.style.boxShadow = valor + 'px ' + valor + 'px ' + (valor * 2) + 'px rgba(0,0,0,0.3)';
}

function actualizarBorde() {
    const boton = document.getElementById('botonPrincipal');
    const grosor = document.getElementById('grosorBorde').value;
    const tipo = document.getElementById('tipoBorde').value;
    const color = document.getElementById('colorBorde').value;
    document.getElementById('valorGrosor').textContent = grosor + 'px';
    boton.style.border = grosor + 'px ' + tipo + ' ' + color;
}

function actualizarRedondez() {
    const boton = document.getElementById('botonPrincipal');
    const valor = document.getElementById('redondez').value;
    document.getElementById('valorRedondez').textContent = valor + 'px';
    boton.style.borderRadius = valor + 'px';
}

function actualizarDegradado() {
    const boton = document.getElementById('botonPrincipal');
    const activar = document.getElementById('activarDegradado').checked;
    const opciones = document.getElementById('opcionesDegradado');
    const colorBase = boton.getAttribute('data-color-base') || '#3498db';
    const color2 = document.getElementById('colorDegradado').value;

    if (activar) {
        opciones.style.display = 'block';
        boton.style.backgroundImage = 'linear-gradient(to right, ' + colorBase + ', ' + color2 + ')';
        boton.style.backgroundColor = 'transparent';
    } else {
        opciones.style.display = 'none';
        // Restaurar imagen de fondo solo si está activa y no se ha reseteado
        if (imagenActiva) {
            boton.style.backgroundImage = 'url(' + IMAGEN_DEFAULT + ')';
        } else {
            boton.style.backgroundImage = 'none';
        }
        boton.style.backgroundColor = colorBase;
    }
}

// Nueva función: restaurar todos los valores por defecto, pero sin imagen de fondo
function resetearValores() {
    // Desactivar la imagen de fondo
    imagenActiva = false;
    const boton = document.getElementById('botonPrincipal');
    boton.style.backgroundImage = 'none';

    // Restablecer color base a #3498db
    boton.setAttribute('data-color-base', '#3498db');
    boton.style.backgroundColor = '#3498db';

    // Desactivar degradado
    document.getElementById('activarDegradado').checked = false;
    document.getElementById('opcionesDegradado').style.display = 'none';
    document.getElementById('colorDegradado').value = '#ffffff';

    // Restablecer sliders y sus etiquetas
    document.getElementById('sombra').value = 4;
    document.getElementById('valorSombra').textContent = '4px';
    document.getElementById('grosorBorde').value = 3;
    document.getElementById('valorGrosor').textContent = '3px';
    document.getElementById('redondez').value = 10;
    document.getElementById('valorRedondez').textContent = '10px';

    // Restablecer tipo y color de borde
    document.getElementById('tipoBorde').value = 'solid';
    document.getElementById('colorBorde').value = '#ffffff';

    // Aplicar todos los cambios visuales
    actualizarSombra();
    actualizarBorde();
    actualizarRedondez();
    actualizarDegradado(); // Se encarga de quitar el gradiente y la imagen
}

// Inicialización al cargar la página
window.onload = function() {
    const boton = document.getElementById('botonPrincipal');
    boton.setAttribute('data-color-base', '#3498db');
    // Establecer la imagen predeterminada desde el enlace de Steam
    boton.style.backgroundImage = 'url(' + IMAGEN_DEFAULT + ')';
    imagenActiva = true;

    // Aplicar valores iniciales
    actualizarSombra();
    actualizarBorde();
    actualizarRedondez();
};