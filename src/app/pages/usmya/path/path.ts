import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../layouts/sidebar";
import { NavbarComponent } from "../../../layouts/navbar";
import { TrayectoriaComponent } from "../../../components/trayectoria/trayectoria.component";
import { LoadingOverlayComponent } from "../../../components/loading-overlay/loading-overlay";
import { UsuarioService } from '../../../services/usuario-service';
import { JwtService } from '../../../services/jwt-service';
import { Usuario } from '../../../models/usuario.interface';

@Component({
  selector: 'app-path',
  imports: [SidebarComponent, NavbarComponent, TrayectoriaComponent, LoadingOverlayComponent],
  templateUrl: './path.html',
  styleUrl: './path.scss'
})
export class Path implements OnInit {
  loading = true;
  usmyaId: number | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.loadUsmyaId();
  }

  private loadUsmyaId(): void {
    const userEmail = this.jwtService.getEmail();
    const userRole = this.jwtService.getRole();

    if (userEmail && userRole === 'usmya') {
      // Usuario USMYA logueado - buscar su ID
      this.usuarioService.getAllUsers().subscribe(users => {
        const currentUser = users.find(user => user.email === userEmail && user.role === 'usmya');
        if (currentUser) {
          this.usmyaId = currentUser.id;
        } else {
          // Si no se encuentra, usar ID simulado
          this.setSimulatedUsmyaId();
        }
        this.loading = false;
      });
    } else {
      // No hay usuario USMYA logueado - usar ID simulado
      this.setSimulatedUsmyaId();
      this.loading = false;
    }
  }

  private setSimulatedUsmyaId(): void {
    // Usar un ID de USMYA existente de los mocks (ej: 17, 18, 19, etc.)
    this.usmyaId = 17; // Agustina Herrera
  }
}
