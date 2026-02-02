import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() label: string = ''; // Alias para text
  @Input() disabled: boolean = false;
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() icon: string = '';
  @Input() loading: boolean = false;
  @Input() title: string = ''; // Para tooltip
  @Input() type: string = 'button'; // Tipo de botón
  @Output() clicked = new EventEmitter<void>();

  get displayText(): string {
    return this.label || this.text;
  }

  get buttonClasses(): string {
    const classes = ['app-btn'];
    
    classes.push(`app-btn--${this.variant}`);
    classes.push(`app-btn--${this.size}`);
    
    if (this.loading) {
      classes.push('app-btn--loading');
    }
    
    if (this.icon && !this.displayText) {
      classes.push('app-btn--icon-only');
    }
    
    return classes.join(' ');
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
