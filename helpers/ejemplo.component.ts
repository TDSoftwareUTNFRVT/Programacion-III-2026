import { Component } from '@angular/core';

@Component({
  selector: 'app-ejemplo',
  templateUrl: './ejemplo.component.html',
  styleUrl: './ejemplo.component.css'
})
export class EjemploComponent {
  nombre: string = 'Soy el componente ejemplo 😊';

  mostrar_nombre: boolean = true;

  frutas: string[] = ['Manzana', 'Banana', 'Cereza', 'Durazno', 'Uva'];

  click() {
    alert('¡Has clickeado el botón!');
  }

  mostrarNombre() {
    this.mostrar_nombre = !this.mostrar_nombre;
  }

  toggleName() {
    if (this.mostrar_nombre === true) {
      this.mostrar_nombre = false;
    } else {
      this.mostrar_nombre = true;
    }
  }
}
