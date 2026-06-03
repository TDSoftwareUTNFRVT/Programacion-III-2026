import TriviaAPI from "./TriviaAPI.js";
import TriviaGame from "./TriviaGame.js";


// Instancias globales
const api = new TriviaAPI();
const game = new TriviaGame();

// Función para decodificar HTML escapado
function decodificarHTML(texto) {
  const el = document.createElement('textarea');
  el.innerHTML = texto;
  return el.value;
}

function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let sillaAlAzar = Math.floor(Math.random() * (i + 1));
    let cajitaTemporal = array[i];
    array[i] = array[sillaAlAzar];
    array[sillaAlAzar] = cajitaTemporal;

  }
  return array;
}

function mostrarPantalla(idPantalla) {
  let pantallas = document.querySelectorAll('div[id*="screen"]');
  pantallas.forEach(pantalla => {
    if (pantalla.id != `${idPantalla}-screen`) {
      pantalla.classList.add("hidden");
    } else {
      pantalla.classList.remove("hidden");
    }
  });
}

function mostrarError(mensaje) {
  mostrarPantalla("error");
  document.getElementById("error-msg").innerText = mensaje;
}

function mostrarRespuestas(respuestas) {
  let listaDeRespuestas = mezclar(respuestas);
  let botonCorrecto;
  let contenedorRespuestas = document.getElementById("answers-container");
  contenedorRespuestas.innerText = "";


  listaDeRespuestas.forEach(respuesta => {
    let botonRespuesta = document.createElement("button");
    botonRespuesta.innerText = decodificarHTML((respuesta));
    botonRespuesta.classList.add("btn-answer", "bg-white", "border-radius-soft", "font-bebas-neue");
    if (respuesta === game.getPreguntaActual().correct_answer) {
      botonCorrecto = botonRespuesta;
    };
    botonRespuesta.addEventListener("click", () => {
      if (game.responder(respuesta)) {
        botonRespuesta.classList.add("estilo-correcto")
      } else {
        botonRespuesta.classList.add("estilo-incorrecto", "shake-style")
        botonCorrecto.classList.add("estilo-resaltar")
      };

      document.querySelectorAll(".btn-answer").forEach(boton => {
        boton.disabled = true;
      });

      document.getElementById("score").innerText = `Puntaje: ${game.puntaje}`;

      setTimeout(() => {

        game.siguiente()
        if (!game.haTerminado()) {
          mostrarPregunta()
        } else {
          mostrarResultado()
        }
      }, 1000);
    });

    contenedorRespuestas.appendChild(botonRespuesta);
  });
}

function mostrarPregunta() {
  let pregunta = game.getPreguntaActual();

  document.getElementById("current-question").innerText = `Pregunta ${game.preguntaActual + 1} de ${game.preguntas.length}`;


  let contenedorPregunta = document.getElementById("question");
  contenedorPregunta.innerText = decodificarHTML(pregunta.question);

  let listaDeRespuestas = [];
  listaDeRespuestas.push(pregunta.correct_answer);

  pregunta.incorrect_answers.forEach(resp => {
    listaDeRespuestas.push(resp);
  });

  mostrarRespuestas(listaDeRespuestas);
}

function obtenerHistorial() {
  let fechaDeHoy = new Date().toLocaleDateString();
  let anotador = localStorage.getItem("historial-trivia");
  let historial = [];
  let juegoActual = {
    puntaje: game.puntaje,
    fecha: fechaDeHoy
  };

  if (anotador != null) {
    historial = JSON.parse(anotador);
  };

  if (historial.length < 5) {
    historial.push(juegoActual);
  } else {
    historial.shift();
    historial.push(juegoActual);
  };

  let historialCongelado = JSON.stringify(historial);
  localStorage.setItem("historial-trivia", historialCongelado);
  return historial;
}

function mostrarResultado() {
  mostrarPantalla("final");

  let puntaje = document.getElementById("final-score");
  puntaje.innerText = `Puntaje total: ${game.puntaje}`;

  let mensajeFinal = document.getElementById("final-message");
  if (game.puntaje <= 19) {
    mensajeFinal.innerText = "La próxima te va mejor, ¡nadie nace sabiendo!";
  } else if (game.puntaje <= 39) {
    mensajeFinal.innerText = "Hay camino por recorrer, ¡pero se aprende jugando!";
  } else if (game.puntaje <= 59) {
    mensajeFinal.innerText = "Mitad y mitad... El conocimiento no te sobra, pero tampoco te falta.";
  } else if (game.puntaje <= 79) {
    mensajeFinal.innerText = "¡Buen juego! Sabés más de lo que pensabas.";
  } else {
    mensajeFinal.innerText = "¡Sos un genio! La trivia no te para.";
  };

  let historial = obtenerHistorial();
  let contenedorHistorial = document.getElementById("last-scores");
  contenedorHistorial.innerText = "";

  historial.forEach(reg => {
    let registro = document.createElement("li");
    registro.innerText = `Fecha: ${reg.fecha} - Puntaje obtenido: ${reg.puntaje}`;
    contenedorHistorial.appendChild(registro);
  });
}

async function cargarCategorias() {
  try {
    let categorias = await api.getCategorias();
    let selector = document.getElementById("categories");

    categorias.forEach(categ => {
      let nuevaOpcion = document.createElement("option");

      nuevaOpcion.value = categ.id;
      nuevaOpcion.innerText = categ.name;
      selector.appendChild(nuevaOpcion);

    });
  } catch (error) {
    mostrarError(error.message);
  }
}

cargarCategorias();
let dificultad = "";

let botonFacil = document.getElementById("btn-easy");
let botonMedio = document.getElementById("btn-medium");
let botonDificil = document.getElementById("btn-hard");

function seleccionarDificultad(boton, valor) {
  document.querySelectorAll(".btn-difficulty").forEach(btn => {
    btn.classList.remove("bg-grey");
  });
  boton.classList.add("bg-grey");
  dificultad = valor;
}

botonFacil.addEventListener("click", function () {
  seleccionarDificultad(botonFacil, "easy");
});
botonMedio.addEventListener("click", function () {
  seleccionarDificultad(botonMedio, "medium");
});
botonDificil.addEventListener("click", function () {
  seleccionarDificultad(botonDificil, "hard");
});

// TODO: evento del botón "Jugar"
document.getElementById('btn-start').addEventListener('click', async () => {
  let categoria = "";
  let selector = document.getElementById("categories");
  categoria = selector.value;

  mostrarPantalla("loading");
  document.getElementById("question").innerText = "Cargando preguntas. Por favor, espera...";

  try {
    const datos = await api.getPreguntas(10, categoria, dificultad);
    document.getElementById("loading-questions").innerText = "Inicializando preguntas...";
    setTimeout(() => {
      game.iniciar(datos);
      mostrarPantalla("game");
      mostrarPregunta();
    }, 800);

  } catch (error) {
    mostrarError(error.message);
  }
});

document.getElementById("btn-replay").addEventListener("click", () => {
  mostrarPantalla("start");
});

document.getElementById("btn-retry").addEventListener("click", () => {
  mostrarPantalla("start");
});