import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavbarComponent } from '../../../../../layouts/navbar/navbar.component';
import { SidebarComponent } from '../../../../../layouts/sidebar/sidebar.component';
import { LoadingOverlayComponent } from '../../../../../components/loading-overlay/loading-overlay';
import { BackButtonComponent } from '../../../../../components/back-button/back-button.component';
import { Actividad } from '../../../../../models/actividad.model';
import { ActivitiesService } from '../../../../../services/activities-service';
import { Espacio } from '../../../../../models/espacio.model';
import { EspacioService } from '../../../../../services/espacio-service';

@Component({
  selector: 'app-detail',
  imports: [
    CommonModule,
    NavbarComponent,
    SidebarComponent,
    LoadingOverlayComponent,
    BackButtonComponent
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.scss'
})
export class Detail implements OnInit {
  actividad: Actividad | null = null;
  espacio: Espacio | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activitiesService: ActivitiesService,
    private espacioService: EspacioService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadActividadDetails();
  }

  private loadActividadDetails(): void {
    const id = this.route.snapshot.params['id'];

    if (!id) {
      this.error = 'ID de actividad no proporcionado';
      this.isLoading = false;
      return;
    }

    this.activitiesService.getActivityById(+id).subscribe({
      next: (actividad) => {
        if (actividad) {
          this.actividad = actividad;
          // Obtener el espacio correspondiente
          this.espacioService.getEspacioById(actividad.espacioId).subscribe({
            next: (espacio) => {
              this.espacio = espacio;
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error al cargar el espacio:', error);
              this.isLoading = false;
            }
          });
        } else {
          this.error = 'Actividad no encontrada';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar detalles de la actividad:', error);
        this.error = 'Error al cargar los detalles de la actividad';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/resourceful/benefits']);
  }

  getTipoActividadIcon(esFija: boolean): string {
    return esFija ? '📅' : '🎯';
  }

  getTipoActividadLabel(esFija: boolean): string {
    return esFija ? 'Actividad Fija' : 'Actividad Variable';
  }

  getFechaFormateada(dia: Date): string {
    return new Date(dia).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
