document.getElementById("button")


class artistCard extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: open});
  }
    connectedcallBack(){
        const name = this.getAttribute("name") || "nombre del artista";
        const country = this.getAttribute("country") || "pais de origen";
        const type = this.getAttribute("type") || "Person, Group, Orchestra"
        const  score = this.getAttribute("score") || "relevancia del resultado"

       shadow.innerHTML = `
            <style>
                button {
                background: #00d4ff;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                }
            </style>
            <button>Click!</button>
            `;

    }

    }
 
customElements.define(artistCard)

async function buscarArtistas(){
    const url = 'http://musicbrainz.org/ws/2/artist/?query={query}&offset={offset}&limit={limit}&fmt=json';
    try {
        const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);

            return await response.json();
    }
    } catch (error) {
      console.error('Falló la petición:', error.message);
      throw error;
    }
    
}
    
    




