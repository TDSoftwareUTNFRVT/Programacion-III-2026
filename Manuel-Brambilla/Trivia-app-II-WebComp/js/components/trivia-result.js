class TriviaResult extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' }); // Crear un shadow DOM para encapsular estilos y estructura
        this._game = null;// Preguntas respondidas correctamente
        this._nombre = ''; // Inicializar la propiedad nombre

    }

    set game(valor) {
        this._game = valor;
        this._guardarHistorial(); // Guardar el resultado en el historial cada vez que se actualice el juego
        this._render(); // Renderizar el componente cada vez que se actualice el juego
    }

    set nombre(valor) {
        this._nombre = valor;
    }

    _guardarHistorial() {
        const historial = JSON.parse(localStorage.getItem('historial')) || [];
        historial.push({
            nombre: this._nombre,
            puntaje: this._game.puntaje,
            preguntas: this._game.preguntas.length
        });
        const ultimos5 = historial.slice(-5); // Obtener solo los últimos 5 resultados
        localStorage.setItem('historial', JSON.stringify(ultimos5));
    }
    
    _renderHistorial(historial) {
        return historial.map(p => `
            <li>${p.nombre}: ${p.puntaje} / ${p.preguntas}</li>
        `).join('');
    }

    _render() {
        console.log('render result', this._game, this._nombre); // ← temporal
        if (!this._game) return;
        
        const historial = JSON.parse(localStorage.getItem('historial')) || [];

        this._shadow.innerHTML = `
            <style>
                ${estilosBase()}
                :host {
                    display: block;
                    padding: 1em;
                    text-align: center;
                    font-family: var(--font);
                }
                h2 {margin-bottom: 0.5em;}
                ul {
                    list-style: none;
                    padding: 0;
                    margin-top: 1em;
                    text-align: left;
                }
                li {
                    padding: 0.3em 0;
                    border-bottom: 1px solid #eee;
                }
            </style>
            <div class="card">
                <h2>¡Juego Terminado!</h2>
                <p>${this._nombre} tu puntaje es ${this._game.puntaje} de ${this._game.preguntas.length}.</p>
                <h3>Historial de Puntajes</h3>
                <ul>
                    ${this._renderHistorial(historial)}
                </ul>
                <button id="btn-reiniciar">Juego Nuevo</button>
            </div>
            `;

    this._shadow.getElementById('btn-reiniciar').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('reiniciar', { bubbles: true}));
    });
    }
}

customElements.define('trivia-result', TriviaResult);