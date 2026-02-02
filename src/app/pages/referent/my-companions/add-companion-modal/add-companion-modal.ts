import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../components/button/button.component';
import { Usuario } from '../../../../models/usuario.interface';
import { UsuarioService } from '../../../../services/usuario-service';
import { ReferenteUsmyaService } from '../../../../services/referente-usmya-service';
import { EfectorUsmyaService } from '../../../../services/efector-usmya-service';
import { IntegrantesChatService } from '../../../../services/integrantes-chat-service';
import { ChatService } from '../../../../services/chat-service';
import { LoadingOverlayComponent } from '../../../../components/loading-overlay/loading-overlay';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-companion-modal',
  imports: [CommonModule, FormsModule, MatDialogModule, ButtonComponent, LoadingOverlayComponent],
  templateUrl: './add-companion-modal.html',
  styleUrl: './add-companion-modal.scss'
})
export class AddCompanionModalComponent {
  searchTerm: string = '';
  availableUsmya: Usuario[] = [];
  selectedUsmya: Usuario | null = null;
  isLoading: boolean = false;

  // Modo del modal: 'companion', 'chat' o 'patient'
  mode: 'companion' | 'chat' | 'patient' = 'companion';

  // Propiedades computadas basadas en el modo
  get modalTitle(): string {
    switch (this.mode) {
      case 'chat':
        return 'Participar en nuevo chat';
      case 'patient':
        return 'Agregar nuevo paciente';
      default:
        return 'Agregar nuevo acompañado';
    }
  }

  get modalSubtitle(): string {
    switch (this.mode) {
      case 'chat':
        return 'Busca y selecciona el paciente con el que deseas iniciar o unirte a un chat';
      case 'patient':
        return 'Busca y selecciona un usuario para que sea un paciente suyo';
      default:
        return 'Busca y selecciona un USMYA para agregar como acompañado';
    }
  }

  get submitButtonText(): string {
    switch (this.mode) {
      case 'chat':
        return 'Unirme al chat';
      case 'patient':
        return 'Agregar paciente';
      default:
        return 'Acompañar';
    }
  }

  constructor(
    private usuarioService: UsuarioService,
    private referenteUsmyaService: ReferenteUsmyaService,
    private efectorUsmyaService: EfectorUsmyaService,
    private integrantesChatService: IntegrantesChatService,
    private chatService: ChatService,
    private router: Router,
    private dialogRef: MatDialogRef<AddCompanionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { referenteId?: number; mode?: 'companion' | 'chat' | 'patient'; agenteId?: number; efectorId?: number }
  ) {
    this.mode = data.mode || 'companion';
    this.loadAvailableUsmya();
  }

  loadAvailableUsmya(): void {
    this.isLoading = true;

    if (this.mode === 'patient' && this.data.efectorId) {
      // Para modo patient, buscar USMYA disponibles para el efector
      this.usuarioService.searchAvailableUsmyaForEfector(this.searchTerm, this.data.efectorId)
        .subscribe({
          next: (usmya: Usuario[]) => {
            this.availableUsmya = usmya;
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error al cargar USMYA disponibles para efector:', error);
            this.availableUsmya = [];
            this.isLoading = false;
          }
        });
    } else {
      // Para modos companion y chat, usar la lógica existente
      const referenteId = this.data.referenteId || 0;
      this.usuarioService.searchAvailableUsmya(this.searchTerm, referenteId)
        .subscribe({
          next: (usmya: Usuario[]) => {
            this.availableUsmya = usmya;
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error al cargar USMYA disponibles:', error);
            this.availableUsmya = [];
            this.isLoading = false;
          }
        });
    }
  }

  onSearchChange(): void {
    this.loadAvailableUsmya();
  }

  selectUsmya(usmya: Usuario): void {
    this.selectedUsmya = usmya;
  }

  isSelected(usmya: Usuario): boolean {
    return this.selectedUsmya?.id === usmya.id;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAddCompanion(): void {
    if (!this.selectedUsmya) return;

    if (this.mode === 'chat') {
      // Lógica para unirse a chat
      if (!this.data.agenteId) {
        console.error('ID de agente no proporcionado');
        return;
      }

      // Buscar el chat que corresponde al USMYA seleccionado
      this.chatService.getChatsByUsmyaId(this.selectedUsmya.id).subscribe({
        next: (chats: any[]) => {
          if (chats.length === 0) {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'No se encontró chat para este paciente',
              showConfirmButton: false,
              timer: 3000,
              toast: true
            });
            return;
          }

          // Tomar el primer chat (debería haber solo uno por USMYA)
          const chat = chats[0];

          // Crear el integrante en el chat
          this.integrantesChatService.createIntegrante({
            idChat: chat.id,
            idUser: this.data.agenteId!
          }).subscribe({
            next: (newIntegrante: any) => {
              // Mostrar SweetAlert de éxito
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Te has unido al chat correctamente',
                showConfirmButton: false,
                timer: 3000,
                toast: true
              });

              // Cerrar modal y devolver la información
              this.dialogRef.close({
                success: true,
                integrante: newIntegrante,
                chat: chat,
                usmya: this.selectedUsmya
              });
            },
            error: (error: any) => {
              console.error('Error al unirse al chat:', error);
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error al unirse al chat',
                showConfirmButton: false,
                timer: 3000,
                toast: true
              });
            }
          });
        },
        error: (error: any) => {
          console.error('Error al buscar chat:', error);
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error al buscar el chat',
            showConfirmButton: false,
            timer: 3000,
            toast: true
          });
        }
      });
    } else if (this.mode === 'patient') {
      // Lógica para agregar paciente a efector
      if (!this.data.efectorId) {
        console.error('ID de efector no proporcionado');
        return;
      }

      this.efectorUsmyaService.create({
        idUsmya: this.selectedUsmya.id,
        idEfector: this.data.efectorId
      }).subscribe({
        next: (newRelation: any) => {
          // Mostrar SweetAlert de éxito
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Paciente agregado correctamente',
            showConfirmButton: false,
            timer: 3000,
            toast: true
          });

          // Cerrar modal y devolver la relación creada
          this.dialogRef.close({
            success: true,
            relation: newRelation,
            usmya: this.selectedUsmya
          });
        },
        error: (error: any) => {
          console.error('Error al crear relación efector-usmya:', error);
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error al agregar paciente',
            showConfirmButton: false,
            timer: 3000,
            toast: true
          });
        }
      });
    } else {
      // Lógica original para agregar acompañado
      this.referenteUsmyaService.create({
        idUsmya: this.selectedUsmya.id,
        idReferente: this.data.referenteId!
      }).subscribe({
        next: (newRelation: any) => {
          // Mostrar SweetAlert de éxito
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Acompañado agregado correctamente',
            showConfirmButton: false,
            timer: 3000,
            toast: true
          });

          // Cerrar modal y devolver la relación creada
          this.dialogRef.close({
            success: true,
            relation: newRelation,
            usmya: this.selectedUsmya
          });
        },
        error: (error: any) => {
          console.error('Error al crear relación referente-usmya:', error);
          // TODO: Mostrar mensaje de error al usuario
        }
      });
    }
  }

  goToRegisterPatient(): void {
    // Cerrar el modal
    this.dialogRef.close();
    // Navegar a la página de registro de paciente
    this.router.navigate(['/efector/pacientes/nuevo-paciente']);
  }
}