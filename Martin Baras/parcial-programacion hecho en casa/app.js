import apiOpenLibrary from './API.js'
const api = new apiOpenLibrary();

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

let results_box = document.getElementById('results-box')

search_button.addEventListener('click', async () => {
    let inputed_name = input_box.value
    let selected_limit = select_limit.value
    let selected_page = 1
    console.log(inputed_name)
    console.log(selected_limit)
    const response = await api.getData(inputed_name, selected_limit, selected_page)
    const total_results = Number(api.getTotalResults(response))
    if(total_results!==0){
        console.log(`Resultados totales: ${total_results}`)
        

        // console.log(author_name)
        // console.log(author_key)
        // console.log(author_top_work)
        // console.log(author_birth_date)
        await createCards(response, total_results)

    }
    else{console.log('No se encontraron resultados para esta busqeda')}
    

})

async function createCards(response, total_results){
    let cards = "";
    // let author_index = 0
    for(let author_index = 0; author_index < 100; author_index++){
        let author_data = api.getAuthorData(response, author_index)
        let author_name = api.getAuthorName(author_data)
        let author_key = api.getAuthorKey(author_data)
        // let author_photo = await api.getAuthorPhoto(author_data, author_key)
        // console.log(author_photo)
        let author_top_work = api.getAuthorTopWork(author_data)
        let author_birth_date = api.getAuthorBirthDate(author_data)
        if(!author_name){author_name='Sin nombre'}
        else if(!author_key){author_key='Sin imagen'}
        else if(!author_top_work){author_top_work='Sin gran hazaña'}
        else if(!author_birth_date){author_birth_date='Sin fecha'}

        cards +=`<author-card name="${author_name}" top-work="${author_top_work}" birth-year="${author_birth_date}" photo-url=""></author-card>`;
    }
    results_box.innerHTML=cards
    // console.log(cards)
}




