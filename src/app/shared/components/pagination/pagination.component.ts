import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input({required: true}) currentPage: number = 1;
  @Input({required: true}) totalPages: number = 1;

  @Output() pageChange = new EventEmitter<number>();

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    if (page === this.currentPage) return;

    this.pageChange.emit(page);
  }
}
