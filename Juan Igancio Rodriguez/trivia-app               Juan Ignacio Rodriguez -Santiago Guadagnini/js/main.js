
const api = new TriviaAPI();
const game = new TriviaGame();


const pantallas = {
  inicio: document.getElementById('pantalla-inicio'),
  juego: document.getElementById('pantalla-juego'),
  fin: document.getElementById('pantalla-fin')
};

const btnJugar = document.getElementById('btn-jugar');
const btnReintentar = document.getElementById('btn-reintentar');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnVolverJugar = document.getElementById('btn-volver-jugar');
const selectCategoria = document.getElementById('categoria');
const selectDificultad = document.getElementById('dificultad');
const selectCantidad = document.getElementById('cantidad');
const mensajeCargando = document.getElementById('mensaje-cargando');
const mensajeError = document.getElementById('mensaje-error');
const textoError = document.getElementById('texto-error');
const textoPregunta = document.getElementById('texto-pregunta');
const opcionesContainer = document.getElementById('opciones');
const feedback = document.getElementById('feedback');
const puntajeActual = document.getElementById('puntaje-actual');
const progreso = document.getElementById('progreso');
const puntajeFinal = document.getElementById('puntaje-final');
const historialDiv = document.getElementById('historial');
const listaHistorial = document.getElementById('lista-historial');

function decodificarHTML(texto) {
  const el = document.createElement('textarea');
  el.innerHTML = texto;
  return el.value;
}

function mezclar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function mostrarPantalla(nombre) {
  pantallas.inicio.classList.remove('visible');
  pantallas.juego.classList.remove('visible');
  pantallas.fin.classList.remove('visible');
  if (nombre === 'inicio') pantallas.inicio.classList.add('visible');
  else if (nombre === 'juego') pantallas.juego.classList.add('visible');
  else if (nombre === 'fin') pantallas.fin.classList.add('visible');
}


function mostrarError(mensaje) {
  textoError.textContent = mensaje;
  mensajeError.classList.remove('oculto');
  btnReintentar.classList.remove('oculto');
}

function limpiarError() {
  mensajeError.classList.add('oculto');
  btnReintentar.classList.add('oculto');
}

function guardarPuntaje(puntaje, total) {
  const historial = JSON.parse(localStorage.getItem('triviaHistorial') || '[]');
  historial.unshift({
    puntaje: puntaje,
    total: total,
    fecha: new Date().toLocaleDateString()
  });
  historial.splice(5);
  localStorage.setItem('triviaHistorial', JSON.stringify(historial));
}

function mostrarHistorial() {
  const historial = JSON.parse(localStorage.getItem('triviaHistorial') || '[]');
  if (historial.length === 0) {
    historialDiv.classList.add('oculto');
    return;
  }
  historialDiv.classList.remove('oculto');
  listaHistorial.innerHTML = '';
  for (const partida of historial) {
    const li = document.createElement('li');
    li.textContent = `${partida.fecha} — ${partida.puntaje}/${partida.total}`;
    listaHistorial.appendChild(li);
  }
}

async function cargarCategorias() {
  try {
    const categorias = await api.getCategorias();
    for (const cat of categorias) {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      selectCategoria.appendChild(option);
    }
  } catch (error) {
    console.warn('No se pudieron cargar las categorías:', error);
  }
}

function mostrarPregunta() {
  const pregunta = game.getPreguntaActual();
  if (!pregunta) return;

  const texto = decodificarHTML(pregunta.question);
  const correcta = pregunta.correct_answer;
  const incorrectas = pregunta.incorrect_answers.map(decodificarHTML);

  let respuestas = [correcta, ...incorrectas];
  respuestas = mezclar(respuestas);

  textoPregunta.textContent = texto;
  progreso.textContent = `Pregunta ${game.preguntaActual + 1} de ${game.preguntas.length}`;
  puntajeActual.textContent = `Puntaje: ${game.puntaje}`;

  opcionesContainer.innerHTML = '';
  feedback.classList.add('oculto');
  btnSiguiente.classList.add('oculto');

  for (const respuesta of respuestas) {
    const boton = document.createElement('button');
    boton.textContent = respuesta;
    boton.addEventListener('click', () => {
      if (boton.disabled) return;

      const botones = opcionesContainer.querySelectorAll('button');
      for (const btn of botones) {
        btn.disabled = true;
      }

      const esCorrecta = game.responder(respuesta);

      for (const btn of botones) {
        if (btn.textContent === correcta) {
          btn.classList.add('correcta');
        } else if (btn === boton && !esCorrecta) {
          btn.classList.add('incorrecta');
        }
      }

      feedback.textContent = esCorrecta ? '¡Correcto!' : 'Fallaste';
      feedback.classList.remove('oculto');
      puntajeActual.textContent = `Puntaje: ${game.puntaje}`;

      btnSiguiente.textContent = game.haTerminado() ? 'Ver resultado' : 'Siguiente';
      btnSiguiente.classList.remove('oculto');
    });
    opcionesContainer.appendChild(boton);
  }
}

async function empezarJuego() {
  limpiarError();
  mensajeCargando.classList.remove('oculto');
  btnJugar.disabled = true;

  const cantidad = parseInt(selectCantidad.value) || 10;
  const categoria = selectCategoria.value;
  const dificultad = selectDificultad.value;

  try {
    const preguntas = await api.getPreguntas(cantidad, categoria, dificultad);
    game.iniciar(preguntas);
    mensajeCargando.classList.add('oculto');
    btnJugar.disabled = false;
    mostrarPantalla('juego');
    mostrarPregunta();
  } catch (error) {
    mensajeCargando.classList.add('oculto');
    btnJugar.disabled = false;
    mostrarError(error.message || 'Ocurrió un error al cargar las preguntas.');
  }
}

function avanzar() {
  if (game.haTerminado()) {
    puntajeFinal.textContent = `Sacaste ${game.puntaje} de ${game.preguntas.length}`;
    guardarPuntaje(game.puntaje, game.preguntas.length);
    mostrarHistorial();
    mostrarPantalla('fin');
  } else {
    game.siguiente();
    mostrarPregunta();
  }
}

function reiniciar() {
  limpiarError();
  mostrarPantalla('inicio');
}

btnJugar.addEventListener('click', empezarJuego);
btnReintentar.addEventListener('click', empezarJuego);
btnSiguiente.addEventListener('click', avanzar);
btnVolverJugar.addEventListener('click', reiniciar);

cargarCategorias();
mostrarPantalla('inicio');