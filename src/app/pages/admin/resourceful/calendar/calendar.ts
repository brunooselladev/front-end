import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../layouts/navbar/navbar.component';
import { SidebarComponent } from '../../../../layouts/sidebar/sidebar.component';
import { FullcalendarWeek } from '../../../../components/fullcalendar-week/fullcalendar-week';
import { SideMenu } from '../../../../components/side-menu/side-menu';
import { LoadingOverlayComponent } from '../../../../components/loading-overlay/loading-overlay';
import { ActivitiesService } from '../../../../services/activities-service';
import { EspacioService } from '../../../../services/espacio-service';
import { Actividad } from '../../../../models/actividad.model';

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    NavbarComponent,
    SidebarComponent,
    FullcalendarWeek,
    SideMenu,
    LoadingOverlayComponent
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar implements OnInit {
  currentWeekText: string = '';
  weekActivities: Actividad[] = [];
  isLoading: boolean = true;
  
  // Side menu state
  isSideMenuOpen: boolean = false;
  selectedActivity: Actividad | null = null;
  selectedActivitySpaceName: string = '';

  constructor(
    private activitiesService: ActivitiesService, 
    private espacioService: EspacioService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  private updateBodyScroll(): void {
    if (this.isSideMenuOpen) {
      this.renderer.addClass(document.body, 'overflow-hidden');
    } else {
      this.renderer.removeClass(document.body, 'overflow-hidden');
    }
  }

  ngOnInit() {
    this.calculateCurrentWeek();
    this.loadWeekActivities();
  }

  private calculateCurrentWeek() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes como inicio de semana

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo como fin de semana

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    this.currentWeekText = `Semana del ${formatDate(startOfWeek)} al ${formatDate(endOfWeek)}`;
  }

  private loadWeekActivities() {
    this.isLoading = true;
    this.activitiesService.getCurrentWeekActivities().subscribe({
      next: (activities) => {
        this.weekActivities = activities;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando actividades:', error);
        this.isLoading = false;
      }
    });
  }

  // Manejar click en actividad del calendario
  onActivityClick(activityId: number) {
    const activity = this.weekActivities.find(a => a.id === activityId);
    if (activity) {
      this.selectedActivity = activity;
      
      // Deshabilitar scroll del body cuando se abre el sidebar
      
      
      // Buscar el nombre del espacio
      this.espacioService.getEspacioById(activity.espacioId).subscribe({
        next: (espacio) => {
          this.selectedActivitySpaceName = espacio ? espacio.nombre : 'Espacio no encontrado';
        },
        error: (error) => {
          console.error('Error cargando espacio:', error);
          this.selectedActivitySpaceName = 'Error al cargar espacio';
        }
      });
      
      this.isSideMenuOpen = true;
      this.updateBodyScroll();
    }
  }

  // Cerrar side menu
  closeSideMenu() {
    this.isSideMenuOpen = false;
    
    // Habilitar scroll del body cuando se cierra el sidebar
    
    
    setTimeout(() => {
      this.selectedActivity = null;
      this.selectedActivitySpaceName = '';
    }, 300); // Esperar animación de cierre
    this.updateBodyScroll();
  }

  // Formatear fecha para mostrar
  formatDate(date: Date): string {
    const dateObj = new Date(date);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    return `${days[dateObj.getDay()]}, ${dateObj.getDate()} de ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  }
}
