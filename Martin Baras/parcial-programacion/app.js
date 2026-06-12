import authorCard from './webComponents/author-card.js'
customElements.define('author-card',authorCard)
let author_card = document.querySelector('author-card')

import selectLimit from './webComponents/select-limit.js'
customElements.define('select-limit',selectLimit)
let select_limit = document.querySelector('select-limit')
select_limit = select_limit.shadowRoot.querySelector('select')

import inputBox from './webComponents/input-box.js'
customElements.define('input-box',inputBox)
let input_box = document.querySelector('input-box')
input_box = input_box.shadowRoot.querySelector('input')

import searchButton from './webComponents/search-button.js'
customElements.define('search-button', searchButton)
let search_button = document.querySelector('search-button')
search_button = search_button.shadowRoot.querySelector('button')
search_button.addEventListener('click', () => {
    const inputed_name = input_box.value
    const selected_limit = select_limit.value
    console.log(inputed_name)
    console.log(selected_limit)
})


