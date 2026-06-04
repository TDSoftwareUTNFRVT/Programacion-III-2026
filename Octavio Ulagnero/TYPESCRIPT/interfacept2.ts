interface Cultivo {
    nombre: string;
    epoca: string;
    ciclo: string;
    precio: number;
    fertilizante?: string;
}

interface Hibrido extends Cultivo {
    tipo: string;
    gen: string;
    resistencia: string;
    categoria: string[];
}

interface Curado extends Hibrido {
    tiempoCurado: string;
    metodoCurado: string;
}

const maiz: Curado = {
    nombre: "Maíz",
    epoca: "Primavera",
    ciclo: "Corto",
    precio: 100,
    fertilizante: "NPK",
    tipo: "Híbrido",
    gen: "Bt",
    resistencia: "Plagas",
    categoria: ["B4","C2","D1"],
    tiempoCurado: "30 días",
    metodoCurado: "Producto quimico",
};

console.log(maiz);

