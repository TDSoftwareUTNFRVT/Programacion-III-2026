import TriviaApi from "./TriviaAPI.js";
import TriviaGame from "./TriviaGame.js";

const api = new TriviaApi();
const game = new TriviaGame();

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


async function categories() {
    const categorias = await api.getCategorias()
    document.getElementById('categorias').innerHTML = categorias.map(c => `
        <option value="${c.id}">${c.name}</option>
        `).join()
}


function mostrarPantalla(id){
    document.getElementById('pantalla-inicio').style.display = 'none';
    document.getElementById('pantalla-juego').style.display = 'none';
    document.getElementById('pantalla-final').style.display = 'none';
    document.getElementById('pantalla-error').style.display = 'none';
    document.getElementById('pantalla-cargando').style.display = 'none';
    document.getElementById(id).style.display = 'block';
}

function mostrarPregunta() { 
    const pregunta = game.getPreguntaActual()
    document.getElementById('num-preg').innerHTML = `Pregunta ${game.preguntaActual + 1} de 10`
    document.getElementById('preg').innerHTML = decodificarHTML(pregunta.question)
    const respuestas = mezclar([... pregunta.incorrect_answers, pregunta.correct_answer])
    document.getElementById('grp-rta').innerHTML= respuestas.map(r =>
        `<button class=btn-preg font-col-wht>${decodificarHTML(r)}</button>`
    ).join('')
}

function mostrarResultado() { 
    mostrarPantalla('pantalla-final')
    document.getElementById('puntaje-final').innerHTML = `Obtuviste ${game.puntaje} de 10`
}

document.getElementById('btn-jugar')
    .addEventListener('click', async () => {
        mostrarPantalla('pantalla-cargando')
        const dificultad = document.getElementById('dificultades').value;
        try{
            const preguntas = await api.getPreguntas(10, '', dificultad);
            game.iniciar(preguntas);
            mostrarPantalla('pantalla-juego');
            mostrarPregunta();
        }
        catch{
            mostrarPantalla('pantalla-error');
        }
    });

document.getElementById('btn-reintentar')
    .addEventListener('click',  () =>{
        mostrarPantalla('pantalla-inicio')
        document.getElementById('pantalla-inicio').style.display = 'flex';
    })

document.getElementById('btn-volver')
    .addEventListener('click',  () =>{
        mostrarPantalla('pantalla-inicio')
        document.getElementById('pantalla-inicio').style.display = 'flex';
    })

document.getElementById('grp-rta').addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const respuesta = event.target.textContent;
        const rta = game.responder(respuesta)
        if (rta){
            event.target.classList.add('rta-correcta');
        }
        else{
            event.target.classList.add('rta-incorrecta');
        }
        game.siguiente()
        setTimeout(()=>{
            if (game.haTerminado()){
                mostrarResultado();
            }
            else{
            mostrarPregunta();
            }
        }, 1000)
    }
});

categories();