let valor_selector = 0;
let pagina = 1;

const contenedor_resultados = document.getElementById('results');

const entrada_texto = document.getElementById('entrada_texto');

const indice_pagina = document.getElementById('page-index');

const boton_retroceder = document.getElementById('before-button');
const boton_avanzar = document.getElementById('after-button');

const boton_buscar = document.getElementById('boton-buscar');

class bookapi {
    async getlibros(query, page = 1, limit) {
        contenedor_resultados.textContent = 'Buscando...';

        try {

            const response = await fetch(`https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${limit}`);

            if (!response.ok) {
                throw new Error(`Error ${response.statusText}: ${response.status}`);
            }

            const data = await response.json();

            contenedor_resultados.textContent = '';

            return data;

        } catch (error) {
            console.error(`Falló la petición: ${error.message}`);
            contenedor_resultados.textContent = `Ha ocurrido un fallo durante la búsqueda: [${error.message}]`;
            throw error;
        }
    }
}

const apibook = new bookapi();

const template = document.createElement('template');
template.innerHTML = `
<style>
    .card {
        display: flex;
        flex-direction: column;
        height: 50vh;
        width: 25vw;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        border: 2px solid blue;
    }

    img {
        width: 100px;
        height: 100px;
    }
</style>`;

class BookCard extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'author', 'year', 'cover-url'];
    }

    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        console.log('Elemento insertado en el DOM');
    }

    attributeChangedCallback(nombre, anterior, nuevo) {
        console.log(`${nombre} cambió de ${anterior} a ${nuevo}`);
        this.render();
    }

    disconnectedCallback() {
        console.log('Elemento eliminado del DOM');
    }

    render() {
        const titulo = this.getAttribute('title') || '';
        const autor = this.getAttribute('author') || '';
        const año_publicacion = this.getAttribute('year') || '';
        const portada_url = this.getAttribute('cover-url') || '';

        this.shadow.innerHTML = `
                                <style>
                                    .card {
                                        display: flex;
                                        flex-direction: column;
                                        height: 50vh;
                                        width: 25vw;
                                        flex-wrap: wrap;
                                        justify-content: center;
                                        align-items: center;
                                        border: 2px solid blue;
                                    }

                                    img {
                                        width: 100px;
                                        height: 100px;
                                    }

                                    @media (max-width: 600px) {
                                        .card {
                                            width: 100vw;
                                        }
                                    }
                                </style>
                                <div class="card">
                                    <h2>${titulo}</h2>
                                    <p>${autor}</p>
                                    <p>${año_publicacion}</p>
                                    <img src="${portada_url || 'placeholder.jpg'}" alt="portada.jpg">
                                </div>`;
    }
}

customElements.define('book-card', BookCard);

async function obtenerLibros() {
    contenedor_resultados.innerHTML = '';
    
    valor_selector = Number(selector.value);

    const libros = await apibook.getlibros(entrada_texto.value, pagina, valor_selector);

    libros.docs.forEach(libro => {
        const bookCard = document.createElement('book-card');
        // Se instancia igual que cualquier etiqueta

        bookCard.setAttribute('title', libro.title || 'Título no encontrado');
        //                      nombre del atributo, valor
        bookCard.setAttribute('author', libro.author_name[0] || 'Autor desconocido');
        bookCard.setAttribute('year', libro.first_publish_year || 'Año no especificado');
        bookCard.setAttribute('cover-url', `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg` || 'Portada no encontrada');
        // (||): "O" lógico, se usa para declarar un valor por defecto si el primero resulta falso, o no aparece, o cualquier error que pueda pasar

        contenedor_resultados.appendChild(bookCard);
    });

    const total_paginas = Math.ceil(libros.numFound / valor_selector);
                        // (Math.ceil): Función de JS que sirve para redondear hacia arriba al entero más cercano

    // if (pagina === 1) {
    //     boton_retroceder.setAttribute('disabled', true);
    // }

    if (pagina === total_paginas) {
        boton_avanzar.setAttribute('disabled', true);
    }

    if (total_paginas === 0) {
        contenedor_resultados.textContent = 'No se encontraron resultados para esa búsqueda :(';
    } else {
        boton_retroceder.style.display = "flex";
        boton_avanzar.style.display = "flex";

        indice_pagina.textContent = `Página ${pagina} de ${total_paginas}`;
    }
}

// USAR SIEMPRE ASYNC Y AWAIT PARA OBTENER EL RESULTADO REAL Y NO LA PROMESA, AUNQUE LA FUNCION QUE HICE ANTES CAPAZ LO TENGA APLICADO PONERLO IGUAL PARA EVITAR PROBLEMAS EN CUALQUIER OTRO AMBITO EXTERNO

boton_buscar.addEventListener('click', async () => {
    pagina = 1;
    obtenerLibros();
});

boton_retroceder.addEventListener('click', async () => {
    if (pagina > 1) {
        pagina --;
        obtenerLibros();
    }
});

boton_avanzar.addEventListener('click', async () => {
    pagina ++;
    obtenerLibros();
});