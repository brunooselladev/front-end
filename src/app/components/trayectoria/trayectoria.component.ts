import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AsistenciaService } from '../../services/asistencia-service';
import { NotasTrayectoriaService } from '../../services/notas-trayectoria-service';
import { ActivitiesService } from '../../services/activities-service';
import { EspacioService } from '../../services/espacio-service';
import { UsuarioService } from '../../services/usuario-service';
import { JwtService } from '../../services/jwt-service';
import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';
import { Asistencia } from '../../models/asistencia.model';
import { NotaTrayectoria } from '../../models/nota-trayectoria.model';
import { Actividad } from '../../models/actividad.model';
import { Espacio } from '../../models/espacio.model';
import { Usuario } from '../../models/usuario.interface';

interface TimelineItem {
  id: string;
  type: 'asistencia' | 'nota';
  fecha: Date;
  titulo: string;
  descripcion: string;
  estado?: 'presente' | 'ausente';
  actor?: string;
  rol?: string;
  espacio?: string;
  responsable?: string;
  observacion: string;
  data: Asistencia | NotaTrayectoria;
}

@Component({
  selector: 'app-trayectoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingOverlayComponent, InputComponent, ButtonComponent],
  templateUrl: './trayectoria.component.html',
  styles: []
})
export class TrayectoriaComponent implements OnInit, OnChanges {
  @Input() idUsmya!: number;

  timelineItems: TimelineItem[] = [];
  loading = true;
  selectedItem: TimelineItem | null = null;
  
  // Usuario actual
  currentUser: Usuario | null = null;
  currentUserRole: string | null = null;
  
  // Modal de nueva observación
  showNuevaObservacionModal = false;
  nuevaObservacionForm: FormGroup;
  creatingObservacion = false;

  constructor(
    private asistenciaService: AsistenciaService,
    private notasTrayectoriaService: NotasTrayectoriaService,
    private activitiesService: ActivitiesService,
    private espacioService: EspacioService,
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private fb: FormBuilder
  ) {
    this.nuevaObservacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      observacion: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    if (this.idUsmya) {
      this.loadTrayectoria();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idUsmya'] && changes['idUsmya'].currentValue) {
      this.loadTrayectoria();
    }
  }

  private loadTrayectoria(): void {
    this.loading = true;

    // Obtener asistencias y notas en paralelo
    combineLatest([
      this.asistenciaService.getAsistenciasByUsmyaId(this.idUsmya),
      this.notasTrayectoriaService.getNotasByIdUsmya(this.idUsmya)
    ]).pipe(
      switchMap(([asistencias, notas]) => {
        // Procesar asistencias
        const asistenciaObservables = asistencias.map(asistencia =>
          this.processAsistencia(asistencia)
        );

        // Procesar notas
        const notaObservables = notas.map(nota =>
          this.processNota(nota)
        );

        // Combinar todos los observables
        return forkJoin([...asistenciaObservables, ...notaObservables]);
      })
    ).subscribe({
      next: (timelineItems) => {
        // Ordenar por fecha descendente (más reciente primero)
        this.timelineItems = timelineItems
          .filter(item => item !== null)
          .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar trayectoria:', error);
        this.loading = false;
      }
    });
  }

  private processAsistencia(asistencia: Asistencia): Observable<TimelineItem | null> {
    return this.activitiesService.getActivityById(asistencia.idActividad).pipe(
      switchMap(actividad => {
        if (!actividad) return of(null);

        return this.espacioService.getEspacioById(actividad.espacioId).pipe(
          map(espacio => {
            // Manejar tanto Date como string para compatibilidad
            let fechaDate: Date;
            if (actividad.dia instanceof Date) {
              fechaDate = actividad.dia;
            } else {
              // Tratar como string por defecto
              const diaString = actividad.dia as string;
              const fechaString = diaString.split('T')[0];
              fechaDate = new Date(fechaString + 'T12:00:00');
            }
            return {
              id: `asistencia-${asistencia.id}`,
              type: 'asistencia' as const,
              fecha: fechaDate,
              titulo: actividad.nombre,
              descripcion: actividad.descripcion,
              estado: asistencia.estado,
              espacio: espacio?.nombre || 'Espacio no encontrado',
              responsable: actividad.responsable,
              observacion: asistencia.observacion,
              data: asistencia
            };
          })
        );
      })
    );
  }

  private processNota(nota: NotaTrayectoria): Observable<TimelineItem | null> {
    return this.usuarioService.getUserById(nota.idActor).pipe(
      map(actor => {
        // Para evitar problemas de zona horaria, extraer solo la fecha YYYY-MM-DD
        const fechaString = typeof nota.fecha === 'string' ? nota.fecha.split('T')[0] : nota.fecha;
        const fechaDate = new Date(fechaString + 'T12:00:00'); // Usar mediodía para evitar cambios de día
        return {
          id: `nota-${nota.id}`,
          type: 'nota' as const,
          fecha: fechaDate,
          titulo: nota.titulo,
          descripcion: nota.observacion,
          actor: actor?.nombre || 'Profesional no encontrado',
          rol: actor?.role === 'efector' ? 'Efector de Salud' : actor?.role === 'referente' ? 'Referente Afectivo' : 'Profesional',
          observacion: nota.observacion,
          data: nota
        };
      })
    );
  }

  showObservaciones(item: TimelineItem): void {
    this.selectedItem = item;
  }

  closeObservaciones(): void {
    this.selectedItem = null;
  }

  // Método para cargar el usuario actual
  private loadCurrentUser(): void {
    const userEmail = this.jwtService.getEmail();
    this.currentUserRole = this.jwtService.getRole();
    
    if (userEmail) {
      this.usuarioService.getAllUsers().subscribe(users => {
        this.currentUser = users.find(user => user.email === userEmail) || null;
      });
    }
  }

  // Método para verificar si el usuario puede agregar observaciones
  get canAddObservaciones(): boolean {
    return this.currentUserRole === 'efector' || this.currentUserRole === 'referente';
  }

  // Método para abrir el modal de nueva observación
  openNuevaObservacionModal(): void {
    this.showNuevaObservacionModal = true;
    this.nuevaObservacionForm.reset();
  }

  // Método para cerrar el modal de nueva observación
  closeNuevaObservacionModal(): void {
    this.showNuevaObservacionModal = false;
    this.nuevaObservacionForm.reset();
  }

  // Método para crear una nueva observación
  crearNuevaObservacion(): void {
    // Marcar todos los controles como touched para mostrar errores de validación
    this.nuevaObservacionForm.markAllAsTouched();
    
    if (this.nuevaObservacionForm.valid && this.idUsmya) {
      this.creatingObservacion = true;
      
      const formValue = this.nuevaObservacionForm.value;
      const now = new Date();
      
      // Usar fecha local en formato ISO completo para consistencia con el mock
      const argentinaOffsetMs = -3 * 60 * 60 * 1000; // -3 horas
      const nowArgentina = new Date(now.getTime() + argentinaOffsetMs);
      // Obtener la fecha en formato ISO YYYY-MM-DDT00:00:00.000Z
      const fechaISO = nowArgentina.toISOString().split('T')[0] + 'T00:00:00.000Z';

      const nuevaNota: Omit<NotaTrayectoria, 'id'> = {
        idActor: 9,
        idUsmya: this.idUsmya,
        titulo: formValue.titulo,
        observacion: formValue.observacion,
        fecha: fechaISO, // Usar formato ISO completo como en el mock
        hora: now.toTimeString().split(' ')[0].substring(0, 5) // HH:MM
      };

      this.notasTrayectoriaService.create(nuevaNota).subscribe({
        next: (notaCreada) => {
          // Recargar la trayectoria para mostrar la nueva nota
          this.loadTrayectoria();
          this.closeNuevaObservacionModal();
          this.creatingObservacion = false;
          
          // Mostrar SweetAlert de éxito
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Nueva observacion en la trayectoria",
            showConfirmButton: false,
            timer: 3000,
            toast: true
          });
        },
        error: (error) => {
          console.error('Error al crear la observación:', error);
          this.creatingObservacion = false;
        }
      });
    }
  }

  // Método para formatear fechas
  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const formatted = dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return formatted;
  }

  // Getters para los controles del formulario
  get tituloControl(): FormControl {
    return this.nuevaObservacionForm.get('titulo') as FormControl;
  }

  get observacionControl(): FormControl {
    return this.nuevaObservacionForm.get('observacion') as FormControl;
  }
}