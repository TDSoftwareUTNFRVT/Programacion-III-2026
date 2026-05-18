/* Integrantes: Lautaro Torancio y Octavio Ulagnero*/
class TriviaGame {
    constructor() {
        this.preguntas = [];       
        this.preguntaActual = 0;   
        this.puntaje = 0;          
    }

    iniciar(preguntas) {
        this.preguntas = preguntas;
        this.preguntaActual = 0;
        this.puntaje = 0;
    }

    getPreguntaActual() {
        return this.preguntas[this.preguntaActual];
    }

    responder(respuesta) {
        const pregunta = this.getPreguntaActual();
        if (respuesta === pregunta.correct_answer) {
            this.puntaje++;
            return true;
        }
        return false;
    }
    siguiente() {
        this.preguntaActual++;
    }
    haTerminado() {
        return this.preguntaActual >= this.preguntas.length;
    }
}