const paleta = document.getElementById("paletaDesplegable");
const tab = document.getElementById("paletaTab");
const boton = document.getElementById("miBoton");

tab.addEventListener("click", () => {
    paleta.classList.toggle("open");
});

/* FUNCIONES */
function cambiarColor() {
    boton.style.background = "#ff0000";
}

function cambiarTamano() {
    boton.style.transform = "scale(1.3)";
}