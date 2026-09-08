import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentItem: string = 'Item del Header enviado a un @Input';
  nombre_usuario: string = 'Bruno González';

  recibirMensajeDesdeElHijo(mensaje: string) {
    console.log(mensaje);
  }
}
