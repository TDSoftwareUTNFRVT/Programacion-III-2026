document.addEventListener("DOMContentLoaded", () => {
    const input_box = document.querySelector("#input-box");
    const editable_button = document.querySelector("#editable-button");
    const submit_button = document.querySelector("#submit-button");
    const colores = document.querySelectorAll(".caja-color");
    const colores_bs = document.querySelectorAll(".caja-color-bs");
    let color_viejo;
    let color_nuevo;
    let color_viejo_bs;
    let color_nuevo_bs;

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

        colores_bs.forEach(color_bs => {
            color_bs.addEventListener("click", () => {
                colores_bs.forEach(c_bs => c_bs.classList.remove("border-selection"));
                color_bs.classList.add("border-selection");
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

        color_viejo_bs=editable_button.classList[3]
        colores_bs.forEach(color_bs => {
            if (color_bs.classList.contains("border-selection")){
                color_nuevo_bs=color_bs.classList[1]
                if (color_viejo_bs!==color_nuevo_bs){
                    editable_button.classList.remove(color_viejo_bs);
                    editable_button.classList.add(color_nuevo_bs);
                };
            };
        });
    }

    submit_button.addEventListener("click",()=>{
        CambiarTexto();
        CambiarColor();
        console.log(editable_button.classList)
    });

    SeleccionarColor();
});