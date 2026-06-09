const template= document.createElement('template')
template.innerHTML=`
    <style>
        input{width:100%;height:100%}
    </style>
    <input type="text" placeholder="Nombre autor">`;
export default class inputBox extends HTMLElement{
    constructor(){
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));

    }
}