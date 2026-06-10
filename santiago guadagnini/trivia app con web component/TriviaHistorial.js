class TriviaHistorial extends HTMLElement {
  connectedCallback() {
    this.classList.add('oculto');
  }

  setPartidas(partidas) {
    if (!partidas || partidas.length === 0) {
      this.classList.add('oculto');
      return;
    }

    const items = partidas
      .map(p => `<li>${p.fecha} — ${p.puntaje}/${p.total}</li>`)
      .join('');

    this.innerHTML = `
      <h3>Historial de partidas</h3>
      <ul>${items}</ul>
    `;

    this.classList.remove('oculto');
  }
}

customElements.define('trivia-historial', TriviaHistorial);
