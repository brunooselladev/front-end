import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnChanges {
  @Input() label: string = '';
  @Input() name = '';
  @Input() type: 'text' | 'email' | 'number' | 'password' | 'date' | 'tel' | 'time' = 'text';
  @Input() control = new FormControl();
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() allowOnlyNumbersAndPlus = false;

  showPassword = false;

  get inputType(): string {
    if (this.type === 'password' && this.showPassword) {
      return 'text';
    }
    return this.type;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      if (this.disabled) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    }
  }

  onInputFilter(event: Event): void {
    if (!this.allowOnlyNumbersAndPlus) return;

    const input = event.target as HTMLInputElement;
    // Permitir solo números y el signo +
    const filteredValue = input.value.replace(/[^0-9+]/g, '');
    
    if (input.value !== filteredValue) {
      input.value = filteredValue;
      // Actualizar el FormControl
      this.control.setValue(filteredValue);
    }
  }
}
