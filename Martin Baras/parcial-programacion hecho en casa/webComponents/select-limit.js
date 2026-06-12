const template= document.createElement('template')
template.innerHTML=`
    <style>
        select{width:100%;height:100%}
    </style>
    <select name="select" class="select" id="select-limit">
        <option value="5" selected>5</option>
        <option value="10">10</option>
        <option value="20">20</option>
    </select>
`;
export default class selectLimit extends HTMLElement{
    constructor(){
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));

        
    }
}