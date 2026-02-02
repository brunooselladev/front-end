import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalConfirmation } from '../../components/modal-confirmation/modal-confirmation';
import { CardNotifications } from '../../components/card-notifications/card-notifications';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ModalConfirmation, CardNotifications],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  showModal = false;
  modalMessage = '¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.';
  modalType: 'positive' | 'danger' = 'positive';
  lastAction = '';

  // Datos de ejemplo para las notificaciones
  notifications = [
    {
      id: '1',
      userName: 'Juan Carlos Pérez',
      espacioName: 'Complejo Los Pumitas',
      requestDate: new Date(2024, 9, 8), // 2 días atrás
    },
    {
      id: '2', 
      userName: 'María González',
      espacioName: 'Centro de Salud Norte',
      requestDate: new Date(2024, 9, 5), // 5 días atrás
    },
    {
      id: '3',
      userName: 'Roberto Silva',
      espacioName: 'Complejo Los Pumitas',
      requestDate: new Date(2024, 8, 25), // Hace más de una semana
    }
  ];

  openModal(): void {
    this.showModal = true;
  }

  openDangerModal(): void {
    this.modalMessage = '¿Estás seguro que deseas eliminar este elemento? Esta acción es irreversible.';
    this.modalType = 'danger';
    this.showModal = true;
  }

  onCancel(): void {
    this.showModal = false;
    this.lastAction = 'Cancelado';
  }

  onConfirm(): void {
    this.showModal = false;
    this.lastAction = 'Confirmado';
  }

  // Métodos para manejar las acciones de las notificaciones
  onViewDetails(notificationId: string): void {
    console.log('Ver detalles de la notificación:', notificationId);
    this.lastAction = `Ver detalles - ID: ${notificationId}`;
  }

  onAcceptNotification(notificationId: string): void {
    console.log('Aceptar notificación:', notificationId);
    this.lastAction = `Aceptado - ID: ${notificationId}`;
    // Aquí puedes agregar la lógica para aceptar la solicitud
  }

  onRejectNotification(notificationId: string): void {
    console.log('Rechazar notificación:', notificationId);
    this.lastAction = `Rechazado - ID: ${notificationId}`;
    // Aquí puedes agregar la lógica para rechazar la solicitud
  }
}
