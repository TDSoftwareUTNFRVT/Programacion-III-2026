class TriviaLoading extends HTMLElement {

    connectedCallback(){
        this.innerHTML=`
            <div class="flex-display column center-xy full-size bg-lightblue">
                <div id="loading-msg" class="loading-msg flex-display column center-xy bg-white border-radius-soft shadow-soft">
                    <p id="loading-questions" class="font-montserrat m-font text-centered">Cargando preguntas...</p>
                </div>
            </div>
        `
    }

}

customElements.define('trivia-loading',TriviaLoading);