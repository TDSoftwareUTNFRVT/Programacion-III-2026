const texto = document.querySelector("#texto");
const wrapper = document.querySelector("#textoWrapper");
const resetBtn = document.querySelector("#reset");


document.querySelector("[data-clase='fondo-rosa']").onclick = () => {
    wrapper.className = "texto-wrapper fondo-rosa";
};
document.querySelector("[data-clase='fondo-azul']").onclick = () => {
    wrapper.className = "texto-wrapper fondo-azul";
};
document.querySelector("[data-clase='fondo-verde']").onclick = () => {
    wrapper.className = "texto-wrapper fondo-verde";
};
document.querySelector("[data-clase='fondo-gris']").onclick = () => {
    wrapper.className = "texto-wrapper fondo-gris";
};


document.querySelector("[data-clase='color-rojo']").onclick = () => {
    texto.className = "color-rojo";
};
document.querySelector("[data-clase='color-violeta']").onclick = () => {
    texto.className = "color-violeta";
};
document.querySelector("[data-clase='color-gris']").onclick = () => {
    texto.className = "color-gris";
};
document.querySelector("[data-clase='color-azul']").onclick = () => {
    texto.className = "color-azul";
};


document.querySelector("[data-clase='sombra-suave']").onclick = () => {
    wrapper.className = "texto-wrapper sombra-suave";
};
document.querySelector("[data-clase='sombra-fuerte']").onclick = () => {
    wrapper.className = "texto-wrapper sombra-fuerte";
};


document.querySelector("[data-clase='borde-negro']").onclick = () => {
    wrapper.className = "texto-wrapper borde-negro";
};
document.querySelector("[data-clase='borde-blanco']").onclick = () => {
    wrapper.className = "texto-wrapper borde-blanco";
};


resetBtn.onclick = () => {
    wrapper.className = "texto-wrapper";
    texto.className = "";
};
