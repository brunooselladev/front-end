import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from "../../../layouts/sidebar";
import { NavbarComponent } from "../../../layouts/navbar";
import { InputComponent } from "../../../components/input/input.component";
import { ButtonComponent } from "../../../components/button/button.component";
import { Select } from "../../../components/select/select";
import { LoadingOverlayComponent } from "../../../components/loading-overlay/loading-overlay";
import { TableComponent, FilterConfig } from "../../../components/table/table.component";
import { SideMenu } from "../../../components/side-menu/side-menu";
import { ModalConfirmation } from "../../../components/modal-confirmation/modal-confirmation";

import { Espacio } from '../../../models/espacio.model';
import { Actividad } from '../../../models/actividad.model';
import { JwtService } from '../../../services/jwt-service';
import { EspacioService } from '../../../services/espacio-service';
import { ActivitiesService } from '../../../services/activities-service';
import { ActivityFormComponent } from "../activities/activity-form/activity-form";
import { ActivityDetailsComponent } from "../activities/activity-details/activity-details";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-space',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarComponent,
    NavbarComponent,
    InputComponent,
    ButtonComponent,
    Select,
    LoadingOverlayComponent,
    TableComponent,
    SideMenu,
    ModalConfirmation,
    ActivityFormComponent,
    ActivityDetailsComponent
  ],
  templateUrl: './profile-space.html',
  styleUrl: './profile-space.scss'
})
export class ProfileSpace implements OnInit {
  espacioForm: FormGroup;
  isLoading = false;
  isLoadingData = true;
  espacioData: Espacio | null = null;
  userRole: string | null = null;
  isFormLocked = true; // Por defecto, el formulario está bloqueado

  // Opciones para los selects
  tipoOrganizacionOpciones = [
    { value: 'estatal', label: 'Estatal' },
    { value: 'comunitario', label: 'Comunitario' },
    { value: 'educacion', label: 'Educación' },
    { value: 'merendero', label: 'Merendero' },
    { value: 'comedor', label: 'Comedor' },
    { value: 'deportiva', label: 'Deportiva' },
    { value: 'religiosa', label: 'Religiosa' },
    { value: 'centro vecinal', label: 'Centro Vecinal' },
    { value: 'otros', label: 'Otros' }
  ];

  poblacionOpciones = [
    { value: 'niños', label: 'Niños' },
    { value: 'adolescentes', label: 'Adolescentes' },
    { value: 'jovenes', label: 'Jóvenes' },
    { value: 'adultos', label: 'Adultos' },
    { value: 'mayores', label: 'Mayores' },
    { value: 'familias', label: 'Familias' },
    { value: 'otros', label: 'Otros' }
  ];

  // Propiedades para actividades
  actividades: Actividad[] = [];
  isLoadingActivities = false;
  isFormOpen = false;
  activityToEdit: Actividad | null = null;
  showDeleteModal = false;
  activityToDelete: Actividad | null = null;
  showDetailsModal = false;
  activityToView: Actividad | null = null;

  // Configuración de columnas para la tabla de actividades
  columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'dia', label: 'Día' },
    { key: 'horario', label: 'Horario' },
    { key: 'responsable', label: 'Responsable' },
    { key: 'lugar', label: 'Lugar' },
    { key: 'esFija', label: 'Es Fija' }
  ];

  // Configuración de filtros para actividades
  filters: FilterConfig[] = [
    {
      key: 'dia',
      label: 'Día',
      type: 'date',
      placeholder: 'Seleccionar fecha'
    },
    {
      key: 'esFija',
      label: 'Tipo',
      type: 'select',
      placeholder: 'Seleccionar tipo',
      options: [
        { value: true, label: 'Fija' },
        { value: false, label: 'Eventual' }
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    private jwtService: JwtService,
    private espacioService: EspacioService,
    private activitiesService: ActivitiesService,
    private renderer: Renderer2
  ) {
    this.espacioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required]],
      tipoOrganizacion: ['', [Validators.required]],
      direccion: [''],
      barrio: [''],
      encargado: [''],
      poblacionVinculada: this.fb.array([]),
      diasHorarios: [''],
      actividadesPrincipales: ['', [Validators.required, Validators.minLength(10)]],
      actividadesSecundarias: ['']
    });
  }

  ngOnInit() {
    this.userRole = this.jwtService.getRole();
    this.loadEspacioData();
    this.loadActivities();
  }

  // Getters para títulos de modales
  get sideMenuTitle(): string {
    return this.activityToEdit ? 'Editar Actividad' : 'Nueva Actividad';
  }

  get detailsModalTitle(): string {
    return this.activityToView ? `Detalles: ${this.activityToView.nombre}` : 'Detalles de Actividad';
  }

  get deleteModalMessage(): string {
    return this.activityToDelete
      ? `¿Estás seguro de que deseas eliminar la actividad "${this.activityToDelete.nombre}"? Esta acción no se puede deshacer.`
      : '¿Estás seguro de que deseas eliminar esta actividad?';
  }

  // Getters para títulos condicionales según el rol
  get pageTitle(): string {
    return this.userRole?.toLowerCase() === 'agente' ? 'Perfil Espacio' : 'Mi Institución';
  }

  get formTitle(): string {
    return this.userRole?.toLowerCase() === 'agente' ? 'Información del Espacio' : 'Información de la Institución';
  }

  get showActivitiesSection(): boolean {
    return this.userRole?.toLowerCase() === 'agente';
  }

  // Getters para datos de tabla
  get tableData() {
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

  // Métodos para actividades
  private loadActivities() {
    const espacioId = this.jwtService.getIdEspacio();
    if (!espacioId) return;

    this.isLoadingActivities = true;
    this.activitiesService.getActivitiesByEspacioId(espacioId).subscribe({
      next: (actividades) => {
        this.actividades = actividades;
        this.isLoadingActivities = false;
      },
      error: (error) => {
        console.error('Error al cargar actividades:', error);
        this.isLoadingActivities = false;
      }
    });
  }

  // Métodos para el formulario de actividades
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
    this.loadActivities();
  }

  onActivityUpdated(actividad: Actividad): void {
    this.loadActivities();
  }

  // Métodos para detalles de actividades
  cerrarDetailsModal(): void {
    this.showDetailsModal = false;
    this.activityToView = null;
    this.updateBodyScroll();
  }

  onEditFromDetails(activity: Actividad): void {
    this.cerrarDetailsModal();
    this.abrirFormModal(activity);
  }

  // Métodos para eliminación de actividades
  confirmarEliminacion(): void {
    if (this.activityToDelete?.id) {
      this.isLoadingActivities = true;
      this.activitiesService.deleteActivity(this.activityToDelete.id).subscribe({
        next: (success) => {
          if (success) {
            this.loadActivities();
            this.cancelarEliminacion();
          } else {
            console.error('Error al eliminar la actividad');
            this.isLoadingActivities = false;
            this.cancelarEliminacion();
          }
        },
        error: (error) => {
          console.error('Error al eliminar actividad:', error);
          this.isLoadingActivities = false;
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

  // Manejadores de eventos de la tabla
  onViewActivity(tableItem: any): void {
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
    const actividadCompleta = this.actividades.find(a => a.id === tableItem.id);
    if (actividadCompleta) {
      this.abrirFormModal(actividadCompleta);
    } else {
      console.error('No se encontró la actividad con ID:', tableItem.id);
    }
  }

  onDeleteActivity(tableItem: any): void {
    const actividadCompleta = this.actividades.find(a => a.id === tableItem.id);
    if (actividadCompleta) {
      this.activityToDelete = actividadCompleta;
      this.showDeleteModal = true;
      this.updateBodyScroll();
    } else {
      console.error('No se encontró la actividad con ID:', tableItem.id);
    }
  }

  // Métodos de utilidad
  private updateBodyScroll(): void {
    const hasModalOpen = this.isFormOpen || this.showDetailsModal || this.showDeleteModal;
    if (hasModalOpen) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  onFilterChange(filters: { [key: string]: any } | string): void {
    console.log('Filtros aplicados:', filters);
  }

  onPageChange(page: number): void {
    console.log('Página cambiada a:', page);
  }

  // Formateadores
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

  private loadEspacioData() {
    const espacioId = this.jwtService.getIdEspacio();

    if (!espacioId) {
      console.error('No se encontró idEspacio en el token');
      this.isLoadingData = false;
      return;
    }

    this.espacioService.getEspacioById(espacioId).subscribe({
      next: (espacio) => {
        if (espacio) {
          this.espacioData = espacio;
          this.populateForm(espacio);
        } else {
          console.error('Espacio no encontrado');
        }
        this.isLoadingData = false;
      },
      error: (error) => {
        console.error('Error al cargar datos del espacio:', error);
        this.isLoadingData = false;
      }
    });
  }

  private populateForm(espacio: Espacio) {
    this.espacioForm.patchValue({
      nombre: espacio.nombre,
      telefono: espacio.telefono,
      tipoOrganizacion: espacio.tipoOrganizacion,
      direccion: espacio.direccion,
      barrio: espacio.barrio,
      encargado: espacio.encargado,
      diasHorarios: espacio.diasHorarios,
      actividadesPrincipales: espacio.actividadesPrincipales,
      actividadesSecundarias: espacio.actividadesSecundarias
    });

    // Limpiar el FormArray actual
    while (this.poblacionVinculada.length !== 0) {
      this.poblacionVinculada.removeAt(0);
    }

    // Agregar la población vinculada
    if (espacio.poblacionVinculada && espacio.poblacionVinculada.length > 0) {
      espacio.poblacionVinculada.forEach(poblacion => {
        this.poblacionVinculada.push(new FormControl(poblacion));
      });
    }
  }

  // Getters para acceso fácil a los controles
  get nombre() { return this.espacioForm.get('nombre') as FormControl; }
  get telefono() { return this.espacioForm.get('telefono') as FormControl; }
  get tipoOrganizacion() { return this.espacioForm.get('tipoOrganizacion') as FormControl; }
  get direccion() { return this.espacioForm.get('direccion') as FormControl; }
  get barrio() { return this.espacioForm.get('barrio') as FormControl; }
  get encargado() { return this.espacioForm.get('encargado') as FormControl; }
  get poblacionVinculada() { return this.espacioForm.get('poblacionVinculada') as FormArray; }
  get diasHorarios() { return this.espacioForm.get('diasHorarios') as FormControl; }
  get actividadesPrincipales() { return this.espacioForm.get('actividadesPrincipales') as FormControl; }
  get actividadesSecundarias() { return this.espacioForm.get('actividadesSecundarias') as FormControl; }

  // Método para manejar la selección de población vinculada
  onPoblacionChange(event: any, poblacion: string) {
    const formArray = this.poblacionVinculada;
    if (event.target.checked) {
      formArray.push(new FormControl(poblacion));
    } else {
      const index = formArray.controls.findIndex(x => x.value === poblacion);
      if (index >= 0) {
        formArray.removeAt(index);
      }
    }
  }

  // Verificar si una población está seleccionada
  isPoblacionSelected(poblacion: string): boolean {
    return this.poblacionVinculada.value.includes(poblacion);
  }

  // Método para alternar el estado del candado (bloquear/desbloquear formulario)
  toggleFormLock(): void {
    this.isFormLocked = !this.isFormLocked;
  }

  // Método para guardar los cambios
  onSave() {
    if (this.espacioForm.valid && !this.isLoading) {
      this.isLoading = true;

      // Simular guardado
      setTimeout(() => {
        console.log('Datos guardados:', this.espacioForm.value);
        this.isLoading = false;
        // Aquí iría la lógica real de guardado
      }, 2000);
      Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Datos guardados correctamente',
                  showConfirmButton: false,
                  timer: 3000,
                  toast: true
                });
    } else {
      this.espacioForm.markAllAsTouched();
    }
  }

  // Método para cancelar
  onCancel() {
    if (this.espacioData) {
      this.populateForm(this.espacioData);
    } else {
      this.espacioForm.reset();
      // Limpiar el FormArray
      while (this.poblacionVinculada.length !== 0) {
        this.poblacionVinculada.removeAt(0);
      }
    }
  }

  // Método para obtener la etiqueta de una población
  getPoblacionLabel(value: string): string {
    const opcion = this.poblacionOpciones.find(opt => opt.value === value);
    return opcion ? opcion.label : value;
  }
}
