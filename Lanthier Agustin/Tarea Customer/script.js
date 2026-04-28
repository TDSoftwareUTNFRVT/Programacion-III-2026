const box = document.getElementById("box");

let shadowBlur = 10;
let shadowOffsetX = 10;
let shadowOffsetY = 10;
let borderWidth = 2;
let borderColor = "#000";
let shadowColor = "#000"
// COLOR
function setColor(color) {
    box.style.background = color;
}

// FONDO
function setBackground(value) {
    box.style.background = value;
    box.style.backgroundSize = "cover";
}

// FORMA
function setShape(value) {
    box.style.borderRadius = value;
}

// SOMBRA
function updateShadow() {
    shadowOffsetX= document.getElementById("shadowMoveX").value;
    shadowOffsetY= document.getElementById("shadowMoveY").value;
    shadowColor = document.getElementById("shadowColorInput").value;
    shadowBlur= document.getElementById("shadowBlur").value;
    box.style.boxShadow = `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`;
}

// BORDE
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

// DEGRADÉ
function setGradient() {
    const c1 = document.getElementById("color1").value;
    const c2 = document.getElementById("color2").value;

    box.style.background = `linear-gradient(to right, ${c1}, ${c2})`;
}

// GUARDAR
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

// CARGAR
window.onload = () => {
    const saved = localStorage.getItem("boxStyles");
    if (saved) {
        Object.assign(box.style, JSON.parse(saved));
    }
};