import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Actividad } from '../../models/actividad.model';

@Component({
  selector: 'app-card-activities',
  imports: [CommonModule],
  templateUrl: './card-activities.html',
  styleUrl: './card-activities.scss'
})
export class CardActivitiesComponent {
  @Input() actividad!: Actividad;
  @Input() isSelected: boolean = false;
  @Input() showCheckbox: boolean = true;

  @Output() selectionChange = new EventEmitter<{actividad: Actividad, selected: boolean}>();

  onSelectionChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.selectionChange.emit({
      actividad: this.actividad,
      selected: checkbox.checked
    });
  }

  getDiaFormateado(): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[this.actividad.dia.getDay()];
  }

  getFechaFormateada(): string {
    return this.actividad.dia.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  }
}
