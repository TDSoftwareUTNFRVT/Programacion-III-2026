/* Integrantes: Lautaro Torancio y Octavio Ulagnero */

class BotonVista extends HTMLElement {
    connectedCallback() {
        const tipo = this.getAttribute('tipo') || 'menu';
        const colores = {
            menu:      'background: #ffb300;',
            juego:     'background: #ffb300;',
            resultado: 'background: #ffb300;'
        };
        this.style.cssText = `
            width: 100%;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
            ${colores[tipo] || colores.menu}
        `;
    }
}
if (!customElements.get('boton-vista-menu')) {
    customElements.define('boton-vista-menu', BotonVista);
}
class HistorialBoton extends HTMLElement {
    connectedCallback() {
        const fecha   = this.getAttribute('fecha')   || '-';
        const puntaje = this.getAttribute('puntaje') || '0';
        const total   = this.getAttribute('total')   || '0';

        this.style.cssText = `
            display: block;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
            font-size: 13px;
            color: #555;
            font-family: Arial, Helvetica, sans-serif;
        `;

        this.textContent = fecha + ': ' + puntaje + '/' + total;
    }
}
if (!customElements.get('historial-boton')) {
    customElements.define('historial-boton', HistorialBoton);
}
class BotonMenuCard extends HTMLElement {
    connectedCallback() {
        const titulo = this.getAttribute('titulo') || '';

        this.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        const h3 = document.createElement('h3');
        h3.textContent = titulo;
        h3.style.cssText = `
            margin: 0;
            font-size: 12px;
            color: #4502fb;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #4502fb;
            padding-bottom: 4px;
            font-family: Arial, Helvetica, sans-serif;
        `;
        this.insertBefore(h3, this.firstChild);
    }
}

if (!customElements.get('boton-menu-card')) {
    customElements.define('boton-menu-card', BotonMenuCard);
}
class BtnJugar extends HTMLElement {
    connectedCallback() {
        const texto   = this.getAttribute('texto')    || 'JUGAR';
        const idBoton = this.getAttribute('id-boton') || '';

        const boton = document.createElement('button');
        boton.textContent = texto;
        boton.id = idBoton;
        boton.style.cssText = `
            background: #4502fb;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 14px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            letter-spacing: 1px;
            width: 100%;
            font-family: Arial, Helvetica, sans-serif;
        `;

        boton.addEventListener('mouseover', function() {
            boton.style.background = '#3300cc';
        });
        boton.addEventListener('mouseout', function() {
            boton.style.background = '#4502fb';
        });
        this.style.display = 'block';
        this.style.width = '100%';
        this.appendChild(boton);
    }
}
if (!customElements.get('btn-jugar')) {
    customElements.define('btn-jugar', BtnJugar);
}

class OpcionesBoton extends HTMLElement {
    connectedCallback() {
        const letra = this.getAttribute('letra') || 'A';

        const boton = document.createElement('button');
        boton.textContent = letra;
        boton.className = 'btn-opcion';

        this.appendChild(boton);
        this.style.display = 'contents';
    }
}
if (!customElements.get('opciones-boton')) {
    customElements.define('opciones-boton', OpcionesBoton);
}
