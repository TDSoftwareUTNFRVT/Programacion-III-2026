// la interface sirven para cuando voy a hacer una peticion a la tabla
// usando el readonly
interface Juego {
    nombre: string;
    categoria: string;
    imagen?: string[];
}

interface Dispositivo extends Juego {
    dispositivo: string;
}

interface Cuenta extends Dispositivo {
    nombre_cuenta: string;
}

const persona: Cuenta = {
    nombre: 'Mortal Kombat',
    categoria: 'Juego de lucha',
    dispositivo: 'PC',
    nombre_cuenta: '',
    imagen: ['mk.png']
};

console.log(persona);
