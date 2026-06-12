class TriviaSelect extends HTMLElement {
  connectedCallback() {
    const labelTexto = this.getAttribute('label') || '';
    const selectId = this.getAttribute('select-id') || '';
    const optionsAttr = this.getAttribute('options') || '';
    const porDefecto = this.getAttribute('default') || '';
    let optionsHTML = '';
    if (optionsAttr) {
      optionsHTML = optionsAttr.split('|').map(par => {
        const [valor, texto] = par.split(':');
        const selected = valor === porDefecto ? ' selected' : '';
        return `<option value="${valor}"${selected}>${texto}</option>`;
      }).join('');
    }
    this.innerHTML = `
      <label for="${selectId}">${labelTexto}</label>
      <select id="${selectId}">${optionsHTML}</select>
    `;
  }
}

customElements.define('trivia-select', TriviaSelect);
