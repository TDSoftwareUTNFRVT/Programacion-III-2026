// script.js
let currentColor = '#3498db';
let currentShadow = 'none';
let currentRadius = '10px';
let currentGradientAngle = '0';
let currentButtonText = 'Haz clic para editar';

const boton = document.getElementById('boton-preview');
const textoInput = document.getElementById('texto-input');

const gradientColors = {
    '0': 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
    '45': 'linear-gradient(45deg, #a8e6cf, #ffd3b6)',
    '90': 'linear-gradient(90deg, #667eea, #764ba2)',
    '135': 'linear-gradient(135deg, #f093fb, #f5576c)',
    '180': 'linear-gradient(180deg, #4facfe, #00f2fe)',
    '225': 'linear-gradient(225deg, #43e97b, #38f9d7)'
};

function actualizarBoton() {
    let backgroundStyle;
    
    if (currentGradientAngle === 'none') {
        backgroundStyle = currentColor;
    } else {
        backgroundStyle = gradientColors[currentGradientAngle];
    }

    let shadowStyle = 'none';
    switch(currentShadow) {
        case 'light':
            shadowStyle = '0 2px 8px rgba(0,0,0,0.15)';
            break;
        case 'medium':
            shadowStyle = '0 4px 15px rgba(0,0,0,0.25)';
            break;
        case 'heavy':
            shadowStyle = '0 8px 25px rgba(0,0,0,0.35)';
            break;
        default:
            shadowStyle = 'none';
    }

    boton.style.background = backgroundStyle;
    boton.style.boxShadow = shadowStyle;
    boton.style.borderRadius = currentRadius;
    boton.style.color = 'white';
    boton.style.border = '2px solid black';
    boton.textContent = currentButtonText;
}

function inicializarColores() {
    const colorOpciones = document.querySelectorAll('.barravertical:first-child .opcion');
    const coloresHex = ['#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ffa500', '#800080'];
    
    colorOpciones.forEach((opcion, index) => {
        if (index < coloresHex.length) {
            opcion.style.backgroundColor = coloresHex[index];
            opcion.addEventListener('click', () => {
                colorOpciones.forEach(opt => opt.classList.remove('opcion-activa'));
                opcion.classList.add('opcion-activa');
                currentColor = coloresHex[index];
                currentGradientAngle = 'none';
                actualizarBoton();
                
                const gradOpciones = document.querySelectorAll('.barravertical:last-child .opcion');
                gradOpciones.forEach(opt => opt.classList.remove('opcion-activa'));
                if(gradOpciones[0]) gradOpciones[0].classList.add('opcion-activa');
            });
        }
    });
}

function inicializarSombras() {
    const shadowContainer = document.querySelectorAll('.barravertical')[1];
    if(shadowContainer) {
        const shadowOpts = shadowContainer.querySelectorAll('.opcion');
        const shadowValues = ['none', 'light', 'medium', 'heavy'];
        shadowOpts.forEach((opt, idx) => {
            if(idx < shadowValues.length) {
                opt.addEventListener('click', () => {
                    shadowOpts.forEach(o => o.classList.remove('opcion-activa'));
                    opt.classList.add('opcion-activa');
                    currentShadow = shadowValues[idx];
                    actualizarBoton();
                });
            }
        });
    }
}

function inicializarBordes() {
    const borderContainer = document.querySelectorAll('.barravertical')[2];
    if(borderContainer) {
        const borderOpts = borderContainer.querySelectorAll('.opcion');
        const radiusVals = ['0%', '10%', '25%', '40%', '50%', '50px'];
        borderOpts.forEach((opt, idx) => {
            if(idx < radiusVals.length) {
                opt.addEventListener('click', () => {
                    borderOpts.forEach(o => o.classList.remove('opcion-activa'));
                    opt.classList.add('opcion-activa');
                    currentRadius = radiusVals[idx];
                    actualizarBoton();
                });
            }
        });
    }
}

function inicializarDegradados() {
    const gradContainer = document.querySelectorAll('.barravertical')[3];
    if(gradContainer) {
        const gradOpts = gradContainer.querySelectorAll('.opcion');
        const gradAngles = ['none', '45', '90', '135', '180', '225'];
        gradOpts.forEach((opt, idx) => {
            if(idx < gradAngles.length) {
                opt.addEventListener('click', () => {
                    gradOpts.forEach(o => o.classList.remove('opcion-activa'));
                    opt.classList.add('opcion-activa');
                    currentGradientAngle = gradAngles[idx];
                    actualizarBoton();
                    
                    if(currentGradientAngle !== 'none') {
                        const colorOpcionesBarra = document.querySelectorAll('.barravertical:first-child .opcion');
                        colorOpcionesBarra.forEach(opt => opt.classList.remove('opcion-activa'));
                    }
                });
            }
        });
    }
}

function inicializarTexto() {
    textoInput.addEventListener('input', (e) => {
        currentButtonText = e.target.value;
        actualizarBoton();
    });
}

function init() {
    inicializarColores();
    inicializarSombras();
    inicializarBordes();
    inicializarDegradados();
    inicializarTexto();
    actualizarBoton();
}

document.addEventListener('DOMContentLoaded', init);