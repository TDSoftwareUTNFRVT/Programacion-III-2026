class TriviaInicio extends HTMLElement {
    
    connectedCallback(){
        this.innerHTML=`
            <div class="flex-display column center-xy full-size bg-lightblue">
                <div class="title-container center-x bg-white shadow-soft border-solid">
                    <h1 class="title font-luckiest-guy font-black">Trivia<br>Game</h1>
                </div>
                <div class="difficulty-container flex-display column center-xy full-width">
                    <div class="row center-x">
                        <p class="subtitle font-bebas-neue">Selecciona una dificultad:</p>
                    </div>
                    <div class="row center-x">
                        <button id="btn-easy"
                            class="btn-difficulty bg-white font-black font-karla border-radius-soft">Fácil</button>
                        <button id="btn-medium"
                            class="btn-difficulty bg-white font-black font-karla border-radius-soft">Medio</button>
                        <button id="btn-hard"
                            class="btn-difficulty bg-white font-black font-karla border-radius-soft">Difícil</button>
                    </div>
                </div>
                <div class="categories-container flex-display column center-xy">
                    <div class="row center-x">
                        <p class="subtitle font-bebas-neue">Selecciona una categoría:</p>
                    </div>
                    <div class="row center-x">
                        <select name="categories" id="categories"
                            class="select-category font-karla border-radius-soft shadow-soft">
                        </select>
                    </div>
                </div>
                <div class="btn-play-container row center-x">
                    <button id="btn-start"
                        class="btn-start-replay bg-white font-black font-karla border-radius-soft">Jugar</button>
                </div>
            </div>
        `;
        
        this.querySelector("#btn-start").addEventListener("click", ()=>{
            let categoria = this.querySelector("#categories").value;
            this.dispatchEvent(new CustomEvent("jugar",{bubbles:true, detail:categoria}))
        })

        this.querySelector("#btn-easy").addEventListener("click", () => {
            this.querySelectorAll(".btn-difficulty").forEach(btn => btn.classList.remove("bg-grey"));
            this.querySelector("#btn-easy").classList.add("bg-grey");
            this.dispatchEvent(new CustomEvent("dificultad", { bubbles: true, detail: "easy" }));
        });

        this.querySelector("#btn-medium").addEventListener("click", () => {
            this.querySelectorAll(".btn-difficulty").forEach(btn => btn.classList.remove("bg-grey"));
            this.querySelector("#btn-medium").classList.add("bg-grey");
            this.dispatchEvent(new CustomEvent("dificultad", { bubbles: true, detail: "medium" }));
        });

        this.querySelector("#btn-hard").addEventListener("click", () => {
            this.querySelectorAll(".btn-difficulty").forEach(btn => btn.classList.remove("bg-grey"));
            this.querySelector("#btn-hard").classList.add("bg-grey");
            this.dispatchEvent(new CustomEvent("dificultad", { bubbles: true, detail: "hard" }));
        });

    }

    cargarCategorias(categorias) {
        let selector = this.querySelector("#categories");
        categorias.forEach(categ => {
            let nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = categ.id;
            nuevaOpcion.innerText = categ.name;
            selector.appendChild(nuevaOpcion);
        });
    }
    
}
customElements.define('trivia-inicio',TriviaInicio);
   