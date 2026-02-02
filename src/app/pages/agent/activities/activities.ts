import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesService } from '../../../services/activities-service';
import { JwtService } from '../../../services/jwt-service';

import { NavbarComponent } from "../../../layouts/navbar";
import { SidebarComponent } from "../../../layouts/sidebar";
import { ButtonComponent } from "../../../components/button/button.component";
import { TableComponent, FilterConfig } from "../../../components/table/table.component";
import { SideMenu } from "../../../components/side-menu/side-menu";
import { ActivityFormComponent } from "./activity-form/activity-form";
import { ActivityDetailsComponent } from "./activity-details/activity-details";
import { ModalConfirmation } from "../../../components/modal-confirmation/modal-confirmation";
import { LoadingOverlayComponent } from '../../../components/loading-overlay/loading-overlay';
import { Actividad } from '../../../models/actividad.model';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, ButtonComponent, TableComponent, SideMenu, ActivityFormComponent, ActivityDetailsComponent, ModalConfirmation, LoadingOverlayComponent],
  templateUrl: './activities.html',
  styleUrls: ['./activities.scss']
})
export class Activities implements OnInit {
  actividades: Actividad[] = [];
  isLoading = false;
  isFormOpen = false;
  activityToEdit: Actividad | null = null;
  showDeleteModal = false;
  activityToDelete: Actividad | null = null;
  showDetailsModal = false;
  activityToView: Actividad | null = null;

  // Configuración de columnas para la tabla
  columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'dia', label: 'Día' },
    { key: 'horario', label: 'Horario' },
    { key: 'responsable', label: 'Responsable' },
    { key: 'lugar', label: 'Lugar' },
    { key: 'esFija', label: 'Es Fija' }
  ];

  // Configuración de filtros
  filters: FilterConfig[] = [
    {
      key: 'dia',
      label: 'Día',
      type: 'date',
      placeholder: 'Seleccionar fecha'
    },
    {
      key: 'responsable',
      label: 'Responsable',
      type: 'text',
      placeholder: 'Buscar por responsable'
    },
    {
      key: 'esFija',
      label: 'Es Fija',
      type: 'select',
      placeholder: 'Seleccionar',
      options: [
        { value: true, label: 'Sí' },
        { value: false, label: 'No' }
      ]
    }
  ];

  constructor(private activitiesService: ActivitiesService, private jwtService: JwtService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.cargarActividades();
  }

  private updateBodyScroll(): void {
    if (this.isFormOpen || this.showDeleteModal || this.showDetailsModal) {
      this.renderer.addClass(document.body, 'overflow-hidden');
    } else {
      this.renderer.removeClass(document.body, 'overflow-hidden');
    }
  }

  cargarActividades(): void {
    this.mostrarCargando();
    
    // Obtener el idEspacio del agente logueado
    const agentEspacioId = this.jwtService.getIdEspacio();
    
    if (!agentEspacioId) {
      console.error('Agente no tiene idEspacio asignado');
      this.ocultarCargando();
      return;
    }

    // Simular llamada al backend - cambiar solo el interior del método
    this.activitiesService.getActivitiesByEspacioId(agentEspacioId).subscribe({
      next: actividades => {
        this.actividades = actividades;
        this.ocultarCargando();
      },
      error: () => this.ocultarCargando()
    });
  }

  private mostrarCargando(): void {
    this.isLoading = true;
  }

  private ocultarCargando(): void {
    this.isLoading = false;
  }

  abrirFormModal(activity?: Actividad): void {
    this.activityToEdit = activity || null;
    this.isFormOpen = true;
    this.updateBodyScroll();
  }

  cerrarFormModal(): void {
    this.isFormOpen = false;
    this.activityToEdit = null;
    this.updateBodyScroll();
  }

  onActivityCreated(actividad: Actividad): void {
    // Recargar la lista de actividades
    this.cargarActividades();
  }

  onActivityUpdated(actividad: Actividad): void {
    // Recargar la lista de actividades
    this.cargarActividades();
  }

  // Getter para el título dinámico del side menu
  get sideMenuTitle(): string {
    return this.activityToEdit ? 'Editar Actividad' : 'Nueva Actividad';
  }

  // Getter para el mensaje del modal de eliminación
  get deleteModalMessage(): string {
    return this.activityToDelete
      ? `¿Estás seguro de que quieres eliminar la actividad "${this.activityToDelete.nombre}"? Esta acción no se puede deshacer.`
      : '¿Estás seguro de que quieres eliminar esta actividad?';
  }

  // Getter para el título del modal de detalles
  get detailsModalTitle(): string {
    return 'Detalles de Actividad';
  }

  // Métodos para manejar la vista de detalles
  cerrarDetailsModal(): void {
    this.showDetailsModal = false;
    this.activityToView = null;
    this.updateBodyScroll();
  }

  onEditFromDetails(activity: Actividad): void {
    // Cerrar detalles y abrir formulario de edición
    this.cerrarDetailsModal();
    this.abrirFormModal(activity);
  }

  // Getter para datos transformados para la tabla
  get tableData(): any[] {
    return this.actividades.map((actividad: Actividad) => ({
      id: actividad.id,
      nombre: actividad.nombre,
      dia: this.formatDate(actividad.dia),
      horario: this.formatHorario(actividad.hora, actividad.horaFin),
      responsable: actividad.responsable,
      lugar: actividad.lugar,
      esFija: actividad.esFija ? 'Sí' : 'No'
    }));
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  private formatHorario(horaInicio: string, horaFin?: string): string {
    if (horaFin) {
      return `${horaInicio} - ${horaFin}`;
    }
    return horaInicio;
  }

  // Manejadores de eventos de la tabla
  onViewActivity(tableItem: any): void {
    // Buscar la actividad completa usando el ID
    const actividadCompleta = this.actividades.find(a => a.id === tableItem.id);
    if (actividadCompleta) {
      this.activityToView = actividadCompleta;
      this.showDetailsModal = true;
      this.updateBodyScroll();
    } else {
      console.error('No se encontró la actividad con ID:', tableItem.id);
    }
  }

  onEditActivity(tableItem: any): void {
    // Buscar la actividad completa usando el ID
    const actividadCompleta = this.actividades.find(a => a.id === tableItem.id);
    if (actividadCompleta) {
      this.abrirFormModal(actividadCompleta);
    } else {
      console.error('No se encontró la actividad con ID:', tableItem.id);
    }
  }

  onDeleteActivity(tableItem: any): void {
    // Buscar la actividad completa usando el ID
    const actividadCompleta = this.actividades.find(a => a.id === tableItem.id);
    if (actividadCompleta) {
      this.activityToDelete = actividadCompleta;
      this.showDeleteModal = true;
      this.updateBodyScroll();
    } else {
      console.error('No se encontró la actividad con ID:', tableItem.id);
    }
  }

  confirmarEliminacion(): void {
    if (this.activityToDelete?.id) {
      this.mostrarCargando();
      this.activitiesService.deleteActivity(this.activityToDelete.id).subscribe({
        next: (success) => {
          if (success) {
            this.cargarActividades();
            this.cancelarEliminacion();
          } else {
            console.error('Error al eliminar la actividad');
            this.ocultarCargando();
            this.cancelarEliminacion();
          }
        },
        error: (error) => {
          console.error('Error al eliminar actividad:', error);
          this.ocultarCargando();
          this.cancelarEliminacion();
        }
      });
    }
  }

  cancelarEliminacion(): void {
    this.showDeleteModal = false;
    this.activityToDelete = null;
    this.updateBodyScroll();
  }

  onFilterChange(filters: { [key: string]: any } | string): void {
    console.log('Filtros aplicados:', filters);
  }

  onPageChange(page: number): void {
    console.log('Página cambiada a:', page);
  }
}
