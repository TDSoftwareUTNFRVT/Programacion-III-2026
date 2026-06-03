class TriviaError extends HTMLElement {
    
    connectedCallback() {
        this.innerHTML = `
            <div class="flex-display column center-xy full-size bg-lightblue">
                <div class="error-container flex-display column center-xy bg-white border-radius-soft shadow-soft">
                    <p id="error-msg" class="font-montserrat text-centered font-550">Ha ocurrido un error</p>
                </div>
                <div class="btn-retry-container">
                    <button id="btn-retry" class="btn-retry bg-white font-black font-karla border-radius-soft">
                        Reintentar
                    </button>
                </div>
            </div>
        `;

        this.querySelector("#btn-retry").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("reintentar", { bubbles: true }));
        });
    }

    mostrar(mensaje) {
        this.querySelector("#error-msg").innerText = mensaje;
        this.classList.remove("hidden");
    }

    ocultar() {
        this.classList.add("hidden");
    }
}

customElements.define('trivia-error', TriviaError);