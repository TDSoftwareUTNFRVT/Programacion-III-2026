class TriviaGame {
  constructor() {
    this.preguntas = [];
    this.puntaje = 0;
    this.preguntaActual = 0;
    // inicializar estados del juego
  }

  iniciar(preguntas) {
    this.preguntas = preguntas;
    this.puntaje = 0;
    this.preguntaActual = 0;
    //Resetear estados al iniciar un nuevo juego
  }

  getPreguntaActual() {
    return this.preguntas[this.preguntaActual];
  }

  responder(respuesta) {
    const correcta = this.getPreguntaActual().correct_answer;
    if (respuesta === correcta) {
        this.puntaje ++;
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
