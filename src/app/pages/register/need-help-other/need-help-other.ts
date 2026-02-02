import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

// Componentes
import { Stepper } from '../../../components/stepper/stepper';
import { InputComponent } from '../../../components/input/input.component';
import { ButtonComponent } from '../../../components/button/button.component';

// Validadores
import { 
  commonEmailValidator,
  telefonoArgentinoValidator,
  passwordValidator,
  passwordMatchValidator,
  fechaNacimientoValidator,
  soloNumerosValidator,
  dniArgentinoValidator
} from '../../../shared/validators';
import { RegisterService } from '../../../services/register-service';
import { ReferenteUsmya } from '../../../models/efector-usmya.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-need-help-other',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    Stepper,
    InputComponent,
    ButtonComponent,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: true, showError: true }
    }
  ],
  templateUrl: './need-help-other.html',
  styleUrl: './need-help-other.scss'
})
export class NeedHelpOtherComponent {
  @ViewChild(Stepper) stepper?: Stepper;

  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);
  isLoading = false; // Estado de carga
  private router = inject(Router);

  // Paso 1: Datos del referente afectivo (obligatorio)
  formStep1: FormGroup = this.fb.group({
    nombre: ['', [
      Validators.required, 
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/) // Solo letras y espacios
    ]],
    email: ['', [
      Validators.required,
      Validators.maxLength(250),
      commonEmailValidator
    ]],
    telefono: ['', [
      Validators.required,
      telefonoArgentinoValidator
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      passwordValidator
    ]],
    repeatPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  // Paso 2: Datos de la persona a ayudar (obligatorio)
  formStep2: FormGroup = this.fb.group({
    nombrePersona: ['', [
      Validators.required, 
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/) // Solo letras y espacios
    ]],
    dni: ['', [
      Validators.required,
      dniArgentinoValidator
    ]],
    telefonoPersona: ['', [
      Validators.required,
      telefonoArgentinoValidator
    ]],
    fechaNacimiento: ['', [
      Validators.required,
      fechaNacimientoValidator
    ]]
  });



  // Getters para acceso fácil a los controles del Paso 1
  get nombre() { return this.formStep1.get('nombre') as FormControl; }
  get email() { return this.formStep1.get('email') as FormControl; }
  get telefono() { return this.formStep1.get('telefono') as FormControl; }
  get password() { return this.formStep1.get('password') as FormControl; }
  get repeatPassword() { return this.formStep1.get('repeatPassword') as FormControl; }

  // Getters para acceso fácil a los controles del Paso 2
  get nombrePersona() { return this.formStep2.get('nombrePersona') as FormControl; }
  get dni() { return this.formStep2.get('dni') as FormControl; }
  get telefonoPersona() { return this.formStep2.get('telefonoPersona') as FormControl; }
  get fechaNacimiento() { return this.formStep2.get('fechaNacimiento') as FormControl; }





  // Método llamado al finalizar el registro
  onFinish() {
    if (this.formStep1.valid && this.formStep2.valid && !this.isLoading) {
      this.isLoading = true; // Activar estado de carga

      // Deshabilitar controles del formulario
      Object.keys(this.formStep1.controls).forEach(key => {
        this.formStep1.get(key)?.disable();
      });
      Object.keys(this.formStep2.controls).forEach(key => {
        this.formStep2.get(key)?.disable();
      });
      // Crear objeto EfectorUsmya
      const efectorUsmyaData: ReferenteUsmya = {
        referente: {
          nombre: this.formStep1.value.nombre,
          email: this.formStep1.value.email,
          telefono: this.formStep1.value.telefono,
          password: this.formStep1.value.password,
          registroConUsmya: true
        },
        usmya: {
          nombre: this.formStep2.value.nombrePersona,
          dni: this.formStep2.value.dni,
          telefono: this.formStep2.value.telefonoPersona,
          fechaNacimiento: this.formStep2.value.fechaNacimiento
        }
      };

      // Llamar al servicio simulado
      this.registerService.postEfectorUsmya(efectorUsmyaData)
        .subscribe({
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
                            text: 'El referente y la persona a ayudar fueron registrados correctamente.',
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
    } else {
      console.error('Formulario inválido');
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos correctamente antes de continuar.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#f39c12'
      });
    }
  }
}