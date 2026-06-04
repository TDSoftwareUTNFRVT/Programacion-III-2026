class TriviaCard extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' }); // Crear un shadow DOM para encapsular estilos y estructura
        this._pregunta = null; // Inicializar la propiedad pregunta
        this._numeroPregunta = 0;
        this._puntaje = 0;
    }

    // setter para la propiedad pregunta, que se usará para actualizar el contenido del componente
    set pregunta(valor) {
        this._pregunta = valor;
        this._render(); // Renderizar el componente cada vez que se actualice la pregunta 
    }

    set numeroPregunta(valor) {
        this._numeroPregunta = valor;
    }
    
    set puntaje(valor){
        this._puntaje = valor;
    }

    _render() {
        if (!this._pregunta) return;

        const opciones = mezclar([this._pregunta.correct_answer,
             ...this._pregunta.incorrect_answers
        ]);
        this._shadow.innerHTML = `
            <style>
                ${estilosBase()}
                :host {
                    display: block;
                    padding: 1em;
                    font-family: var(--font);
                }
                .pregunta {
                    font-size: 1.2em;
                    margin-bottom: 1em;
                }
                .opciones {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3em;
                }
                button {
                    padding: 0.5em 1em;
                    font-size: 1em;
                    border: 1px solid var(--color-border);
                    border-radius: 6px;
                    cursor: pointer;
                    background-color: var(--color-surface);
                }
                button:hover {
                    background-color: var(--color-bg);
                }
                button.correct {
                    background-color: var(--color-correct);
                    color: white;
                }
                button.incorrect {
                    background-color: var(--color-wrong);
                    color: white;
                }
                button:disabled {
                    cursor: not-allowed;
                    opacity: 0.6;
                }
                button.correct, button.incorrect {
                    opacity: 1;
                }
            </style>
            <div class="card">
                <div class="info">
                <span>Pregunta ${this._numeroPregunta} de 10</span>
                <span>Puntaje: ${this._puntaje}</span>
                </div>
                <p class="pregunta">${decodificarHTML(this._pregunta.question)}</p>
                <div class="opciones">
                    ${opciones.map((op) => `
                        <button data-respuesta="${op}">${decodificarHTML(op)}</button>
                    `).join('')}
                </div>
            </div>
        `;

        this._agregarEventos();
    }

    _agregarEventos() {
        const botones = this._shadow.querySelectorAll('button');

        botones.forEach((btn) => {
            btn.addEventListener('click', () => {
                this._manejarRespuesta(btn);
            });
        });
    }

    _manejarRespuesta(btn) {
        this._deshabilitarBotones();
        const opcionElegida = btn.dataset.respuesta;
        const esCorrecta = opcionElegida === this._pregunta.correct_answer;

        this._mostrarFeedback(btn, esCorrecta);

        setTimeout(() => {
            this._emitirRespuesta(esCorrecta);
        }, 1000);
    }

    _deshabilitarBotones() {
        this._shadow.querySelectorAll('button').forEach(b => b.disabled = true);
    }

    _mostrarFeedback(btn, esCorrecta) {
        btn.classList.add(esCorrecta ? 'correct' : 'incorrect');
        if (!esCorrecta) {
            this._shadow.querySelectorAll('button').forEach(btn => {
                if (btn.dataset.respuesta === this._pregunta.correct_answer) {
                    btn.classList.add('correct');
                }
            });  
        }
    }

    _emitirRespuesta(esCorrecta) {
        this.dispatchEvent(new CustomEvent('respondida', {
            detail: { correcta: esCorrecta },
            bubbles: true,
        }));
    }


}

customElements.define('trivia-card', TriviaCard);