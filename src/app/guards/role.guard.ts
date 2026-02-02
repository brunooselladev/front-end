import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtService } from '../services/jwt-service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private jwtService: JwtService, private router: Router) {}

  canActivate(): boolean {
    const token = this.jwtService.getToken();
    const role = this.jwtService.getRole();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!role) {
      this.router.navigate(['/login']);
      return false;
    }

    // Redirigir según el rol
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/recursero/calendario-semanal']);
        break;
      case 'referente':
        this.router.navigate(['/referente/mis-acompañados']);
        break;
      case 'usmya':
        this.router.navigate(['/usmya/mi-perfil']);
        break;
      case 'agente':
        this.router.navigate(['/agente/asistencia']);
        break;
      case 'efector':
        this.router.navigate(['/efector/pacientes']);
        break;
      default:
        this.router.navigate(['/login']);
        return false;
    }

    return false; // Siempre redirige, nunca permite acceso directo a la ruta raíz
  }
}