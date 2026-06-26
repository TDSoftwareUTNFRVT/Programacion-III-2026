type AppState = "idle" | "loading" | "error" | "empty";

class AppStatus extends HTMLElement {
    connectedCallback(): void {
        // se ejecuta cuando el elemento se agrega al DOM
        this.render();
    }

        // 1. Decirle al browser qué atributos observar
    static get observedAttributes() {
        return ["state", "message"];
    }

    // 2. Este callback se ejecuta cada vez que cambia un atributo
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        this.render()
    }

    private render(): void {
        const estado = this.getAttribute("state") as AppState;
        if (estado === "loading"){
            this.innerHTML = `<div class= "spinner"></div>`
        }
        else if (estado === "error"){
            const error = this.getAttribute("message")
            this.innerHTML = `<p class="error">${error}</p>`
        }
        else{
            this.innerHTML=''
        }
    }
}

customElements.define("app-status", AppStatus);