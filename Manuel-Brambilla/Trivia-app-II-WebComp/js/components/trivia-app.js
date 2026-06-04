class TriviaApp extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        this._game = new TriviaGame();
        this._api = new TriviaAPI();
    }
    connectedCallback() {
        this._mostrarInicio();

    }
    _mostrarInicio() {
        this._shadow.innerHTML = `
            <style>
                ${estilosBase()}
                :host {
                    display: block;
                    font-family: var(--font);
                    width: 100%;
                    box-sizing: border-box;
                }
                input, select, button {
                    padding: 0.5em;
                    font-size: 1em;
                    margin-top: 0.5em;
                    width: 100%;
                    border: 1px solid var(--color-border);
                    border-radius: 6px;
                }
                button {
                    background-color: var(--color-accent);
                    color: white;
                    cursor: pointer;
                    border: none;
                }
                
            </style>
            <div class="card">
                <h1>Trivia Game</h1>
                <input type="text" id="nombre" placeholder="Ingresa tu nombre" />
                
                <select id="dificultad">
                    <option value="">Aleatorio</option>
                    <option value="easy">Fácil</option>
                    <option value="medium">Medio</option>
                    <option value="hard">Difícil</option>
                </select>

                <select id="categoria">
                    <option value="">Todas las categorías</option>
                </select>

                <button id="iniciar">Iniciar Juego</button>
            </div>
            
            
            
        `;

        this._cargarCategorias();
        this._agregarEventoJugar();

    }

    async _cargarCategorias() {
        try {
            const categorias = await this._api.getCategorias();
            const select = this._shadow.getElementById('categoria');

            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    }

    _agregarEventoJugar() {
        this._shadow.getElementById('iniciar').addEventListener('click', () => {
            this._iniciarJuego();
        });
    }
    
    async _iniciarJuego() {
        const nombre = this._shadow.getElementById('nombre').value.trim();
        if (!nombre) {
            alert('Por favor, ingresa tu nombre para comenzar.');
            return;
        }

        const dificultad = this._shadow.getElementById('dificultad').value;
        const categoria = this._shadow.getElementById('categoria').value;
        this._nombre = nombre;
        this.dificultad = dificultad;
        this.categoria = categoria;

        try {
            const preguntas = await this._api.getPreguntas(10, categoria, dificultad);
            this._game.iniciar(preguntas);
            this._mostrarPregunta();
        } catch (error) {
            this._mostrarError("No se pudieron cargar las preguntas. Intenta nuevamente.");
        }
    }
    _mostrarPregunta() {
        this._shadow.innerHTML = '';
        const card = document.createElement('trivia-card');       
        this._shadow.appendChild(card);

        card.addEventListener('respondida', (e) => {
            if (e.detail.correcta) this._game.puntaje++;
            this._game.siguiente();
            if (this._game.haTerminado()) {
                this._mostrarResultado();
            } else {
                this._mostrarPregunta();
            }
            
        });
        
        card.numeroPregunta = this._game.preguntaActual + 1;
        card.puntaje = this._game.puntaje;
        card.pregunta = this._game.getPreguntaActual();       
    }

    _mostrarResultado() {
        this._shadow.innerHTML = '';
        const result = document.createElement('trivia-result');
        this._shadow.appendChild(result);
        result.nombre = this._nombre;
        result.game = this._game;        
        result.addEventListener('reiniciar', () => {
            this._mostrarInicio();
        });
    }

    _mostrarError(msg) {
        this._shadow.innerHTML = `
            <style>
                ${estilosBase()}
                :host {
                    font-family: var(--font);
                    display: block;
                    width: 100%;
                    box-sizing: border-box;
                }
                button {
                    margin-top: 1em;
                    padding: 0.5em 1em;
                    cursor: pointer;
                    border-radius: 6px;
                    border: none;
                    background: var(--color-accent);
                    color: white;
                }
            </style>
            <div class="card">    
                <p style="color:red;">${msg}</p>
                <button id="btn-reintentar">Reintentar</button>
            </div>

        `;
        this._shadow.getElementById('btn-reintentar')
            .addEventListener('click', () => this._mostrarInicio());
    }
    
}

customElements.define('trivia-app', TriviaApp);

