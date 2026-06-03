class TriviaResultado extends HTMLElement {
    connectedCallback(){
        this.innerHTML=`
            <div class="flex-display column center-xy full-size bg-lightblue">
                <div class="final-message-container flex-display column center-xy border-radius-soft">
                    <p id="final-message" class="final-score-msg font-bebas-neue font-white text-centered font-550"></p>
                    <p id="final-greeting" class="final-greeting-msg font-bebas-neue font-white text-centered font-550">
                        ¡Gracias por haber jugado!</p>
                </div>
                <div class="final-score-container flex-display column center-xy">
                    <p id="final-score" class="final-score text-centered font-karla font-white font-550">[Puntaje final]</p>
                </div>
                <div class="last-scores-container flex-display column center-xy bg-white border-radius-soft shadow-soft">
                    <ol id="last-scores" class="last-scores no-bullet-points text-centered font-karla font-black">Últimos
                        puntajes:
                    </ol>
                </div>
                <div class="btn-play-replay-container">
                    <button id="btn-replay"
                        class="btn-start-replay bg-white font-black font-karla border-radius-soft">Volver a jugar</button>
                </div>
            </div>
        `
        this.querySelector("#btn-replay").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("reiniciar", { bubbles: true }));
        });
    }
    mostrarResultado(puntaje) {

        this.querySelector("#final-score").innerText = `Puntaje total: ${puntaje}`;

        let mensajeFinal = this.querySelector("#final-message");
        if (puntaje <= 19) {
            mensajeFinal.innerText = "La próxima te va mejor, ¡nadie nace sabiendo!";
        } else if (puntaje <= 39) {
            mensajeFinal.innerText = "Hay camino por recorrer, ¡pero se aprende jugando!";
        } else if (puntaje <= 59) {
            mensajeFinal.innerText = "Mitad y mitad... El conocimiento no te sobra, pero tampoco te falta.";
        } else if (puntaje <= 79) {
            mensajeFinal.innerText = "¡Buen juego! Sabés más de lo que pensabas.";
        } else {
            mensajeFinal.innerText = "¡Sos un genio! La trivia no te para.";
        };
    }
    mostrarHistorial(historial) {
        let contenedor = this.querySelector("#last-scores");
        contenedor.innerText = "";
        historial.forEach(reg => {
            let registro = document.createElement("li");
            registro.innerText = `Fecha: ${reg.fecha} - Puntaje: ${reg.puntaje}`;
            contenedor.appendChild(registro);
        });
    }

}

customElements.define("trivia-resultado",TriviaResultado)