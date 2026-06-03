import TriviaAPI from "./TriviaAPI.js";
import TriviaGame from "./TriviaGame.js";
import "./inicio-Trivia.js";
import "./error-Trivia.js";
import "./juego-Trivia.js";
import "./loading-Trivia.js";
import "./resultado-Trivia.js";


// Instancias globales
const api = new TriviaAPI();
const game = new TriviaGame();
let dificultad = "";

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
  document.querySelectorAll("trivia-inicio, trivia-error, trivia-juego, trivia-resultado, trivia-loading").forEach(c => c.classList.add("hidden"));
  document.querySelector(`trivia-${idPantalla}`).classList.remove("hidden");
}

function mostrarError(mensaje) {
  document.querySelectorAll("trivia-inicio, trivia-error, trivia-juego, trivia-resultado, trivia-loading").forEach(c => c.classList.add("hidden"));
  document.querySelector("trivia-error").mostrar(mensaje);
}


function mostrarPregunta() {
    let pregunta = game.getPreguntaActual();
    
    let listaDeRespuestas = [];
    listaDeRespuestas.push(pregunta.correct_answer);
    pregunta.incorrect_answers.forEach(resp => listaDeRespuestas.push(resp));

    let respuestasMezcladas = mezclar(listaDeRespuestas).map(r => decodificarHTML(r));
    let correctaDecodificada = decodificarHTML(pregunta.correct_answer);

    let componente = document.querySelector("trivia-juego");
    componente.mostrarPregunta(decodificarHTML(pregunta.question), game.preguntaActual + 1, game.preguntas.length);
    componente.mostrarRespuestas(respuestasMezcladas, correctaDecodificada);
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
    mostrarPantalla("resultado");
    
    let historial = obtenerHistorial();
    
    let componente = document.querySelector("trivia-resultado");
    componente.mostrarResultado(game.puntaje);
    componente.mostrarHistorial(historial);
}

async function cargarCategorias() {
  try {
    let categorias = await api.getCategorias();
    document.querySelector("trivia-inicio").cargarCategorias(categorias);
  } catch (error) {
    mostrarError(error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
});

document.querySelector("trivia-inicio").addEventListener("dificultad", (evento) => {
    dificultad = evento.detail;
});

// TODO: evento del botón "Jugar"
document.querySelector("trivia-inicio").addEventListener("jugar", async (evento) => {
    let categoria = evento.detail;
    mostrarPantalla("loading");
    try {
        const datos = await Promise.all([
            api.getPreguntas(10, categoria, dificultad), 
            new Promise(resolve => setTimeout(resolve, 2000))
        ]);

        game.iniciar(datos[0]);
        mostrarPantalla("juego");
        mostrarPregunta();
    } catch (error) {
        mostrarError(error.message);
    }
});

document.querySelector("trivia-error").addEventListener("reintentar", () => {
    mostrarPantalla("inicio");
});

document.querySelector("trivia-resultado").addEventListener("reiniciar", () => {
    mostrarPantalla("inicio");
});

document.querySelector("trivia-juego").addEventListener("respuesta", (evento) => {
    game.responder(evento.detail.respuesta);
    document.querySelector("trivia-juego").actualizarPuntaje(game.puntaje);
});

document.querySelector("trivia-juego").addEventListener("siguiente", () => {
    game.siguiente();
    if (!game.haTerminado()) {
        mostrarPregunta();
    } else {
        mostrarResultado();
    }
});