import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NavbarComponent } from "../../../layouts/navbar";
import { SidebarComponent } from '../../../layouts/sidebar';
import { Stepper } from '../../../components/stepper/stepper';
import { FormPersonalData } from '../../usmya/my-profile/form-personal-data/form-personal-data';
import { Usmya } from '../../../models/usmya.model';
import { FormSummary } from '../../usmya/my-profile/form-summary/form-summary';
import { RecommendActivitiesComponent } from "../../usmya/recommend-activities/recommend-activities";

@Component({
  selector: 'app-register-usmya',
  imports: [FormSummary, NavbarComponent, FormPersonalData, SidebarComponent, Stepper, RecommendActivitiesComponent],
  templateUrl: './register-usmya.html',
  styleUrl: './register-usmya.scss',
})
export class RegisterUsmya implements OnInit {
  @ViewChild(Stepper) stepper?: Stepper;

  userData?: Partial<Usmya>;

  // Configuración del stepper
  currentStep = 1;
  stepLabels = ['Datos Personales', 'Resumen', 'Actividades'];

  // Formularios para cada paso
  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;

  // Controles para el stepper
  get stepControls(): AbstractControl[] {
    return [this.step1Form, this.step2Form, this.step3Form];
  }

  constructor(private fb: FormBuilder) {
    // Inicializar formularios para cada paso
    this.step1Form = this.fb.group({
      // Aquí irían los controles del formulario de datos personales
      // Por ahora vacío, se manejará en el componente FormPersonalData
    });

    this.step2Form = this.fb.group({
      // Controles del resumen (si los hay)
    });

    this.step3Form = this.fb.group({
      // Controles de actividades (si los hay)
    });
  }

  ngOnInit(): void {
    // Cargar datos del usuario desde un servicio
    this.loadUserData();
  }

  loadUserData(): void {
    // Datos de ejemplo - reemplazar con llamada al servicio
    this.userData = {
      nombre: 'Juan Pérez',
      dni: 12345678,
      fechaNacimiento: '1990-01-15',
      telefono: '+54 11 1234-5678',
      direccionResidencia: 'Calle Ejemplo 123, Buenos Aires',
      alias: 'Juancho',
      generoAutoPercibido: 'masculino',
      estadoCivil: 'soltero',
      obraSocial: 'OSDE'
    };
  }

  onStepNext(step: number): void {
    this.currentStep = step;
  }

  onStepPrevious(step: number): void {
    this.currentStep = step;
  }

  onStepperFinished(): void {
    // Lógica para finalizar el registro
    console.log('Registro completado');
    // Aquí iría la lógica para enviar los datos al servidor
  }

  onSaveProfile(formData: Partial<Usmya>): void {
    console.log('Datos del formulario:', formData);
    // Marcar el paso 1 como válido
    this.step1Form.markAsTouched();
    // Aquí se podría actualizar el formulario step1Form con los datos
  }

  onNextStep(formData: any): void {
    console.log('Datos del formulario para siguiente paso:', formData);
    
    if (this.currentStep === 1) {
      // Marcar el paso 1 como válido y actualizar datos
      this.step1Form.markAsTouched();
    } else if (this.currentStep === 2) {
      // Marcar el paso 2 como válido y actualizar datos
      this.step2Form.markAsTouched();
    } else if (this.currentStep === 3) {
      // Marcar el paso 3 como válido y actualizar datos
      this.step3Form.markAsTouched();
    }
    
    // Avanzar al siguiente paso del stepper
    this.stepper?.onNext();
  }

  onPreviousStep(): void {
    console.log('Volviendo al paso anterior');
    // Retroceder al paso anterior del stepper
    this.stepper?.onPrevious();
  }

  onSaveSummary(formData: any): void {
    console.log('Datos del resumen guardados:', formData);
    // Marcar el paso 2 como válido
    this.step2Form.markAsTouched();
    // Aquí se podría actualizar el formulario step2Form con los datos
  }

  onRegisterPatient(formData: any): void {
    console.log('Paciente registrado:', formData);
    // Marcar el paso 3 como válido
    this.step3Form.markAsTouched();
    // Aquí iría la lógica para finalizar el registro completo
    // Por ahora solo mostramos un mensaje
    console.log('Registro de USMYA completado exitosamente');
  }

  onCancelEdit(): void {
    // Recargar datos originales si es necesario
    this.loadUserData();
  }
}
