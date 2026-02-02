import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableComponent } from '../../../components/table/table.component';
import { EfectorUsmyaService } from '../../../services/efector-usmya-service';
import { Usmya } from '../../../models/usmya.model';
import { NavbarComponent } from '../../../layouts/navbar/navbar.component';
import { SidebarComponent } from '../../../layouts/sidebar/sidebar.component';
import { ButtonComponent } from "../../../components/button/button.component";
import { MatDialog } from '@angular/material/dialog';
import { AddCompanionModalComponent } from '../../referent/my-companions/add-companion-modal/add-companion-modal';

@Component({
  selector: 'app-my-patients',
  standalone: true,
  imports: [CommonModule, TableComponent, NavbarComponent, SidebarComponent, ButtonComponent],
  templateUrl: './my-patients.html',
  styleUrls: ['./my-patients.scss']
})
export class MyPatients implements OnInit {
  patients: Usmya[] = [];
  loading = true;

  // Configuración de columnas de la tabla
  columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'dni', label: 'DNI' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'fechaNacimiento', label: 'Fecha de Nacimiento' },
    { key: 'alias', label: 'Alias' }
  ];

  // Configuración de filtros
  filters = [
    { key: 'nombre', label: 'Nombre', type: 'text' as const, placeholder: 'Buscar por nombre...' },
    { key: 'alias', label: 'Alias', type: 'text' as const, placeholder: 'Buscar por alias...' },
    { key: 'dni', label: 'DNI', type: 'text' as const, placeholder: 'Buscar por DNI...' }
  ];

  // Configuración de acciones personalizadas
  customActions = [
    { key: 'ver-trayectoria', label: 'Ver Trayectoria', icon: 'assets/personal.png', color: 'text-blue-600' },
    { key: 'ver-ficha', label: 'Ver Ficha', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'text-green-600' }
  ];

  constructor(private efectorUsmyaService: EfectorUsmyaService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    // TODO: Obtener el ID del efector actual desde el servicio de autenticación/JWT
    // const efectorId = this.jwtService.getUserId(); // o similar
    const efectorId = 9; // Temporal: debería obtenerse del usuario logueado

    this.efectorUsmyaService.getUsmyaUsersByEfectorId(efectorId).subscribe({
      next: (patients) => {
        this.patients = patients;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
        this.loading = false;
      }
    });
  }

  onCustomAction(event: { action: string; item: Usmya }): void {
    switch (event.action) {
      case 'ver-trayectoria':
        this.viewTrajectory(event.item);
        break;
      case 'ver-ficha':
        this.viewPatientFile(event.item);
        break;
    }
  }

  private viewTrajectory(patient: Usmya): void {
    // Navegar a la página de trayectoria del paciente
    this.router.navigate(['/efector/pacientes/ver-trayectoria', patient.id]);
  }

  private viewPatientFile(patient: Usmya): void {
    // TODO: Implementar navegación a la ficha del paciente
    this.router.navigate(['/efector/pacientes/ver-ficha', patient.id]);
  }

  goToNewPatient(){
    this.router.navigate(['/efector/pacientes/nuevo-paciente']);
  }

  onAddPatient(): void {
    const efectorId = 9; // Temporal: debería obtenerse del usuario logueado

    const dialogRef = this.dialog.open(AddCompanionModalComponent, {
      width: '90vw',
      maxWidth: '600px',
      data: { efectorId: efectorId, mode: 'patient' },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        // Recargar los datos para mostrar el nuevo paciente
        this.loadPatients();
      }
    });
  }
}