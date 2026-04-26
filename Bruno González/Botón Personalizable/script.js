document.addEventListener("DOMContentLoaded", ()=>{
    const contenedor_general = document.querySelector('#wrapper-general');

    contenedor_general.classList.add('wrapper','bc-general');

    const contenedor_color_letra = document.querySelector('#wrapper-letter-colour');

    contenedor_color_letra.classList.add('contenedor', 'small-gap','fdc','custom-size');

    const titulo_color_letra = document.querySelector('#letter-colour-title');

    titulo_color_letra.classList.add('title');

    const boton_color_letra_1 = document.querySelector('#letter-colour-1');

    boton_color_letra_1.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'bc-white', 'font-white');

    const boton_color_letra_2 = document.querySelector('#letter-colour-2');

    boton_color_letra_2.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'bc-black', 'font-black');

    const boton_color_letra_3 = document.querySelector('#letter-colour-3');

    boton_color_letra_3.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'bc-darkgrey', 'font-darkgrey');

    const boton_color_letra_4 = document.querySelector('#letter-colour-4');

    boton_color_letra_4.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'bc-blue', 'font-blue');

    const boton_color_letra_5 = document.querySelector('#letter-colour-5');

    boton_color_letra_5.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'bc-red', 'font-red');

    const contenedor_color_fondo = document.querySelector('#wrapper-bg-colour');

    contenedor_color_fondo.classList.add('contenedor', 'small-gap', 'fdc', 'custom-size');

    const titulo_color_fondo = document.querySelector('#bg-colour-title');

    titulo_color_fondo.classList.add('title');

    const boton_color_fondo_1 = document.querySelector('#bg-colour-1');

    boton_color_fondo_1.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'bc-lime-green');

    const boton_color_fondo_2 = document.querySelector('#bg-colour-2');

    boton_color_fondo_2.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'bc-yellow-mustard');

    const boton_color_fondo_3 = document.querySelector('#bg-colour-3');

    boton_color_fondo_3.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'bc-orange');

    const boton_color_fondo_4 = document.querySelector('#bg-colour-4');

    boton_color_fondo_4.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'bc-violet');

    const boton_color_fondo_5 = document.querySelector('#bg-colour-5');

    boton_color_fondo_5.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'bc-light-blue');

    const contenedor_sombras = document.querySelector('#wrapper-shadows');

    contenedor_sombras.classList.add('contenedor', 'medium-gap', 'fdc', 'custom-size');

    const titulo_sombras = document.querySelector('#shadow-title');

    titulo_sombras.classList.add('title');

    const boton_sin_sombra = document.querySelector('#no-shadow');

    boton_sin_sombra.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'transparent-style', 'no-shadow');

    const boton_sombra_1 = document.querySelector('#shadow-1');

    boton_sombra_1.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'transparent-style', 'small-shadow');

    const boton_sombra_2 = document.querySelector('#shadow-2');

    boton_sombra_2.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'transparent-style', 'medium-shadow');

    const boton_sombra_3 = document.querySelector('#shadow-3');

    boton_sombra_3.classList.add('button-base', 'bordered', 'small-border', 'light-grey-border', 'transparent-style', 'big-shadow');

    const contenedor_bordes = document.querySelector('#wrapper-border');

    contenedor_bordes.classList.add('contenedor', 'fdc', 'custom-size');

    const titulo_bordes = document.querySelector('#border-title');

    titulo_bordes.classList.add('title');

    const slider_bordes = document.querySelector('#slider');

    slider_bordes.classList.add('slider-bordes');

    const etiqueta_valor_slider = document.querySelector('#slider-valor');

    etiqueta_valor_slider.classList.add('title');

    const contenedor_gradientes_fondo = document.querySelector('#wrapper-gradient-bg');

    contenedor_gradientes_fondo.classList.add('contenedor', 'medium-gap', 'fdc', 'custom-size');

    const titulo_gradientes_fondo = document.querySelector('#gradient-bg-title');

    titulo_gradientes_fondo.classList.add('title');

    const boton_gradiente_lineal = document.querySelector('#linear-gradient');

    boton_gradiente_lineal.classList.add('button-base', 'transparent-style', 'bordered', 'small-border', 'light-grey-border', 'linear-gradient-style');

    const boton_gradiente_radial = document.querySelector('#radial-gradient');

    boton_gradiente_radial.classList.add('button-base', 'transparent-style', 'bordered', 'small-border', 'light-grey-border', 'radial-gradient-style');

    const contenedor_resultado_y_aplicar = document.querySelector('#wrapper-result-apply');

    contenedor_resultado_y_aplicar.classList.add('contenedor', 'fdc', 'custom-size');

    const contenedor_resultado = document.querySelector('#wrapper-result');

    contenedor_resultado.classList.add('contenedor', 'big-gap', 'fdc', 'custom-size');

    const titulo_resultado = document.querySelector('#result-title');

    titulo_resultado.classList.add('title');

    const boton_resultado = document.querySelector('#result-button');

    boton_resultado.classList.add('button-base', 'button-custom-height', 'bordered', 'small-border', 'light-grey-border');

    const contenedor_aplicar = document.querySelector('#wrapper-apply');

    contenedor_aplicar.classList.add('contenedor', 'small-gap', 'fdc', 'custom-size');

    const entrada_texto = document.querySelector('#text-input');

    entrada_texto.classList.add('input-text', 'small-border', 'light-grey-border');

    const boton_aplicar_cambios = document.querySelector('#button-apply-changes');

    boton_aplicar_cambios.classList.add('input-submit', 'small-border', 'light-grey-border');

    let color_seleccionado;
    let color_fondo_seleccionado;
    let sombra_seleccionada;
    let degradado_elegido;

    const botones_colores = [boton_color_letra_1, boton_color_letra_2, boton_color_letra_3, boton_color_letra_4, boton_color_letra_5];

    const botones_fondos = [boton_color_fondo_1, boton_color_fondo_2, boton_color_fondo_3, boton_color_fondo_4, boton_color_fondo_5];

    const botones_sombras = [boton_sin_sombra, boton_sombra_1, boton_sombra_2, boton_sombra_3];

    const botones_degradados = [boton_gradiente_lineal, boton_gradiente_radial];

    function CambiarTextoBoton(){
        const nuevo_texto = entrada_texto.value;
        boton_resultado.textContent = nuevo_texto;
        // !:Es como decir "IF NOT" 
        if(!boton_resultado.textContent){
            boton_resultado.textContent = "Texto de ejemplo"
        }
    }

    function CambiarColorLetra(){
        const colores_letra_disponibles = document.querySelectorAll(".font-white, .font-black, .font-darkgrey, .font-blue, .font-red");

        colores_letra_disponibles.forEach(color_letra => {
            color_letra.addEventListener("click", () => {
                color_seleccionado = color_letra.classList[5];

                console.log(`Color seleccionado: ${color_seleccionado}`);
            });
        });
    }

    function CambiarColorFondo(){
        const colores_fondo_disponibles = document.querySelectorAll(".bc-lime-green, .bc-yellow-mustard, .bc-orange, .bc-violet, .bc-light-blue");

        colores_fondo_disponibles.forEach(color_fondo => {
            color_fondo.addEventListener("click", () => {
                color_fondo_seleccionado = getComputedStyle(color_fondo).backgroundColor;

                console.log(`Color de fondo seleccionado: ${color_fondo_seleccionado}`);
            });
        });
    }

    function CambiarTipoSombra(){
        const sombras_disponibles = document.querySelectorAll(".no-shadow, .small-shadow, .medium-shadow, .big-shadow");

        sombras_disponibles.forEach(sombra => {
            sombra.addEventListener("click", () => {
                sombra_seleccionada = getComputedStyle(sombra).boxShadow;

                console.log(`Sombra seleccionada: ${sombra_seleccionada}`);
            });
        });
    }

    function CambiarDegradadoFondo(){
        const degradados_de_fondo = document.querySelectorAll('.linear-gradient-style, .radial-gradient-style');

        degradados_de_fondo.forEach(boton => {
            boton.addEventListener('click', () => {
                if(boton.classList.contains('linear-gradient-style')){
                    degradado_elegido = 'linear-gradient';
                }
                else {
                    degradado_elegido = 'radial-gradient';
                }

                console.log(`Degradado elegido: ${degradado_elegido}`);
            });
        });
    }

    function BordearBotonElegido(){
        botones_colores.forEach(boton => {
            boton.addEventListener('click', () => {
                botones_colores.forEach(btn => btn.classList.remove('color-selected'));
                boton.classList.add('color-selected');
            });
        });

        botones_fondos.forEach(boton => {
            boton.addEventListener('click', () => {
                botones_fondos.forEach(btn => btn.classList.remove('color-selected'));
                boton.classList.add('color-selected');
            });
        });

        botones_sombras.forEach(boton => {
            boton.addEventListener('click', () => {
                botones_sombras.forEach(btn => btn.classList.remove('color-selected'));
                boton.classList.add('color-selected');
            });
        });

        botones_degradados.forEach(boton => {
            boton.addEventListener('click', () => {
                botones_degradados.forEach(btn => btn.classList.remove('color-selected'));
                boton.classList.add('color-selected');
            });
        });
    }

    BordearBotonElegido();

    CambiarColorLetra();
    CambiarColorFondo();
    CambiarTipoSombra();
    CambiarDegradadoFondo();

    boton_aplicar_cambios.addEventListener('click', () => {
        CambiarTextoBoton();

        if(color_seleccionado){
            boton_resultado.classList.remove("font-white","font-black","font-darkgrey","font-blue", "font-red");

            boton_resultado.classList.add(color_seleccionado);

            console.log(`Color aplicado: ${boton_resultado.classList}`);
        }

        if(color_fondo_seleccionado){
            boton_resultado.classList.remove("bc-lime-green", "bc-yellow-mustard", "bc-orange", "bc-violet", "bc-light-blue");

            boton_resultado.style.background = color_fondo_seleccionado;

            console.log(`Color de fondo aplicado: ${boton_resultado.classList}`);
        }

        //getComputedStyle: Obtiene el estilo calculado por el navegador.
        //style.propiedad: Obtiene los estilos escritos directamente desde el atributo style del HTML, no los que vienen de CSS.

        if(sombra_seleccionada){
            boton_resultado.classList.remove("no-shadow","small-shadow","medium-shadow", "big-shadow");

            boton_resultado.style.boxShadow = sombra_seleccionada;

            console.log(`Sombra aplicada: ${boton_resultado.classList}`);
        }

        boton_resultado.style.borderRadius = `${slider_bordes.value}px`;
        
        // &&: Operador Y lógico ( AND ).
        if(degradado_elegido && color_fondo_seleccionado){
            if(degradado_elegido === 'linear-gradient') {
                boton_resultado.style.background = `linear-gradient(transparent, ${color_fondo_seleccionado})`;
            }
            else {
                boton_resultado.style.background = `radial-gradient(transparent, ${color_fondo_seleccionado})`;
            }
        }

        else if(degradado_elegido){
            if(degradado_elegido === 'linear-gradient') {
                boton_resultado.style.background = `linear-gradient(transparent, black)`;
            }
            else {
                boton_resultado.style.background = `radial-gradient(transparent, black)`;
            }
        }

        else if(color_fondo_seleccionado){
            boton_resultado.style.background = color_fondo_seleccionado;
        }

        else {
            boton_resultado.style.background = `white`;
        }

        botones_colores.forEach(boton => boton.classList.remove('color-selected'));

        botones_fondos.forEach(boton => boton.classList.remove('color-selected'));

        botones_sombras.forEach(boton => boton.classList.remove('color-selected'));
        
        botones_degradados.forEach(boton => boton.classList.remove('color-selected'));
    });

    slider_bordes.addEventListener('input', () => {
        etiqueta_valor_slider.textContent = `Valor: ${slider_bordes.value}`;
    });
})