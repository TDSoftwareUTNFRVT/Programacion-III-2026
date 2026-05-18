// Instancias globales
const api = new TriviaAPI();
const game = new TriviaGame();

// Función para mostrar una pantalla y ocultar las demás
function mostrarPantalla(id) {
    const pantallas = ['pantalla-inicio', 'pantalla-carga', 'pantalla-error', 'pantalla-juego', 'pantalla-resultado'];
    pantallas.forEach(p => {
        document.getElementById(p).style.display = p === id ? 'block' : 'none';
    });
}

// Función para decodificar HTML escapado
function decodificarHTML(texto) {
  const el = document.createElement('textarea');
  el.innerHTML = texto;
  return el.value;
}

function mezclar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// TODO: función para mostrar una pregunta en el DOM
function mostrarPregunta() {
    const pregunta = game.getPreguntaActual();
    document.getElementById('contador').textContent = `Pregunta ${game.preguntaActual + 1} de ${game.preguntas.length}`;
    document.getElementById('puntaje').textContent = `Puntaje: ${game.puntaje}`;
    document.getElementById('pregunta').textContent = decodificarHTML(pregunta.question);
    document.getElementById('opciones').innerHTML = '';
    const opciones = mezclar([pregunta.correct_answer, ...pregunta.incorrect_answers]);
    opciones.forEach(opcion => {
        const btn = document.createElement('button');
        btn.textContent = decodificarHTML(opcion);
        btn.addEventListener('click', () => {
            document.querySelectorAll('#opciones button').forEach(b => b.disabled = true); // Deshabilitar botones tras responder
            const correcta = game.responder(opcion);
            if (correcta) {
                btn.classList.add('correcta');
            } else {
                btn.classList.add('incorrecta');
            }
            setTimeout(() => {
                game.siguiente();
                if (game.haTerminado()) {
                    mostrarResultado();
                } else {
                    mostrarPregunta();
                }
            }, 1000);
        });
        document.getElementById('opciones').appendChild(btn);
    });
}

// TODO: función para mostrar pantalla final
function mostrarResultado() {
    const resultado = document.getElementById('puntaje-final');
    resultado.textContent = `¡Juego terminado! Tu puntaje final es ${game.puntaje} de ${game.preguntas.length}.`;
    guardarHistorial();
    mostrarHistorial();
    mostrarPantalla('pantalla-resultado');
}

// TODO: evento del botón "Jugar"
document.getElementById('btn-jugar').addEventListener('click', async () => {
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        alert('Por favor, ingresa tu nombre para jugar.');
        return;
    }
    mostrarPantalla('pantalla-carga');
    const dificultad = document.getElementById('dificultad').value;
    const categoria = document.getElementById('categoria').value;
    try {
        const preguntas = await api.getPreguntas(10, categoria, dificultad);
        game.iniciar(preguntas);
        mostrarPantalla('pantalla-juego');
        mostrarPregunta();
    } catch (error) {
        document.getElementById('mensaje-error').textContent = 'No se pudieron cargar las preguntas. Por favor, intenta nuevamente.';
        mostrarPantalla('pantalla-error');
    }
  });

document.getElementById('btn-reintentar').addEventListener('click', () => {
    document.getElementById('btn-jugar').click();
    
});
document.getElementById('btn-reiniciar').addEventListener('click', () => {
    document.getElementById('nombre').value = '';
    mostrarPantalla('pantalla-inicio');
});

async function cargarCategorias() {
    try {
        const categorias = await api.getCategorias();
        const select = document.getElementById('categoria');
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('No se pudieron cargar las categorías:', error);
    }
}

//cargarCategorias();

function guardarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    const resultado = {
        nombre: document.getElementById('nombre').value.trim(),
        puntaje: game.puntaje,
        dificultad: document.getElementById('dificultad').value || 'Aleatorio',
    }
    historial.push(resultado);
    const ultimos5 = historial.slice(-5); // Guardar solo los últimos 5 resultados
    localStorage.setItem('historial', JSON.stringify(ultimos5));
}  

function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    // map() para convertir cada resultado en un string legible
    if (historial.length === 0)
        document.getElementById('historial').innerHTML = '<p>No hay juegos anteriores.</p>';
    
    document.getElementById('historial').innerHTML = `
    <h3>Historial de juegos anteriores: </h3>
        ${historial.map(r => 
            `<p>${r.nombre}: ${r.puntaje}/10 (${r.dificultad})</p>`
        ).join('')}
        `;  
}