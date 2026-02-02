import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../layouts/navbar";
import { SidebarComponent } from "../../../layouts/sidebar";
import { TableComponent, ActionConfig, FilterConfig } from "../../../components/table/table.component";
import { UsuarioService } from "../../../services/usuario-service";
import { Usuario } from "../../../models/usuario.interface";
import { ButtonComponent } from "../../../components/button/button.component";
import { Usmya } from '../../../models/usmya.model';
import { Router } from '@angular/router';
import { LoadingOverlayComponent } from '../../../components/loading-overlay/loading-overlay';
import { ReferenteUsmyaService } from '../../../services/referente-usmya-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCompanionModalComponent } from './add-companion-modal/add-companion-modal';

@Component({
  selector: 'app-my-companions',
  imports: [NavbarComponent, SidebarComponent, TableComponent, ButtonComponent, LoadingOverlayComponent, MatDialogModule],
  templateUrl: './my-companions.html',
  styleUrl: './my-companions.scss'
})
export class MyCompanions implements OnInit {

  // Datos de la tabla
  usmyaData: Usuario[] = [];
  isLoading = true;

  // Simulación de referente logueado (ID del referente actual)
  private currentReferenteId = 14; // TODO: Obtener del servicio de autenticación

  // Configuración de columnas
  columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'dni', label: 'DNI' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'fechaNacimiento', label: 'Fecha de Nacimiento' },
    { key: 'alias', label: 'Alias' }
  ];

  // Configuración de acciones personalizadas
  customActions: ActionConfig[] = [
    {
      key: 'view-trajectory',
      label: 'Ver trayectoria',
      icon: 'assets/personal.png',
      color: 'text-blue-600'
    },
    {
      key: 'view-profile',
      label: 'Ver ficha',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      color: 'text-green-600'
    }
  ];

  // Configuración de filtros
  filters: FilterConfig[] = [
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'text' as const,
      placeholder: 'Buscar por nombre...'
    },
    {
      key: 'alias',
      label: 'Alias',
      type: 'text' as const,
      placeholder: 'Buscar por alias...'
    },
    {
      key: 'dni',
      label: 'DNI',
      type: 'text' as const,
      placeholder: 'Buscar por DNI...'
    }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private referenteUsmyaService: ReferenteUsmyaService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsmyaData();
  }

  loadUsmyaData(): void {
    this.isLoading = true;

    // Obtener los USMYA asociados al referente actual desde el servicio referente-usmya
    this.referenteUsmyaService.getByIdReferente(this.currentReferenteId).subscribe({
      next: (referenteUsmyaRecords) => {
        // Extraer los IDs de USMYA (idUsmya) de los registros
        const usmyaIds = referenteUsmyaRecords.map(record => record.idUsmya);

        if (usmyaIds.length === 0) {
          // Si no hay USMYA asociados, mostrar lista vacía
          this.usmyaData = [];
          this.isLoading = false;
          return;
        }

        // Para cada ID de USMYA, buscar el usuario completo
        const usmyaPromises = usmyaIds.map(id =>
          this.usuarioService.getUserById(id).toPromise()
        );

        // Esperar a que se resuelvan todas las promesas
        Promise.all(usmyaPromises).then(usmyaUsers => {
          // Filtrar usuarios válidos y que sean de rol 'usmya'
          this.usmyaData = usmyaUsers
            .filter(user => user && user.role === 'usmya')
            .map(user => user!); // El ! es porque ya filtramos los null/undefined

          this.isLoading = false;
        }).catch(error => {
          console.error('Error al cargar datos de USMYA:', error);
          this.usmyaData = [];
          this.isLoading = false;
        });
      },
      error: (error) => {
        console.error('Error al cargar registros referente-usmya:', error);
        this.usmyaData = [];
        this.isLoading = false;
      }
    });
  }

  private viewTrajectory(patient: Usmya): void {
      // Navegar a la página de trayectoria del paciente
      this.router.navigate(['/referente/mis-acompañados/ver-trayectoria', patient.id]);
    }
  
    private viewPatientFile(patient: Usmya): void {
      // TODO: Implementar navegación a la ficha del paciente
      this.router.navigate(['/referente/mis-acompañados/ver-ficha', patient.id]);
    }

  onTableFilterChange(filters: any): void {
    console.log('Filtros aplicados:', filters);
    // Los filtros se manejan automáticamente por el componente TableComponent
  }

  onCustomAction(actionData: { action: string; item: Usmya }): void {
    const { action, item } = actionData;

    switch (action) {
      case 'view-trajectory':
        this.viewTrajectory(item);
        break;
      case 'view-profile':
        this.viewPatientFile(item);
        break;
      default:
        console.log('Acción no reconocida:', action);
    }
  }

  onAddCompanion(): void {
    const dialogRef = this.dialog.open(AddCompanionModalComponent, {
      width: '90vw',
      maxWidth: '600px',
      data: { referenteId: this.currentReferenteId, mode: 'companion' },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        // Recargar los datos para mostrar el nuevo acompañado
        this.loadUsmyaData();
      }
    });
  }
}
