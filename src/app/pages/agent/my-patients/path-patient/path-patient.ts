import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../../../layouts/sidebar/sidebar.component";
import { NavbarComponent } from "../../../../layouts/navbar/navbar.component";
import { TrayectoriaComponent } from "../../../../components/trayectoria/trayectoria.component";
import { BackButtonComponent } from "../../../../components/back-button/back-button.component";
import { UsuarioService } from '../../../../services/usuario-service';
import { Usmya } from '../../../../models/usmya.model';
import { Usuario } from '../../../../models/usuario.interface';

@Component({
  selector: 'app-path-patient',
  imports: [CommonModule, SidebarComponent, NavbarComponent, TrayectoriaComponent, BackButtonComponent],
  templateUrl: './path-patient.html',
  styleUrl: './path-patient.scss'
})
export class PathPatient implements OnInit {
  patient: Usmya | null = null;
  loading = true;
  patientId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPatient();
  }

  loadPatient(): void {
    this.loading = true;
    this.usuarioService.getUserById(this.patientId).subscribe({
      next: (user: Usuario | null) => {
        if (user && user.role === 'usmya') {
          // Convertir Usuario a Usmya
          this.patient = {
            id: user.id,
            nombre: user.nombre,
            dni: user.dni || 0,
            fechaNacimiento: user.fechaNacimiento || '',
            telefono: user.telefono || '',
            direccionResidencia: user.direccionResidencia || undefined,
            alias: user.alias || undefined,
            generoAutoPercibido: user.generoAutoPercibido || undefined,
            estadoCivil: user.estadoCivil || undefined,
            obraSocial: user.obraSocial || undefined,
            geolocalizacion: user.geolocalizacion || undefined,
          };
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar paciente:', error);
        this.loading = false;
      }
    });
  }
}
