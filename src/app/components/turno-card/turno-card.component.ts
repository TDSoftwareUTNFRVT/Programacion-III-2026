import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-turno-card',
  templateUrl: './turno-card.component.html',
  styleUrl: './turno-card.component.css'
})
export class TurnoCardComponent {
  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<string>();

  @Input() time: string = '00:00PM';
  @Input() patient: string = '';
  @Input() state: string = 'Pendiente';

  @ViewChild('card') card!: ElementRef<HTMLDivElement>;
  @ViewChild('confirmButton') confirmButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('cancelButton') cancelButton!: ElementRef<HTMLButtonElement>;

  confirmShift() {
    let newState: string = 'Confirmado';

    this.confirm.emit(newState);

    this.card.nativeElement.style.background = '#82FF82';
  }

  cancelShift() {
    let newState: string = 'Cancelado';

    this.cancel.emit(newState);

    this.card.nativeElement.style.background = '#FF8282';

    this.confirmButton.nativeElement.disabled = true;
    this.cancelButton.nativeElement.disabled = true;
  }
}