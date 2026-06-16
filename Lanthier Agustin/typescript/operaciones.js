"use strict";
function calcular(a, b, op) {
    return op(a, b);
}
const suma = (a, b) => a + b;
const resta = (a, b) => a - b;
const multiplicacion = (a, b) => a * b;
const division = (a, b) => a / b;
console.log(`suma: ${calcular(5, 5, suma)}`);
console.log(`resta: ${calcular(47, 29, resta)}`);
console.log(`multiplicación: ${calcular(7, 7, multiplicacion)}`);
console.log(`división: ${calcular(81, 9, division)}`);
