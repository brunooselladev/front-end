import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../../layouts/navbar/navbar.component';
import { SidebarComponent } from '../../../../layouts/sidebar/sidebar.component';
import { CardBenefitComponent } from '../../../../components/card-benefit/card-benefit.component';
import { LoadingOverlayComponent } from '../../../../components/loading-overlay/loading-overlay';
import { Actividad } from '../../../../models/actividad.model';
import { ActivitiesService } from '../../../../services/activities-service';

@Component({
  selector: 'app-benefits',
  imports: [
    CommonModule,
    NavbarComponent,
    SidebarComponent,
    CardBenefitComponent,
    LoadingOverlayComponent
  ],
  templateUrl: './benefits.html',
  styleUrl: './benefits.scss'
})
export class Benefits implements OnInit {
  // Actividades desde el servicio
  actividades: Actividad[] = [];
  isLoading: boolean = true;

  constructor(private activitiesService: ActivitiesService, private router: Router) {}

  ngOnInit() {
    this.loadActividades();
  }

  private loadActividades(): void {
    this.activitiesService.getAllActivities().subscribe({
      next: (actividades) => {
        this.actividades = actividades;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar actividades:', error);
        this.isLoading = false;
      }
    });
  }

  // Método para manejar el click en "Ver detalles"
  onVerMas(actividad: Actividad) {
    this.router.navigate(['/admin/recursero/prestaciones', actividad.id]);
  }
}
