class Persona {
public nombre: string;
public edad: number;
public dni: number;
private sueldo: number;
constructor(nombre: string, edad: number, dni: number, sueldo: number) {
this.nombre = nombre;
this.edad = edad;
this.dni = dni;
this.sueldo = sueldo;
}

public obtenerNombre(): string {
return `tu nombre es ${this.nombre}`;
}
public obtenerEdad(): string {
return `tu edad es ${this.edad}`;
}
public aumentarSueldo(cantidad: number): void {
    if (cantidad > 0) this.sueldo += cantidad;
}
public obtenerSueldo(): number {
    return this.sueldo;
}
}

const humano = new Persona('Cesar', 28, 12345678, 1000);
humano.obtenerNombre(); // 'tu nombre es Cesar'
humano.obtenerEdad(); // 'tu edad es 28'
humano.aumentarSueldo(500);
humano.obtenerSueldo(); // 1500
//humano.sueldo;  Error: 'sueldo' es privado y solo se puede acceder dentro de la clase 'Persona'   