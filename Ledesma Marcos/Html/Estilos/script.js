document.addEventListener("DOMContentLoaded", function () {
  let contador = 0;
  const titulo = document.querySelector("#titulo");

  function actualizar() {
    titulo.textContent = contador;
  }

  function sumar() {
    contador++;
    actualizar();
  }

  function restar() {
    contador--;
    actualizar();
  }

  function reset() {
    contador = 0;
    actualizar();
  }

  document.querySelector("#suma").addEventListener("click", sumar);
  document.querySelector("#resta").addEventListener("click", restar);
  document.querySelector("#reset").addEventListener("click", reset);
});