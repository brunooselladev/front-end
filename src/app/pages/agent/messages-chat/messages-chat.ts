import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SidebarComponent } from "../../../layouts/sidebar";
import { NavbarComponent } from "../../../layouts/navbar";
import { ChatComponent } from '../../../components/chat-component/chat-component';
import { LoadingOverlayComponent } from '../../../components/loading-overlay/loading-overlay';
import { Chat } from '../../../models/chat.model';
import { Usuario } from '../../../models/usuario.interface';
import { Mensaje } from '../../../models/mensaje.model';
import { ChatService } from '../../../services/chat-service';
import { UsuarioService } from '../../../services/usuario-service';
import { MensajeService } from '../../../services/mensaje-service';
import { IntegrantesChatService } from '../../../services/integrantes-chat-service';

@Component({
  selector: 'app-messages-chat',
  imports: [SidebarComponent, NavbarComponent, CommonModule, ChatComponent, LoadingOverlayComponent],
  templateUrl: './messages-chat.html',
  styleUrl: './messages-chat.scss'
})
export class MessagesChat implements OnInit {
  loading = true;
  chatId: number | null = null;
  chat: Chat | null = null;
  integrantes: Usuario[] = [];
  mensajes: Mensaje[] = [];

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private mensajeService: MensajeService,
    private integrantesChatService: IntegrantesChatService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.chatId = +params['id'];
      if (this.chatId) {
        this.loadChatData();
      } else {
        console.error('No se proporcionó un ID de chat válido');
        this.loading = false;
      }
    });
  }

  private loadChatData(): void {
    if (!this.chatId) return;

    this.loading = true;

    // Cargar información del chat
    this.chatService.getChatById(this.chatId).subscribe({
      next: (chat) => {
        this.chat = chat;
        console.log('Chat cargado:', chat);

        // Cargar integrantes del chat
        this.loadIntegrantes();

        // Cargar mensajes del chat
        this.loadMensajes();
      },
      error: (error) => {
        console.error('Error al cargar el chat:', error);
        this.loading = false;
      }
    });
  }

  private loadIntegrantes(): void {
    if (!this.chatId) return;

    this.integrantesChatService.getIntegrantesByChatId(this.chatId).subscribe({
      next: (integrantesChat) => {
        console.log('Integrantes del chat:', integrantesChat);

        // Obtener información completa de cada usuario
        const userRequests = integrantesChat.map(integrante =>
          this.usuarioService.getUserById(integrante.idUser)
        );

        // Cargar todos los usuarios en paralelo
        Promise.all(userRequests.map(req => req.toPromise())).then(users => {
          this.integrantes = users.filter(user => user !== undefined) as Usuario[];
          console.log('Usuarios cargados:', this.integrantes);
          this.checkLoadingComplete();
        }).catch(error => {
          console.error('Error al cargar usuarios:', error);
          this.checkLoadingComplete();
        });
      },
      error: (error) => {
        console.error('Error al cargar integrantes:', error);
        this.checkLoadingComplete();
      }
    });
  }

  private loadMensajes(): void {
    if (!this.chatId) return;

    this.mensajeService.getMensajesByChatId(this.chatId).subscribe({
      next: (mensajes) => {
        this.mensajes = mensajes;
        console.log('Mensajes cargados:', mensajes);
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error al cargar mensajes:', error);
        this.checkLoadingComplete();
      }
    });
  }

  private checkLoadingComplete(): void {
    // Verificar si tanto los integrantes como los mensajes están cargados
    if (this.integrantes.length > 0 && this.mensajes !== undefined && this.mensajes.length >= 0) {
      this.loading = false;
    }
  }
}
