async function fetchSeguro(query,page,limit) {
    const url=`https://openlibrary.org/search/authors.json?q=${query}&page;=${page}&limit;=${limit}`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
        throw new Error(`Ocurrio un error al conectar con la API`);
        }

        const data= await response.json();

        return data;
    } catch (error) {
        console.error(`Ocurrio un error al conectar con la API`);
        throw error; 
    }
}

function mostrarMensaje(resultado){
    resultado.innerHTML="Buscando...."
    resultado.classList.add("mostrar");
}
function ocultarMensaje(resultado){
    resultado.innerHTML="Buscando...."
    resultado.classList.remove("mostrar");
    resultado.classList.add("ocultar");
}

function crearElemento(datos){
    const tarjeta=document.createElement('author-card');
    tarjeta.setAttribute('name', datos.name);
    tarjeta.setAttribute('birth-year', datos.birth_date);
    tarjeta.setAttribute('top-work', datos.top_work);
    // HASTA ACA LLEGUE
}



let boton=document.querySelector('#buscar');
boton.addEventListener('click', ()=>{
    const texto=document.querySelector('#input').value;
    const selector=document.querySelector('#opciones').value;
    const resultado=document.querySelector('#result');
    let pagina=1;
    setTimeout(() => {
        mostrarMensaje(resultado);
      }, 1000);
      ocultarMensaje(resultado);
    let datos=await fetchSeguro(texto,selector,pagina);
    crearElemento(datos.docs);
    });




