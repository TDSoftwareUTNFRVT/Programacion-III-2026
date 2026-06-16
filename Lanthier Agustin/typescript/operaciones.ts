type Operacion = (a:number, b:number) => number;
function calcular(a:number, b:number, op:Operacion): number {
    return op(a,b)
}
const suma: Operacion = (a, b) => a + b;
const resta: Operacion = (a, b) => a - b;
const multiplicacion: Operacion = (a, b) => a * b;
const division: Operacion = (a, b) => a / b;

console.log(`suma: ${calcular(5, 5, suma)}`); 
console.log(`resta: ${calcular(47, 29, resta)}`); 
console.log(`multiplicación: ${calcular(7, 7, multiplicacion)}`); 
console.log(`división: ${calcular(81, 9, division)}`);