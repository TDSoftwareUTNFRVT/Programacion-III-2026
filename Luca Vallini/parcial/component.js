
class authorCard extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    connectedCallback(){
        const name = this.getAttribute('name')
        const birthYear = this.getAttribute('birth-year')
        const topWork = this.getAttribute('top-work')
        const photoUrl = this.getAttribute('photo-url') || 'https://via.placeholder.com/150'

        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    border: 1px solid #000;
                    border-radius: 8px;
                    padding: 16px;
                    text-align: center;
                    width: 90%;
                    background-color: #ddd;
                }
                .photo {
                    width: 200px;
                    height: 200px;
                    border-radius: 4px;
                }
                .name {
                    font-size: 18px;
                    margin: 8px 0;
                }
                .details {
                    color: #555;
                }
            </style>
            <div class="card">
                <img class="photo" src="${photoUrl}" alt="${name} Foto">
                <div class="name">${name}</div>
                <div class="details">Born: ${birthYear}</div>
                <div class="details">Top Work: ${topWork}</div>
            </div>
        `;
    }
}

customElements.define('author-card', authorCard);