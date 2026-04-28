document.addEventListener("DOMContentLoaded",function(){
    function Saludo(){
        if(document.querySelector("#saludo").innerHTML === "Saludo")
        {document.querySelector("#saludo").innerHTML = "Hola"}
        else
        {document.querySelector("#saludo").innerHTML ="Chau"}
    }
    const saludo = document.querySelector("#saludo");
    saludo.addEventListener("click",Saludo);

    let contador=0
    const numero = document.querySelector("#numero")
    
    function Sumar(){
        if(numero.classList.contains("salida")) return;
        numero.classList.remove("entrada");
        numero.classList.add("salida");
        numero.addEventListener("animationend",()=>{
            contador++;
            numero.textContent=contador;
            numero.classList.remove("salida");
            numero.classList.add("entrada");
        },{once:true})
    }
    sumar = document.querySelector("#sumar")
    sumar.addEventListener("click",Sumar);
    
    function Restar(){
        if(numero.classList.contains("salida")) return;
        numero.classList.remove("entrada");
        numero.classList.add("salida");
        numero.addEventListener("animationend",()=>{
            contador--;
            numero.textContent=contador;
            numero.classList.remove("salida");
            numero.classList.add("entrada");
        },{once:true})
    }
    restar = document.querySelector("#restar")
    restar.addEventListener("click",Restar);
    
    function Reiniciar(){
        contador=0;
        document.querySelector("#numero").innerHTML = contador
    }
    const reiniciar = document.querySelector("#reiniciar");
    reiniciar.addEventListener("click",Reiniciar);
})
