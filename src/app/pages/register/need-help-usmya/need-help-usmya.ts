import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputComponent } from '../../../components/input/input.component';
import { ButtonComponent } from '../../../components/button/button.component';

// Angular Material
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Select } from '../../../components/select/select';
import { Stepper } from "../../../components/stepper/stepper";

// Validadores
import { soloNumerosValidator, dniArgentinoValidator, telefonoArgentinoValidator, fechaNacimientoValidator } from '../../../shared/validators';
import { RegisterService } from '../../../services/register-service';
import { Usmya } from '../../../models/usmya.model';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-need-help-usmya',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    Select,
    MatStepperModule,
    Stepper,
    RouterModule
  ],
  providers: [
    // Números en los pasos y mostrar errores
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: true, showError: true }
    }
  ],
  templateUrl: './need-help-usmya.html',
  styleUrl: './need-help-usmya.scss'
})
export class NeedHelpUsmya {
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);
  private router = inject(Router);

  @ViewChild(Stepper) stepper?: Stepper;

  isLoading = false;

  // Paso 1 (obligatorio)
  formStep1: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(60)]],
    dni: ['', [Validators.required, dniArgentinoValidator]],
    fechaNacimiento: ['', [Validators.required, fechaNacimientoValidator]],
    telefono: ['', [Validators.required, telefonoArgentinoValidator]],
  });

  // Paso 2 (opcional)
  formStep2: FormGroup = this.fb.group({
    direccion: ['', [Validators.maxLength(200)]],
    alias: ['', [Validators.maxLength(60)]],
    genero: ['', [Validators.maxLength(100)]],
    estadoCivil: [''],
    obraSocial: ['']
  });

  estadoCivilOpciones = [
    'Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a',
    'Unión convivencial', 'Prefiero no decir'
  ];

  // getters cómodos para el paso 1
    get nombre() { return this.formStep1.get('nombre') as FormControl; }
  get dni() { return this.formStep1.get('dni') as FormControl; }
  get fechaNacimiento() { return this.formStep1.get('fechaNacimiento') as FormControl; }
  get telefono() { return this.formStep1.get('telefono') as FormControl; }
  get direccion() { return this.formStep2.get('direccion') as FormControl; }
  get alias() { return this.formStep2.get('alias') as FormControl; }
  get genero() { return this.formStep2.get('genero') as FormControl; }
  get estadoCivil() { return this.formStep2.get('estadoCivil') as FormControl; }
  get obraSocial() { return this.formStep2.get('obraSocial') as FormControl; }

  onFinish() {
    // Validación final (el stepper ya evita avanzar si el 1 es inválido)
    if (this.formStep1.valid && this.formStep2.valid && !this.isLoading) {
      this.isLoading = true; // Activar estado de carga

      // Deshabilitar controles del formulario
      Object.keys(this.formStep1.controls).forEach(key => {
        this.formStep1.get(key)?.disable();
      });
      Object.keys(this.formStep2.controls).forEach(key => {
        this.formStep2.get(key)?.disable();
      });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const usmya: Usmya = {
              nombre: this.formStep1.value.nombre,
              dni: Number(this.formStep1.value.dni),
              fechaNacimiento: this.formStep1.value.fechaNacimiento,
              telefono: this.formStep1.value.telefono,
              direccionResidencia: this.formStep2.value.direccion || '',
              alias: this.formStep2.value.alias || '',
              generoAutoPercibido: this.formStep2.value.genero || '',
              estadoCivil: this.formStep2.value.estadoCivil || '',
              obraSocial: this.formStep2.value.obraSocial || '',
              geolocalizacion: `${position.coords.latitude},${position.coords.longitude}`,
              password: 'Usmya2024*',
              creadoPor: 0,
              requiereAprobacion: true,
              email: ''
            };
            this.registerService.postUsmya(usmya).subscribe({
              next: (res) => {
                this.isLoading = false; // Desactivar estado de carga

                // Habilitar controles del formulario
                Object.keys(this.formStep1.controls).forEach(key => {
                  this.formStep1.get(key)?.enable();
                });
                Object.keys(this.formStep2.controls).forEach(key => {
                  this.formStep2.get(key)?.enable();
                });

                Swal.fire({
                  icon: 'success',
                  title: 'Registro exitoso',
                  text: 'El usuario USMYA fue registrado correctamente.',
                  timer: 3000,                    // ⏱️ 3 segundos
                  timerProgressBar: true,         // 📊 Barra de progreso
                  showConfirmButton: false        // ❌ Sin botón "Aceptar"
                }).then(() => {
                  this.formStep1.reset();
                  this.formStep2.reset();
                  this.router.navigate(['/login']);
                });
              },
              error: (err) => {
                this.isLoading = false; // Desactivar estado de carga

                // Habilitar controles del formulario
                Object.keys(this.formStep1.controls).forEach(key => {
                  this.formStep1.get(key)?.enable();
                });
                Object.keys(this.formStep2.controls).forEach(key => {
                  this.formStep2.get(key)?.enable();
                });

                Swal.fire({
                  icon: 'error',
                  title: 'Hubo un problema',
                  text: 'No se pudo completar el registro. Intenta nuevamente.'
                });
              }
            });
          },
          (error) => {
            Swal.fire({
              icon: 'warning',
              title: 'Ubicación no compartida',
              text: 'No se pudo obtener la ubicación. El registro se enviará sin geolocalización.'
            });
            const usmya: Usmya = {
              nombre: this.formStep1.value.nombre,
              dni: Number(this.formStep1.value.dni),
              fechaNacimiento: this.formStep1.value.fechaNacimiento,
              telefono: this.formStep1.value.telefono,
              direccionResidencia: this.formStep2.value.direccion || '',
              alias: this.formStep2.value.alias || '',
              generoAutoPercibido: this.formStep2.value.genero || '',
              estadoCivil: this.formStep2.value.estadoCivil || '',
              obraSocial: this.formStep2.value.obraSocial || '',
              geolocalizacion: '',
              password: 'Usmya2024*',
              creadoPor: 0,
              requiereAprobacion: true,
              email: ''
            };
            this.registerService.postUsmya(usmya).subscribe({
              next: (res) => {
                this.isLoading = false; // Desactivar estado de carga

                // Habilitar controles del formulario
                Object.keys(this.formStep1.controls).forEach(key => {
                  this.formStep1.get(key)?.enable();
                });
                Object.keys(this.formStep2.controls).forEach(key => {
                  this.formStep2.get(key)?.enable();
                });

                Swal.fire({
                  icon: 'success',
                  title: 'Registro exitoso',
                  text: 'El usuario USMYA fue registrado correctamente.',
                  timer: 3000,                    // ⏱️ 3 segundos
                  timerProgressBar: true,         // 📊 Barra de progreso
                  showConfirmButton: false        // ❌ Sin botón "Aceptar"
                }).then(() => {
                  this.formStep1.reset();
                  this.formStep2.reset();
                  this.router.navigate(['/login']);
                });
              },
              error: (err) => {
                this.isLoading = false; // Desactivar estado de carga

                // Habilitar controles del formulario
                Object.keys(this.formStep1.controls).forEach(key => {
                  this.formStep1.get(key)?.enable();
                });
                Object.keys(this.formStep2.controls).forEach(key => {
                  this.formStep2.get(key)?.enable();
                });

                Swal.fire({
                  icon: 'error',
                  title: 'Hubo un problema',
                  text: 'No se pudo completar el registro. Intenta nuevamente.'
                });
              }
            });
          }
        );
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Ubicación no soportada',
          text: 'Tu navegador no soporta geolocalización. El registro se enviará sin ubicación.'
        });
        const usmya: Usmya = {
          nombre: this.formStep1.value.nombre,
          dni: Number(this.formStep1.value.dni),
          fechaNacimiento: this.formStep1.value.fechaNacimiento,
          telefono: this.formStep1.value.telefono,
          direccionResidencia: this.formStep2.value.direccion || '',
          alias: this.formStep2.value.alias || '',
          generoAutoPercibido: this.formStep2.value.genero || '',
          estadoCivil: this.formStep2.value.estadoCivil || '',
          obraSocial: this.formStep2.value.obraSocial || '',
          geolocalizacion: '',
          password: 'Usmya2024*',
          creadoPor: 0,
          requiereAprobacion: true,
          email: ''
        };
        this.registerService.postUsmya(usmya).subscribe({
          next: (res) => {
            this.isLoading = false; // Desactivar estado de carga

            // Habilitar controles del formulario
            Object.keys(this.formStep1.controls).forEach(key => {
              this.formStep1.get(key)?.enable();
            });
            Object.keys(this.formStep2.controls).forEach(key => {
              this.formStep2.get(key)?.enable();
            });

            Swal.fire({
              icon: 'success',
              title: 'Registro exitoso',
              text: 'El usuario USMYA fue registrado correctamente.',
              timer: 3000,                    // ⏱️ 3 segundos
              timerProgressBar: true,         // 📊 Barra de progreso
              showConfirmButton: false        // ❌ Sin botón "Aceptar"
            }).then(() => {
              this.formStep1.reset();
              this.formStep2.reset();
              this.router.navigate(['/login']);
            });
          },
          error: (err) => {
            this.isLoading = false; // Desactivar estado de carga

            // Habilitar controles del formulario
            Object.keys(this.formStep1.controls).forEach(key => {
              this.formStep1.get(key)?.enable();
            });
            Object.keys(this.formStep2.controls).forEach(key => {
              this.formStep2.get(key)?.enable();
            });

            Swal.fire({
              icon: 'error',
              title: 'Hubo un problema',
              text: 'No se pudo completar el registro. Intenta nuevamente.'
            });
          }
        });
      }
    } else {
      this.formStep1.markAllAsTouched();
      this.formStep2.markAllAsTouched();
    }
  }

  ayudaUrgente() {
    console.log('Necesito ayuda urgente');
  }
}

