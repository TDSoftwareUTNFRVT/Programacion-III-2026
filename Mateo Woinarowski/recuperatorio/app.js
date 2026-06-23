const query = document.getElementById('input-query')
const btn_buscar = document.getElementById('fnc-buscar')
const resultados = document.getElementById('results')
const limit = document.getElementById('select-limit')
const contador = document.getElementById('contador')
const btn_anterior = document.getElementById('btn-anterior')
const btn_siguiente = document.getElementById('btn-siguiente')
const btn_limpiar = document.getElementById('fnc-limpiar')

let pagina_actual = 1
let total_paginas = 1
let query_actual = ""
let limite_actual = 10

class musicApi{
    async getArtista(query, offset = 1, limit){
        try{
            const response = await fetch(`https://musicbrainz.org/ws/2/artist/?query=${query}&offset=${offset}&limit=${limit}&fmt=json`)
            if(!response.ok){throw new Error(`Error HTTP:${response.status}`)}
            const data = await response.json();
            console.log(data);
            return data
        }   catch(error){console.error(`Fallo la peticion ${error.message}`)
            throw error}
    }
}
const api = new musicApi()

class cartaArtista extends HTMLElement{
    static get observedAttributes(){
        return ["name", "country", "type", "score"]
    }
    constructor(){
        super()
        this.shadow = this.attachShadow({mode:"open"})
    }
    connectedCallback(){
        this.render()
    }

    render(){
        const nombre = this.getAttribute("name") || "Nombre desconocido"
        const region = this.getAttribute("country") || "Pais desconocido"
        const tipo = this.getAttribute("type") || "Tipo de banda desconocido"
        const puntuacion = this.getAttribute("score") || "Puntuacion desconocida"
        this.shadow.innerHTML = `
        <style>
        .artist-card{
        width:200px;
        height:400px;
        border-radius:8px;
        background-color:gray;
        display:flex;
        border:1px solid black;
        flex-direction:column;
        justify-content:center;
        align-items:center;}
        h3{
        font-size:15px;
        color:black;}
        </style>
        <div class="artist-card">
        <h3>Nombre: ${nombre}</h3>
        <h3>Pais: ${region}</h3>
        <h3>Tipo de artista: ${tipo}</h3>
        <h3>Puntuacion: ${puntuacion}</h3>
        </div>
        `
    }
}
customElements.define('artist-card',cartaArtista)
function mostrar_resultados(data){
    resultados.innerHTML = ""
    data.artists.forEach(artista => {
        const tarjeta = document.createElement('artist-card');
        tarjeta.setAttribute("name", artista.name || "");
        tarjeta.setAttribute("country", artista.country || "");
        tarjeta.setAttribute("type", artista.type || "");
        tarjeta.setAttribute("score",artista.score || "");
        resultados.appendChild(tarjeta);
    });
    actualizarPaginacion(data.numFound)
}
function actualizarPaginacion(numFound) {
    total_paginas = Math.ceil(numFound / limite_actual)
    contador.textContent = `Página ${pagina_actual} de ${total_paginas}`
    btn_anterior.disabled  = (pagina_actual === 1)
    btn_siguiente.disabled = (pagina_actual === total_paginas)
}

btn_buscar.addEventListener('click', async()=>{
query_actual = query.value.trim()
limite_actual = Number(limit.value)
pagina_actual = 1
const offset = (pagina_actual - 1) * limite_actual;
resultados.innerHTML = "Buscando..."
const data = await api.getArtista(query_actual, offset,limite_actual);
mostrar_resultados(data)
    });

btn_anterior.addEventListener('click',async ()=>{
    pagina_actual --
    const offset = (pagina_actual - 1) * limite_actual
    const data = await api.getArtista(query_actual,offset,limite_actual)
    mostrar_resultados(data)
})

btn_siguiente.addEventListener('click', async()=>{
    pagina_actual ++
    const offset = (pagina_actual - 1) * limite_actual
    const data = await api.getArtista(query_actual,offset,limite_actual)
    mostrar_resultados(data)
} )

btn_limpiar.addEventListener('click', ()=>{
    resultados.innerHTML = ""
    btn_anterior.disabled
    btn_siguiente.disabled
})
