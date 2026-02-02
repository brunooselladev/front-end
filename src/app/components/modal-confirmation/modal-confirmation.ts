import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-confirmation.html',
  styleUrl: './modal-confirmation.scss'
})
export class ModalConfirmation {
  @Input() message: string = '';
  @Input() visible: boolean = false;
  @Input() type: 'positive' | 'danger' = 'positive';
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  get icon(): string {
    return this.type === 'positive' ? '✅' : '⚠️';
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
