import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Chat } from '../../models/chat.model';
import { Usuario } from '../../models/usuario.interface';
import { Mensaje } from '../../models/mensaje.model';
import { MensajeService } from '../../services/mensaje-service';
import { UsuarioService } from '../../services/usuario-service';
import { BackButtonComponent } from '../back-button/back-button.component';

interface MensajeConUsuario extends Mensaje {
  emisorUsuario?: Usuario;
  esMio: boolean;
}

interface MensajesPorDia {
  fecha: string;
  mensajes: MensajeConUsuario[];
}

@Component({
  selector: 'app-chat-component',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  templateUrl: './chat-component.html',
  styleUrl: './chat-component.scss'
})
export class ChatComponent implements OnInit, OnChanges {
  @Input() chat!: Chat;
  @Input() integrantes: Usuario[] = [];
  @Input() mensajes: Mensaje[] = [];
  @Input() currentUserId: number = 9; // Simulado - ID del efector logueado

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  mensajesPorDia: MensajesPorDia[] = [];
  nuevoMensaje: string = '';
  loading = false;
  nombrePaciente: string = '';

  constructor(
    private mensajeService: MensajeService,
    private usuarioService: UsuarioService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadPacienteInfo();
    await this.procesarMensajes();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['chat'] && changes['chat'].currentValue) {
      await this.loadPacienteInfo();
    }
    if (changes['mensajes'] && changes['mensajes'].currentValue) {
      await this.procesarMensajes();
    }
  }

  private async procesarMensajes(): Promise<void> {
    if (!this.mensajes.length) {
      this.mensajesPorDia = [];
      return;
    }

    // Obtener IDs únicos de emisores que no están en integrantes
    const emisoresIds = [...new Set(this.mensajes.map(m => m.idEmisor))];
    const emisoresFaltantes = emisoresIds.filter(id => !this.integrantes.find(u => u.id === id));

    // Cargar usuarios faltantes
    const usuariosFaltantes: Usuario[] = [];
    if (emisoresFaltantes.length > 0) {
      const userRequests = emisoresFaltantes.map(id => this.usuarioService.getUserById(id));
      const loadedUsers = await Promise.all(userRequests.map(req => firstValueFrom(req)));
      usuariosFaltantes.push(...loadedUsers.filter(user => user !== null) as Usuario[]);
    }

    // Combinar integrantes conocidos con usuarios cargados
    const todosLosUsuarios = [...this.integrantes, ...usuariosFaltantes];

    // Procesar mensajes con información de usuario
    const mensajesConUsuario: MensajeConUsuario[] = this.mensajes.map(mensaje => ({
      ...mensaje,
      emisorUsuario: todosLosUsuarios.find(u => u.id === mensaje.idEmisor),
      esMio: mensaje.idEmisor === this.currentUserId
    }));

    // Agrupar por fecha
    const gruposPorFecha = new Map<string, MensajeConUsuario[]>();

    mensajesConUsuario.forEach(mensaje => {
      const fecha = this.formatearFecha(mensaje.fecha);
      if (!gruposPorFecha.has(fecha)) {
        gruposPorFecha.set(fecha, []);
      }
      gruposPorFecha.get(fecha)!.push(mensaje);
    });

    // Convertir a array y ordenar por fecha
    this.mensajesPorDia = Array.from(gruposPorFecha.entries())
      .map(([fecha, mensajes]) => ({
        fecha,
        mensajes: mensajes.sort((a, b) =>
          new Date(a.fecha + ' ' + a.hora).getTime() - new Date(b.fecha + ' ' + b.hora).getTime()
        )
      }))
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    // Scroll al final después de procesar
    setTimeout(() => this.scrollToBottom(), 100);
  }

  private formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    if (date.toDateString() === hoy.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === ayer.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  formatearHora(hora: string): string {
    return hora;
  }

  enviarMensaje(): void {
    if (!this.nuevoMensaje.trim() || !this.chat?.id) return;

    this.loading = true;
    const now = new Date();
    const mensajeData = {
      descripcion: this.nuevoMensaje.trim(),
      idEmisor: this.currentUserId,
      idChat: this.chat.id,
      fecha: now.toISOString().split('T')[0], // YYYY-MM-DD
      hora: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) // HH:MM
    };

    this.mensajeService.createMensaje(mensajeData).subscribe({
      next: (mensaje) => {
        // Agregar el mensaje a la lista local
        const mensajeConUsuario: MensajeConUsuario = {
          ...mensaje,
          emisorUsuario: this.integrantes.find(u => u.id === mensaje.idEmisor),
          esMio: true
        };

        // Agregar al grupo de hoy
        const hoy = 'Hoy';
        let grupoHoy = this.mensajesPorDia.find(g => g.fecha === hoy);

        if (!grupoHoy) {
          grupoHoy = { fecha: hoy, mensajes: [] };
          this.mensajesPorDia.push(grupoHoy);
        }

        grupoHoy.mensajes.push(mensajeConUsuario);

        this.nuevoMensaje = '';
        this.loading = false;

        // Scroll al final
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        this.loading = false;
      }
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarMensaje();
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    }
  }

  getChatTypeText(): string {
    return this.chat.tipo === 'general' ? 'General' : 'Tratante';
  }

  private async loadPacienteInfo(): Promise<void> {
    if (this.chat?.idUsmya) {
      try {
        const paciente = await firstValueFrom(this.usuarioService.getUserById(this.chat.idUsmya));
        this.nombrePaciente = paciente?.nombre || 'Paciente desconocido';
      } catch (error) {
        console.error('Error al cargar información del paciente:', error);
        this.nombrePaciente = 'Paciente desconocido';
      }
    }
  }

  getIntegrantesText(): string {
    if (this.integrantes.length === 0) return 'Sin participantes';
    if (this.integrantes.length === 1) return '1 participante';
    return `${this.integrantes.length} participantes`;
  }

  getUserRoleText(role: string): string {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrador',
      'efector': 'Efector de salud',
      'agente': 'Agente comunitario',
      'referente': 'Referente afectivo',
      'usmya': 'USMYA'
    };
    return roleMap[role] || role;
  }

  getParticipantesNombres(): string {
    if (this.integrantes.length === 0) return 'Sin participantes';

    const nombres = this.integrantes.map(i => i.nombre);
    const textoCompleto = nombres.join(', ');

    // Si el texto es muy largo (más de 50 caracteres), truncar y agregar puntos suspensivos
    if (textoCompleto.length > 50) {
      return textoCompleto.substring(0, 47) + '...';
    }

    return textoCompleto;
  }

  trackByIntegranteId(index: number, integrante: Usuario): number {
    return integrante.id;
  }

  trackByFecha(index: number, dia: MensajesPorDia): string {
    return dia.fecha;
  }

  trackByMensajeId(index: number, mensaje: MensajeConUsuario): number {
    return mensaje.id || index;
  }
}
