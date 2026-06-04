const nombre: string = "Bruno";
const edad: number = 19;
const es_estudiante: boolean = true;

console.log(`Hola, soy ${nombre}, solo tengo ${edad} años y soy estudiante? ${es_estudiante}`);

type Operacion = (a: number, b: number) => number;
function calcular(a: number, b: number, op: Operacion): number {
    return op(a, b);
}
const suma: Operacion = (a, b) => a + b;
const resta: Operacion = (a, b) => a - b;
const multiplicacion: Operacion = (a, b) => a * b;
const division: Operacion = (a, b) => a / b;

console.log(`suma: ${calcular(10, 5, suma)}`); // 15
console.log(`resta: ${calcular(10, 5, resta)}`); // 15
console.log(`multiplicación: ${calcular(10, 5, multiplicacion)}`); // 15
console.log(`división: ${calcular(10, 5.5, division)}`); // 15

// Definir una interface
interface Usuario {
    id: number;
    nombre: string;
    email: string;
}

// Usar la interface como tipo
function mostrarUsuario(user: Usuario): void {
    console.log(`=======================================================\n${user.id}: ${user.nombre}\nEmail: ${user.email}\n=======================================================`);
}

const cesar: Usuario = {
    id: 1,
    nombre: 'Cesar',
    email: 'saavedra0706@gmail.com'
};

const martin: Usuario = {
    id: 2,
    nombre: 'Martín',
    email: 'martinezequielfachasoyciego@gmail.com'
};

const bruno: Usuario = {
    id: 3,
    nombre: 'Bruno',
    email: 'brunobrunito048@gmail.com'
};

// mostrarUsuario(cesar); // OK
// mostrarUsuario(martin); // OK
// mostrarUsuario(bruno); // OK

interface Robot {
    nombre: string;
    readonly id: number;
    readonly ia: string;
    laburante?: string;
}

interface Maquinaria extends Robot {
    brazos: boolean;
}

const robot_trabajador_1: Maquinaria = {
    nombre: 'pepe',
    id: 1,
    ia: 'Claude',
    laburante: 'si',
    brazos: true
}

function describirRobot(t: Maquinaria): void {
    console.log(`Soy la unidad ${t.nombre}, uso como asistente de IA a ${t.ia} y soy laburante? ${t.laburante}. tengo brazos? ${t.brazos}`);
}

// describirRobot(robot_trabajador_1);

class T_800 {
    memoria: number;
    nombre: string;

    constructor(memoria: number, nombre: string) {
        this.memoria = memoria;
        this.nombre = nombre;
    }

    presentarse(): void {
        console.log(`Soy ${this.nombre}`);
    }

    crear(construccion: number) {
        for (let i = 0; i < construccion + 1; i++) {
            //console.clear();
            console.log(`Construyendo... Progreso: ${i}%`);
        }
    }
}

const robot_1 = new T_800(1000, 'elpapureal');

const construccion: number = 5;

robot_1.crear(construccion);
robot_1.presentarse();