import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.html',
  styleUrl: './stepper.scss'
})
export class Stepper implements OnInit {
  /** Etiquetas de los pasos (nueva API dinámica) */
  @Input() stepLabels?: string[];

  /** Controles para validación de cada paso (nueva API dinámica) */
  @Input() stepControls?: AbstractControl[];

  /** Etiquetas de los pasos (API antigua para compatibilidad) */
  @Input() step1Label = 'Datos básicos';
  @Input() step2Label = 'Datos adicionales';

  /** Controles para validación (API antigua para compatibilidad) */
  @Input() stepControl1?: AbstractControl;
  @Input() stepControl2?: AbstractControl;
  @Input() step2Optional = true;

  /** Estado del stepper */
  currentStep = 1;
  totalSteps = 2;
  stepsArray: number[] = [];
  stepsVisited: boolean[] = [];

  /** Evento al finalizar */
  @Output() finished = new EventEmitter<void>();

  /** Eventos navegación */
  @Output() next = new EventEmitter<number>();
  @Output() previous = new EventEmitter<number>();

  ngOnInit() {
    // Determinar si usar nueva API o antigua
    if (this.stepLabels && this.stepControls) {
      // Nueva API dinámica
      this.totalSteps = Math.max(this.stepLabels.length, this.stepControls.length);
      this.stepsArray = Array.from({ length: this.totalSteps }, (_, i) => i + 1);
      this.stepsVisited = new Array(this.totalSteps).fill(false);
      this.stepsVisited[0] = true; // El primer paso siempre está visitado
    } else {
      // API antigua (compatibilidad)
      this.totalSteps = this.stepControl2 ? 2 : 1;
      this.stepsArray = Array.from({ length: this.totalSteps }, (_, i) => i + 1);
      this.stepsVisited = new Array(this.totalSteps).fill(false);
      this.stepsVisited[0] = true;
    }
  }

  // Métodos para navegación (llamados desde los formularios)
  onNext() {
    if (this.currentStep < this.totalSteps) {
      // Validar el paso actual antes de continuar
      const currentControl = this.getCurrentControl();
      if (currentControl && currentControl.valid) {
        this.currentStep++;
        this.stepsVisited[this.currentStep - 1] = true;
        this.next.emit(this.currentStep);
      } else {
        alert(`Completa todos los campos requeridos del paso ${this.currentStep} antes de continuar.`);
      }
    }
  }

  onPrevious() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.previous.emit(this.currentStep);
    }
  }

  onFinish() {
    // Validar todos los pasos antes de finalizar
    const allValid = this.areAllStepsValid();
    if (allValid) {
      this.finished.emit();
    } else {
      alert('Completa todos los campos requeridos antes de finalizar.');
    }
  }

  private getCurrentControl(): AbstractControl | null {
    if (this.stepControls && this.stepControls.length > 0) {
      // Nueva API
      return this.stepControls[this.currentStep - 1] || null;
    } else {
      // API antigua
      if (this.currentStep === 1) return this.stepControl1 || null;
      if (this.currentStep === 2) return this.stepControl2 || null;
      return null;
    }
  }

  private areAllStepsValid(): boolean {
    if (this.stepControls && this.stepControls.length > 0) {
      // Nueva API
      return this.stepControls.every(control => control?.valid ?? true);
    } else {
      // API antigua
      const step1Valid = this.stepControl1?.valid ?? true;
      const step2Valid = this.stepControl2?.valid ?? true;
      return step1Valid && step2Valid;
    }
  }

  // Getter para el label del paso actual
  get currentStepLabel(): string {
    if (this.stepLabels && this.stepLabels.length > 0) {
      return this.stepLabels[this.currentStep - 1] || `Paso ${this.currentStep}`;
    } else {
      // API antigua
      if (this.currentStep === 1) return this.step1Label;
      if (this.currentStep === 2) return this.step2Label;
      return `Paso ${this.currentStep}`;
    }
  }

  // Getter para controlar si un paso debe mostrarse como completado
  isStepCompleted(stepIndex: number): boolean {
    return this.stepsVisited[stepIndex] && this.isStepValid(stepIndex);
  }

  private isStepValid(stepIndex: number): boolean {
    if (this.stepControls && this.stepControls.length > stepIndex) {
      return this.stepControls[stepIndex]?.valid ?? true;
    } else {
      // API antigua
      if (stepIndex === 0) return this.stepControl1?.valid ?? true;
      if (stepIndex === 1) return this.stepControl2?.valid ?? true;
      return true;
    }
  }
}