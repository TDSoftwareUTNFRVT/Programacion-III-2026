"use strict";
class AppStatus extends HTMLElement {
    connectedCallback() {
        // se ejecuta cuando el elemento se agrega al DOM
        this.render();
    }
    // 1. Decirle al browser qué atributos observar
    static get observedAttributes() {
        return ["state", "message"];
    }
    // 2. Este callback se ejecuta cada vez que cambia un atributo
    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }
    render() {
        const estado = this.getAttribute("state");
        if (estado === "loading") {
            this.innerHTML = `<div class= "spinner"></div>`;
        }
        else if (estado === "error") {
            const error = this.getAttribute("message");
            this.innerHTML = `<p class="error">${error}</p>`;
        }
        else {
            this.innerHTML = '';
        }
    }
}
customElements.define("app-status", AppStatus);
