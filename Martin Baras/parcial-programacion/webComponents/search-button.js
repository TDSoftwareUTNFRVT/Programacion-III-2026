const template= document.createElement('template')
template.innerHTML=`
    <style>
        select{width:100%;height:100%}
    </style>
    <button id="search-button">Buscar</button>
`;
export default class searchButton extends HTMLElement{
    constructor(){
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }
}