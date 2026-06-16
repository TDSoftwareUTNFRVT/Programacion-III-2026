interface Persona{
    nombre: string;
    apellido: string;
    dni: number;
    fecha_nacimiento: string;
}

interface Alumno extends Persona{
    carrera: string;
    legajo: number;
}

interface Profesor extends Persona{
    titulo: string;
    carreras: string[];
    
}

interface No_Docente extends Persona{
    cargo: string;
}

const cesar: Profesor={
    nombre: "Cesar",
    apellido: "Barrionuevo",
    dni: 11111111,
    fecha_nacimiento: "01/01/1999",
    titulo: "Analista",
    carreras: ["Tecnicatura en Programacion","Gestion de Software"]
}

function presentar(p: Profesor):void {
        console.log(`Hola soy ${p.nombre} ${p.apellido}, mi DNI es ${p.dni}, naci el ${p.fecha_nacimiento}, me recibi de ${p.titulo} y soy profesor de ${p.carreras} `)
    }
presentar(cesar);