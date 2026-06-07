class TriviaGame {
  constructor() {
    this.preguntas    = [];
    this.preguntaActual = 0;
    this.puntaje      = 0;
  }

  iniciar(preguntas) {
    this.preguntas      = preguntas;
    this.preguntaActual = 0;
    this.puntaje        = 0;
  }

  getPreguntaActual() {
    return this.preguntas[this.preguntaActual] ?? null;
  }

  responder(respuesta) {
    const correcta = this.getPreguntaActual()?.correct_answer;
    const esCorrecta = respuesta === correcta;
    if (esCorrecta) this.puntaje++;
    return esCorrecta;
  }

  siguiente() {
    if (!this.haTerminado()) this.preguntaActual++;
  }

  haTerminado() {
    return this.preguntaActual >= this.preguntas.length - 1;
  }
}
