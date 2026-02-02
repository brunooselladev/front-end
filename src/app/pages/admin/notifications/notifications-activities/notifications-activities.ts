import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { Actividad } from '../../../../models/actividad.model';
import { ActivitiesService } from '../../../../services/activities-service';
import { EspacioService } from '../../../../services/espacio-service';
import { NavbarComponent } from '../../../../layouts/navbar/navbar.component';
import { SidebarComponent } from '../../../../layouts/sidebar/sidebar.component';
import { CardNotifications } from '../../../../components/card-notifications/card-notifications';
import { SideMenu } from '../../../../components/side-menu/side-menu';
import { ModalConfirmation } from '../../../../components/modal-confirmation/modal-confirmation';
import { LoadingOverlayComponent } from '../../../../components/loading-overlay/loading-overlay';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notifications-activities',
  imports: [
    CommonModule,
    NavbarComponent,
    SidebarComponent,
    CardNotifications,
    SideMenu,
    ModalConfirmation,
    LoadingOverlayComponent
  ],
  templateUrl: './notifications-activities.html',
  styleUrl: './notifications-activities.scss'
})
export class NotificationsActivities implements OnInit {
  sideMenuOpen = false;
  selectedActivity: Actividad | null = null;
  unverifiedActivities$!: Observable<Actividad[]>;
  isLoading$ = new BehaviorSubject<boolean>(true);

  // Map para almacenar nombres de espacios por ID
  private espacioNames: Map<number, string> = new Map();

  // Modal properties
  showModal = false;
  modalMessage = '';
  modalType: 'positive' | 'danger' = 'positive';
  pendingAction: { type: 'accept' | 'reject'; activityId: number } | null = null;

  constructor(
    private activitiesService: ActivitiesService,
    private espacioService: EspacioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeObservables();
  }

  private initializeObservables(): void {
    this.isLoading$.next(true);
    this.unverifiedActivities$ = this.activitiesService.getUnverifiedActivities();

    // Cargar nombres de espacios
    this.loadEspacioNames();

    this.unverifiedActivities$.subscribe(() => {
      this.isLoading$.next(false);
    });
  }

  private loadEspacioNames(): void {
    this.espacioService.getAllEspacios().subscribe(espacios => {
      this.espacioNames.clear();
      espacios.forEach(espacio => {
        if (espacio.id !== undefined) {
          this.espacioNames.set(espacio.id, espacio.nombre);
        }
      });
    });
  }

  // Método para obtener el nombre del espacio por ID
  getEspacioName(espacioId: number): string {
    return this.espacioNames.get(espacioId) || `Espacio ${espacioId}`;
  }

  toggleSideMenu(): void {
    this.sideMenuOpen = !this.sideMenuOpen;
  }

  closeSideMenu(): void {
    this.sideMenuOpen = false;
    this.selectedActivity = null;
  }

  // Método para ver detalles de la actividad
  onViewDetails(activityId: number | string): void {
    const id = typeof activityId === 'string' ? parseInt(activityId) : activityId;
    console.log('Ver detalles de la actividad:', id);

    this.activitiesService.getActivityById(id).subscribe(activity => {
      if (activity) {
        this.selectedActivity = activity;
        this.sideMenuOpen = true;
      }
    });
  }

  onAcceptNotification(activityId: number | string): void {
    const id = typeof activityId === 'string' ? parseInt(activityId) : activityId;
    console.log('Aprobar actividad:', id);
    this.modalMessage = '¿Estás seguro de que deseas aprobar esta actividad?';
    this.modalType = 'positive';
    this.pendingAction = { type: 'accept', activityId: id };
    this.showModal = true;
  }

  onRejectNotification(activityId: number | string): void {
    const id = typeof activityId === 'string' ? parseInt(activityId) : activityId;
    console.log('Rechazar actividad:', id);
    this.modalMessage = '¿Estás seguro de que deseas rechazar esta actividad? Se eliminará permanentemente.';
    this.modalType = 'danger';
    this.pendingAction = { type: 'reject', activityId: id };
    this.showModal = true;
  }

  onModalConfirm(): void {
    if (this.pendingAction) {
      if (this.pendingAction.type === 'accept') {
        this.activitiesService.updateActivity(this.pendingAction.activityId, { isVerified: true }).subscribe(() => {
          console.log('Actividad aprobada exitosamente');
          this.reloadObservables();
          this.sideMenuOpen = false; // Cerrar side menu
          Swal.fire({
            position: 'top-end',
            title: 'La actividad ha sido aprobada exitosamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            toast: true
          });
        });
      } else if (this.pendingAction.type === 'reject') {
        this.activitiesService.deleteActivity(this.pendingAction.activityId).subscribe(() => {
          console.log('Actividad rechazada y eliminada exitosamente');
          this.reloadObservables();
          this.sideMenuOpen = false; // Cerrar side menu
          Swal.fire({
            position: 'top-end',
            title: 'La actividad ha sido rechazada y eliminada.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            toast: true
          });
        });
      }
    }
    this.showModal = false;
    this.pendingAction = null;
  }

  private reloadObservables(): void {
    this.initializeObservables();
  }

  onModalCancel(): void {
    this.showModal = false;
    this.pendingAction = null;
  }

  getCurrentDate(): Date {
    return new Date();
  }
}
