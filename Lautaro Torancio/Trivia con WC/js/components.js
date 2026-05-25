/* Integrantes: Lautaro Torancio y Octavio Ulagnero */

class BotonMenuCard extends HTMLElement {
    connectedCallback() {
        const titulo = this.getAttribute('titulo');
        const h3 = document.createElement('h3');
        h3.textContent = titulo;
        this.prepend(h3);
    }
}
customElements.define('boton-menu-card', BotonMenuCard);

class HistorialBoton extends HTMLElement {
    connectedCallback() {
        const fecha   = this.getAttribute('fecha');
        const puntaje = this.getAttribute('puntaje');
        const total   = this.getAttribute('total');

        this.innerHTML = `
            <div class="historial-item">${fecha}: ${puntaje}/${total}</div>
        `;
    }
}
customElements.define('historial-boton', HistorialBoton);

class BtnJugar extends HTMLElement {
    connectedCallback() {
        const texto   = this.getAttribute('texto');
        const idBoton = this.getAttribute('id-boton');

        this.innerHTML = `
            <button id="${idBoton}" class="btn-jugar">${texto}</button>
        `;
    }
}

customElements.define('btn-jugar', BtnJugar);
class OpcionesBoton extends HTMLElement {
    connectedCallback() {
        const letra = this.getAttribute('letra');

        this.innerHTML = `
            <button class="btn-opcion">${letra}</button>
        `;
        this.style.display = 'contents';
    }
}
customElements.define('opciones-boton', OpcionesBoton);