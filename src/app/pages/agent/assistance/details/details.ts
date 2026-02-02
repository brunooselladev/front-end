import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NavbarComponent } from "../../../../layouts/navbar";
import { SidebarComponent } from "../../../../layouts/sidebar";
import { SideMenu } from "../../../../components/side-menu/side-menu";
import { ActivitiesService } from '../../../../services/activities-service';
import { AsistenciaService } from '../../../../services/asistencia-service';
import { CardParticipant } from '../../../../components/card-participant/card-participant';
import { ParticipantDetailsModal } from '../../../../components/participant-details-modal/participant-details-modal';
import { LoadingOverlayComponent } from '../../../../components/loading-overlay/loading-overlay';
import { BackButtonComponent } from '../../../../components/back-button/back-button.component';
import { Actividad } from '../../../../models/actividad.model';
import { Asistencia } from '../../../../models/asistencia.model';

@Component({
  selector: 'app-details',
  imports: [CommonModule, NavbarComponent, SidebarComponent, CardParticipant, SideMenu, ParticipantDetailsModal, LoadingOverlayComponent, BackButtonComponent],
  templateUrl: './details.html',
  styleUrl: './details.scss'
})
export class Details implements OnInit {
  actividad: Actividad | null = null;
  asistencias$!: Observable<Asistencia[]>;
  isLoading = true;
  errorMessage = '';

  // Side menu states
  isParticipantModalOpen = false;
  selectedAsistencia: Asistencia | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activitiesService: ActivitiesService,
    private asistenciaService: AsistenciaService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.loadActivityDetails();
  }

  private loadActivityDetails() {
    const id = this.route.snapshot.params['id'];

    if (!id) {
      this.errorMessage = 'ID de actividad no proporcionado';
      this.isLoading = false;
      return;
    }

    this.activitiesService.getActivityById(+id).subscribe({
      next: (actividad) => {
        if (actividad) {
          this.actividad = actividad;
          // Cargar asistencias de esta actividad
          this.asistencias$ = this.asistenciaService.getAsistenciasByActividadId(+id);
        } else {
          this.errorMessage = 'Actividad no encontrada';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar actividad:', error);
        this.errorMessage = 'Error al cargar los detalles de la actividad';
        this.isLoading = false;
      }
    });
  }

  onOpenParticipantDetails(asistencia: Asistencia) {
    this.selectedAsistencia = asistencia;
    this.isParticipantModalOpen = true;
    this.updateBodyScroll();
  }

  onCloseParticipantModal() {
    this.isParticipantModalOpen = false;
    this.selectedAsistencia = null;
    this.updateBodyScroll();
  }

  onAsistenciaUpdated(updatedAsistencia: Asistencia) {
    // Aquí se podría actualizar la lista de asistencias o mostrar un mensaje de éxito
    console.log('Asistencia actualizada:', updatedAsistencia);
    // Por ahora solo cerramos el modal
    this.onCloseParticipantModal();
  }

  private updateBodyScroll(): void {
    if (this.isParticipantModalOpen) {
      this.renderer.addClass(document.body, 'overflow-hidden');
    } else {
      this.renderer.removeClass(document.body, 'overflow-hidden');
    }
  }

  goBack() {
    this.router.navigate(['/agente/asistencia']);
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  }
}
