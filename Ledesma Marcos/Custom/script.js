const paleta = document.getElementById("paletaDesplegable");
const tab = document.getElementById("paletaTab");
const box = document.getElementById("miBoton");

tab.addEventListener("click", () => {
    paleta.classList.toggle("open");
});

/* VARIABLES */
let borderWidth = 2;
let borderColor = "#000";

let sizeH = 2;
let sizeW = 2;

let shadowBlur = 10;
let shadowOffsetX = 10;
let shadowOffsetY = 10;
let shadowColor = "#000";

let radius = {
    tl: 10,
    tr: 10,
    bl: 10,
    br: 10
};

function setBorderWidth(width) {
    borderWidth = width;
    applyBorder();
}


function setRadius(corner, value) {
    radius[corner] = value;

    box.style.borderRadius = `
        ${radius.tl}px 
        ${radius.tr}px 
        ${radius.br}px 
        ${radius.bl}px
    `;
}

/* TAMAÑO */
function setWidht(value) {
    box.style.width = value + "px";
}
function setHeight(value) {
    box.style.height = value + "px";
}

/* COLOR */
let currentGradient = "linear";

function setGradient(value) {
    currentGradient = value;
    updateGradient();
}

function updateGradient() {
    const c1 = document.getElementById("color1").value;
    const c2 = document.getElementById("color2").value;

    if (currentGradient === "linear") {
        box.style.background = `linear-gradient(to right, ${c1}, ${c2})`;
    }

    if (currentGradient === "radial") {
        box.style.background = `radial-gradient(circle, ${c1}, ${c2})`;
    }

    if (currentGradient === "conic") {
        box.style.background = `conic-gradient(${c1}, ${c2})`;
    }
}
/* FONDO */
function setBackground(value) {
    box.style.background = value;
    box.style.backgroundSize = "cover";
}

/* BORDE */
function setBorderColor(color) {
    borderColor = color;
    applyBorder();
}

function setBorderWidth(width) {
    borderWidth = width;
    applyBorder();
}

function applyBorder() {
    box.style.border = `${borderWidth}px solid ${borderColor}`;
}

/* SOMBRA */
function updateShadow() {
    shadowOffsetX = document.getElementById("shadowMoveX").value;
    shadowOffsetY = document.getElementById("shadowMoveY").value;
    shadowBlur = document.getElementById("shadowBlur").value;
    shadowColor = document.getElementById("shadowColorInput").value;

    box.style.boxShadow = `
        ${shadowOffsetX}px 
        ${shadowOffsetY}px 
        ${shadowBlur}px 
        ${shadowColor}
    `;
}

/* GUARDAR */
function saveChanges() {
    const styles = {
        background: box.style.background,
        borderRadius: box.style.borderRadius,
        boxShadow: box.style.boxShadow,
        border: box.style.border
    };

    localStorage.setItem("boxStyles", JSON.stringify(styles));
    alert("Guardado");
}

/* CARGAR */
window.onload = () => {
    const saved = localStorage.getItem("boxStyles");
    if (saved) {
        Object.assign(box.style, JSON.parse(saved));
    }
};