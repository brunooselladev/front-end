import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export interface Option { label: string; value: string; disabled?: boolean; }

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select.html',
  styleUrl: './select.scss'
})
export class Select implements OnChanges {
  @Input() label = '';
  @Input() name = '';
  @Input() placeholder = 'Seleccione una opción';
  @Input({ required: true }) control!: FormControl | null;
  @Input() options: Array<Option | string> = [];
  @Input() multiple = false;
  @Input() disabled = false;
  @Input() required = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled'] && this.control) {
      if (this.disabled) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    }

    // Asegurar que el control tenga el valor por defecto si no tiene valor
    if (this.control && (this.control.value === null || this.control.value === undefined)) {
      this.control.setValue('null');
    }
  }

  asOption(o: Option | string): Option {
    return typeof o === 'string' ? { label: o, value: o } : o;
  }
}
