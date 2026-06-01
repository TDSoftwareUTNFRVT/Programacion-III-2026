const api = new ApiPaises();

const boton = document.getElementById('funcion-boton')
const input = document.getElementById('funcion-buscador')
const resultado_habitantes = document.getElementById('res-habitantes')
const resultado_nombre = document.getElementById('res-nombre')
const resultado_continente = document.getElementById('res-continente')
const resultado_capital = document.getElementById('res-capital')
const resultado_idiomas = document.getElementById('res-idiomas')


boton.addEventListener('click',async function(){
    const nombre_pais = input.value
    const datos = await api.buscar_pais(nombre_pais)
    const habitantes = await habitantes_f(nombre_pais)
    const nombre = await nombre_f(nombre_pais)
    const capital = await capital_f(nombre_pais)
    const continente = await continente_f(nombre_pais)
    const idiomas = await idiomas_f(nombre_pais)
    resultado_nombre.innerHTML ='Nombre:' + nombre
    resultado_habitantes.innerHTML ='Cantidad de habitantes:' + habitantes
    resultado_continente.innerHTML ='Continente:' + `${continente.join(', ')}`
    resultado_capital.innerHTML ='Capital:' + capital
    resultado_idiomas.innerHTML ='Idiomas:' + `${idiomas.join(', ')}`
    console.log(datos)
}
)

async function habitantes_f(nombre_pais) {
    const data = await api.buscar_pais(nombre_pais)
    const habitantes = data[0].population
    return habitantes
    console.log(habitantes)
}

async function continente_f(nombre_pais) {
    const data = await api.buscar_pais(nombre_pais)
    const continente = data[0].continents
    return continente
    console.log(continente)
}

async function capital_f(nombre_pais) {
    const data = await api.buscar_pais(nombre_pais)
    const capital = data[0].capital
    return capital
    console.log(capital)
}

async function nombre_f(nombre_pais) {
    const data = await api.buscar_pais(nombre_pais)
    const nombre = data[0].name.common
    return nombre
    console.log(nombre)
}

async function idiomas_f(nombre_pais) {
    const data = await api.buscar_pais(nombre_pais)
    const idioma = Object.values(data[0].languages)
    return idioma
    console.log(idioma)
}

