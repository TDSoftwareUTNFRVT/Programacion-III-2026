//Mateo Woinarowski
class TriviaPuntaje extends HTMLElement {

  static get observedAttributes() {
    return ['numero', 'total', 'puntaje'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const numero  = this.getAttribute('numero')  || '1';
    const total   = this.getAttribute('total')   || '10';
    const puntaje = this.getAttribute('puntaje') || '0';

    this.innerHTML = `
      <div class="barra-superior">
        <span>Pregunta ${numero} de ${total}</span>
        <span class="display-puntaje">Puntaje: ${puntaje}</span>
      </div>
    `;
  }

}

customElements.define('trivia-puntaje', TriviaPuntaje);

class TriviaPregunta extends HTMLElement {

  connectedCallback() {
    this.innerHTML = `
      <p class="texto-pregunta" id="texto-pregunta"></p>
      <div class="contenedor-opciones" id="contenedor-opciones"></div>
    `;
  }

  cargar(pregunta, mezclar, decodificar) {
    this._correcta    = pregunta.correct_answer;
    this._decodificar = decodificar;

    this.querySelector('#texto-pregunta').textContent = decodificar(pregunta.question);

    const opciones   = mezclar([pregunta.correct_answer, ...pregunta.incorrect_answers]);
    const contenedor = this.querySelector('#contenedor-opciones');
    contenedor.innerHTML = '';

    opciones.forEach(opcion => {
      const boton = document.createElement('button');
      boton.className   = 'btn-opcion';
      boton.textContent = decodificar(opcion);
      boton.addEventListener('click', () => this._alHacerClick(opcion, boton));
      contenedor.appendChild(boton);
    });
  }

  _alHacerClick(opcion, botonElegido) {

    this.querySelectorAll('.btn-opcion').forEach(b => b.disabled = true);

    const esCorrecta = opcion === this._correcta;
    botonElegido.classList.add(esCorrecta ? 'correcta' : 'incorrecta');

    if (!esCorrecta) {
      this.querySelectorAll('.btn-opcion').forEach(b => {
        if (b.textContent === this._decodificar(this._correcta)) {
          b.classList.add('correcta');
        }
      });
    }
    this.dispatchEvent(new CustomEvent('respuesta-elegida', {
      bubbles: true,
      detail: { opcion }
    }));
  }

}

customElements.define('trivia-pregunta', TriviaPregunta);


class TriviaHistorial extends HTMLElement {

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          background: #af4d5d;
          border-radius: 10px;
          padding: 16px 20px;
          margin-bottom: 24px;
          text-align: left;
          font-family: 'Segoe UI', sans-serif;
        }
        h3 {
          font-size: 0.85rem;
          color: #aea3a3;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.9rem;
        }
        li {
          color: #afa1a1;
          border-bottom: 1px solid #1a4a8a;
          padding-bottom: 6px;
        }
        li:last-child { border-bottom: none; }
        .fecha { color: #bbbbbb; }
        .pts   { color: #7b748f; font-weight: 700; }
        .vacio { color: #666; font-style: italic; }
      </style>
      <h3>Últimas partidas</h3>
      <ul id="lista"></ul>
    `;

    this._lista = shadow.getElementById('lista');
    this.actualizar();
  }

  actualizar() {
    if (!this._lista) return;

    const historial = JSON.parse(localStorage.getItem('triviaHistorial') || '[]');

    if (historial.length === 0) {
      this._lista.innerHTML = '<li class="vacio">No hay partidas anteriores.</li>';
      return;
    }

    this._lista.innerHTML = historial.map(p => `
      <li>
        <span class="fecha">${p.fecha}</span>
        —
        <span class="pts">${p.puntaje}/${p.total}</span>
      </li>
    `).join('');
  }

}

customElements.define('trivia-historial', TriviaHistorial);
