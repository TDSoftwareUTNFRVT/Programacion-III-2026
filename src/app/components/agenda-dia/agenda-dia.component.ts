import { Component, ViewChild } from '@angular/core';
import Shift from '../../models/Shift';
import { TurnoCardComponent } from '../turno-card/turno-card.component';

@Component({
  selector: 'app-agenda-dia',
  templateUrl: './agenda-dia.component.html',
  styleUrl: './agenda-dia.component.css'
})
export class AgendaDiaComponent {
  @ViewChild(TurnoCardComponent) shiftCard!: TurnoCardComponent;

  shifts: Shift[];

  constructor() {
    this.shifts = [
      {
        id: 0,
        time: '10:00 PM',
        patient: 'Paciente 1',
        state: 'Pendiente'
      },
      {
        id: 1,
        time: '11:00 PM',
        patient: 'Paciente 2',
        state: 'Pendiente'
      },
      {
        id: 2,
        time: '12:00 PM',
        patient: 'Paciente 3',
        state: 'Pendiente'
      },
      {
        id: 3,
        time: '13:00 PM',
        patient: 'Paciente 4',
        state: 'Pendiente'
      },
      {
        id: 4,
        time: '14:00 PM',
        patient: 'Paciente 5',
        state: 'Pendiente'
      },
      {
        id: 5,
        time: '15:00 PM',
        patient: 'Paciente 6',
        state: 'Pendiente'
      },
      {
        id: 6,
        time: '16:00 PM',
        patient: 'Paciente 7',
        state: 'Pendiente'
      },
      {
        id: 7,
        time: '17:00 PM',
        patient: 'Paciente 8',
        state: 'Pendiente'
      },
      {
        id: 8,
        time: '18:00 PM',
        patient: 'Paciente 9',
        state: 'Pendiente'
      },
      {
        id: 9,
        time: '19:00 PM',
        patient: 'Paciente 10',
        state: 'Pendiente'
      }
    ]
  }

  handleState(shiftId: number, newState: string) {
    const shift = this.shifts[shiftId];

    shift.state = newState;
  }
}
