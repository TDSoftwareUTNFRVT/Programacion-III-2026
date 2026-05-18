//Mateo Woinarowski

class TriviaGame {
  constructor() {
    this.preguntas      = [];
    this.preguntaActual = 0;
    this.puntaje        = 0;
  }

  iniciar(preguntas) {
    this.preguntas      = preguntas;
    this.preguntaActual = 0;
    this.puntaje        = 0;
  }

  getPreguntaActual() {
    return this.preguntas[this.preguntaActual];
  }

  responder(respuesta) {
    const esCorrecta = respuesta === this.getPreguntaActual().correct_answer;
    if (esCorrecta) this.puntaje++;
    return esCorrecta;
  }

  siguiente() {
    this.preguntaActual++;
  }

  haTerminado() {
    return this.preguntaActual >= this.preguntas.length;
  }
}
