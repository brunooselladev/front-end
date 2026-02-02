import { Component } from '@angular/core';
import { UsuarioService } from '../../../services/usuario-service';
import { EspacioService } from '../../../services/espacio-service';
import { Observable, combineLatest, map, BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario.interface';
import { NavbarComponent } from '../../../layouts/navbar/navbar.component';
import { SidebarComponent } from '../../../layouts/sidebar/sidebar.component';
import { CardNotifications } from '../../../components/card-notifications/card-notifications';
import { NotificationTabsComponent } from '../../../components/notification-tabs/notification-tabs.component';
import { SideMenu } from '../../../components/side-menu/side-menu';
import { ModalConfirmation } from '../../../components/modal-confirmation/modal-confirmation';
import { LoadingOverlayComponent } from '../../../components/loading-overlay/loading-overlay';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notifications',
  imports: [
    CommonModule,
    NavbarComponent,
    SidebarComponent,
    CardNotifications,
    NotificationTabsComponent,
    SideMenu,
    ModalConfirmation,
    LoadingOverlayComponent
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss'
})
export class Notifications {
  sideMenuOpen = false;
  selectedUser: Usuario | null = null; // Usuario seleccionado para mostrar detalles
  selectedUserUsmya: Usuario | null = null; // USMYA asociado al usuario seleccionado
  selectedUserCreador: Usuario | null = null; // Creador del USMYA seleccionado
  pendingUsers$!: Observable<Usuario[]>;
  filteredUsers$!: Observable<Usuario[]>;
  tabCounts$!: Observable<{ [key: string]: number }>;
  isLoading$ = new BehaviorSubject<boolean>(true);
  selectedRole$ = new BehaviorSubject<string>('agente');
  referentesWithUsmya: Set<number> = new Set(); // IDs de referentes que tienen USMYA
  usmyasWithCreador: Set<number> = new Set(); // IDs de USMYAs que tienen creador

  // Map para almacenar nombres de espacios por ID
  private espacioNames: Map<number, string> = new Map();

  // Modal properties
  showModal = false;
  modalMessage = '';
  modalType: 'positive' | 'danger' = 'positive';
  pendingAction: { type: 'accept' | 'reject'; userId: number } | null = null;

  constructor(private usuarioService: UsuarioService, private espacioService: EspacioService) {
    this.initializeObservables();
  }

  private initializeObservables(): void {
    this.isLoading$.next(true);
    this.pendingUsers$ = this.usuarioService.getUsersPendingApproval();
    
    // Cargar todos los espacios para crear el mapa de nombres
    this.loadEspacioNames();
    
    // Cargar referentes que tienen USMYA asociado
    this.loadReferentesWithUsmya();

    // Crear observable para los conteos por rol
    this.tabCounts$ = this.pendingUsers$.pipe(
      map(users => {
        const counts = {
          agente: users.filter(u => u.role === 'agente' || u.role === 'efector').length, // Agentes + Efectores
          referente: users.filter(u => u.role === 'referente').length,
          usmya: users.filter(u => u.role === 'usmya').length
        };
        return counts;
      })
    );

    // Crear observable para usuarios filtrados
    this.filteredUsers$ = combineLatest([
      this.pendingUsers$,
      this.selectedRole$
    ]).pipe(
      map(([users, role]) => {
        this.isLoading$.next(false); // Los datos han llegado
        return this.filterUsersByRole(users, role);
      })
    );
  }

  private loadReferentesWithUsmya(): void {
    // Obtener todos los usuarios para identificar qué referentes tienen USMYA
    this.usuarioService.getAllUsers().subscribe(users => {
      const referentesConUsmya = users
        .filter(user => user.role === 'usmya' && user.creadoPor)
        .map(user => user.creadoPor!)
        .filter((id, index, array) => array.indexOf(id) === index);
      
      this.referentesWithUsmya = new Set(referentesConUsmya);
      
      // También cargar USMYAs que tienen creador
      this.loadUsmyasWithCreador();
    });
  }

  private loadEspacioNames(): void {
    this.espacioService.getAllEspacios().subscribe(espacios => {
      // Crear mapa de nombres de espacios
      this.espacioNames.clear();
      espacios.forEach(espacio => {
        if (espacio.id !== undefined) {
          this.espacioNames.set(espacio.id, espacio.nombre);
        }
      });
    });
  }

  private loadUsmyasWithCreador(): void {
    // Obtener todos los usuarios para identificar qué USMYAs tienen creador
    this.usuarioService.getAllUsers().subscribe(users => {
      const usmyasConCreador = users
        .filter(user => user.role === 'usmya' && user.creadoPor)
        .map(user => user.id);
      
      this.usmyasWithCreador = new Set(usmyasConCreador);
      
      // Cargar tipos de creadores para USMYAs
      users
        .filter(user => user.role === 'usmya' && user.creadoPor)
        .forEach(usmya => {
          const creador = users.find(u => u.id === usmya.creadoPor);
          if (creador) {
            this.creadorTipos.set(usmya.id, creador.role);
          }
        });
    });
  }

  // Método para verificar si un referente tiene USMYA
  referenteHasUsmya(userId: number): boolean {
    return this.referentesWithUsmya.has(userId);
  }

  // Método para verificar si un USMYA tiene creador
  usmyaHasCreador(userId: number): boolean {
    return this.usmyasWithCreador.has(userId);
  }

  // Método para obtener el tipo de creador de un USMYA
  getCreadorTipo(user: Usuario): string {
    if (user.role === 'usmya' && user.creadoPor) {
      // En el componente ya tenemos acceso a todos los usuarios
      // Buscaremos el creador cuando carguemos los datos
      return this.creadorTipos.get(user.id) || '';
    }
    return '';
  }

  // Método para obtener el nombre del espacio por ID
  getEspacioName(espacioId: number | null | undefined): string {
    if (!espacioId) return 'Sin espacio asignado';

    // Devolver el nombre del mapa si existe, sino un valor por defecto
    return this.espacioNames.get(espacioId) || `Espacio ${espacioId}`;
  }

  // Map para almacenar tipos de creadores por ID de USMYA
  private creadorTipos: Map<number, string> = new Map();

  // Método para filtrar usuarios por rol con lógica especial para agentes
  private filterUsersByRole(users: Usuario[], role: string): Usuario[] {
    switch (role) {
      case 'agente':
        // Para agentes, incluir tanto 'agente' como 'efector'
        return users.filter(user => user.role === 'agente' || user.role === 'efector');
      case 'referente':
        return users.filter(user => user.role === 'referente');
      case 'usmya':
        return users.filter(user => user.role === 'usmya');
      default:
        return users;
    }
  }

  onRoleChange(role: string): void {
    this.selectedRole$.next(role);
  }

  toggleSideMenu(): void {
    this.sideMenuOpen = !this.sideMenuOpen;
  }

  closeSideMenu(): void {
    this.sideMenuOpen = false;
    this.selectedUser = null; // Limpiar usuario seleccionado
    this.selectedUserUsmya = null; // Limpiar USMYA asociado
    this.selectedUserCreador = null; // Limpiar creador asociado
  }

  // Métodos para manejar las acciones de las notificaciones
  onViewDetails(userId: number | string): void {
    const id = typeof userId === 'string' ? parseInt(userId) : userId;
    console.log('Admin - Ver detalles del usuario:', id);
    
    // Buscar el usuario por ID y abrir el side menu
    this.usuarioService.getUserById(id).subscribe(user => {
      if (user) {
        this.selectedUser = user;
        this.selectedUserUsmya = null; // Reset USMYA data
        this.selectedUserCreador = null; // Reset creador data
        
        // Si es un referente, buscar su USMYA asociado
        if (user.role === 'referente') {
          this.usuarioService.getUsmyaByReferenteId(user.id).subscribe(usmya => {
            this.selectedUserUsmya = usmya;
          });
        }
        
        // Si es un USMYA, buscar su creador
        if (user.role === 'usmya' && user.creadoPor) {
          this.usuarioService.getCreadorByUsmyaId(user.id).subscribe(creador => {
            this.selectedUserCreador = creador;
          });
        }
        
        this.sideMenuOpen = true;
      }
    });
  }

  onAcceptNotification(userId: number | string): void {
    const id = typeof userId === 'string' ? parseInt(userId) : userId;
    console.log('Admin - Aprobar usuario:', id);
    // Open modal for confirmation
    this.modalMessage = '¿Estás seguro de que deseas aprobar esta solicitud de registro?';
    this.modalType = 'positive';
    this.pendingAction = { type: 'accept', userId: id };
    this.showModal = true;
  }

  onRejectNotification(userId: number | string): void {
    const id = typeof userId === 'string' ? parseInt(userId) : userId;
    console.log('Admin - Rechazar usuario:', id);
    // Open modal for confirmation
    this.modalMessage = '¿Estás seguro de que deseas rechazar esta solicitud de registro?';
    this.modalType = 'danger';
    this.pendingAction = { type: 'reject', userId: id };
    this.showModal = true;
  }

  onModalConfirm(): void {
    if (this.pendingAction) {
      if (this.pendingAction.type === 'accept') {
        this.usuarioService.postVerified(this.pendingAction.userId).subscribe(() => {
          console.log('Usuario aprobado exitosamente');
          // Recargar todos los observables
          this.reloadObservables();
          this.sideMenuOpen = false; // Cerrar side menu
          Swal.fire({
            position: 'top-end',
            title: 'El usuario ha sido aprobado exitosamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            toast: true
          });
        });
      } else if (this.pendingAction.type === 'reject') {
        this.usuarioService.rejectUser(this.pendingAction.userId).subscribe(() => {
          console.log('Usuario rechazado exitosamente');
          // Recargar todos los observables
          this.reloadObservables();
          this.sideMenuOpen = false; // Cerrar side menu
          Swal.fire({
             position: 'top-end',
            title: 'El usuario ha sido rechazado.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            toast: true
          });
        });
      }
    }
    this.showModal = false;
    this.pendingAction = null;
  }

  private reloadObservables(): void {
    this.initializeObservables();
  }

  onModalCancel(): void {
    this.showModal = false;
    this.pendingAction = null;
  }

  getCurrentDate(): Date {
    return new Date();
  }
}
