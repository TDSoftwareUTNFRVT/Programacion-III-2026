const template = document.createElement("template");

template.innerHTML = `
<style>
    .flex-display {
        display: flex;
    }

    .column {
        flex-direction: column;
    }

    .row {
        flex-direction: row;
    }

    .center-xy {
        align-items: center;
        justify-content: center;
    }

    .center-x {
        align-items: center;
    }

    .full-size {
        height: 100vh;
        width: 100%;
    }

    .full-width {
        width: 100%;
    }

    .bg-lightblue {
        background-color: var(--color-lightblue);
    }

    .bg-white {
        background-color: var(--color-white);
    }

    .bg-grey {
        background-color: var(--color-grey);
    }

    .font-black {
        color: var(--color-black);
    }

    .font-luckiest-guy {
        font-family: var(--font-luckiest-guy);
    }

    .font-montserrat {
        font-family: var(--font-montserrat);
    }

    .font-karla {
        font-family: var(--font-karla);
    }

    .font-bebas-neue {
        font-family: var(--font-bebas-neue);
    }

    .border-radius-soft {
        border-radius: 10px;
    }

    .border-solid {
        border: var(--border-solid);
    }

    .shadow-soft {
        box-shadow: var(--shadow-soft);
    }

    .opacity-transition {
        opacity: 1;
        transition: opacity 0.5s ease-in-out;
    }

    .font-550 {
        font-weight: 550;
    }

    .font-700 {
        font-weight: 700;
    }

    .title-container {
        margin: 1rem;
        border-radius: 100%;
        padding: 1.25rem;
    }

    .title {
        font-size: var(--font-size-xxlarge);
        margin: 0.5rem;
        text-align: center;
        font-weight: 450;
    }

    .difficulty-container {
        margin: 0.75rem;
    }

    .categories-container {
        margin: 0.75rem;
    }

    .subtitle {
        font-size: var(--font-size-medium);
        margin: 0.25rem;
    }

    .btn-difficulty {
        font-size: var(--font-size-small);
        padding: 0.4rem 0.6rem;
        margin: 0.25rem;
        border: none;
        cursor: pointer;
    }

    .btn-difficulty:hover {
        transform: translateY(-2px);
        transition: all 0.35s ease;
    }

    .btn-difficulty:active {
        transform: translateY(0);
        transition: all 0.35s ease;
        box-shadow: 0px 0px 15px 3px #5d5d5d;
    }

    .select-category {
        font-size: var(--font-size-small);
        padding: 0.4rem 0.6rem;
        margin: 0.25rem;
        border: none;
        cursor: pointer;
        background-color: var(--color-white);
        color: var(--color-black);
        appearance: none;
        text-align: center;
        min-width: 160px;
    }

    .select-category:focus {
        outline: none;
        box-shadow: 0px 0px 15px 3px #5d5d5d;
    }

    .btn-play-container {
        margin-top: 0.75rem;
    }

    .btn-start-replay {
        font-size: var(--font-size-medium);
        padding: 0.5rem 1rem;
        border: none;
        cursor: pointer;
        margin: 0.5rem;
    }

    .btn-start-replay:hover {
        transform: translateY(-2px);
        transition: all 0.35s ease;
    }

    .btn-start-replay:active {
        transform: translateY(0);
        transition: all 0.35s ease;
        box-shadow: 0px 0px 15px 3px #5d5d5d;
    }
</style>

<div id="start-screen" class="full-size opacity-transition">
    <div class="flex-display column center-xy full-size bg-lightblue">
        <div class="title-container center-x bg-white shadow-soft border-solid">
            <h1 class="title font-luckiest-guy font-black">Trivia<br>Game</h1>
        </div>
        <div class="difficulty-container flex-display column center-xy full-width">
            <div class="row center-x">
                <p class="subtitle font-bebas-neue">Selecciona una dificultad:</p>
            </div>
            <div class="row center-x">
                <button id="btn-easy" class="btn-difficulty bg-white font-black font-karla border-radius-soft">Fácil</button>
                <button id="btn-medium" class="btn-difficulty bg-white font-black font-karla border-radius-soft">Medio</button>
                <button id="btn-hard" class="btn-difficulty bg-white font-black font-karla border-radius-soft">Difícil</button>
            </div>
        </div>
        <div class="categories-container flex-display column center-xy">
            <div class="row center-x">
                <p class="subtitle font-bebas-neue">Selecciona una categoría:</p>
            </div>
            <div class="row center-x">
                <select name="categories" id="categories" class="select-category font-karla border-radius-soft shadow-soft">
                </select>
            </div>
        </div>
        <div class="btn-play-container row center-x">
            <button id="btn-start" class="btn-start-replay bg-white font-black font-karla border-radius-soft">Jugar</button>
        </div>
    </div>
</div>
`;

class StartScreen extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });

        this.shadow.appendChild(template.content.cloneNode(true));

        this.difficulty = "";
    }

    seleccionarDificultad(boton, valor) {
        this.shadowRoot.querySelectorAll(".btn-difficulty").forEach(btn => {
            btn.classList.remove("bg-grey");
        });
        boton.classList.add("bg-grey");
        this.difficulty = valor;
    }

    connectedCallback() {
        const btnEasy = this.shadow.getElementById("btn-easy");
        const btnMedium = this.shadow.getElementById("btn-medium");
        const btnHard = this.shadow.getElementById("btn-hard");
        const btnStart = this.shadow.getElementById("btn-start");

        btnEasy.addEventListener("click", () => {
            this.seleccionarDificultad(btnEasy, "easy");
        });
        btnMedium.addEventListener("click", () => {
            this.seleccionarDificultad(btnMedium, "medium");
        });
        btnHard.addEventListener("click", () => {
            this.seleccionarDificultad(btnHard, "hard");
        });
        btnStart.addEventListener("click", async () => {
            this.dispatchEvent(new CustomEvent("game-started", {
                bubbles: true,
                composed: true,
                detail: {
                    difficulty: this.difficulty,
                    category: this.shadowRoot.getElementById("categories").value
                }
            }));
        });
    }

    static get observedAttributes() {
        return ["categories"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        try {
            if (name === "categories") {
                const categories = JSON.parse(newValue);
                const selector = this.shadowRoot.getElementById("categories");

                categories.forEach(category => {
                    let option = document.createElement("option");
                    option.value = category.id;
                    option.innerText = category.name;
                    selector.appendChild(option);
                });
            }
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    }
}

customElements.define("start-screen", StartScreen);