const template = document.createElement('template')
template.innerHTML=`
        <style>
            .card {
                width: 120px;
                height: 240px;
                background: red;
                border: 2px solid black;
                display: flex;
                flex-direction: column;
                justify-content:center;
                align-content:center;
                padding: 4px;
                gap: 4px;
            }

            .card__profilePhoto {
                height: 65%;
                border: 2px solid black;
            }

            .card__profilePhoto img {}

            .card__bio {
                height: 35%;
                border: 2px solid black;
                display: flex;
                flex-direction: column;
                justify-content:center;
                padding:2px;
                gap:3px;
            }

            .card__bio-name {height:fit-content;border:2px solid black;}

            .card__bio-top-work {height:fit-content;border:2px solid black;}

            .card__bio-birth-year {height:fit-content;border:2px solid black;}
        </style>
        <div class="card" id="card">
            <div class="card__profilePhoto">
                
            </div>
            <div class="card__bio">
                <div class="card__bio-name"></div>
                <div class="card__bio-top-work"></div>
                <div class="card__bio-birth-year"></div>
            </div>
        </div>
        `;

export default class authorCard extends HTMLElement {
    static get observedAttributes(){return ['name','top-work','birth-year','photo-url']};
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
        this._render()
    }

   _render() {
    this.shadowRoot.querySelector('.card__profilePhoto').textContent=this.getAttribute('photo-url') || 'foto';
    this.shadowRoot.querySelector('.card__bio-name').textContent=this.getAttribute('name') || 'nombre';
    this.shadowRoot.querySelector('.card__bio-top-work').textContent=this.getAttribute('top-work') || 'trabajo';
    this.shadowRoot.querySelector('.card__bio-birth-year').textContent=this.getAttribute('birth-year') || 'año';
  }
}