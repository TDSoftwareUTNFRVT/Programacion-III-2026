let data = [];
let inicio = 0;


async function mostrarPaises() {
    if (data.length === 0){
        const url= 'https://restcountries.com/v3.1/all?fields=name,capital,currencies,flag,languages';
        const response = await fetch(url)
        data = await response.json();
    }

    let paises = data.slice(inicio, inicio + 12);

    const container = document.getElementById('paises-container');
    container.innerHTML = 
        paises.map(pais => `
            <div class='pais bg-col-gray'>
                <h2>${pais.name.common} ${pais.flag}</h2>
                <div class='capital'>Capital: ${pais.capital[0]}</div>
                <div class='currency'> Moneda: ${Object.keys(pais.currencies)[0]}</div>
                <div class='lenguage'>Idioma: ${Object.values(pais.languages)[0]}</div>
            </div>
        `).join('');
}


const buttonBack = document.getElementById('back');
const buttonForward = document.getElementById('forward');

buttonBack.addEventListener('click', () => {
    if (inicio > 0) {
        inicio -=12;
        mostrarPaises();
    } 
});

buttonForward.addEventListener('click', () => {
    if (inicio < data.length) {
        inicio +=12;
        mostrarPaises();
    }
});

mostrarPaises();