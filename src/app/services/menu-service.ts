import { Injectable } from '@angular/core';
import { JwtService } from './jwt-service';
import { SidebarItem } from '../models/sidebar-item.model';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private jwtService: JwtService) {}

  getMenuItems(): SidebarItem[] {
    const role = this.jwtService.getRole();
    if (role === 'admin') {
      return [
        {
          label: 'Recursero',
          icon: 'assets/recursero.svg',
          url: '/recursero',
          subsections: [
            { label: 'Calendario semanal', icon: 'assets/recursero.svg', url: '/admin/recursero/calendario-semanal' },
            { label: 'Prestaciones', icon: 'assets/recursero.svg', url: '/admin/recursero/prestaciones' }
          ]
        },
        {
          label: 'Notificaciones',
          icon: 'assets/notificaciones.svg',
          url: '/admin',
          subsections: [
            { label: 'Usuarios', icon: 'assets/chat.svg', url: '/admin/notificaciones' },
            { label: 'Actvidades', icon: 'assets/chat.svg', url: '/admin/notificaciones-actividades' }
          ]
        },
        { label: 'Espacios', icon: 'assets/espacios.svg', url: '/admin/espacios' }
      ];
    } else if (role === 'efector') {
      return [
        // { label: 'Actividades', icon: 'assets/actividades.svg', url: '/efector/actividades' },
        // { label: 'Asistencias', icon: 'assets/asistencias.svg', url: '/efector/asistencia' },
        // { label: 'Registro Usmya', icon: 'assets/registro-paciente.svg', url: '/efector/registro-usmya' },
        { label: 'Mis pacientes', icon: 'assets/mis-acompanados.svg', url: '/efector/pacientes' },
        {
          label: 'Sala de chat',
          icon: 'assets/chat.svg',
          url: '/efector',
          subsections: [
            { label: 'Sala general', icon: 'assets/chat.svg', url: '/efector/chat-general' },
            { label: 'Sala e.tratante', icon: 'assets/chat.svg', url: '/efector/chat-tratante' }
          ]
        },
        { label: 'Mi institución', icon: 'assets/perfil-espacio.svg', url: '/efector/mi-institucion' },
        // { label: 'Sala de chat', icon: 'assets/chat.svg', url: '/efector/chat-general' },
      ];
    } else if (role === 'agente') {
      return [
        // { label: 'Actividades', icon: 'assets/actividades.svg', url: '/agente/actividades' },
        { label: 'Asistencias', icon: 'assets/asistencias.svg', url: '/agente/asistencia' },
        { label: 'Nuevo usuario', icon: 'assets/registro-paciente.svg', url: '/agente/registro-usmya' },
        { label: 'Sala de chat', icon: 'assets/chat.svg', url: '/agente/chat-general' },
        { label: 'Perfil espacio', icon: 'assets/perfil-espacio.svg', url: '/agente/mi-institucion' },
      ];
    } else if (role === 'referente') {
      return [
        { label: 'Mis acompañados', icon: 'assets/mis-acompanados.svg', url: '/referente/mis-acompañados' },
        { label: 'Sala de chat', icon: 'assets/chat.svg', url: '/referente/chat-general' }
      ];
    }else if (role === 'usmya') {
      return [
        { label: 'Mi Trayectoria', icon: 'assets/trayectoria.svg', url: '/usmya/mi-trayectoria' },
        { label: 'Mi perfil', icon: 'assets/mi-perfil.svg', url: '/usmya/mi-perfil' }
      ];
    }
     else {
      return [
        { label: 'Actividades', icon: 'assets/logout.svg', url: '/actividades' }
      ];
    }
  }
}