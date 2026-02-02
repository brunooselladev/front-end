import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from "../../../../components/input/input.component";
import { Select } from "../../../../components/select/select";
import { ButtonComponent } from "../../../../components/button/button.component";
import { Usmya } from "../../../../models/usmya.model";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-personal-data',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    Select,
    ButtonComponent
  ],
  templateUrl: './form-personal-data.html',
  styleUrls: ['./form-personal-data.scss']
})
export class FormPersonalData implements OnInit, OnChanges {
  @Input() userData?: Partial<Usmya>;
  @Input() readonly: boolean = false;
  @Input() isAgentRegistration: boolean = false;
  @Input() isAgentEdit: boolean = false;
  @Output() save = new EventEmitter<Partial<Usmya>>();
  @Output() cancel = new EventEmitter<void>();
  @Output() next = new EventEmitter<Partial<Usmya>>();

  profileForm!: FormGroup;

  // Opciones para los selects
  generoOptions = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Femenino', value: 'femenino' },
    { label: 'No binario', value: 'no-binario' },
    { label: 'Prefiero no decirlo', value: 'otro' }
  ];

  estadoCivilOptions = [
    { label: 'Soltero/a', value: 'soltero' },
    { label: 'Casado/a', value: 'casado' },
    { label: 'Divorciado/a', value: 'divorciado' },
    { label: 'Viudo/a', value: 'viudo' },
    { label: 'Unión convivencial', value: 'union-convivencial' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    if (this.userData) {
      this.loadUserData(this.userData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && this.profileForm && this.userData) {
      this.loadUserData(this.userData);
    }
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-()]+$/)]],
      direccionResidencia: [''],
      alias: [''],
      generoAutoPercibido: [''],
      estadoCivil: [''],
      obraSocial: ['']
    });
  }

  loadUserData(data: Partial<Usmya>): void {
    if (!this.profileForm) return;
    this.profileForm.patchValue({
      nombre: data.nombre || '',
      dni: data.dni || '',
      fechaNacimiento: data.fechaNacimiento || '',
      telefono: data.telefono || '',
      direccionResidencia: data.direccionResidencia || '',
      alias: data.alias || '',
      generoAutoPercibido: data.generoAutoPercibido || '',
      estadoCivil: data.estadoCivil || '',
      obraSocial: data.obraSocial || ''
    });
  }

  onSave(): void {
    if (this.profileForm.valid) {
      this.save.emit(this.profileForm.value);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }

  onNext(): void {
    if (this.profileForm.valid) {
      this.next.emit(this.profileForm.value);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSaveAgentEdit(): void {
    if (this.profileForm.valid) {
      // Mostrar SweetAlert de éxito
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Datos personales guardados',
        showConfirmButton: false,
        timer: 3000,
        toast: true
      });

      console.log('Datos personales guardados:', this.profileForm.value);
      this.save.emit(this.profileForm.value);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }
}
