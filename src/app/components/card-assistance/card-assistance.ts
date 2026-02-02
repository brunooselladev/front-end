import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-assistance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-assistance.html',
  styleUrl: './card-assistance.scss'
})
export class CardAssistance {
  @Input() activityName!: string;
  @Input() activityDate!: string;
  @Input() activityTime!: string;
  @Input() confirmedParticipants!: number;
  @Input() totalParticipants?: number;

  @Output() viewDetails = new EventEmitter<void>();

  onViewDetails() {
    this.viewDetails.emit();
  }

  getParticipantsText(): string {
    const confirmed = this.confirmedParticipants;
    const total = this.totalParticipants;
    
    // Si confirmed y total son iguales, mostrar solo el total de participantes inscritos
    if (total && confirmed === total) {
      return `${total} participantes anotados`;
    }
    
    // Caso normal: mostrar confirmados de total
    return total ? `${confirmed}/${total} participantes confirmados` : `${confirmed} participantes confirmados`;
  }
}
