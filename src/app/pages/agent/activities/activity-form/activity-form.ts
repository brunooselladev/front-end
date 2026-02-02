import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { InputComponent } from '../../../../components/input/input.component';
import { Select } from '../../../../components/select/select';
import { ButtonComponent } from '../../../../components/button/button.component';
import { Actividad } from '../../../../models/actividad.model';
import { ActivitiesService } from '../../../../services/activities-service';

interface EspacioOption {
  label: string;
  value: string; // Cambiar a string para coincidir con Option
}

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    Select,
    ButtonComponent
  ],
  templateUrl: './activity-form.html',
  styleUrls: ['./activity-form.scss']
})
export class ActivityFormComponent implements OnInit, OnChanges {
  @Input() activityToEdit: Actividad | null = null;
  @Output() closeForm = new EventEmitter<void>();
  @Output() activityCreated = new EventEmitter<Actividad>();
  @Output() activityUpdated = new EventEmitter<Actividad>();

  private fb = inject(FormBuilder);
  private activitiesService = inject(ActivitiesService);

  activityForm: FormGroup;
  isSubmitting = false;


  constructor() {
    this.activityForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      dia: ['', Validators.required],
      hora: ['', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      horaFin: ['', Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)],
      responsable: ['', [Validators.required]],
      espacioId: [''],
      lugar: ['', [Validators.required]],
      esFija: [false]
    });
  }

  ngOnInit(): void {
    // Inicialización básica del formulario
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activityToEdit'] && changes['activityToEdit'].currentValue) {
      this.loadActivityData();
    } else if (changes['activityToEdit'] && !changes['activityToEdit'].currentValue) {
      // Si activityToEdit cambió a null, resetear el formulario
      this.activityForm.reset();
    }
  }

  private loadActivityData(): void {
    if (this.activityToEdit) {
      const formattedDate = this.formatDateForInput(this.activityToEdit.dia);

      this.activityForm.patchValue({
        nombre: this.activityToEdit.nombre,
        descripcion: this.activityToEdit.descripcion,
        dia: formattedDate,
        hora: this.activityToEdit.hora,
        horaFin: this.activityToEdit.horaFin || '',
        responsable: this.activityToEdit.responsable,
        espacioId: this.activityToEdit.espacioId.toString(),
        lugar: this.activityToEdit.lugar,
        esFija: this.activityToEdit.esFija
      });
    }
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get isEditing(): boolean {
    return this.activityToEdit !== null;
  }

  onSubmit(): void {
    if (this.activityForm.valid) {
      this.isSubmitting = true;

      const formValue = this.activityForm.value;

      if (this.isEditing && this.activityToEdit && this.activityToEdit.id) {
        // Actualizar actividad existente
        this.activitiesService.updateActivity(this.activityToEdit.id, {
          nombre: formValue.nombre,
          descripcion: formValue.descripcion,
          dia: new Date(formValue.dia),
          hora: formValue.hora,
          horaFin: formValue.horaFin || undefined,
          responsable: formValue.responsable,
          espacioId: parseInt(formValue.espacioId),
          lugar: formValue.lugar,
          esFija: formValue.esFija
        }).subscribe({
          next: (updatedActivity) => {
            if (updatedActivity) {
              this.activityUpdated.emit(updatedActivity);
              this.closeForm.emit();
            } else {
              console.error('Activity not found for update');
              this.isSubmitting = false;
            }
          },
          error: (error) => {
            console.error('Error updating activity:', error);
            this.isSubmitting = false;
          }
        });
      } else {
        // Crear nueva actividad
        const newActivity: Omit<Actividad, 'id'> = {
          nombre: formValue.nombre,
          descripcion: formValue.descripcion,
          dia: new Date(formValue.dia),
          hora: formValue.hora,
          horaFin: formValue.horaFin || undefined,
          responsable: formValue.responsable,
          espacioId: parseInt(formValue.espacioId),
          lugar: formValue.lugar,
          esFija: formValue.esFija
        };

        this.activitiesService.createActivity(newActivity).subscribe({
          next: (createdActivity) => {
            this.activityCreated.emit(createdActivity);
            this.closeForm.emit();
          },
          error: (error) => {
            console.error('Error creating activity:', error);
            this.isSubmitting = false;
          }
        });
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.activityForm.controls).forEach(key => {
        this.activityForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.closeForm.emit();
  }

  // Getters para facilitar el acceso a los controles
  get nombre(): FormControl { return this.activityForm.get('nombre') as FormControl; }
  get descripcion(): FormControl { return this.activityForm.get('descripcion') as FormControl; }
  get dia(): FormControl { return this.activityForm.get('dia') as FormControl; }
  get hora(): FormControl { return this.activityForm.get('hora') as FormControl; }
  get horaFin(): FormControl { return this.activityForm.get('horaFin') as FormControl; }
  get responsable(): FormControl { return this.activityForm.get('responsable') as FormControl; }
  get espacioId(): FormControl { return this.activityForm.get('espacioId') as FormControl; }
  get lugar(): FormControl { return this.activityForm.get('lugar') as FormControl; }
  get esFija(): FormControl { return this.activityForm.get('esFija') as FormControl; }
}
