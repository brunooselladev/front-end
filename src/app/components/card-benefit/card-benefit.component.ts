import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Actividad } from '../../models/actividad.model';

@Component({
  selector: 'app-card-benefit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-benefit.component.html',
  styleUrl: './card-benefit.component.scss'
})
export class CardBenefitComponent {
  @Input({ required: true }) actividad!: Actividad;
  @Output() verMas = new EventEmitter<Actividad>();

  // Método para obtener el ícono según si es fija o no
  getTipoIcon(): string {
    return this.actividad.esFija ? '📅' : '🎯';
  }

  // Método para formatear la fecha
  getFechaFormateada(): string {
    return new Date(this.actividad.dia).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Método para truncar texto largo
  truncarTexto(texto: string | undefined, maxLength: number = 80): string {
    if (!texto) return '';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
  }

  onVerMas(): void {
    this.verMas.emit(this.actividad);
  }
}