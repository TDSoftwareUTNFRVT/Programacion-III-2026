class TriviaBoton extends HTMLElement {
  static get observedAttributes() {
    return ['texto'];
  }

  connectedCallback() {
    if (this._btn) return;
    this._btn = document.createElement('button');
    this._btn.textContent = this.getAttribute('texto') || '';
    this.appendChild(this._btn);
  }

  attributeChangedCallback(nombre, anterior, nuevo) {
    if (nombre === 'texto' && this._btn) {
      this._btn.textContent = nuevo;
    }
  }

  get disabled() {
    return this._btn?.disabled ?? false;
  }
  set disabled(valor) {
    if (this._btn) this._btn.disabled = valor;
  }
}

customElements.define('trivia-boton', TriviaBoton);
