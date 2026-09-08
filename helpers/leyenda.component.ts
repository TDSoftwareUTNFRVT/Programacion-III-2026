import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-leyenda',
  templateUrl: './leyenda.component.html',
  styleUrl: './leyenda.component.css'
})
export class LeyendaComponent {
  @Output() alHacerClick = new EventEmitter<string>();

  leyenda: string = 'Leyenda hecha durante la clase del 7/8/26';

  currentItem: string = 'Item';

  avisarAlPadre() {
    this.alHacerClick.emit('HOLA DESDE EL HIJO, SALU2');
  }
}
