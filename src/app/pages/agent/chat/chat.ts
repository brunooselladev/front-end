import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { NavbarComponent } from "../../../layouts/navbar";
import { SidebarComponent } from "../../../layouts/sidebar";
import { ChatService } from '../../../services/chat-service';
import { UsuarioService } from '../../../services/usuario-service';
import { JwtService } from '../../../services/jwt-service';
import { Chat as ChatModel } from '../../../models/chat.model';
import { Usuario } from '../../../models/usuario.interface';
import { LoadingOverlayComponent } from '../../../components/loading-overlay/loading-overlay';
import { CardChatComponent } from '../../../components/card-chat/card-chat';
import { IntegrantesChatService } from '../../../services/integrantes-chat-service';
import { ButtonComponent } from "../../../components/button/button.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCompanionModalComponent } from '../../referent/my-companions/add-companion-modal/add-companion-modal';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [NavbarComponent, SidebarComponent, CommonModule, LoadingOverlayComponent, CardChatComponent, ButtonComponent, MatDialogModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements OnInit {
  loading = true;
  chats: (ChatModel & { usmyaName?: string; usmyaAlias?: string })[] = [];
  currentUserRole: string = '';
  chatType: 'general' | 'tratante' = 'general';

  // Simulación de efector logueado (ID del efector actual)
  private currentEfectorId = 9; // Dr. Juan Perez - TODO: Obtener del servicio de autenticación
  simulatedUserId!: number;

  constructor(
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private integrantesChatService: IntegrantesChatService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Detectar el tipo de chat desde la URL
    const url = this.route.snapshot.url.join('/');
    if (url.includes('chat-tratante')) {
      this.chatType = 'tratante';
    } else {
      this.chatType = 'general';
    }
    
    this.loadChats();
  }

  private loadChats(): void {
    // Obtener el rol del usuario actual
    const userRole = this.jwtService.getRole();
    const userEmail = this.jwtService.getEmail();

    if (!userRole || !userEmail) {
      console.error('No se pudo obtener la información del usuario');
      this.loading = false;
      return;
    }

    // Guardar el rol para usar en el template
    this.currentUserRole = userRole;

    // Determinar el ID simulado según el rol
    

    if (userRole === 'efector') {
      this.simulatedUserId = 9; // Dr. Juan Perez
    } else if (userRole === 'referente') {
      this.simulatedUserId = 13; // Marcela Suarez (referente que participa en chats)
    } 
    else if (userRole === 'agente') {
      this.simulatedUserId = 5; // Agente (ID simulado)
    } else {
      console.error('Rol no soportado para chat:', userRole);
      this.loading = false;
      return;
    }

    console.log(`${userRole} logueado con ID simulado:`, this.simulatedUserId);

    // Obtener todos los chats donde participa este usuario
    this.integrantesChatService.getChatsByUserId(this.simulatedUserId).subscribe(integrantes => {
      console.log(`Chats donde participa el ${userRole}:`, integrantes.length);

      if (integrantes.length === 0) {
        console.log(`No se encontraron chats para este ${userRole}`);
        this.loading = false;
        return;
      }

      // Obtener la información completa de cada chat
      const chatRequests = integrantes.map(integrante =>
        this.chatService.getChatById(integrante.idChat)
      );

      // Ejecutar todas las peticiones en paralelo
      Promise.all(chatRequests.map(req => req.toPromise())).then(async chats => {
        // Filtrar chats válidos (no null)
        let validChats = chats.filter(chat => chat !== null) as ChatModel[];

        // Filtrar por tipo de chat según la URL
        validChats = validChats.filter(chat => chat.tipo === this.chatType);

        console.log(`Chats filtrados por tipo '${this.chatType}':`, validChats.length);

        // Cargar información de USMYA para cada chat
        const chatsWithUsmyaInfo = await Promise.all(
          validChats.map(async (chat) => {
            try {
              const usmya = await firstValueFrom(this.usuarioService.getUserById(chat.idUsmya));
              return {
                ...chat,
                usmyaName: usmya?.nombre || 'USMYA no encontrado',
                usmyaAlias: usmya?.alias || undefined
              };
            } catch (error) {
              console.error(`Error al obtener USMYA para chat ${chat.id}:`, error);
              return {
                ...chat,
                usmyaName: 'USMYA no encontrado',
                usmyaAlias: undefined
              };
            }
          })
        );

        this.chats = chatsWithUsmyaInfo;

        console.log('Chats cargados:', this.chats.length);
        this.chats.forEach(chat => {
          console.log(`Chat ${chat.id}: Tipo ${chat.tipo}, USMYA: ${chat.usmyaName}`);
        });

        this.loading = false;
      }).catch(error => {
        console.error('Error al cargar los chats:', error);
        this.loading = false;
      });
    });
  }

  // Método para manejar la selección de un chat
  onChatSelected(chat: ChatModel): void {
    console.log('Chat seleccionado:', chat);
    // TODO: Implementar navegación al chat específico
    // this.router.navigate(['/agent/chat', chat.id]);
  }

  // Método para crear un nuevo chat
  onNewChat(): void {
    const dialogRef = this.dialog.open(AddCompanionModalComponent, {
      width: '90vw',
      maxWidth: '600px',
      data: { referenteId: this.simulatedUserId, mode: 'chat', agenteId: this.simulatedUserId },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        // Recargar los chats para mostrar el nuevo chat
        this.loadChats();
      }
    });
  }
}
