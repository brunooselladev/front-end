import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-option.component.html',
  styleUrls: ['./card-option.component.scss']
})
export class CardOptionComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() route: string = '';

  constructor(private router: Router) {}

  navigate() {
    if (this.route) {
      this.router.navigate([this.route]);
    }
  }

  isFontAwesomeIcon(icon: string): boolean {
    return !!(icon && (icon.includes('fas ') || icon.includes('far ') || icon.includes('fab ') || icon.includes('fa-')));
  }

  isMaterialIcon(icon: string): boolean {
    return !!(icon && icon.includes('material-icons'));
  }

  getMaterialIconName(icon: string): string {
    // Extrae el nombre del icono de la clase (ej: "material-icons help" -> "help")
    const parts = icon.split(' ');
    return parts.length > 1 ? parts[1] : '';
  }
}
