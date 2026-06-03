"use strict";
function calcular(a, b, op) {
    return op(a, b);
}
//manera un poco mas larga
const suma = (a, b) => a + b;
console.log(calcular(10, 5, suma)); // 15
const resta = (a, b) => a - b;
console.log(calcular(10, 5, resta)); // 5
const multiplicacion = (a, b) => a * b;
console.log(calcular(10, 5, multiplicacion)); // 50
//manera mas corta 
console.log(calcular(20, 2, (a, b) => a + b)); // 22
console.log(calcular(14, 7, (a, b) => a - b)); // 7
console.log(calcular(3, 40, (a, b) => a * b)); // 120
