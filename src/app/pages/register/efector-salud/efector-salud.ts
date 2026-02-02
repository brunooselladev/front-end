import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/button/button.component';
import { InputComponent } from '../../../components/input/input.component';
import { Select } from "../../../components/select/select";
import { commonEmailValidator, emailDomain, passwordsMatch, passwordValidator, soloNumerosValidator, telefonoArgentinoValidator } from '../../../shared/validators';
import { RegisterService } from '../../../services/register-service';
import { EspacioService } from '../../../services/espacio-service';
import { Efector } from '../../../models/efector.model';
import { Espacio } from '../../../models/espacio.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-efector-salud',
  imports: [RouterModule, ButtonComponent, InputComponent, CommonModule, ReactiveFormsModule, Select],
  templateUrl: './efector-salud.html',
  styleUrl: './efector-salud.scss'
})
export class EfectorSalud {
  form: FormGroup;
  espacioOpciones: { label: string; value: string }[] = [];
  isLoading = false; // Estado de carga


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
        commonEmailValidator // cambia a 'gmail.com' si era un typo
      ]],
      telefono: ['', [
        Validators.required,
        telefonoArgentinoValidator
      ]],
      espacio: ['', [Validators.required]],
      tipoProfesional: ['', [Validators.required]],
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
      console.log(this.espacioOpciones);
      
    });
  }


  onSubmit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true; // Activar estado de carga

      // Deshabilitar controles del formulario
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.disable();
      });

      const efector: Efector = {
        nombre: this.form.value.nombre,
        email: this.form.value.email,
        telefono: this.form.value.telefono,
        idEspacio: parseInt(this.form.value.espacio),
        tipoProfesional: this.form.value.tipoProfesional,
        password: this.form.value.password,
        esETratante: false
      };

      this.registerService.postEfector(efector).subscribe({
        next: (res) => {
          this.isLoading = false; // Desactivar estado de carga

          // Habilitar controles del formulario
          Object.keys(this.form.controls).forEach(key => {
            this.form.get(key)?.enable();
          });

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'El efector fue registrado correctamente',
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
