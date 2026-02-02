import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputComponent } from "../../components/input/input.component";
import { ButtonComponent } from "../../components/button/button.component";
import { LoadingOverlayComponent } from '../../components/loading-overlay/loading-overlay';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { JwtService } from '../../services/jwt-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, InputComponent, ButtonComponent, ReactiveFormsModule, LoadingOverlayComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  form: FormGroup;
  isLoading = false; // Estado de carga

  get email() {
    return this.form.get('email') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  constructor(private fb: FormBuilder, private authService: AuthService, private jwtService: JwtService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true; // Activar estado de carga
      
      // Deshabilitar controles del formulario
      this.form.get('email')?.disable();
      this.form.get('password')?.disable();
      
      this.authService.login(this.form.value).subscribe({
        next: (res: any) => {
          this.isLoading = false; // Desactivar estado de carga
          
          // Habilitar controles del formulario
          this.form.get('email')?.enable();
          this.form.get('password')?.enable();
          
          console.log('Respuesta del login:', res); // Para debug
          
          if (res && res.data && res.data.token) {
            this.jwtService.setToken(res.data.token);
              this.form.reset();
              this.router.navigate(['/']);
          } else {
            Swal.fire({
              position: 'top-end',
            title: 'Credenciales incorrectas',
            icon: 'error',
            showConfirmButton: false,
            timer: 3000,
            toast: true
            });
          }
        },
        error: (err: any) => {
          this.isLoading = false; // Desactivar estado de carga
          
          // Habilitar controles del formulario
          this.form.get('email')?.enable();
          this.form.get('password')?.enable();
          
          Swal.fire({
            position: 'top-end',
            title: 'Credenciales incorrectas',
            icon: 'error',
            showConfirmButton: false,
            timer: 3000,
            toast: true
          });
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
