//Mateo Woinarowski
const api  = new TriviaAPI();
const game = new TriviaGame();

function decodificarHTML(texto) {
  const el = document.createElement('textarea');
  el.innerHTML = texto;
  return el.value;
}

function mezclar(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const pantallaInicio    = document.getElementById('pantalla-inicio');
const pantallaJuego     = document.getElementById('pantalla-juego');
const pantallaResultado = document.getElementById('pantalla-resultado');
const pantallaError     = document.getElementById('pantalla-error');
const pantallaCarga     = document.getElementById('pantalla-carga');

const selectCategoria   = document.getElementById('select-categoria');
const selectDificultad  = document.getElementById('select-dificultad');
const btnJugar          = document.getElementById('btn-jugar');
const btnReintentar     = document.getElementById('btn-reintentar');
const btnVolverAJugar   = document.getElementById('btn-volver-a-jugar');

const resultadoPuntaje  = document.getElementById('resultado-puntaje');
const resultadoMensaje  = document.getElementById('resultado-mensaje');
const mensajeError      = document.getElementById('mensaje-error');

const compPuntaje   = document.getElementById('comp-puntaje');
const compPregunta  = document.getElementById('comp-pregunta');
const compHistorial = document.getElementById('comp-historial');



function mostrarPantalla(id) {
  [pantallaInicio, pantallaJuego, pantallaResultado, pantallaError, pantallaCarga]
    .forEach(p => p.classList.add('oculto'));
  document.getElementById(id).classList.remove('oculto');
}

function guardarPartida(puntaje, total) {
  const historial = JSON.parse(localStorage.getItem('triviaHistorial') || '[]');
  historial.unshift({
    puntaje,
    total,
    fecha: new Date().toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  });
  localStorage.setItem('triviaHistorial', JSON.stringify(historial.slice(0, 5)));
}

async function cargarCategorias() {
  try {
    const categorias = await api.getCategorias();
    categorias.forEach(cat => {
      const opcion = document.createElement('option');
      opcion.value       = cat.id;
      opcion.textContent = cat.name;
      selectCategoria.appendChild(opcion);
    });
  } catch (e) {
    console.warn('No se pudieron cargar las categorías:', e.message);
  }
}

function mostrarPregunta() {
  const numero = game.preguntaActual + 1;
  const total  = game.preguntas.length;

  compPuntaje.setAttribute('numero',  numero);
  compPuntaje.setAttribute('total',   total);
  compPuntaje.setAttribute('puntaje', game.puntaje);

  compPregunta.cargar(game.getPreguntaActual(), mezclar, decodificarHTML);
}

compPregunta.addEventListener('respuesta-elegida', (evento) => {
  const opcion     = evento.detail.opcion;
  const esCorrecta = game.responder(opcion);  // TriviaGame valida y actualiza el puntaje

  compPuntaje.setAttribute('puntaje', game.puntaje);

  setTimeout(() => {
    game.siguiente();
    if (game.haTerminado()) {
      mostrarResultado();
    } else {
      mostrarPregunta();
    }
  }, 1200);
});

function mostrarResultado() {
  const total = game.preguntas.length;
  const pts   = game.puntaje;

  guardarPartida(pts, total);

  resultadoPuntaje.textContent = `${pts} / ${total}`;
  resultadoMensaje.textContent =
    pts === total      ? '¡Felicitaciones, sos un gigacrack'          :
    pts >= total * 0.7 ? 'Buena mostro, ya casi sos Crack'          :
    pts >= total * 0.4 ? 'Definitivamente sos mas tonto que crack' : 'Metele al estudio porque a crack no llegas ni de onda';

  compHistorial.actualizar();
  mostrarPantalla('pantalla-resultado');
}

btnJugar.addEventListener('click', async () => {
  mostrarPantalla('pantalla-carga');
  try {
    const preguntas = await api.getPreguntas(10, selectCategoria.value, selectDificultad.value);
    game.iniciar(preguntas);
    mostrarPantalla('pantalla-juego');
    mostrarPregunta();
  } catch (error) {
    mensajeError.textContent = error.message;
    mostrarPantalla('pantalla-error');
  }
});

btnReintentar.addEventListener('click', () => mostrarPantalla('pantalla-inicio'));
btnVolverAJugar.addEventListener('click', () => mostrarPantalla('pantalla-inicio'));

cargarCategorias();
