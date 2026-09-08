import { Component, ElementRef, EventEmitter, input, Input, Output, ViewChild } from '@angular/core';
import Patient from '../../models/Patient';
import Alta from '../../models/Alta';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.css'
})
export class WizardComponent {
  @ViewChild('beforeButton') beforeButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('nextButton') nextButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('confirmButton') confirmButton!: ElementRef<HTMLButtonElement>;

  @Input() patientSelected!: Patient;
  @Input() date!: string;
  @Input() time!: string;

  @Input() currentStep!: number;

  @Output() MoveToNextStep = new EventEmitter<number>();
  @Output() MoveToPreviousStep = new EventEmitter<number>();

  @Output() ConfirmarAlta = new EventEmitter<Alta>();

  alta!: Alta;

  confirmarAlta_() {
    this.alta = this.SetAlta();
    console.log(this.alta);

    this.beforeButton.nativeElement.disabled = true;
    this.nextButton.nativeElement.disabled = true;
    this.confirmButton.nativeElement.disabled = true;

    this.ConfirmarAlta.emit(this.alta);
  }

  SetAlta(): Alta {
    return {
      patient: this.patientSelected,
      date: this.date,
      time: this.time
    }
  }

  MoveToNextStep_() {
    this.currentStep = this.currentStep + 1;

    this.MoveToNextStep.emit(this.currentStep);
  }

  MoveToPreviousStep_() {
    if (this.currentStep > 0) {
      this.currentStep = this.currentStep - 1;

      this.MoveToPreviousStep.emit(this.currentStep);
    }
  }

  isPatientSelected(): boolean {
    if (this.patientSelected) {
      this.MoveToNextStep_();
      return true;

    } else {
      console.log('Debe elegir un paciente!');
      return false;
    }
  }

  isDateAndTimeSelected(): boolean {
    if (this.date && this.time) {
      this.MoveToNextStep_();
      return true;

    } else {
      console.log('Debe elegir una fecha y una hora!');
      return false;
    }
  }

  esValido(): boolean {
    if (this.currentStep === 0) {
      return this.isPatientSelected();
    }

    if (this.currentStep === 1) {
      return this.isDateAndTimeSelected();
    }

    return true;
  }
}
