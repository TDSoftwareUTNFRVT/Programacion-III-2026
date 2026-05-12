class MiBoton extends HTMLElement {
    constructor(){
        super();
        this.innerHTML = `
        <style>
        .mi-boton{
        
        color:white;
        background-color: red;
        padding: 5px;
        border: 1px solid black;
        border-radius: 4px;
        }
        </style>
        <button class="mi-boton">
        ¡Soy un botón personalizado!
        </button>`;

    }
}

customElements.define("mi-boton", MiBoton)