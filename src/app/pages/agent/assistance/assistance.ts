import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../../layouts/navbar";
import { SidebarComponent } from "../../../layouts/sidebar";
import { CardAssistance } from "../../../components/card-assistance/card-assistance";
import { LoadingOverlayComponent } from "../../../components/loading-overlay/loading-overlay";
import { ActivitiesService } from '../../../services/activities-service';
import { AsistenciaService } from '../../../services/asistencia-service';
import { JwtService } from '../../../services/jwt-service';
import { Actividad } from '../../../models/actividad.model';
import { Asistencia } from '../../../models/asistencia.model';
import { combineLatest, forkJoin } from 'rxjs';

interface AssistanceCard {
  id: number;
  activityName: string;
  activityDate: string;
  activityTime: string;
  confirmedParticipants: number;
  totalParticipants?: number;
}

@Component({
  selector: 'app-assistance',
  imports: [CommonModule, NavbarComponent, SidebarComponent, CardAssistance, LoadingOverlayComponent],
  templateUrl: './assistance.html',
  styleUrl: './assistance.scss'
})
export class Assistance implements OnInit {
  assistanceCards: AssistanceCard[] = [];
  isLoading = true;

  constructor(
    private activitiesService: ActivitiesService,
    private asistenciaService: AsistenciaService,
    private jwtService: JwtService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAssistanceData();
  }

  private loadAssistanceData() {
    this.isLoading = true;
    const agentEspacioId = this.jwtService.getIdEspacio();

    if (!agentEspacioId) {
      console.error('Agente no tiene idEspacio asignado');
      this.isLoading = false;
      return;
    }

    // Obtener actividades del espacio del agente
    this.activitiesService.getActivitiesByEspacioId(agentEspacioId).subscribe(activities => {
      if (activities.length === 0) {
        this.isLoading = false;
        return;
      }

      // Para cada actividad, obtener las asistencias y calcular participantes confirmados
      const validActivities = activities.filter(activity => activity.id !== undefined);
      const assistanceObservables = validActivities.map(activity =>
        this.asistenciaService.getAsistenciasByActividadId(activity.id!)
      );

      forkJoin(assistanceObservables).subscribe(asistenciasArrays => {
        this.assistanceCards = validActivities.map((activity, index) => {
          const asistencias = asistenciasArrays[index];
          const totalParticipants = asistencias.length;

          return {
            id: activity.id!,
            activityName: activity.nombre,
            activityDate: this.formatDate(activity.dia),
            activityTime: `${activity.hora} - ${activity.horaFin}`,
            confirmedParticipants: totalParticipants,
            totalParticipants: totalParticipants
          };
        });

        this.isLoading = false;
      });
    });
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  }

  onViewDetails(card: AssistanceCard) {
    // Obtener el rol del usuario
    const userRole = this.jwtService.getRole();

    // Navegar a la página de detalles según el rol
    if (userRole === 'efector') {
      this.router.navigate(['/efector/asistencia/detalles', card.id]);
    } else {
      // Por defecto, usar la ruta de agente
      this.router.navigate(['/agente/asistencia/detalles', card.id]);
    }
  }
}
