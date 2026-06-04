// Definir una interface mas opcionales
interface Usuario{
    readonly id: number;
    nombre: string;
    email: string;
    ciudad: string;
    estadocivil?: string;
    color_pelo?: string;
}
// uso de interface
function mostrarUsuario(user: Usuario): void {
console.log(`${user.id}: ${user.nombre}`);
}

const Felipe: Usuario = {
    id: 1,
    nombre: "Felipe",
    email: "felipe123@gmail.com",
    ciudad: "Venado Tuerto",
    estadocivil: "", // Opcional
    color_pelo: "Castaño",
};

// Felipe.id = 2; no nos va a dejar modificarlo

Felipe.ciudad = "Rosario";

mostrarUsuario(Felipe);

