document.addEventListener("DOMContentLoaded", () => {
    // Obtener botones principales
    const botonMuestra = document.getElementById("vistaPreviaBtn");
    const botonAplicar = document.getElementById("aplicarBtn");
    const botonRestablecer = document.getElementById("restablecerBtn");

    // Obtener valores default
    function obtenerValores() {
        return {
            colorTexto: document.querySelector('input[name="colorTexto"]:checked').value,
            colorFondo: document.querySelector('input[name="colorFondo"]:checked').value,
            tamano: document.querySelector('input[name="tamano"]:checked').value,
            sombra: document.querySelector('input[name="sombra"]:checked').value,
            borde: document.querySelector('input[name="borde"]:checked').value,
            radioBorde: document.querySelector('input[name="radioBorde"]:checked').value
        };
    }

    // Aplicar estilos al boton
    function aplicarEstilos(config) {
        // Clase base
        botonMuestra.className = "btn-muestra";

        // Agrega clases segun seleccion
        botonMuestra.classList.add(`tx-${config.colorTexto}`);
        botonMuestra.classList.add(`bg-${config.colorFondo}`);
        botonMuestra.classList.add(`tx-${config.tamano}`);
        botonMuestra.classList.add(`sombra-${config.sombra}`);
        botonMuestra.classList.add(`borde-${config.borde}`);
        botonMuestra.classList.add(`radio-${config.radioBorde}`);
    }

    // Lee la configuración actual y la aplica
    botonAplicar.addEventListener("click", () => {
        const config = obtenerValores();
        aplicarEstilos(config);
        console.log("Estilos aplicados:", config);
    });

    function restablecer() {
        // Definir valores por defecto
        const configDefault = {
            colorTexto: "negro",
            colorFondo: "blanco",
            tamano: "mediano",
            sombra: "ninguna",
            borde: "ninguno",
            radioBorde: "ninguno"
        };

        document.querySelector('input[name="colorTexto"][value="negro"]').checked = true;
        document.querySelector('input[name="colorFondo"][value="blanco"]').checked = true;
        document.querySelector('input[name="tamano"][value="mediano"]').checked = true;
        document.querySelector('input[name="sombra"][value="ninguna"]').checked = true;
        document.querySelector('input[name="borde"][value="ninguno"]').checked = true;
        document.querySelector('input[name="radioBorde"][value="ninguno"]').checked = true;

        aplicarEstilos(configDefault);
    }

    botonRestablecer.addEventListener("click", restablecer);

    const configInicial = obtenerValores();
    aplicarEstilos(configInicial);

});


