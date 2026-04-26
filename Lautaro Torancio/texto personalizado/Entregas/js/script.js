const texto = document.getElementById("texto");
const opciones = document.querySelectorAll(".opcion");
const resetBtn = document.getElementById("reset");

const tipos = {
    fondo: ["fondo-rosa","fondo-azul","fondo-verde","fondo-gris"],
    color: ["color-rojo","color-violeta","color-gris","color-azul"],
    degradado: ["degradado-calido","degradado-frio"],
    sombra: ["sombra-suave","sombra-fuerte"],
    borde: ["borde-negro","borde-blanco"]
};

opciones.forEach(opcion => {
    opcion.addEventListener("click", () => {
        const tipo = opcion.dataset.tipo;
        const clase = opcion.dataset.clase;

        // eliminar solo las clases del mismo grupo
        if (tipo) {
            tipos[tipo].forEach(c => texto.classList.remove(c));
        }

        // evitar conflicto entre color y degradado
        if(tipo === "degradado"){
            tipos.color.forEach(c => texto.classList.remove(c));
        }
        if(tipo === "color"){
            tipos.degradado.forEach(c => texto.classList.remove(c));
        }

        // agregar nueva clase con animación
        if (clase) {
            texto.classList.add(clase);
            texto.style.transform = "scale(1.05)";
            setTimeout(() => texto.style.transform = "scale(1)", 200);
        }
    });
});

// botón reset
resetBtn.addEventListener("click", () => {
    texto.className = "";
    texto.textContent = "Texto personalizable";
});
