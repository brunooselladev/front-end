import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';

export interface SummaryOption {
  label: string;
  value: string;
  checked?: boolean;
}

export interface SummaryData {
  text: string;
  selectedOptions: string[];
}

@Component({
  selector: 'app-input-summary',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-summary.html',
  styleUrl: './input-summary.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSummary),
      multi: true
    }
  ]
})
export class InputSummary implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Escribe aquí...';
  @Input() options: SummaryOption[] = [];
  @Input() maxLength: number = 500;

  textValue: string = '';
  selectedOptions: string[] = [];
  isDropdownOpen: boolean = false;
  searchTerm: string = '';
  
  private onChange: any = () => {};
  private onTouched: any = () => {};

  get remainingChars(): number {
    return this.maxLength - this.textValue.length;
  }

  get selectedOptionsData(): SummaryOption[] {
    return this.options.filter(opt => this.selectedOptions.includes(opt.value));
  }

  get filteredOptions(): SummaryOption[] {
    if (!this.searchTerm.trim()) {
      return this.options;
    }
    const term = this.searchTerm.toLowerCase();
    return this.options.filter(option => 
      option.label.toLowerCase().includes(term)
    );
  }

  writeValue(value: SummaryData): void {
    if (value) {
      this.textValue = value.text || '';
      this.selectedOptions = value.selectedOptions || [];
      this.updateOptionsCheckState();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onTextChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.textValue = target.value;
    this.emitValue();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (!this.isDropdownOpen) {
      this.searchTerm = ''; // Limpiar búsqueda al cerrar
    }
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
  }

  markAsTouched(): void {
    this.onTouched();
  }

  toggleOption(option: SummaryOption): void {
    const index = this.selectedOptions.indexOf(option.value);
    
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
      option.checked = false;
    } else {
      this.selectedOptions.push(option.value);
      option.checked = true;
    }
    
    this.emitValue();
  }

  removeOption(optionValue: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    const index = this.selectedOptions.indexOf(optionValue);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
      const option = this.options.find(opt => opt.value === optionValue);
      if (option) {
        option.checked = false;
      }
      this.emitValue();
    }
  }

  private emitValue(): void {
    const value: SummaryData = {
      text: this.textValue,
      selectedOptions: [...this.selectedOptions]
    };
    this.onChange(value);
  }

  private updateOptionsCheckState(): void {
    this.options.forEach(option => {
      option.checked = this.selectedOptions.includes(option.value);
    });
  }
}
