import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormSummary } from "../../../usmya/my-profile/form-summary/form-summary";
import { FormPersonalData } from "../../../usmya/my-profile/form-personal-data/form-personal-data";
import { NotificationTabsComponent } from "../../../../components/notification-tabs/notification-tabs.component";
import { LoadingOverlayComponent } from "../../../../components/loading-overlay/loading-overlay";
import { RecommendActivitiesComponent } from "../../../usmya/recommend-activities/recommend-activities";
import { map, Observable } from 'rxjs';
import { Usuario } from '../../../../models/usuario.interface';
import { Usmya } from '../../../../models/usmya.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../../services/usuario-service';
import { SidebarComponent } from "../../../../layouts/sidebar";
import { NavbarComponent } from "../../../../layouts/navbar";

@Component({
  selector: 'app-patient-form',
  imports: [CommonModule,FormSummary, FormPersonalData, NotificationTabsComponent, LoadingOverlayComponent, RecommendActivitiesComponent, SidebarComponent, NavbarComponent],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.scss'
})
export class PatientForm {
  @Input() participantId!: number;

  participant$!: Observable<Usuario | null>;
  participantName = '';
  userData$!: Observable<Partial<Usmya> | undefined>;

  // Configuración de tabs
  activeTab = 'datos';
  tabs = [
    { label: 'Datos Personales', icon: '', value: 'datos' },
    { label: 'Resumen', icon: '', value: 'resumen' },
    { label: 'Actividades', icon: '', value: 'actividades' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  // Helper function to convert ISO date to yyyy-MM-dd format for date inputs
  private formatDateForInput(dateString: string | null | undefined): string {
    if (!dateString) return '';
    try {
      // If it's already in yyyy-MM-dd format, return as is
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
      }
      // Convert ISO string to Date and then to yyyy-MM-dd
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Error formatting date:', dateString, error);
      return '';
    }
  }

  ngOnInit() {
    // Si no se recibe participantId por input, intentar obtenerlo de la ruta
    if (!this.participantId) {
      const id = this.route.snapshot.params['id'];
      if (id) {
        this.participantId = +id;
      }
    }

    if (this.participantId) {
      this.loadParticipantData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['participantId'] && this.participantId) {
      this.loadParticipantData();
    }
  }

  private loadParticipantData() {
    this.participant$ = this.usuarioService.getUserById(this.participantId);
    

    // Convertir Usuario a Usmya para los formularios
    this.userData$ = this.participant$.pipe(
      map(participant => {
        if (!participant) return undefined;

        return {
          nombre: participant.nombre,
          dni: participant.dni || undefined,
          fechaNacimiento: this.formatDateForInput(participant.fechaNacimiento),
          telefono: participant.telefono || undefined,
          direccionResidencia: participant.direccionResidencia || undefined,
          alias: participant.alias || undefined,
          generoAutoPercibido: participant.generoAutoPercibido || undefined,
          estadoCivil: participant.estadoCivil || undefined,
          obraSocial: participant.obraSocial || undefined,
          email: participant.email
        } as Partial<Usmya>;
      })
    );

    // Actualizar el nombre para el título
    this.participant$.subscribe(participant => {
      if (participant) {
        this.participantName = participant.nombre;
      }
    });
  }

  onTabChange(tabValue: string) {
    this.activeTab = tabValue;
  }

  onSaveProfile(updatedData: any) {
    // Lógica para guardar cambios en el perfil del participante
    console.log('Guardando cambios del participante:', updatedData);
    // Aquí iría la llamada al servicio para actualizar
  }

  onCancelEdit() {
    // Lógica para cancelar edición
    console.log('Cancelando edición del participante');
  }

  goBack() {
    this.router.navigate(['/agente/asistencia']);
  }

}
