export default class TriviaGame {
  constructor() {
    this.preguntas = [];
    this.preguntaActual = 0;
    this.puntaje = 0;
  }

  iniciar(preguntas) {
    this.puntaje = 0;
    this.preguntas = preguntas;
    this.preguntaActual = 0;
  }

  getPreguntaActual() {
    return this.preguntas[this.preguntaActual]
  }

  responder(respuesta) {
    let preguntaActual = this.getPreguntaActual();

    if (respuesta === preguntaActual.correct_answer) {
      this.puntaje += 10;
      return true
    } else
      return false
  }

  siguiente() {
    this.preguntaActual++;
  }

  haTerminado() {
    if (this.preguntaActual >= this.preguntas.length) {
      return true
    } else {
      return false
    }
  }
}