"use strict";
function saludar(nombre, edad) {
    return `Hola ${nombre}, tienes ${edad} anyos`;
}
const multiplicar = (a, b) => a * b;
function log(mensaje) {
    console.log(mensaje);
}
function crearUsuario(nombre, rol) {
    return `${nombre} - ${rol ?? "usuario"}`;
}
function potencia(base, exp = 2) {
    return Math.pow(base, exp);
}
function calcular(a, b, op) {
    return op(a, b);
}
const suma = (a, b) => a + b;
console.log(saludar("Ana", 25));
console.log(multiplicar(4, 5));
console.log(crearUsuario("Cesar"));
console.log(crearUsuario("Cesar", "admin"));
console.log(potencia(3));
console.log(potencia(3, 3));
console.log(calcular(10, 5, suma));
console.log(calcular(10, 5, (a, b) => a * b));