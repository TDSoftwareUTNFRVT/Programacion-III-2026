import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  titulo: string = "Angular 18";
  descripcion: string = "Componente con Angular";
  boton: string = "Mas";
  autor:string = "Lautaro";
}
