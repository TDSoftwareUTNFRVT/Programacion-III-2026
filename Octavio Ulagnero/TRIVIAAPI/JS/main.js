
const api = new TriviaAPI();
const game = new TriviaGame();

function mostrarVista(id) {
    document.querySelectorAll('.vista').forEach(function(v) {
        v.classList.add('oculto');
    });

    document.getElementById(id).classList.remove('oculto');
}

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
async function cargarCategorias() {
    const categorias = await api.getCategorias();
    const select = document.getElementById('categoria');

    select.innerHTML = '<option value="">Todas</option>';

    categorias.forEach(function(cat) {
        const opcion = document.createElement('option');
        opcion.value = cat.id;
        opcion.textContent = cat.name;
        select.appendChild(opcion);
    });
}
function mostrarPregunta() {
    const pregunta = game.getPreguntaActual();
    const num = game.preguntaActual + 1;
    const total = game.preguntas.length;

    document.getElementById('contador-pregunta').textContent = 'Pregunta ' + num + '/' + total;
    const porcentaje = num > 1 ? Math.round((game.puntaje / (num - 1)) * 100) : 0;
    document.getElementById('porcentaje-actual').textContent = porcentaje + '% aciertos';
    document.getElementById('pregunta').textContent = decodificarHTML(pregunta.question);
    const opciones = mezclar(pregunta.incorrect_answers.concat(pregunta.correct_answer));
    const letras = ['A', 'B', 'C', 'D'];
    const botones = document.querySelectorAll('.btn-opcion');
    botones.forEach(function(btn, i) {
        btn.textContent = letras[i] + ')  ' + decodificarHTML(opciones[i]);
        btn.className = 'btn-opcion';
        btn.disabled = false;
        btn.onclick = function() {
            const esCorrecta = game.responder(opciones[i]);
            btn.className = esCorrecta ? 'btn-opcion correcto' : 'btn-opcion incorrecto';
            if (!esCorrecta) {
                botones.forEach(function(b, j) {
                    if (opciones[j] === pregunta.correct_answer) {
                        b.className = 'btn-opcion correcto';
                    }
                });
            }
            botones.forEach(function(b) { b.disabled = true; });
            document.getElementById('puntaje').textContent = 'Puntaje: ' + game.puntaje;
            setTimeout(function() {
                game.siguiente();
                if (game.haTerminado()) {
                    mostrarResultado();
                } else {
                    mostrarPregunta();
                }
            }, 1000);
        };
    });
}

function mostrarResultado() {
    const total = game.preguntas.length;
    const puntaje = game.puntaje;
    const porcentajeFinal = Math.round((puntaje / total) * 100);

    document.getElementById('resultado-porcentaje').textContent = porcentajeFinal + '%';
    document.getElementById('resultado-texto').textContent =
        'Respondiste bien ' + puntaje + ' de ' + total + ' preguntas.';
    guardarHistorial(puntaje, total);
    mostrarVista('vista-resultado');
}

function guardarHistorial(puntaje, total) {
    const historial = JSON.parse(localStorage.getItem('historial') || '[]');
    const fecha = new Date().toLocaleDateString('es-AR');

    historial.unshift({ puntaje: puntaje, total: total, fecha: fecha });
    if (historial.length > 5) historial.pop();
    localStorage.setItem('historial', JSON.stringify(historial));
}

function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historial') || '[]');
    const contenedor = document.getElementById('historial');
    
    if (historial.length === 0) {
        contenedor.textContent = 'Sin partidas aún';
        return;
    }

    contenedor.innerHTML = historial.map(function(h) {
        return '<div class="historial-item">' + h.fecha + ': ' + h.puntaje + '/' + h.total + '</div>';
    }).join('');
}

document.getElementById('btn-jugar').addEventListener('click', async function() {
    const dificultad = document.getElementById('dificultad').value;
    const categoria = document.getElementById('categoria').value;
    
    mostrarVista('vista-juego');
    document.getElementById('pregunta').textContent = 'Cargando preguntas...';
    document.getElementById('contador-pregunta').textContent = 'Pregunta -/-';
    document.getElementById('puntaje').textContent = 'Puntaje: 0';
    document.getElementById('porcentaje-actual').textContent = '0% aciertos';
    const preguntas = await api.getPreguntas(10, categoria, dificultad);

    if (!preguntas || preguntas.length === 0) {
        mostrarVista('vista-menu');
        alert('No se pudieron cargar las preguntas. Verificá tu conexión e intentá de nuevo.');
        return;
    }

    game.iniciar(preguntas);
    mostrarPregunta();
});

document.getElementById('btn-volver').addEventListener('click', function() {
    mostrarHistorial();       
    mostrarVista('vista-menu');
});

cargarCategorias();
mostrarHistorial();