import { Component, ViewChild } from '@angular/core';
import { Hijo2Component } from '../hijo-2/hijo-2.component';

@Component({
  selector: 'app-padre-2',
  templateUrl: './padre-2.component.html',
  styleUrl: './padre-2.component.css'
})
export class Padre2Component {
  @ViewChild(Hijo2Component) contador!: Hijo2Component;

  resetearContador() {
    this.contador.reset();
  }
}
