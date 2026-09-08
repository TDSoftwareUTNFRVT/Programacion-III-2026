import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title: string = 'Título por defecto';
  @Input() visible: boolean = false;

  @Output() confirmEvent = new EventEmitter<string>();
  @Output() cancelEvent = new EventEmitter<string>();

  confirmEvent_() {
    this.confirmEvent.emit('Confirmación');
  }

  cancelEvent_() {
    this.cancelEvent.emit('Cancelación');
  }
}
