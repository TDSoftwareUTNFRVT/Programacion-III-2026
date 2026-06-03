type Operacion = (a: number, b: number) => number;
function calcular(a: number, b: number, op: Operacion): number{
return op(a,b);
}
//manera un poco mas larga

const suma:Operacion = (a, b) => a+b;
console.log(calcular(10, 5, suma)); // 15

const resta:Operacion = (a, b) => a-b;
console.log(calcular(10, 5, resta)); // 5

const multiplicacion:Operacion = (a, b) => a*b;
console.log(calcular(10, 5, multiplicacion)); // 50

//manera mas corta 
console.log(calcular(20, 2, (a, b) => a + b)); // 22
console.log(calcular(14, 7, (a, b) => a - b)); // 7
console.log(calcular(3, 40, (a, b) => a * b)); // 120
