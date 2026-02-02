import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardActivitiesComponent } from '../../../components/card-activities/card-activities';
import { Actividad } from '../../../models/actividad.model';
import { ActivitiesService } from '../../../services/activities-service';
import { LoadingOverlayComponent } from '../../../components/loading-overlay/loading-overlay';
import { ButtonComponent } from '../../../components/button/button.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recommend-activities',
  imports: [CommonModule, CardActivitiesComponent, LoadingOverlayComponent, ButtonComponent],
  templateUrl: './recommend-activities.html',
  styleUrl: './recommend-activities.scss'
})
export class RecommendActivitiesComponent implements OnInit {
  @Input() isAgentRegistration: boolean = false;
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  @Output() register = new EventEmitter<any>();

  actividades: Actividad[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  selectedActivities: Actividad[] = [];

  constructor(private activitiesService: ActivitiesService) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.isLoading = true;
    this.error = null;

    this.activitiesService.getAllActivities().subscribe({
      next: (actividades) => {
        this.actividades = actividades;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar actividades:', error);
        this.error = 'Error al cargar las actividades. Por favor, intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }

  onActivitySelection(event: {actividad: Actividad, selected: boolean}): void {
    if (event.selected) {
      this.selectedActivities.push(event.actividad);
    } else {
      this.selectedActivities = this.selectedActivities.filter(
        act => act.id !== event.actividad.id
      );
    }
    console.log('Actividades seleccionadas:', this.selectedActivities);

  }

  showSaveActivitiesAlert(): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Se guardaron las actividades para el paciente',
      showConfirmButton: false,
      timer: 3000,
      toast: true
    });
  }

  isActivitySelected(actividad: Actividad): boolean {
    return this.selectedActivities.some(act => act.id === actividad.id);
  }

  getSelectedCount(): number {
    return this.selectedActivities.length;
  }

  onConfirmSelection(): void {
    // Aquí iría la lógica para confirmar la selección
    // Por ahora solo mostramos un mensaje
    alert(`¡Seleccionaste ${this.getSelectedCount()} actividades!`);
    console.log('Actividades confirmadas:', this.selectedActivities);
  }

  onClearSelection(): void {
    this.selectedActivities = [];
    console.log('Selección limpiada');
  }

  onRegisterPatient(): void {
    // Simular registro del paciente
    const registrationData = {
      selectedActivities: this.selectedActivities,
      registrationDate: new Date()
    };

    // Mostrar SweetAlert de éxito
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Paciente registrado correctamente',
      showConfirmButton: false,
      timer: 3000,
      toast: true
    });

    console.log('Paciente registrado:', registrationData);
    this.register.emit(registrationData);
  }

  onGoBack(): void {
    this.previous.emit();
  }
}
