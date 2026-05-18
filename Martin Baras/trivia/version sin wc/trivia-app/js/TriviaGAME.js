// Bruno González - Martín Baras

class TriviaGAME {
    constructor() {
        this.preguntas = [];
        this.preguntaActual = 0;
        this.puntaje = 0;

        this.aumento = 1;
    }

    iniciar(preguntas) {
        this.preguntas = preguntas;

        this.preguntaActual = 0;
        this.puntaje = 0;
    }

    getPreguntaActual() {
        return this.preguntas[this.preguntaActual];
    }

    siguiente() {
        this.preguntaActual ++;
    }

    responder(respuesta, contenedor) {
        if(respuesta === this.getPreguntaActual().correct_answer) {
            setTimeout(() => {
                this.puntaje++;
                this.siguiente();;
            }, 1500);
            
            this.actualizarcontenedor(contenedor);
            return true;
        }

        else {
            setTimeout(() => {
                this.siguiente();;
            }, 1500);

            this.actualizarcontenedor(contenedor);

            return false;
        }
    }

    actualizarcontenedor (contenedor_info) {
        if (this.preguntaActual < this.preguntas.length) {
            contenedor_info.innerHTML = `<h2 class="question-title">Pregunta ${this.preguntaActual + this.aumento} de 10</h2>
                                        <h2 class="question-title">Puntuación: ${this.puntaje}</h2>`;
        }
    }

    haTerminado() {
        if(this.preguntaActual >= this.preguntas.length) {
            return true;
        }

        else {
            return false;
        }
    }
}

export default TriviaGAME;