const api  = new TriviaAPI();
const game = new TriviaGame();

const pantallaInicio    = document.getElementById('pantalla-inicio');
const pantallaJuego     = document.getElementById('pantalla-juego');
const pantallaResultado = document.getElementById('pantalla-resultado');
const pantallaCarga     = document.getElementById('pantalla-carga');
const pantallaError     = document.getElementById('pantalla-error');

const btnJugar       = document.getElementById('btn-jugar');
const btnReintentar  = document.getElementById('btn-reintentar');
const btnJugarOtra   = document.getElementById('btn-jugar-otra');
const selectDificultad = document.getElementById('select-dificultad');

const componente = document.getElementById('componente-pregunta');
const contadorPreg   = document.getElementById('contador-pregunta');
const textoPuntaje   = document.getElementById('puntaje');
const textoError     = document.getElementById('texto-error');

const resultadoPuntaje  = document.getElementById('resultado-puntaje');
const resultadoMensaje  = document.getElementById('resultado-mensaje');


function decodificarHTML(texto) {
  const el = document.createElement('textarea');
  el.innerHTML = texto;
  return el.value;
}

function mezclar(array) {
  const copia = [...array]; 
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function mostrarSolo(pantalla) {
  [pantallaInicio, pantallaJuego, pantallaResultado,
   pantallaCarga, pantallaError].forEach(p => p.classList.add('oculto'));
  pantalla.classList.remove('oculto');
}

function mostrarPregunta() {
  const pregunta = game.getPreguntaActual();

  contadorPreg.textContent =
    `Pregunta ${game.preguntaActual + 1} de ${game.preguntas.length}`;
  textoPuntaje.textContent = `Puntaje: ${game.puntaje}`;

  const opciones = mezclar([
    pregunta.correct_answer,
    ...pregunta.incorrect_answers
  ]);

  componente.cargarPregunta(
    decodificarHTML(pregunta.question),
    opciones.map(o => decodificarHTML(o))
  );
}

function manejarRespuesta(evento) {
  const opcionElegida = evento.detail.opcionElegida;
  const pregunta = game.getPreguntaActual();
  const correcta = decodificarHTML(pregunta.correct_answer);

  const esCorrecta = game.responder(opcionElegida);
  componente.mostrarFeedback(correcta);

  setTimeout(() => {
    game.siguiente();
    if (game.haTerminado()) {
      mostrarResultado();
    } else {
      mostrarPregunta();
    }
  }, 1200);
}

componente.addEventListener('respuesta', manejarRespuesta);

function mostrarResultado() {
  mostrarSolo(pantallaResultado);

  const total = game.preguntas.length;
  const puntaje = game.puntaje;

  resultadoPuntaje.textContent = `${puntaje} / ${total}`;

  if (puntaje === total) {
    resultadoMensaje.textContent = '¡Perfecto! No fallaste ninguna.';
  } else if (puntaje >= total * 0.7) {
    resultadoMensaje.textContent = '¡Muy bien! La rompiste.';
  } else if (puntaje >= total * 0.4) {
    resultadoMensaje.textContent = 'Nada mal, seguí practicando.';
  } else {
    resultadoMensaje.textContent = 'Mala suerte, dale otra vuelta.';
  }

  guardarHistorial(puntaje, total);
  mostrarHistorial();
}

function guardarHistorial(puntaje, total) {
  const historial = JSON.parse(localStorage.getItem('trivia-historial') || '[]');

  historial.unshift({
    puntaje,
    total,
    fecha: new Date().toLocaleDateString('es-AR')
  });

  const ultimas5 = historial.slice(0, 5);
  localStorage.setItem('trivia-historial', JSON.stringify(ultimas5));
}

function mostrarHistorial() {
  const contenedor = document.getElementById('historial');
  const historial = JSON.parse(localStorage.getItem('trivia-historial') || '[]');

  if (historial.length === 0) {
    contenedor.innerHTML = '';
    return;
  }

  contenedor.innerHTML = `
    <h3>Últimas partidas</h3>
    <ul>
      ${historial.map(p =>
        `<li>${p.fecha} — ${p.puntaje}/${p.total}</li>`
      ).join('')}
    </ul>
  `;
}

async function cargarCategorias() {
  const selectCategoria = document.getElementById('select-categoria');
  if (!selectCategoria) return;

  try {
    const categorias = await api.getCategorias();
    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      selectCategoria.appendChild(option);
    });
  } catch (error) {
    console.warn('No se pudieron cargar las categorías:', error);
  }
}

async function iniciarPartida() {
  mostrarSolo(pantallaCarga);

  const dificultad = selectDificultad.value;
  const selectCategoria = document.getElementById('select-categoria');
  const categoria = selectCategoria ? selectCategoria.value : '';

  try {
    const preguntas = await api.getPreguntas(10, categoria, dificultad);
    game.iniciar(preguntas);
    mostrarSolo(pantallaJuego);
    mostrarPregunta();

  } catch (error) {
    textoError.textContent =
      'No se pudieron cargar las preguntas. Revisá tu conexión e intentá de nuevo.';
    mostrarSolo(pantallaError);
  }
}

btnJugar.addEventListener('click', iniciarPartida);

btnReintentar.addEventListener('click', iniciarPartida);

btnJugarOtra.addEventListener('click', () => {
  mostrarSolo(pantallaInicio);
});

cargarCategorias();
