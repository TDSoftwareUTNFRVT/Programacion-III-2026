"use strict";
const nombre = "Bruno";
const edad = 19;
const es_estudiante = true;
console.log(`Hola, soy ${nombre}, solo tengo ${edad} años y soy estudiante? ${es_estudiante}`);
function calcular(a, b, op) {
    return op(a, b);
}
const suma = (a, b) => a + b;
const resta = (a, b) => a - b;
const multiplicacion = (a, b) => a * b;
const division = (a, b) => a / b;
console.log(`suma: ${calcular(10, 5, suma)}`); // 15
console.log(`resta: ${calcular(10, 5, resta)}`); // 15
console.log(`multiplicación: ${calcular(10, 5, multiplicacion)}`); // 15
console.log(`división: ${calcular(10, 5.5, division)}`); // 15
// Usar la interface como tipo
function mostrarUsuario(user) {
    console.log(`=======================================================\n${user.id}: ${user.nombre}\nEmail: ${user.email}\n=======================================================`);
}
const cesar = {
    id: 1,
    nombre: 'Cesar',
    email: 'saavedra0706@gmail.com'
};
const martin = {
    id: 2,
    nombre: 'Martín',
    email: 'martinezequielfachasoyciego@gmail.com'
};
const bruno = {
    id: 3,
    nombre: 'Bruno',
    email: 'brunobrunito048@gmail.com'
};
const robot_trabajador_1 = {
    nombre: 'pepe',
    id: 1,
    ia: 'Claude',
    laburante: 'si',
    brazos: true
};
function describirRobot(t) {
    console.log(`Soy la unidad ${t.nombre}, uso como asistente de IA a ${t.ia} y soy laburante? ${t.laburante}. tengo brazos? ${t.brazos}`);
}
// describirRobot(robot_trabajador_1);
class T_800 {
    memoria;
    nombre;
    constructor(memoria, nombre) {
        this.memoria = memoria;
        this.nombre = nombre;
    }
    presentarse() {
        console.log(`Soy ${this.nombre}`);
    }
    crear(construccion) {
        for (let i = 0; i < construccion + 1; i++) {
            //console.clear();
            console.log(`Construyendo... Progreso: ${i}%`);
        }
    }
}
const robot_1 = new T_800(1000, 'elpapureal');
const construccion = 5;
robot_1.crear(construccion);
robot_1.presentarse();
