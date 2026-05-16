// ===== Integrantes =====
// =    Marcos Ledesma   =
// =   Agustin Lanthier  =
// =======================
import TriviaGame from "./triviaGame.js";
import TriviaAPI from "./triviaAPI.js";

const api = new TriviaAPI();
const game = new TriviaGame();

const preguntaEl = document.getElementById("pregunta");
const respuestasEl = document.getElementById("respuestas");
const progresoEl = document.getElementById("progreso");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaInicio = document.getElementById("pantalla-inicio");
const mensajeEl = document.getElementById("mensaje");

// CATEGORIAS 
const CATEGORIAS_ES = {
    "General Knowledge": "Conocimiento General",
    "Entertainment: Books": "Entretenimiento: Libros",
    "Entertainment: Film": "Entretenimiento: Cine",
    "Entertainment: Music": "Entretenimiento: Música",
    "Entertainment: Musicals & Theatres": "Entretenimiento: Musicales y Teatro",
    "Entertainment: Television": "Entretenimiento: Televisión",
    "Entertainment: Video Games": "Entretenimiento: Videojuegos",
    "Entertainment: Board Games": "Entretenimiento: Juegos de Mesa",
    "Entertainment: Comics": "Entretenimiento: Cómics",
    "Entertainment: Japanese Anime & Manga": "Entretenimiento: Anime y Manga",
    "Entertainment: Cartoon & Animations": "Entretenimiento: Dibujos Animados",
    "Science & Nature": "Ciencia y Naturaleza",
    "Science: Computers": "Ciencia: Computación",
    "Science: Mathematics": "Ciencia: Matemáticas",
    "Science: Gadgets": "Ciencia: Gadgets",
    "Mythology": "Mitología",
    "Sports": "Deportes",
    "Geography": "Geografía",
    "History": "Historia",
    "Politics": "Política",
    "Art": "Arte",
    "Celebrities": "Celebridades",
    "Animals": "Animales",
    "Vehicles": "Vehículos",
};

const CATEGORIAS_SIN_TRADUCIR = new Set([
    "Entertainment: Music",
    "Entertainment: Film",
    "Entertainment: Books",
    "Entertainment: Video Games",
    "Entertainment: Comics",
    "Entertainment: Japanese Anime & Manga",
    "Entertainment: Cartoon & Animations",
    "Entertainment: Musicals & Theatres",
    "Entertainment: Television",
]);

const DIFICULTAD_ES = {
    "easy": "Fácil",
    "medium": "Medio",
    "hard": "Difícil",
};

const medallas = [
    "color: #FFD700; border-color: #FFD700; background: rgba(255,215,0,0.15);",
    "color: #C0C0C0; border-color: #C0C0C0; background: rgba(192,192,192,0.15);",
    "color: #CD7F32; border-color: #CD7F32; background: rgba(205,127,50,0.15);",
];

async function traducir(texto) {
    const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|es`
    );
    
    const data = await response.json();
    return data.responseData.translatedText;
}

function traducirTrueFalse(texto) {
    if (texto === "True") return "Verdadero";
    if (texto === "False") return "Falso";
    return texto;
}

async function cargarCategorias() {
    try {
        const categorias = await api.getCategorias();
        const selectCat = document.getElementById("categoria");
        selectCat.innerHTML = '<option value="">Cualquiera</option>';
        for (const categoria of categorias) {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = CATEGORIAS_ES[categoria.name] ?? categoria.name;
            selectCat.appendChild(option);
        }
    } catch (e) {
        document.getElementById("categoria").innerHTML =
            '<option value="">No se pudieron cargar</option>';
        console.error(e);
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

async function mostrarPregunta() {
    if (game.haTerminado()) {
        mostrarResultado();
        return;
    }

    const pregunta = game.getPreguntaActual();
    const numero = game.preguntaActual + 1;
    const total = game.preguntas.length;
    const debeTraducir = !CATEGORIAS_SIN_TRADUCIR.has(pregunta.category);

    const textos = debeTraducir
    ? await Promise.all([
        traducir(decodificarHTML(pregunta.question)),
        ...pregunta.incorrect_answers.map(a => traducir(decodificarHTML(a))),
        traducir(decodificarHTML(pregunta.correct_answer)),
    ])
    : [
        await traducir(decodificarHTML(pregunta.question)),
        ...pregunta.incorrect_answers.map(a => traducirTrueFalse(decodificarHTML(a))), // ← agregás esto
        traducirTrueFalse(decodificarHTML(pregunta.correct_answer)), 
    ];

    const preguntaTraducida = textos[0];
    const correctaTraducida = textos[textos.length - 1];
    const incorrectasTraducidas = textos.slice(1, textos.length - 1);
    const opciones = mezclar([...incorrectasTraducidas, correctaTraducida]);

    if (pregunta.difficulty === "easy") {
        progresoEl.innerHTML = `
        <span class="badge badge-default">Pregunta ${numero}/${total}</span>
        <span class="badge badge-easy">${DIFICULTAD_ES[pregunta.difficulty]}</span>
        <span class="badge badge-info">${CATEGORIAS_ES[pregunta.category] ?? pregunta.category}</span>
        `;
    }
    if (pregunta.difficulty === "medium") {
        progresoEl.innerHTML = `
        <span class="badge badge-default">Pregunta ${numero}/${total}</span>
        <span class="badge badge-medium">${DIFICULTAD_ES[pregunta.difficulty]}</span>
        <span class="badge badge-info">${CATEGORIAS_ES[pregunta.category] ?? pregunta.category}</span>
        `;
    }
    if (pregunta.difficulty === "hard") {
        progresoEl.innerHTML = `
        <span class="badge badge-default">Pregunta ${numero}/${total}</span>
        <span class="badge badge-hard">${DIFICULTAD_ES[pregunta.difficulty]}</span>
        <span class="badge badge-info">${CATEGORIAS_ES[pregunta.category] ?? pregunta.category}</span>
        `;
    }
    preguntaEl.textContent = preguntaTraducida;
    mensajeEl.textContent = "";
    respuestasEl.innerHTML = "";

    opciones.forEach((opcion) => {
        const btn = document.createElement("button");
        btn.textContent = opcion;

        btn.classList.add("bt_respuesta");

        btn.addEventListener("click", () => {
            respuestasEl
                .querySelectorAll("button")
                .forEach((b) => (b.disabled = true));

            const acertada = opcion === correctaTraducida;
            if (acertada) game.puntaje += 1;

            if (acertada) {
                btn.classList.add("correcta");
                mensajeEl.textContent = "✓ Respuesta correcta!";
                mensajeEl.innerHTML =
                    '<span class="badge badge-correct">✓ Correcta</span>';
                mensajeEl.style.color = "var(--green-b)";
            } else {
                btn.classList.add("incorrecta");
                mensajeEl.textContent = `✗ Incorrecto — era: ${correctaTraducida}`;
                mensajeEl.innerHTML = `<span class="badge badge-wrong">✗ Incorrecto — era: ${correctaTraducida}</span>`;

                mensajeEl.style.color = "var(--red-b)";

                respuestasEl.querySelectorAll("button").forEach((b) => {
                    if (b.textContent === correctaTraducida) {
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
    const nombre = document.getElementById("nombre").value.trim() || "Anónimo";
    const entrada = {
        puntaje,
        total,
        nombre,
        fecha: new Date().toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }),
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
        contenedor.innerHTML =
            '<p class="text-muted" style="font-size:14px;text-transform:none;">Sin partidas anteriores.</p>';
        return;
    }
    const ordenado = [...historial].sort((a, b) => b.puntaje - a.puntaje);
    contenedor.innerHTML = ordenado
        .map(
            (e, i) =>
            `<div class="historial-item">
            <span class="badge" style="${medallas[i] ?? 'color: var(--fg-4); border-color: var(--bg-3);'}">#${i + 1}</span>
            <span class="historial-puntaje">${e.puntaje}/${e.total}</span>
            <span class="historial-nombre">${e.nombre ?? "Anónimo"}</span>
            <span class="historial-fecha text-muted">${e.fecha}</span>
        </div>`,
        )
        .join("");
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
    pantallaJuego.style.display = "none";
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
    const categoria = document.getElementById("categoria").value;
    const btnJugar = document.getElementById("btn-jugar");

    ocultarError();
    btnJugar.disabled = true;
    btnJugar.textContent = "Cargando...";

    try {
        const preguntas = await api.getPreguntas(10, categoria, dificultad);
        game.iniciar(preguntas);

        pantallaInicio.style.display = "none";
        pantallaJuego.style.display = "block";
        document.querySelector("h2").style.display = "none";

        mostrarPregunta();
    } catch (error) {
        mostrarError(
            "No se pudieron cargar las preguntas. Verificá tu conexión e intentá de nuevo.",
            () => {
                ocultarError();
                pantallaInicio.style.display = "block";
            },
        );
    } finally {
        btnJugar.disabled = false;
        btnJugar.textContent = "JUGAR";
    }
}

document.getElementById("btn-jugar").addEventListener("click", iniciarPartida);

document.getElementById("btn-jugar-de-nuevo").addEventListener("click", () => {
    const pantallaResultado = document.getElementById("pantalla-resultado");
    pantallaResultado.style.display = "none";
    pantallaInicio.style.display = "block";
    document.querySelector("h2").style.display = "block";
    api.cache.clear();
});
