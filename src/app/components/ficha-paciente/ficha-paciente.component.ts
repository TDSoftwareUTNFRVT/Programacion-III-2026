import { Component } from '@angular/core';
import Patient from '../../models/Patient';
import HistorialPaciente from '../../models/HistorialPaciente';

@Component({
  selector: 'app-ficha-paciente',
  templateUrl: './ficha-paciente.component.html',
  styleUrl: './ficha-paciente.component.css'
})
export class FichaPacienteComponent {
  patients: Patient[];
  historialPacientes: HistorialPaciente[];
  notasDelProfesional: string[];

  selectedPatient!: Patient;
  selectedHistory!: HistorialPaciente;
  notaProfesionalSeleccionada!: string;

  patientDataExpanded: boolean = true;
  historialTurnosExpanded: boolean = false;
  notasDelProfesionalExpanded: boolean = false;

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
    ]

    this.historialPacientes = [
      {
        patient: this.patients[0],
        visitas: ['2026-09-17 - 12:00PM', '2026-09-17 - 13:00PM', '2026-09-17 - 14:00PM']
      },
      {
        patient: this.patients[1],
        visitas: ['2026-08-05 - 09:30AM', '2026-08-12 - 11:00AM']
      },
      {
        patient: this.patients[2],
        visitas: ['2026-07-20 - 10:00AM', '2026-07-22 - 04:00PM', '2026-08-01 - 02:30PM']
      },
      {
        patient: this.patients[3],
        visitas: ['2026-06-15 - 01:00PM', '2026-06-29 - 03:30PM']
      },
      {
        patient: this.patients[4],
        visitas: ['2026-05-10 - 09:00AM', '2026-05-18 - 11:15AM', '2026-05-25 - 05:00PM']
      },
      {
        patient: this.patients[5],
        visitas: ['2026-04-02 - 02:00PM', '2026-04-09 - 10:30AM']
      },
      {
        patient: this.patients[6],
        visitas: ['2026-03-11 - 08:45AM', '2026-03-18 - 12:00PM', '2026-03-25 - 04:15PM']
      },
      {
        patient: this.patients[7],
        visitas: ['2026-02-05 - 09:00AM', '2026-02-19 - 02:30PM']
      },
      {
        patient: this.patients[8],
        visitas: ['2026-01-12 - 11:00AM', '2026-01-19 - 01:45PM', '2026-01-26 - 03:00PM']
      },
      {
        patient: this.patients[9],
        visitas: ['2025-12-03 - 10:00AM', '2025-12-10 - 12:30PM']
      },
      {
        patient: this.patients[10],
        visitas: ['2025-11-07 - 09:15AM', '2025-11-14 - 02:00PM', '2025-11-21 - 05:30PM']
      },
      {
        patient: this.patients[11],
        visitas: ['2025-10-01 - 08:30AM', '2025-10-08 - 11:45AM']
      },
      {
        patient: this.patients[12],
        visitas: ['2025-09-15 - 01:00PM', '2025-09-22 - 03:30PM', '2025-09-29 - 04:45PM']
      },
      {
        patient: this.patients[13],
        visitas: ['2025-08-04 - 09:00AM', '2025-08-11 - 10:30AM']
      },
      {
        patient: this.patients[14],
        visitas: ['2025-07-09 - 02:00PM', '2025-07-16 - 03:15PM', '2025-07-23 - 05:00PM']
      },
      {
        patient: this.patients[15],
        visitas: ['2025-06-02 - 08:45AM', '2025-06-09 - 12:00PM']
      },
      {
        patient: this.patients[16],
        visitas: ['2025-05-13 - 09:30AM', '2025-05-20 - 01:00PM', '2025-05-27 - 04:30PM']
      },
      {
        patient: this.patients[17],
        visitas: ['2025-04-06 - 10:00AM', '2025-04-13 - 11:30AM']
      },
      {
        patient: this.patients[18],
        visitas: ['2025-03-15 - 02:00PM', '2025-03-22 - 03:45PM', '2025-03-29 - 05:15PM']
      },
      {
        patient: this.patients[19],
        visitas: ['2025-02-01 - 09:00AM', '2025-02-08 - 11:00AM']
      }
    ]

    this.notasDelProfesional = [
      "Bruno González: control rutinario, sin hallazgos relevantes.",
      "Pablo Gutierrez: leve hipertensión, se recomienda seguimiento.",
      "Martin García: cuadro de gastritis, tratamiento con dieta.",
      "Gerónimo Benavidez: dolor lumbar crónico, ejercicios indicados.",
      "Lucía Fernández: resfriado común, reposo y líquidos.",
      "María López: migrañas recurrentes, derivación a neurología.",
      "Sofía Martínez: alergia estacional, antihistamínicos recetados.",
      "Juan Pérez: control odontológico, sin complicaciones.",
      "Valentina Ramírez: ansiedad leve, sugerida terapia cognitiva.",
      "Agustín Morales: revisión pediátrica, crecimiento normal.",
      "Camila Suárez: dermatitis leve, crema tópica indicada.",
      "Mateo Torres: control post-operatorio, evolución favorable.",
      "Florencia Vega: anemia leve, suplemento de hierro.",
      "Tomás Castro: esguince de tobillo, reposo y fisioterapia.",
      "Carolina Domínguez: control ginecológico, todo en orden.",
      "Emilia Herrera: bronquitis leve, tratamiento antibiótico.",
      "Francisco Mendoza: colesterol elevado, dieta recomendada.",
      "Julieta Silva: control oftalmológico, miopía leve.",
      "Diego Navarro: dolor abdominal, estudios complementarios pedidos.",
      "Martina Rojas: vacunación al día, sin novedades."
    ]
  }

  selectPatient(id: number): Patient {
    this.selectedPatient = this.patients[id];
    this.selectedHistory = this.historialPacientes[id];
    this.notaProfesionalSeleccionada = this.notasDelProfesional[id];

    console.log(this.selectedPatient, this.selectedHistory, this.notaProfesionalSeleccionada);

    return this.selectedPatient;
  }

  expandPannel(pannel: string, value: boolean) {
    if (pannel === 'patient-data') {
      this.patientDataExpanded = value;
    }

    if (pannel === 'historial-turnos') {
      this.historialTurnosExpanded = value;
    }

    if (pannel === 'notas-del-profesional') {
      this.notasDelProfesionalExpanded = value;
    }
  }
}
