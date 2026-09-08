import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import Patient from '../../models/Patient';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  modalRequired: string = '';
  modalIsVisible: boolean = false;
  modalTitle: string = '';

  patient: Patient;

  currentAction: string = 'Ninguna';

  @ViewChild(ModalComponent) modal!: ModalComponent;

  constructor() {
    this.patient = {
      id: 0,
      dni: 47507083,
      name: 'Bruno',
      surname: 'González'
    }
  }

  toggleModal(type: string, title: string) {
    this.setModalVisibility();

    this.modalRequired = type;
    this.modalTitle = title;
  }

  setModalVisibility() {
    this.modalIsVisible = !this.modalIsVisible;
  }

  confirm(newAction: string) {
    this.setModalVisibility();

    this.currentAction = newAction;
  }

  cancel(newAction: string) {
    this.setModalVisibility();

    this.currentAction = newAction;
  }
}
