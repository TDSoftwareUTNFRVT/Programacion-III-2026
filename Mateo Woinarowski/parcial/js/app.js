const boton = document.getElementById("buscar-boton")


boton.addEventListener("click", async () => {
const api = new apiLibros()
const buscador = document.getElementById("buscador-libro")
const input_dato = buscador.value
    try {
        const datos = await api.getLibros(input_dato, 10, 1);
        console.log(datos); 
    } catch (error) {
        console.error("Error:", error);
    }
});




