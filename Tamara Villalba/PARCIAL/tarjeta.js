class tarjetaAutor extends HTMLElement{
    static get observedAttributes() {
        return ['name', 'birth-year','top-work','photo-url'];
    }
    constructor(){
        super();
        this.shadow=this.attachShadow({mode:'open'});
    }

    render(){
        const nombre = this.getAttribute('name');
        const nacimiento = this.getAttribute('birth-year');
        const trabajo = this.getAttribute('top-work');
        const url=this.getAttribute('photo-url');


        this.shadow.innerHTML=`
        <div id="nombre">
            <h1>Nombre: ${nombre}</h1>
            <h2>Fecha de nacimiento: ${nacimiento}</h2>
            <h2>Trabajo:${trabajo}</h2>
            <h2>url:${url}</h2>
        </div>
        `;

    }

    connectedCallback(){
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    




}

customElements.define("author-card",tarjetaAutor);