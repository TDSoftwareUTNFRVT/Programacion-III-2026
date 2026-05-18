// Bruno González - Martín Baras

import TriviaAPI from "./TriviaAPI.js";
import TriviaGAME from "./TriviaGAME.js";

const api = new TriviaAPI();
const game = new TriviaGAME();

const contenedor_general = document.querySelector('#general-wrapper');
contenedor_general.classList.add('general-wrapper', 'small-gap');

const contenedor_menu = document.querySelector('#contenedor-menu');
contenedor_menu.classList.add('wrapper','question-container', 'fdc');

const contenedor_juego = document.querySelector('#contenedor-juego');
contenedor_juego.classList.add('wrapper', 'margin-auto', 'fdc', 'custom-padding');

const contenedor_pregunta = document.querySelector('#contenedor-pregunta');
contenedor_pregunta.classList.add('wrapper','question-container', 'fdc');

const contenedor_info = document.querySelector('#contenedor-preguntaindex-score');
contenedor_info.classList.add('container','question-score-index-container', 'wrapper', 'margin-auto', 'small-gap');

const contenedor_fin_del_juego = document.querySelector('#contenedor-fin-juego');
contenedor_fin_del_juego.classList.add('wrapper','question-container', 'fdc', 'margin-auto');

contenedor_fin_del_juego.style.display = "none";
contenedor_juego.style.display = "none";

const boton_iniciar_juego = document.querySelector('#boton-jugar');
boton_iniciar_juego.classList.add('button','play-button', 'margin-auto');

const titulo_dificultad = document.querySelector('#titulo-dificultad');
const boton_dif_facil = document.querySelector('#boton-dif-facil');
const boton_dif_medio = document.querySelector('#boton-dif-medio');
const boton_dif_dificil = document.querySelector('#boton-dif-dificil');

const selector_categorias = document.querySelector('#categories-group');
selector_categorias.classList.add('selector');

function ValoresDefaultMenu(){
    titulo_dificultad.textContent = "Seleccione una dificultad";
    dificultad_seleccionada="";
    categoria_seleccionada="";
    selector_categorias.value="1"
}
                    
let boton_volver_a_jugar = document.querySelector('#boton-volver-a-jugar');

boton_iniciar_juego.addEventListener('click', async () => {
    if (dificultad_seleccionada && categoria_seleccionada) {
        contenedor_juego.style.display = "flex";
        contenedor_menu.style.display = "none";

        contenedor_pregunta.innerHTML = '<p class="question">Cargando...</p>';

        try {
            const preguntas = await api.getPreguntas(10, categoria_seleccionada, dificultad_seleccionada);

            game.iniciar(preguntas);

            MostrarPregunta(preguntas);
        } catch (error) {
            contenedor_pregunta.innerHTML = `<p class="question">Error al cargar las preguntas: ${error.message}</p>
                                            <button id="boton-reiniciar" class="button reset-button margin-auto">Reintentar</button>`;
                                                
            let boton_reiniciar = document.querySelector('#boton-reiniciar');

            boton_reiniciar.addEventListener('click', () => {
                boton_iniciar_juego.click();
            });
        }
    }
    else if (!dificultad_seleccionada){alert('Seleccione una dificultad');}
    else if (!categoria_seleccionada || categoria_seleccionada==="1"){alert('Seleccione una categoria');}
});

const botones = [boton_dif_facil, boton_dif_medio, boton_dif_dificil];

let dificultad_seleccionada;
let categoria_seleccionada;

botones.forEach(boton => {
    boton.addEventListener('click', () => {
        titulo_dificultad.textContent = `Dificultad: ${boton.dataset.difficulty}`;

        if (boton.dataset.difficulty === "Fácil") {
            dificultad_seleccionada = "easy";
        }

        else if (boton.dataset.difficulty === "Medio") {
            dificultad_seleccionada = "medium";
        }

        else {
            dificultad_seleccionada = "hard";
        }
    });
});

function decodificarHTML(texto) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = texto;
    return textarea.value;
}

function Mezclar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

let respuesta_elegida;

function MostrarPregunta(preguntas) {
    const respuesta_correcta = preguntas[game.preguntaActual].correct_answer;
    const respuesta_incorrecta_1 = preguntas[game.preguntaActual].incorrect_answers[0];
    const respuesta_incorrecta_2 = preguntas[game.preguntaActual].incorrect_answers[1];
    const respuesta_incorrecta_3 = preguntas[game.preguntaActual].incorrect_answers[2];
    const respuestas = [respuesta_correcta, respuesta_incorrecta_1, respuesta_incorrecta_2, respuesta_incorrecta_3];

    Mezclar(respuestas);

    game.actualizarcontenedor(contenedor_info);

    contenedor_pregunta.innerHTML = `<div class="wrapper custom-size-2 question-box-style">
                                        <p class="question margin-auto">
                                            ${decodificarHTML(preguntas[game.preguntaActual].question)}
                                        </p>
                                    </div>
                                    <div class="wrapper fdr custom-size">
                                        <button id="respuesta-1" class="button answer-button-size margin-auto answer-bg-colour"><p class="question-text">${decodificarHTML(respuestas[0])}</p></button>
                                        <button id="respuesta-2" class="button answer-button-size margin-auto answer-bg-colour"><p class="question-text">${decodificarHTML(respuestas[1])}</p></button>
                                        <button id="respuesta-3" class="button answer-button-size margin-auto answer-bg-colour"><p class="question-text">${decodificarHTML(respuestas[2])}</p></button>
                                        <button id="respuesta-4" class="button answer-button-size margin-auto answer-bg-colour"><p class="question-text">${decodificarHTML(respuestas[3])}</p></button>
                                    </div>`;

    let boton_rta_1 = document.querySelector('#respuesta-1');
    let boton_rta_2 = document.querySelector('#respuesta-2');
    let boton_rta_3 = document.querySelector('#respuesta-3');
    let boton_rta_4 = document.querySelector('#respuesta-4');
    const botones_rtas = [boton_rta_1, boton_rta_2, boton_rta_3, boton_rta_4];

    let titulo_respuesta_elegida = document.querySelector('#titulo-respuesta-elegida');

    botones_rtas.forEach(boton => {
        boton.addEventListener('click', () => {
            let respuesta_elegida = boton.textContent;
            if (game.responder(respuesta_elegida, contenedor_info)) {
                boton.style.background = "#58ED72";
                boton.style.border = "4px solid #0B6A1B";

            }
            else {
                boton.style.background = "#ED5858";
                boton.style.border = "4px solid #E71818";
            }
            botones_rtas.forEach(boton => {
                boton.disabled = true;
            });
            setTimeout(() => {
                if (game.haTerminado()) {
                    contenedor_juego.style.display = "none";
                    contenedor_fin_del_juego.style.display = "flex";
                    contenedor_fin_del_juego.innerHTML = `<h2 class="main-title">¡Juego terminado!</h2>
                                                        <h2 class="main-title">Puntuación</h2>
                                                        <div class="wrapper score-container">${game.puntaje}</div>
                                                        <button id="boton-volver-a-jugar" class="button play-button">Volver a jugar</button>`;

                    boton_volver_a_jugar = document.querySelector('#boton-volver-a-jugar');
                    boton_volver_a_jugar.addEventListener('click', () => {
                        contenedor_fin_del_juego.style.display = "none";
                        contenedor_menu.style.display = "flex";
                        ValoresDefaultMenu()
                    });
                }
                else {
                    MostrarPregunta(game.preguntas);
                }
            }, 2000);
        });
    });
}

async function CargarCategorias() {
    try {
        const categorias = [{ "id": 1, "name": "Seleccione una categoría" }];
        const demas_categorias = await api.getCategorias();
        const categorias_totales = categorias.concat(demas_categorias);

        selector_categorias.innerHTML = categorias_totales.map(c => `<option value="${c.id}" class="selector">${c.name}</option>`).join('');

        document.querySelector('#boton-reiniciar-categorias')?.remove();
        // Busca si existe un elemento con este id y si existe lo elimina, el (?) evita que explote todo si el elemento no existe. Si existe el elemento, se borra, y si no, nada.

    } catch (error) {
        selector_categorias.innerHTML = `<option>Error al cargar categorías</option>`;

        document.querySelector('#boton-reiniciar-categorias')?.remove();

        contenedor_menu.insertAdjacentHTML("beforeend", `<button id="boton-reiniciar-categorias" class="button margin-auto">Recargar Categorias</button>`);
        // insertAdjacentHTML: Inserta HTML dinámico en un lugar específico del contenedor, sin reemplazar todo lo otro. "beforeend" es para que se inserte lo que quiera justo antes de cerrar la etiqueta del contenedor.
                                                
        const boton_reiniciar_categorias = document.querySelector('#boton-reiniciar-categorias');

        boton_reiniciar_categorias.addEventListener('click', () => {
            CargarCategorias();
            selector_categorias.innerHTML = `<option>Reiniciando búsqueda...</option>`
        });
    }
}

selector_categorias.innerHTML = '<option>Cargando...</p>';

CargarCategorias();

selector_categorias.addEventListener('change', () => {
    if (selector_categorias.value === "1") {
        selector_categorias.value = 9;
    }
    categoria_seleccionada = selector_categorias.value
});