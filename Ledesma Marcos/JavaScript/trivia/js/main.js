// ===== Integrantes =====
// =    Marcos Ledesma   =
// =   Agustin Lanthier  =
// =======================
import TriviaGame from "./triviaGame.js";
import TriviaAPI from "./triviaAPI.js";

const api = new TriviaAPI();
const game = new TriviaGame();

const preguntaEl    = document.getElementById("pregunta");
const respuestasEl  = document.getElementById("respuestas");
const progresoEl    = document.getElementById("progreso");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaInicio = document.getElementById("pantalla-inicio");
const mensajeEl     = document.getElementById("mensaje");

async function cargarCategorias() {
    try {
        const categorias = await api.getCategorias();
        const selectCat = document.getElementById("categoria");
        selectCat.innerHTML = '<option value="">Cualquiera</option>';
        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = categoria.name;
            selectCat.appendChild(option);
        });
    } catch (e) {
        document.getElementById("categoria").innerHTML = '<option value="">No se pudieron cargar</option>';
    }
}

function decodificarHTML(texto) {
    const el = document.createElement("textarea");
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

function mostrarPregunta() {
    if (game.haTerminado()) {
        mostrarResultado();
        return;
    }

    const pregunta = game.getPreguntaActual();
    const numero   = game.preguntaActual + 1;
    const total    = game.preguntas.length;
    const opciones = mezclar([...pregunta.incorrect_answers, pregunta.correct_answer]);

    progresoEl.innerHTML = `
        <span class="badge badge-default">Pregunta ${numero}/${total}</span>
        <span class="badge badge-warn">${pregunta.difficulty}</span>
        <span class="badge badge-info">${pregunta.category}</span>
    `; 
    preguntaEl.textContent = decodificarHTML(pregunta.question);
    mensajeEl.textContent  = "";
    respuestasEl.innerHTML = "";

    opciones.forEach(opcion => {
        const btn = document.createElement("button");
        btn.textContent = decodificarHTML(opcion);

        btn.classList.add("bt_respuesta");

        btn.addEventListener("click", () => {
            respuestasEl.querySelectorAll("button").forEach(b => b.disabled = true);

            const acertada = game.responder(opcion);

            if (acertada) {
                btn.classList.add("correcta");
                mensajeEl.textContent = "✓ Respuesta correcta!";
                mensajeEl.innerHTML = '<span class="badge badge-correct">✓ Correcta</span>';
                mensajeEl.style.color = "var(--green-b)";
            } else {
                btn.classList.add("incorrecta");
                mensajeEl.textContent = `✗ Incorrecto — era: ${decodificarHTML(pregunta.correct_answer)}`;
                mensajeEl.innerHTML = `<span class="badge badge-wrong">✗ Incorrecto — era: ${decodificarHTML(pregunta.correct_answer)}</span>`;

                mensajeEl.style.color = "var(--red-b)";

                respuestasEl.querySelectorAll("button").forEach(b => {
                    if (decodificarHTML(b.textContent) === decodificarHTML(pregunta.correct_answer)) {
                        b.classList.add("correcta");
                    }
                });
            }

            setTimeout(() => {
                game.siguiente();
                mostrarPregunta();
            }, 1500);
        });

        respuestasEl.appendChild(btn);
    });
}

// ===== HISTORIAL =====
const HISTORIAL_KEY = "trivia_historial";
const HISTORIAL_MAX = 5;

function guardarPartida(puntaje, total) {
    const historial = obtenerHistorial();
    const entrada = {
        puntaje,
        total,
        fecha: new Date().toLocaleDateString("es-AR", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        })
    };
    historial.unshift(entrada);
    if (historial.length > HISTORIAL_MAX) historial.pop();
    localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial));
}

function obtenerHistorial() {
    try {
        return JSON.parse(localStorage.getItem(HISTORIAL_KEY)) || [];
    } catch {
        return [];
    }
}

function mostrarHistorial() {
    const historial = obtenerHistorial();
    const contenedor = document.getElementById("historial-lista");
    if (!historial.length) {
        contenedor.innerHTML = '<p class="text-muted" style="font-size:14px;text-transform:none;">Sin partidas anteriores.</p>';
        return;
    }
    contenedor.innerHTML = historial.map((e, i) =>
        `<div class="historial-item">
            <span class="badge badge-default">#${i + 1}</span>
            <span class="historial-puntaje">${e.puntaje}/${e.total}</span>
            <span class="historial-fecha text-muted">${e.fecha}</span>
        </div>`
    ).join("");
}

// ===== RESULTADO =====
function mostrarResultado() {
    pantallaJuego.style.display = "none";
    const pantallaResultado = document.getElementById("pantalla-resultado");
    pantallaResultado.style.display = "block";

    const puntajeFinal = document.getElementById("puntaje-final");
    puntajeFinal.textContent = `Puntaje final: ${game.puntaje}/${game.preguntas.length}`;

    guardarPartida(game.puntaje, game.preguntas.length);
    mostrarHistorial();
}

// ===== ERROR / CARGA =====
function mostrarError(mensaje, onReintentar) {
    pantallaInicio.style.display = "none";
    pantallaJuego.style.display  = "none";
    const pantallaResultado = document.getElementById("pantalla-resultado");
    pantallaResultado.style.display = "none";

    const pantallaError = document.getElementById("pantalla-error");
    pantallaError.style.display = "block";
    document.getElementById("error-mensaje").textContent = mensaje;

    const btnReintentar = document.getElementById("btn-reintentar");
    // Clonar para eliminar listeners previos
    const btnNuevo = btnReintentar.cloneNode(true);
    btnReintentar.parentNode.replaceChild(btnNuevo, btnReintentar);
    btnNuevo.addEventListener("click", onReintentar);
}

function ocultarError() {
    document.getElementById("pantalla-error").style.display = "none";
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", cargarCategorias);

async function iniciarPartida() {
    const dificultad = document.getElementById("dificultad").value;
    const categoria  = document.getElementById("categoria").value;
    const btnJugar   = document.getElementById("btn-jugar");

    ocultarError();
    btnJugar.disabled    = true;
    btnJugar.textContent = "Cargando...";

    try {
        const preguntas = await api.getPreguntas(10, categoria, dificultad);
        game.iniciar(preguntas);

        pantallaInicio.style.display = "none";
        pantallaJuego.style.display  = "block";

        mostrarPregunta();
    } catch (error) {
        mostrarError(
            "No se pudieron cargar las preguntas. Verificá tu conexión e intentá de nuevo.",
            () => {
                ocultarError();
                pantallaInicio.style.display = "block";
            }
        );
    } finally {
        btnJugar.disabled    = false;
        btnJugar.textContent = "JUGAR";
    }
}

document.getElementById("btn-jugar").addEventListener("click", iniciarPartida);

document.getElementById("btn-jugar-de-nuevo").addEventListener("click", () => {
    const pantallaResultado = document.getElementById("pantalla-resultado");
    pantallaResultado.style.display = "none";
    pantallaInicio.style.display    = "block";
});