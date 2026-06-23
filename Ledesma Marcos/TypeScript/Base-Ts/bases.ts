function saludar(nombre: string, edad: number): string {
  return `Hola ${nombre}, tienes ${edad} anyos`;
}

const multiplicar = (a: number, b: number): number => a * b;

function log(mensaje: string): void {
  console.log(mensaje);
}

function crearUsuario(nombre: string, rol?: string): string {
  return `${nombre} - ${rol ?? "usuario"}`;
}

function potencia(base: number, exp: number = 2): number {
  return Math.pow(base, exp);
}

type Operacion = (a: number, b: number) => number;

function calcular(a: number, b: number, op: Operacion): number {
  return op(a, b);
}

const suma: Operacion = (a, b) => a + b;

console.log(saludar("Ana", 25));
console.log(multiplicar(4, 5));
console.log(crearUsuario("Cesar"));
console.log(crearUsuario("Cesar", "admin"));
console.log(potencia(3));
console.log(potencia(3, 3));
console.log(calcular(10, 5, suma));
console.log(calcular(10, 5, (a, b) => a * b));