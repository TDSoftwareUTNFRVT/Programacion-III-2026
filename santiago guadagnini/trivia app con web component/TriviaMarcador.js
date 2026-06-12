class TriviaMarcador extends HTMLElement {
  static get observedAttributes() {
    return ['puntaje', 'progreso'];
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback() {
    this._render();
  }

  _render() {
    const puntaje = this.getAttribute('puntaje') || '0';
    const progreso = this.getAttribute('progreso') || '';
    this.innerHTML = `
      <span>Puntaje: ${puntaje}</span>
      <span>${progreso}</span>
    `;
  }
}

customElements.define('trivia-marcador', TriviaMarcador);
