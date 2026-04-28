document.addEventListener("DOMContentLoaded", () => {
    const nameButton = document.getElementById("name-btn");
    
    const nameDisplay = document.getElementById("name-display");
    
    const nameInput = document.getElementById("name-input");
    
    function asignarNombre() {
        nameDisplay.textContent = nameInput.value;
    }

    nameButton.addEventListener("click", asignarNombre);

    // Botones de cambio de color de fuente
    const btnPurple = document.getElementById("btn-purple");
    btnPurple.addEventListener("click", () => {
        nameDisplay.classList.remove("blue-font", "green-font", "yellow-font", "orange-font", "red-font");
        nameDisplay.classList.toggle("purple-font");
    });

    const btnBlue = document.getElementById("btn-blue");
    btnBlue.addEventListener("click", () => {
        nameDisplay.classList.remove("purple-font", "green-font", "yellow-font", "orange-font", "red-font");
        nameDisplay.classList.toggle("blue-font");
    });

    const btnGreen = document.getElementById("btn-green");
    btnGreen.addEventListener("click", () => {
        nameDisplay.classList.remove("purple-font", "green-font", "yellow-font", "orange-font", "red-font");
        nameDisplay.classList.toggle("green-font");
    });

    const btnYellow = document.getElementById("btn-yellow");
    btnYellow.addEventListener("click", () => {
        nameDisplay.classList.remove("purple-font", "green-font", "yellow-font", "orange-font", "red-font");
        nameDisplay.classList.toggle("yellow-font");
    });

    const btnOrange = document.getElementById("btn-orange");
    btnOrange.addEventListener("click", () => {
        nameDisplay.classList.remove("purple-font", "green-font", "yellow-font", "orange-font", "red-font");
        nameDisplay.classList.toggle("orange-font");
    });

    const btnRed = document.getElementById("btn-red");
    btnRed.addEventListener("click", () => {
        nameDisplay.classList.remove("purple-font", "green-font", "yellow-font", "orange-font", "red-font");
        nameDisplay.classList.toggle("red-font");
    });

    // Botones fondo puro
    const btnPurpleBg = document.getElementById("btn-purple-bg");
    btnPurpleBg.addEventListener("click", () => {
        nameDisplay.classList.remove("blue-bg", "green-bg", "yellow-bg", "orange-bg", "red-bg");
        nameDisplay.classList.toggle("purple-bg");
    });

    const btnBlueBg = document.getElementById("btn-blue-bg");
    btnBlueBg.addEventListener("click", () => {
        nameDisplay.classList.remove("purple-bg", "green-bg", "yellow-bg", "orange-bg", "red-bg");
        nameDisplay.classList.toggle("blue-bg");
    });

    const btnGreenBg = document.getElementById("btn-green-bg");
    btnGreenBg.addEventListener("click", () => {
        nameDisplay.classList.remove("purple-bg", "blue-bg", "yellow-bg", "orange-bg", "red-bg");
        nameDisplay.classList.toggle("green-bg");
    });

    const btnYellowBg = document.getElementById("btn-yellow-bg");
    btnYellowBg.addEventListener("click", () => {
        nameDisplay.classList.remove("purple-bg", "blue-bg", "green-bg", "orange-bg", "red-bg");
        nameDisplay.classList.toggle("yellow-bg");
    });

    const btnOrangeBg = document.getElementById("btn-orange-bg");
    btnOrangeBg.addEventListener("click", () => {       
        nameDisplay.classList.remove("purple-bg", "blue-bg", "green-bg", "yellow-bg", "red-bg");
        nameDisplay.classList.toggle("orange-bg");
    });

    const btnRedBg = document.getElementById("btn-red-bg");
    btnRedBg.addEventListener("click", () => {
        nameDisplay.classList.remove("purple-bg", "blue-bg", "green-bg", "yellow-bg", "orange-bg");
        nameDisplay.classList.toggle("red-bg");
    });

    // Botones fondos degradé
    const btnBasicGrad = document.getElementById("btn-basic-grad");
    btnBasicGrad.addEventListener("click", () => {
        nameDisplay.classList.remove("diagonal-linear-grad-bg", "multicolor-linear-grad-bg", "radial-grad-bg", "harsh-linear-grad-bg", "repeating-linear-grad-bg");
        nameDisplay.classList.toggle("basic-linear-grad-bg");
    });

    const btnDiagonalGrad = document.getElementById("btn-diagonal-grad");
    btnDiagonalGrad.addEventListener("click", () => {
        nameDisplay.classList.remove("basic-linear-grad-bg", "multicolor-linear-grad-bg", "radial-grad-bg", "harsh-linear-grad-bg", "repeating-linear-grad-bg");
        nameDisplay.classList.toggle("diagonal-linear-grad-bg");
    });

    const btnMulticolorGrad = document.getElementById("btn-multicolor-grad");
    btnMulticolorGrad.addEventListener("click", () => {
        nameDisplay.classList.remove("basic-linear-grad-bg", "diagonal-linear-grad-bg", "radial-grad-bg", "harsh-linear-grad-bg", "repeating-linear-grad-bg");
        nameDisplay.classList.toggle("multicolor-linear-grad-bg");
    });

    const btnRadialGrad = document.getElementById("btn-radial-grad");
    btnRadialGrad.addEventListener("click", () => {
        nameDisplay.classList.remove("basic-linear-grad-bg", "diagonal-linear-grad-bg", "multicolor-linear-grad-bg", "harsh-linear-grad-bg", "repeating-linear-grad-bg");
        nameDisplay.classList.toggle("radial-grad-bg");
    });

    const btnHarshGrad = document.getElementById("btn-harsh-grad");
    btnHarshGrad.addEventListener("click", () => {
        nameDisplay.classList.remove("basic-linear-grad-bg", "diagonal-linear-grad-bg", "multicolor-linear-grad-bg", "radial-grad-bg", "repeating-linear-grad-bg");
        nameDisplay.classList.toggle("harsh-linear-grad-bg");
    });

    const btnRepeatingGrad = document.getElementById("btn-repeating-grad");
    btnRepeatingGrad.addEventListener("click", () => {
        nameDisplay.classList.remove("basic-linear-grad-bg", "diagonal-linear-grad-bg", "multicolor-linear-grad-bg", "radial-grad-bg", "harsh-linear-grad-bg");
        nameDisplay.classList.toggle("repeating-linear-grad-bg");
    });

    // Botones sombras
    const btnBasicShadow = document.getElementById("btn-basic-shadow");
    btnBasicShadow.addEventListener("click", () => {
        nameDisplay.classList.remove("harsh-shadow", "multilpe-shadow", "glow-shadow", "floating-shadow", "engraved-shadow");
        nameDisplay.classList.toggle("basic-shadow");
    });

    const btnHarshShadow = document.getElementById("btn-harsh-shadow");
    btnHarshShadow.addEventListener("click", () => {
        nameDisplay.classList.remove("basic-shadow", "multilpe-shadow", "glow-shadow", "floating-shadow", "engraved-shadow");
        nameDisplay.classList.toggle("harsh-shadow");
    });

    const btnMultilpeShadow = document.getElementById("btn-multilpe-shadow");
    btnMultilpeShadow.addEventListener("click", () => {
        nameDisplay.classList.remove("basic-shadow", "harsh-shadow", "glow-shadow", "floating-shadow", "engraved-shadow");
        nameDisplay.classList.toggle("multilpe-shadow");
    });

    const btnGlowShadow = document.getElementById("btn-glow-shadow");
    btnGlowShadow.addEventListener("click", () => {
        nameDisplay.classList.remove("basic-shadow", "harsh-shadow", "multilpe-shadow", "floating-shadow", "engraved-shadow");
        nameDisplay.classList.toggle("glow-shadow");
    });

    const btnFloatingsShadow = document.getElementById("btn-floatings-shadow");
    btnFloatingsShadow.addEventListener("click", () => {
        nameDisplay.classList.remove("basic-shadow", "harsh-shadow", "multilpe-shadow", "glow-shadow", "engraved-shadow");
        nameDisplay.classList.toggle("floating-shadow");
    });

    const btnEngravedShadow = document.getElementById("btn-engraved-shadow");
    btnEngravedShadow.addEventListener("click", () => {
        nameDisplay.classList.remove("basic-shadow", "harsh-shadow", "multilpe-shadow", "glow-shadow", "floating-shadow");
        nameDisplay.classList.toggle("engraved-shadow");
    });

    // Botones bordes
    const btnSolidBrd = document.getElementById("btn-solid-brd");
    btnSolidBrd.addEventListener("click", () => {
        nameDisplay.classList.remove("dotted-brd", "dashed-brd", "double-brd", "groove-brd", "ridge-brd");
        nameDisplay.classList.toggle("solid-brd");
    });

    const btnDottedBrd = document.getElementById("btn-dotted-brd");
    btnDottedBrd.addEventListener("click", () => {
        nameDisplay.classList.remove("solid-brd", "dashed-brd", "double-brd", "groove-brd", "ridge-brd");
        nameDisplay.classList.toggle("dotted-brd");
    });

    const btnDashedBrd = document.getElementById("btn-dashed-brd");
    btnDashedBrd.addEventListener("click", () => {
        nameDisplay.classList.remove("solid-brd", "dotted-brd", "double-brd", "groove-brd", "ridge-brd");
        nameDisplay.classList.toggle("dashed-brd");
    });

    const btnDoubleBrd = document.getElementById("btn-double-brd");
    btnDoubleBrd.addEventListener("click", () => {
        nameDisplay.classList.remove("solid-brd", "dotted-brd", "dashed-brd", "groove-brd", "ridge-brd");
        nameDisplay.classList.toggle("double-brd");
    });

    const btnGrooveBrd = document.getElementById("btn-groove-brd");
    btnGrooveBrd.addEventListener("click", () => {
        nameDisplay.classList.remove("solid-brd", "dotted-brd", "dashed-brd", "double-brd", "ridge-brd");
        nameDisplay.classList.toggle("groove-brd");
    });

    const btnRidgeBrd = document.getElementById("btn-rdge-brd");
    btnRidgeBrd.addEventListener("click", () => {
        nameDisplay.classList.remove("solid-brd", "dotted-brd", "dashed-brd", "double-brd", "groove-brd");
        nameDisplay.classList.toggle("ridge-brd");
    });
});