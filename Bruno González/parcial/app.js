let valor_selector = 0;

class bookapi {
    async getlibros(query, page = 1, limit) {
        try {
            const response = await fetch(`https://openlibrary.org/search.json?q=${query}&page;=${page}&limit;=${limit}`);

            if (!response.ok) {
                throw new Error(`Error ${response.statusText}: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error(`Falló la petición: ${error.message}`);
            throw error;
        }
    }
}

const apibook = new bookapi();

const contenedor_resultados = document.getElementById('results');

const selector = document.getElementById('selector');
selector.addEventListener('click', () => {
    valor_selector = selector.value;
});

const entrada_texto = document.getElementById('entrada_texto');

const template = document.createElement('template');
template.innerHTML = `
<style>
    .card {
        display: flex;
        flex-direction: column;
        width: 200px;
        height: 200px;
        background: yellow;
    }

    img {
        width: 100px;
        height: 100px;
    }
</style>
<div class="card">
    <slot name="title">Título del libro</slot>
    <slot name="author">Autor del libro</slot>
    <slot name="year">Año de publicación del libro</slot>
    <slot name="cover-url">Portada del libro</slot>
</div>`;

class BookCard extends HTMLElement {
    static getObservedAttributes() {
        return ['title', 'author', 'year', 'cover-url'];
    }

    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        console.log('Elemento insertado en el DOM');

        const boton_buscar = document.getElementById('boton-buscar');
        boton_buscar.addEventListener('click', () => {
            valor_selector = selector.value;
            this.libros = apibook.getlibros(entrada_texto.value, 1, valor_selector);
            console.log(this.libros);
            this.render();
        });
    }

    AttributeChangedCallback(nombre, anterior, nuevo) {
        console.log(`${nombre} cambió de ${anterior} a ${nuevo}`);
        this.render();
    }

    DisconnectedCallback() {
        console.log('Elemento eliminado del DOM');
    }

    render() {
        const titulo = this.getAttribute('title') || '';
        const autor = this.getAttribute('author') || '';
        const año_publicacion = this.getAttribute('year') || '';
        const portada_url = this.getAttribute('cover-url') || '';

        this.shadow.innerHTML = `<div class="card">
                                    <span slot="title">${titulo}</span>
                                    <span slot="author">${autor}</span>
                                    <span slot="year">${año_publicacion}</span>
                                    <span slot="cover-url">${portada_url}</span>
                                </div>`;

        contenedor_resultados.innerHTML = this.libros.map(libro => `<div class="card">
                                    <span slot="title">${titulo}</span>
                                    <span slot="author">${autor}</span>
                                    <span slot="year">${año_publicacion}</span>
                                    <span slot="cover-url">${portada_url}</span>
                                </div>`).join('');
    }
}

customElements.define('book-card', BookCard);