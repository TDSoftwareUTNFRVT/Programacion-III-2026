import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-panel-colapsable',
  templateUrl: './panel-colapsable.component.html',
  styleUrl: './panel-colapsable.component.css'
})
export class PanelColapsableComponent {
  @ViewChild('pannelInfo') pannelInfo!: ElementRef<HTMLDivElement>;

  @Input() title: string = '';

  @Input() itIsExpanded: boolean = false;
  
  @Output() expanded = new EventEmitter<boolean>();

  ngAfterViewInit() {
    if (this.itIsExpanded) {
      this.pannelInfo.nativeElement.style.display = 'flex';
    } else {
      this.pannelInfo.nativeElement.style.display = 'none';
    }
  }

  expand() {
    this.itIsExpanded = !this.itIsExpanded;
    
    this.expanded.emit(this.itIsExpanded);

    if (this.itIsExpanded) {
      this.pannelInfo.nativeElement.style.display = 'flex';
    } else {
      this.pannelInfo.nativeElement.style.display = 'none';
    }
  }
}
