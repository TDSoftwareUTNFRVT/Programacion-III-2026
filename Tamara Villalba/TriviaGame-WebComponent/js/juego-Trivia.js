class TriviaJuego extends HTMLElement {

    connectedCallback() {
        this.innerHTML = `
            <div class="flex-display column center-xy full-size bg-lightblue">
                <div class="score-container flex-display center-xy bg-white border-radius-soft">
                    <p id="score" class="text-centered font-karla font-700">Puntaje: 0</p>
                </div>
                <div class="trivia-container flex-display column center-xy">
                    <div class="question-container flex-display column center-xy bg-white border-radius-soft shadow-soft">
                        <p id="current-question" class="font-karla m-font text-centered"></p>
                        <p id="question" class="font-montserrat text-centered font-700"></p>
                    </div>
                    <div id="answers-container" class="answers-container flex-display center-xy">
                    </div>
                </div>
            </div>
        `;
    }

    mostrarPregunta(pregunta, numeroPregunta, totalPreguntas) {
        this.querySelector("#current-question").innerText = `Pregunta ${numeroPregunta} de ${totalPreguntas}`;
        this.querySelector("#question").innerText = pregunta;
    }

    mostrarRespuestas(respuestas, correcta) {
        let contenedorRespuestas = this.querySelector("#answers-container");
        contenedorRespuestas.innerText = "";
        let botonCorrecto;

        respuestas.forEach(respuesta => {
            let botonRespuesta = document.createElement("button");
            botonRespuesta.innerText = respuesta;
            botonRespuesta.classList.add("btn-answer", "bg-white", "border-radius-soft", "font-bebas-neue");
            
            if (respuesta === correcta) {
                botonCorrecto = botonRespuesta;
            }

            botonRespuesta.addEventListener("click", () => {
                this.querySelectorAll(".btn-answer").forEach(btn => btn.disabled = true);

                this.dispatchEvent(new CustomEvent("respuesta", { 
                    bubbles: true, 
                    detail: { respuesta, correcta } 
                }));

                if (respuesta === correcta) {
                    botonRespuesta.classList.add("estilo-correcto");
                } else {
                    botonRespuesta.classList.add("estilo-incorrecto", "shake-style");
                    botonCorrecto.classList.add("estilo-resaltar");
                }

                setTimeout(() => {
                    this.dispatchEvent(new CustomEvent("siguiente", { bubbles: true }));
                }, 1000);
            });

            contenedorRespuestas.appendChild(botonRespuesta);
        });
    }
    actualizarPuntaje(puntaje) {
        this.querySelector("#score").innerText = `Puntaje: ${puntaje}`;
    }
}

customElements.define('trivia-juego', TriviaJuego);