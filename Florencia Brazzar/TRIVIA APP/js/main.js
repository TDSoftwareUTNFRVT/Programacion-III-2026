// Abaca Jonatan - Brazzar Florencia — TP Trivia App — Programación III

const api = new TriviaAPI();
const game = new TriviaGame();


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


function mostrarCarga() {
  document.getElementById('pantalla-inicio').classList.add('oculto');
  document.getElementById('pantalla-carga').classList.remove('oculto');
}

function mostrarError(mensaje) {
  document.getElementById('pantalla-carga').classList.add('oculto');
  document.getElementById('pantalla-error').classList.remove('oculto');
  document.getElementById('error-mensaje').textContent = mensaje;
}

function mostrarJuego() {
  document.getElementById('pantalla-carga').classList.add('oculto');
  document.getElementById('pantalla-juego').classList.remove('oculto');
}


function mostrarPregunta() {
  const pregunta = game.getPreguntaActual();

 
  document.getElementById('contador').textContent =
    `Pregunta ${game.preguntaActual + 1} de ${game.getTotalPreguntas()}`;


  document.getElementById('puntaje').textContent =
    `Puntaje: ${game.puntaje}`;

 
  document.getElementById('pregunta-texto').textContent =
    decodificarHTML(pregunta.question);


  const respuestas = mezclar([
    pregunta.correct_answer,
    ...pregunta.incorrect_answers
  ]);

  
  const contenedor = document.getElementById('respuestas');
  contenedor.innerHTML = '';

 
  respuestas.forEach(respuesta => {
    const btn = document.createElement('button');
    btn.textContent = decodificarHTML(respuesta);
    btn.classList.add('btn-respuesta');

    btn.addEventListener('click', () => manejarRespuesta(respuesta));

    contenedor.appendChild(btn);
  });
}



function manejarRespuesta(respuesta) {
  const esCorrecta = game.responder(respuesta);


  document.querySelectorAll('.btn-respuesta').forEach(btn => {
    btn.disabled = true;

    const textoBtn = decodificarHTML(btn.textContent);
    const correcta = decodificarHTML(game.getPreguntaActual().correct_answer);

    if (textoBtn === correcta) {
      btn.classList.add('correcta');
    }

    if (textoBtn === decodificarHTML(respuesta) && !esCorrecta) {
      btn.classList.add('incorrecta');
    }
  });

  
  setTimeout(() => {
    game.siguiente();

    if (game.haTerminado()) {
      mostrarResultado();
    } else {
      mostrarPregunta();
    }
  }, 1200);
}



function mostrarResultado() {
  document.getElementById('pantalla-juego').classList.add('oculto');
  document.getElementById('pantalla-resultado').classList.remove('oculto');

  document.getElementById('puntaje-final').textContent =
    `${game.puntaje} puntos`;

 
  guardarHistorial(game.puntaje, game.getTotalPreguntas());
  mostrarHistorial();
}


async function cargarCategorias() {
  try {
    const categorias = await api.getCategorias();
    const select = document.getElementById('select-categoria');

    
    select.innerHTML = '<option value="">Todas las categorías</option>';

  
    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });

  } catch (error) {
   
    document.getElementById('select-categoria').innerHTML =
      '<option value="">Todas las categorías</option>';
  }
}


function guardarHistorial(puntaje, total) {
  const historial = JSON.parse(localStorage.getItem('trivia-historial') || '[]');
 
  const entrada = {
    puntaje,
    total,
    fecha: new Date().toLocaleDateString('es-AR')
  };

 
  historial.unshift(entrada);

 
  const ultimas5 = historial.slice(0, 5);

  
  localStorage.setItem('trivia-historial', JSON.stringify(ultimas5));
}


function mostrarHistorial() {
  const historial = JSON.parse(localStorage.getItem('trivia-historial') || '[]');
  const contenedor = document.getElementById('historial');

  if (historial.length === 0) {
    contenedor.innerHTML = '<p class="sin-historial">Sin partidas anteriores.</p>';
    return;
  }


  contenedor.innerHTML = historial.map(entrada =>
    `<div class="historial-item">
      <span>${entrada.fecha}</span>
      <span>${entrada.puntaje} / ${entrada.total}</span>
    </div>`
  ).join('');
}



document.getElementById('btn-jugar').addEventListener('click', async () => {

  const dificultad = document.getElementById('select-dificultad').value;
  const categoria  = document.getElementById('select-categoria').value; 

  mostrarCarga();

  try {
    const preguntas = await api.getPreguntas(10, categoria, dificultad);

    game.iniciar(preguntas);
    mostrarJuego();
    mostrarPregunta();

  } catch (error) {
    mostrarError('No se pudieron cargar las preguntas. Revisá tu conexión e intentá de nuevo.');
  }
});



document.getElementById('btn-reintentar').addEventListener('click', () => {
  document.getElementById('pantalla-error').classList.add('oculto');
  document.getElementById('pantalla-inicio').classList.remove('oculto');
});


document.getElementById('btn-jugar-nuevo').addEventListener('click', () => {
  document.getElementById('pantalla-resultado').classList.add('oculto');
  document.getElementById('pantalla-inicio').classList.remove('oculto');
});


cargarCategorias();