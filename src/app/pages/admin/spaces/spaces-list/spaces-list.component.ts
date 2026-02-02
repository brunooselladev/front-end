import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { EspacioService } from '../../../../services/espacio-service';
import { Espacio } from '../../../../models/espacio.model';
import { ButtonComponent } from '../../../../components/button/button.component';
import { SideMenu } from '../../../../components/side-menu/side-menu';
import { ModalConfirmation } from '../../../../components/modal-confirmation/modal-confirmation';
import { SpaceFormComponent } from '../space-form/space-form.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../../../layouts/navbar/navbar.component';
import { SidebarComponent } from '../../../../layouts/sidebar/sidebar.component';
import { TableComponent } from '../../../../components/table/table.component';
import Swal from 'sweetalert2';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'email';
  placeholder?: string;
  options?: { value: any; label: string }[];
}

@Component({
  selector: 'app-spaces-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    SideMenu,
    ModalConfirmation,
    SpaceFormComponent,
    NavbarComponent,
    SidebarComponent,
    TableComponent
  ],
  templateUrl: './spaces-list.component.html',
  styleUrls: ['./spaces-list.component.scss']
})
export class SpacesListComponent implements OnInit {
  espacios: Espacio[] = [];
  espacioSeleccionado?: Espacio;
  isFormModalOpen = false;
  isDetailsModalOpen = false;
  showDeleteConfirmation = false;
  isLoading = false;

  // Propiedades para la tabla
  tableColumns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipoOrganizacionLabel', label: 'Tipo' },
    { key: 'telefono', label: 'Teléfono' }
  ];

  // Configuración de filtros
  showFilter = true;
  tableFilters: FilterConfig[] = [
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Buscar por nombre...'
    },
    {
      key: 'tipoOrganizacion',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: 'estatal', label: 'Estatal' },
        { value: 'comunitario', label: 'Comunitario' },
        { value: 'educacion', label: 'Educación' },
        { value: 'merendero', label: 'Merendero' },
        { value: 'comedor', label: 'Comedor' },
        { value: 'deportiva', label: 'Deportiva' },
        { value: 'religiosa', label: 'Religiosa' },
        { value: 'centro vecinal', label: 'Centro Vecinal' },
        { value: 'otros', label: 'Otros' }
      ]
    }
  ];

  constructor(private espacioService: EspacioService, private renderer: Renderer2) {}

  private updateBodyScroll(): void {
    if (this.isDetailsModalOpen || this.isFormModalOpen) {
      this.renderer.addClass(document.body, 'overflow-hidden');
    } else {
      this.renderer.removeClass(document.body, 'overflow-hidden');
    }
  }

  ngOnInit(): void {
    this.cargarEspacios();
  }

  cargarEspacios(): void {
    this.mostrarCargando();
    this.espacioService.getAllEspacios().subscribe({
      next: espacios => {
        // Ordenar espacios por ID descendente (más recientes primero)
        this.espacios = espacios.sort((a, b) => {
          const idA = a.id || 0;
          const idB = b.id || 0;
          return idB - idA; // Descendente: IDs más altos primero
        });
        this.ocultarCargando();
      },
      error: () => this.ocultarCargando()
    });
  }

  // Método para obtener los datos formateados para la tabla
  getTableData(): any[] {
    return this.espacios.map(espacio => ({
      id: espacio.id,
      nombre: espacio.nombre,
      tipoOrganizacion: espacio.tipoOrganizacion, // Usar el valor original para filtrado
      tipoOrganizacionLabel: this.getTipoOrganizacionLabel(espacio.tipoOrganizacion),
      telefono: espacio.telefono
    }));
  }

  getTipoOrganizacionLabel(tipo: string): string {
    const tiposMap: { [key: string]: string } = {
      'estatal': 'Estatal',
      'comunitario': 'Comunitario',
      'educacion': 'Educación',
      'merendero': 'Merendero',
      'comedor': 'Comedor',
      'deportiva': 'Deportiva',
      'religiosa': 'Religiosa',
      'centro vecinal': 'Centro Vecinal',
      'otros': 'Otros'
    };
    return tiposMap[tipo] || tipo;
  }

  getPoblacionLabel(poblacion: string): string {
    const poblacionMap: { [key: string]: string } = {
      'niños': 'Niños',
      'adolescentes': 'Adolescentes',
      'adultos': 'Adultos',
      'adultos_mayores': 'Adultos Mayores',
      'personas_con_discapacidad': 'Personas con Discapacidad',
      'migrantes': 'Migrantes',
      'otros': 'Otros'
    };
    return poblacionMap[poblacion] || poblacion;
  }

  abrirFormModal(id?: number): void {
    this.isDetailsModalOpen = false; // Cerrar detalles si está abierto
    this.showDeleteConfirmation = false; // Cerrar confirmación de eliminación si está abierta
    this.isFormModalOpen = true;
    if (id) {
      this.espacioSeleccionado = this.espacios.find(e => e.id === id);
    } else {
      this.espacioSeleccionado = undefined;
    }
    this.updateBodyScroll();
  }

  onCloseForm(): void {
    this.isFormModalOpen = false;
    this.espacioSeleccionado = undefined;
    this.updateBodyScroll();
  }

  abrirDeleteModal(espacio: Espacio): void {
    console.log('Abriendo modal para eliminar:', espacio);
    this.espacioSeleccionado = espacio;
    this.showDeleteConfirmation = true;
  }

  abrirDetailsModal(espacio: Espacio): void {
    this.espacioSeleccionado = espacio;
    this.isDetailsModalOpen = true;
    this.updateBodyScroll();
  }

  onCloseDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.espacioSeleccionado = undefined;
    this.updateBodyScroll();
  }

  onFormularioGuardado(): void {
    this.cargarEspacios();
    this.onCloseForm();
  }

  confirmarEliminacion(): void {
    console.log('Intentando eliminar espacio:', this.espacioSeleccionado);
    if (this.espacioSeleccionado?.id) {
      this.mostrarCargando();
      this.espacioService.deleteEspacio(this.espacioSeleccionado.id).subscribe({
        next: (result) => {
          console.log('Resultado de eliminación:', result);
          this.cargarEspacios();
          this.cancelarEliminacion();
          Swal.fire({
            position: 'top-end',
            title: 'Espacio eliminado correctamente',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
            toast: true
          });
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          this.ocultarCargando();
          this.cancelarEliminacion();
          Swal.fire({
            position: 'top-end',
            title: 'No se pudo eliminar el espacio',
            icon: 'error',
            showConfirmButton: false,
            timer: 3000,
            toast: true
          });
        }
      });
    } else {
      console.error('No hay ID de espacio para eliminar');
    }
  }

  cancelarEliminacion(): void {
    this.showDeleteConfirmation = false;
    this.espacioSeleccionado = undefined;
    this.updateBodyScroll();
  }

  private mostrarCargando(): void {
    this.isLoading = true;
  }

  private ocultarCargando(): void {
    this.isLoading = false;
  }

  // Métodos para la tabla
  onTableView(item: any): void {
    console.log('Ver detalles:', item);
    // Buscar el espacio completo usando el ID
    this.espacioSeleccionado = this.espacios.find(e => e.id === item.id);
    this.isFormModalOpen = false; // Cerrar formulario si está abierto
    this.isDetailsModalOpen = true;
    this.updateBodyScroll();
  }

  onTableEdit(item: any): void {
    console.log('Editar:', item);
    // Buscar el espacio completo usando el ID
    this.espacioSeleccionado = this.espacios.find(e => e.id === item.id);
    this.isDetailsModalOpen = false; // Cerrar detalles si está abierto
    this.isFormModalOpen = true;
    this.updateBodyScroll();
  }

  onTableDelete(item: any): void {
    console.log('Eliminar:', item);
    // Buscar el espacio completo usando el ID
    this.espacioSeleccionado = this.espacios.find(e => e.id === item.id);
    this.isFormModalOpen = false; // Cerrar formulario si está abierto
    this.isDetailsModalOpen = false; // Cerrar detalles si está abierto
    this.showDeleteConfirmation = true;
    this.updateBodyScroll();
  }
}