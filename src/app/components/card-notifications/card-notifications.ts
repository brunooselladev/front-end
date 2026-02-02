import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NotificationData {
  id: string;
  userName: string;
  espacioName: string;
  requestDate: Date;
  userType: 'efector' | 'agente' | 'referente' | 'usmya';
}

@Component({
  selector: 'app-card-notifications',
  imports: [CommonModule],
  templateUrl: './card-notifications.html',
  styleUrl: './card-notifications.scss'
})
export class CardNotifications implements OnInit {
  @Input() userName: string = '';
  @Input() espacioName: string = '';
  @Input() requestDate: Date = new Date();
  @Input() notificationId: string = '';
  @Input() hasUsmya: boolean = false;
  @Input() hasCreador: boolean = false;
  @Input() creadorTipo: string = '';

  @Output() viewDetails = new EventEmitter<string>();
  @Output() accept = new EventEmitter<string>();
  @Output() reject = new EventEmitter<string>();

  formattedDate: string = '';

  ngOnInit(): void {
    this.formattedDate = this.formatDate();
  }

  getUserInitial(): string {
    return this.userName ? this.userName.charAt(0).toUpperCase() : 'U';
  }

  private formatDate(): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.requestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Hace 1 día';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return this.requestDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.notificationId);
  }

  onAccept(): void {
    this.accept.emit(this.notificationId);
  }

  onReject(): void {
    this.reject.emit(this.notificationId);
  }
}
