import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error',
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {
  @Input() show: boolean = false;
  @Input() title: string = 'Error';
  @Input() message: string = 'Ocurrió un error inesperado.';
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  stopPropagation(event: Event) : void {
    event.stopPropagation();
  }
}
