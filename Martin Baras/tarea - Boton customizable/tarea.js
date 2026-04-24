document.addEventListener("DOMContentLoaded", () => {
    const input_box = document.querySelector("#input-box");
    const editable_button = document.querySelector("#editable-button");
    const submit_button = document.querySelector("#submit-button");
    const colores = document.querySelectorAll(".caja-color");
    const colores_bs = document.querySelectorAll(".caja-color-bs");
    let color_viejo;
    let color_nuevo;
    const clases_colores_bs = ["bs-red",
                            "bs-rose",
                            "bs-orange",
                            "bs-amber",
                            "bs-yellow",
                            "bs-lime",
                            "bs-green",
                            "bs-emerald",
                            "bs-teal",
                            "bs-cyan",
                            "bs-lblue",
                            "bs-blue",
                            "bs-indigo",
                            "bs-violet",
                            "bs-purple",
                            "bs-fuchsia",
                            "bs-pink",
                            "bs-black",
                            "bs-lblack"];

    function CambiarTexto() {
        editable_button.textContent = input_box.value;
    }

    function SeleccionarColor() {
        colores.forEach(color => {
            color.addEventListener("click", () => {
                colores.forEach(c => c.classList.remove("border-selection"));
                color.classList.add("border-selection");
            });
        });

        colores_bs.forEach(color => {
            color.addEventListener("click", () => {
                colores_bs.forEach(c => c.classList.remove("border-selection"));
                color.classList.add("border-selection");
            });
        });

    }

    function CambiarColor() {
        color_viejo=editable_button.classList[2]
        colores.forEach(color => {
            if (color.classList.contains("border-selection")){
                color_nuevo=color.classList[1]
                if (color_viejo!==color_nuevo){
                    editable_button.classList.remove(color_viejo);
                    editable_button.classList.add(color_nuevo);
                };
            };
        });
    }

    function CambiarBoxShadow() {

    }

    submit_button.addEventListener("click",()=>{
        CambiarTexto();
        CambiarColor();
    });

    SeleccionarColor();
});