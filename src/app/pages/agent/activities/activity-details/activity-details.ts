import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Actividad } from '../../../../models/actividad.model';

@Component({
  selector: 'app-activity-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-details.html',
  styleUrls: ['./activity-details.scss']
})
export class ActivityDetailsComponent {
  @Input() activity: Actividad | null = null;
  @Output() closeDetails = new EventEmitter<void>();
  @Output() editActivity = new EventEmitter<Actividad>();

  onClose(): void {
    this.closeDetails.emit();
  }

  onEdit(): void {
    if (this.activity) {
      this.editActivity.emit(this.activity);
    }
  }

  // Getters para formatear datos
  get formattedDate(): string {
    if (!this.activity) return '';
    return new Date(this.activity.dia).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  get formattedTime(): string {
    if (!this.activity) return '';
    if (this.activity.horaFin) {
      return `${this.activity.hora} - ${this.activity.horaFin}`;
    }
    return this.activity.hora;
  }

  get isFixedText(): string {
    if (!this.activity) return '';
    return this.activity.esFija ? 'Sí' : 'No';
  }

  get espacioName(): string {
    if (!this.activity) return '';
    // Aquí podrías mapear el ID del espacio a su nombre
    // Por ahora mostramos el ID
    return `Espacio ${this.activity.espacioId}`;
  }
}