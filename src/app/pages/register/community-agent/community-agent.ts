import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/button/button.component';
import { InputComponent } from '../../../components/input/input.component';
import { Select } from "../../../components/select/select";
import { LoadingOverlayComponent } from '../../../components/loading-overlay/loading-overlay';
import { emailDomain, passwordsMatch, passwordPatternValidator, soloNumerosValidator } from '../../../shared/validators';
import { RegisterService } from '../../../services/register-service';
import { Agente } from '../../../models/agente.model';
import { commonEmailValidator, passwordValidator, telefonoArgentinoValidator } from '../../../shared/validators/custom-validators';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { EspacioService } from '../../../services/espacio-service';

@Component({
  selector: 'app-community-agent',
  imports: [ ButtonComponent, InputComponent, CommonModule, ReactiveFormsModule, RouterModule, Select, LoadingOverlayComponent],
  templateUrl: './community-agent.html',
  styleUrl: './community-agent.scss'
})
export class CommunityAgent {
  form: FormGroup;
  isLoading = false;
  espacioOpciones: { label: string; value: string }[] = [];

  tipoProfesionalOpciones = [
    'Médico', 'Enfermero', 'Psicólogo',
    'Trabajador Social', 'Kinesiólogo', 'Otro'
  ];

  get nombre() {
    return this.form.get('nombre') as FormControl;
  }

  get telefono() {
    return this.form.get('telefono') as FormControl;
  }

  get espacio() {
    return this.form.get('espacio') as FormControl;
  }

  get tipoProfesional() {
    return this.form.get('tipoProfesional') as FormControl;
  }

    get email() {
    return this.form.get('email') as FormControl;
  }

    get password() {
    return this.form.get('password') as FormControl;
  }

  get repeatPassword() {
    return this.form.get('repeatPassword') as FormControl;
  }

   constructor(private fb: FormBuilder, private registerService: RegisterService, private router: Router, private espacioService: EspacioService) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(60)]],
      email: ['', [
        Validators.required,
        Validators.maxLength(250),
        commonEmailValidator
      ]],
      telefono: ['', [
        Validators.required,
        telefonoArgentinoValidator
      ]],
      espacio: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        passwordValidator
      ]],
      repeatPassword: ['', [Validators.required]]
    }, { validators: passwordsMatch('password', 'repeatPassword') });

    this.espacioService.getAllEspacios().subscribe(espacios => {
      this.espacioOpciones = espacios.map(e => ({ label: e.nombre, value: (e.id || 0).toString() }));
    });
  }

  get f() { return this.form.controls; }
  onSubmit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true; // Activar estado de carga

      // Deshabilitar controles del formulario
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.disable();
      });

      const agente: Agente = {
        nombre: this.form.value.nombre,
        email: this.form.value.email,
        telefono: this.form.value.telefono,
        idEspacio: parseInt(this.form.value.espacio),
        password: this.form.value.password
      };

      this.registerService.postAgente(agente).subscribe({
        next: (res) => {
          this.isLoading = false; // Desactivar estado de carga

          // Habilitar controles del formulario
          Object.keys(this.form.controls).forEach(key => {
            this.form.get(key)?.enable();
          });

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'El agente fue registrado correctamente',
            timer: 1500,                    
            showConfirmButton: false,
            toast: true     
          }).then(() => {
            this.form.reset();
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          this.isLoading = false; // Desactivar estado de carga

          // Habilitar controles del formulario
          Object.keys(this.form.controls).forEach(key => {
            this.form.get(key)?.enable();
          });

          Swal.fire({
            position: 'top-end',
            title: 'No se pudo completar el registro. Intenta nuevamente',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
            toast: true
          });
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
