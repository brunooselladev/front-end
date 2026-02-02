import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/button/button.component';
import { InputComponent } from '../../../components/input/input.component';
import { Select } from "../../../components/select/select";
import { LoadingOverlayComponent } from '../../../components/loading-overlay/loading-overlay';
import { soloNumerosValidator, requiredWithNullValidator, telefonoArgentinoValidator } from '../../../shared/validators';
import { RegisterService } from '../../../services/register-service';
import { Espacio } from '../../../models/espacio.model';
import { ActividadEspacio } from '../../../models/actividad.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Stepper } from "../../../components/stepper/stepper";

@Component({
  selector: 'app-space',
  imports: [RouterModule, ButtonComponent, InputComponent, CommonModule, ReactiveFormsModule, Select, Stepper, LoadingOverlayComponent],
  templateUrl: './space.html',
  styleUrl: './space.scss'
})
export class Space {
  formStep1: FormGroup;
  formStep2: FormGroup;
  // currentStep = 1;
  isLoading = false;

  @ViewChild(Stepper) stepper?: Stepper;

  // Array para almacenar actividades en memoria
  actividades: ActividadEspacio[] = [];
  actividadEditandoIndex: number | null = null; // null = agregando nueva, number = editando existente

  // Opciones para los selects
  tipoOrganizacionOpciones = [
    { value: 'estatal', label: 'Estatal' },
    { value: 'comunitario', label: 'Comunitario' },
    { value: 'educacion', label: 'Educación' },
    { value: 'merendero', label: 'Merendero' },
    { value: 'comedor', label: 'Comedor' },
    { value: 'deportiva', label: 'Deportiva' },
    { value: 'religiosa', label: 'Religiosa' },
    { value: 'centro vecinal', label: 'Centro Vecinal' },
    { value: 'salud', label: 'Salud' },
    { value: 'otros', label: 'Otros' }
  ];

  poblacionOpciones = [
    { value: 'niños', label: 'Niños' },
    { value: 'adolescentes', label: 'Adolescentes' },
    { value: 'jovenes', label: 'Jóvenes' },
    { value: 'adultos', label: 'Adultos' },
    { value: 'mayores', label: 'Mayores' },
    { value: 'familias', label: 'Familias' },
    { value: 'otros', label: 'Otros' }
  ];

  tipoActividadOpciones = [
    { value: 'principal', label: 'Principal' },
    { value: 'secundario', label: 'Secundario' }
  ];

  formaConfirmacionOpciones = [
    { value: 'conversacion_previa', label: 'Conversación previa para acordar cuándo y cómo' },
    { value: 'whatsapp', label: 'Sólo con aviso por whatsapp' },
    { value: 'abierta', label: 'Actividad abierta sin necesidad de confirmación' },
    { value: 'otro', label: 'Otro' }
  ];

  // Getters para acceso fácil a los controles
  get nombre() { return this.formStep1.get('nombre') as FormControl; }
  get telefono() { return this.formStep1.get('telefono') as FormControl; }
  get tipoOrganizacion() { return this.formStep1.get('tipoOrganizacion') as FormControl; }
  get direccion() { return this.formStep1.get('direccion') as FormControl; }
  get barrio() { return this.formStep1.get('barrio') as FormControl; }
  get encargado() { return this.formStep1.get('encargado') as FormControl; }
  get poblacionVinculada() { return this.formStep1.get('poblacionVinculada') as FormArray; }
  get diasHorarios() { return this.formStep1.get('diasHorarios') as FormControl; }
  get cuentaConInternet() { return this.formStep1.get('cuentaConInternet') as FormControl; }
  get cuentaConDispositivo() { return this.formStep1.get('cuentaConDispositivo') as FormControl; }
  get actividadNombre() { return this.formStep2.get('nombre') as FormControl; }
  get tipoActividad() { return this.formStep2.get('tipoActividad') as FormControl; }
  get actividadDescripcion() { return this.formStep2.get('descripcion') as FormControl; }
  get actividadDiasHorarios() { return this.formStep2.get('diasHorarios') as FormControl; }
  get formaConfirmacion() { return this.formStep2.get('formaConfirmacion') as FormControl; }

  constructor(private fb: FormBuilder, private registerService: RegisterService, private router: Router) {
    this.formStep1 = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      telefono: ['', [Validators.required, telefonoArgentinoValidator]],
      tipoOrganizacion: ['null', [requiredWithNullValidator]],
      direccion: ['', [Validators.minLength(5)]],
      barrio: ['', [Validators.minLength(3)]],
      encargado: ['', [Validators.required, Validators.minLength(3)]],
      poblacionVinculada: this.fb.array([]),
      diasHorarios: ['', [Validators.minLength(5)]],
      cuentaConInternet: [false],
      cuentaConDispositivo: [false]
    });

    this.formStep2 = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      tipoActividad: ['principal'],
      descripcion: [''],
      diasHorarios: [''],
      formaConfirmacion: ['conversacion_previa']
    });
  }

  onPoblacionChange(event: any, poblacion: string) {
    const formArray = this.poblacionVinculada;
    if (event.target.checked) {
      formArray.push(this.fb.control(poblacion));
    } else {
      const index = formArray.controls.findIndex(x => x.value === poblacion);
      if (index >= 0) {
        formArray.removeAt(index);
      }
    }
  }

  isPoblacionSelected(poblacion: string): boolean {
    return this.poblacionVinculada.value.includes(poblacion);
  }

  // Navegación entre pasos
  nextStep() {
    if (this.stepper?.currentStep === 1 && this.formStep1.valid) {
      this.stepper.currentStep = 2;
    }
  }

  previousStep() {
    if (this.stepper?.currentStep === 2) {
      this.stepper.currentStep = 1;
    }
  }

  // Método requerido por el stepper (aunque no lo usaremos)
  onFinish() {
    // Este método es requerido por el stepper pero no lo usaremos
    // ya que manejamos la navegación manualmente
  }

  // Métodos para manejar actividades
  agregarActividad() {
    if (this.formStep2.valid) {
      const nuevaActividad: ActividadEspacio = {
        nombre: this.formStep2.value.nombre,
        tipoActividad: this.formStep2.value.tipoActividad,
        descripcion: this.formStep2.value.descripcion,
        diasHorarios: this.formStep2.value.diasHorarios,
        formaConfirmacion: this.formStep2.value.formaConfirmacion
      };

      if (this.actividadEditandoIndex !== null) {
        // Editando actividad existente
        this.actividades[this.actividadEditandoIndex] = nuevaActividad;
        this.actividadEditandoIndex = null;
      } else {
        // Agregando nueva actividad
        this.actividades.push(nuevaActividad);
      }

      // Limpiar el formulario
      this.formStep2.reset({
        tipoActividad: 'principal',
        formaConfirmacion: 'conversacion_previa'
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.formStep2.controls).forEach(key => {
        const control = this.formStep2.get(key);
        control?.markAsTouched();
      });
    }
  }

  editarActividad(index: number) {
    const actividad = this.actividades[index];
    this.formStep2.patchValue(actividad);
    this.actividadEditandoIndex = index;
  }

  eliminarActividad(index: number) {
    this.actividades.splice(index, 1);
    if (this.actividadEditandoIndex === index) {
      this.cancelarEdicion();
    } else if (this.actividadEditandoIndex !== null && this.actividadEditandoIndex > index) {
      this.actividadEditandoIndex--;
    }
  }

  cancelarEdicion() {
    this.formStep2.reset({
      tipoActividad: 'principal',
      formaConfirmacion: 'conversacion_previa'
    });
    this.actividadEditandoIndex = null;
  }

  // Submit del formulario
  onSubmit() {
    if (this.formStep1.valid && !this.isLoading) {
      this.isLoading = true;

      // Deshabilitar controles del formulario
      Object.keys(this.formStep1.controls).forEach(key => {
        const control = this.formStep1.get(key);
        if (control) {
          control.disable();
        }
      });

      const espacioData: Espacio = {
        nombre: this.formStep1.value.nombre,
        telefono: this.formStep1.value.telefono,
        tipoOrganizacion: this.formStep1.value.tipoOrganizacion,
        direccion: this.formStep1.value.direccion,
        barrio: this.formStep1.value.barrio,
        encargado: this.formStep1.value.encargado,
        poblacionVinculada: this.formStep1.value.poblacionVinculada,
        diasHorarios: this.formStep1.value.diasHorarios,
        actividadEspacio: this.actividades,
        cuentaConInternet: this.formStep1.value.cuentaConInternet,
        cuentaConDispositivo: this.formStep1.value.cuentaConDispositivo
      };

      

      this.registerService.registerEspacioInMongo(espacioData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          Swal.fire({
            position: 'top-end',
            title: 'El espacio ha sido registrado correctamente',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
            toast: true
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error: any) => {
          this.isLoading = false;
          // Rehabilitar controles del formulario
          Object.keys(this.formStep1.controls).forEach(key => {
            const control = this.formStep1.get(key);
            if (control) {
              control.enable();
            }
          });

          Object.keys(this.formStep2.controls).forEach(key => {
            const control = this.formStep2.get(key);
            if (control) {
              control.enable();
            }
          });

          Swal.fire({
            position: 'top-end',
            title: 'Ha ocurrido un error al registrar el espacio',
            icon: 'error',
            showConfirmButton: false,
            timer: 3000,
            toast: true
          });
        }
      });
    }
  }
}
