import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Chat } from '../../models/chat.model';
import { JwtService } from '../../services/jwt-service';

@Component({
  selector: 'app-card-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-chat.html',
  styleUrl: './card-chat.scss'
})
export class CardChatComponent {
  @Input() chat!: Chat;
  @Input() usmyaName?: string;
  @Input() usmyaAlias?: string;
  @Input() showEnterButton: boolean = true;

  @Output() chatSelected = new EventEmitter<Chat>();

  constructor(private router: Router, private jwtService: JwtService) {}

  /**
   * Obtiene la inicial del nombre del USMYA para el avatar
   */
  getInitial(): string {
    return this.usmyaName?.charAt(0)?.toUpperCase() || '?';
  }

  /**
   * Maneja el click en el botón "Entrar al chat"
   */
  onEnterChat(): void {
    // Obtener el rol del usuario para determinar la ruta correcta
    const userRole = this.jwtService.getRole();
    const basePath = userRole === 'efector' ? '/efector' : userRole === 'agente' ? '/agente' : '/referente';

    // Navegar a la página de mensajes del chat
    this.router.navigate([`${basePath}/chat-messages`, this.chat.id]);
  }

  /**
   * Obtiene el texto del tipo de chat
   */
  getChatTypeText(): string {
    return this.chat?.tipo === 'general' ? 'General' : 'Tratante';
  }

  /**
   * Obtiene las clases CSS para el badge del tipo de chat
   */
  getChatTypeBadgeClasses(): string {
    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';
    const typeClasses = this.chat?.tipo === 'general'
      ? 'bg-green-100 text-green-800'
      : 'bg-purple-100 text-purple-800';

    return `${baseClasses} ${typeClasses}`;
  }
}
