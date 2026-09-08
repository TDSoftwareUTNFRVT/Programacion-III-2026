import { Component, ElementRef, ViewChild } from '@angular/core';
import Patient from '../../models/Patient';
import { WizardComponent } from '../wizard/wizard.component';
import Alta from '../../models/Alta';

@Component({
  selector: 'app-alta-turno',
  templateUrl: './alta-turno.component.html',
  styleUrl: './alta-turno.component.css'
})
export class AltaTurnoComponent {
  @ViewChild('inputDate') inputDate!: ElementRef<HTMLInputElement>;
  @ViewChild('inputTime') inputTime!: ElementRef<HTMLInputElement>;

  patients: Patient[];

  patientSelected!: Patient;
  dateSelected!: string;
  timeSelected!: string;

  pasoActual: number = 0;

  alta!: Alta;

  constructor() {
    this.patients = [
      {
        id: 0,
        dni: 47507083,
        name: 'Bruno',
        surname: 'González'
      },
      {
        id: 1,
        dni: 12345678,
        name: 'Pablo',
        surname: 'Gutierrez'
      },
      {
        id: 2,
        dni: 91011213,
        name: 'Martin',
        surname: 'García'
      },
      {
        id: 3,
        dni: 14151617,
        name: 'Gerónimo',
        surname: 'Benavidez'
      },
      {
        id: 4,
        dni: 20212223,
        name: 'Lucía',
        surname: 'Fernández'
      },
      {
        id: 5,
        dni: 24252627,
        name: 'María',
        surname: 'López'
      },
      {
        id: 6,
        dni: 28293031,
        name: 'Sofía',
        surname: 'Martínez'
      },
      {
        id: 7,
        dni: 32333435,
        name: 'Juan',
        surname: 'Pérez'
      },
      {
        id: 8,
        dni: 36373839,
        name: 'Valentina',
        surname: 'Ramírez'
      },
      {
        id: 9,
        dni: 40414243,
        name: 'Agustín',
        surname: 'Morales'
      },
      {
        id: 10,
        dni: 44454647,
        name: 'Camila',
        surname: 'Suárez'
      },
      {
        id: 11,
        dni: 48495051,
        name: 'Mateo',
        surname: 'Torres'
      },
      {
        id: 12,
        dni: 52535455,
        name: 'Florencia',
        surname: 'Vega'
      },
      {
        id: 13,
        dni: 56575859,
        name: 'Tomás',
        surname: 'Castro'
      },
      {
        id: 14,
        dni: 60616263,
        name: 'Carolina',
        surname: 'Domínguez'
      },
      {
        id: 15,
        dni: 64656667,
        name: 'Emilia',
        surname: 'Herrera'
      },
      {
        id: 16,
        dni: 68697071,
        name: 'Francisco',
        surname: 'Mendoza'
      },
      {
        id: 17,
        dni: 72737475,
        name: 'Julieta',
        surname: 'Silva'
      },
      {
        id: 18,
        dni: 76777879,
        name: 'Diego',
        surname: 'Navarro'
      },
      {
        id: 19,
        dni: 80818283,
        name: 'Martina',
        surname: 'Rojas'
      }
    ];
  }

  selectPatient(patient: number): Patient {
    this.patientSelected = this.patients[patient]

    console.log(this.patientSelected);

    return this.patientSelected;
  }

  updateStep(value: number) {
    this.pasoActual = value;
  }

  setSelectedDate() {
    this.dateSelected = this.inputDate.nativeElement.value;

    console.log(this.dateSelected);
  }

  setSelectedTime() {
    this.timeSelected = this.inputTime.nativeElement.value;

    console.log(this.timeSelected);
  }

  recibirAlta(altaRecibida: Alta) {
    this.alta = altaRecibida;
  }
}
