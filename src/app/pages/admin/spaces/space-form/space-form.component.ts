import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Espacio } from '../../../../models/espacio.model';
import { EspacioService } from '../../../../services/espacio-service';
import { ButtonComponent } from '../../../../components/button/button.component';
import { InputComponent } from '../../../../components/input/input.component';
import { Select } from '../../../../components/select/select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-space-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    Select
  ],
  templateUrl: './space-form.component.html'
})
export class SpaceFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() espacio?: Espacio;
  @Input() isReadOnly = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<Espacio>();

  form!: FormGroup;
  isLoading = false;
  errorMessage = '';
  isDropdownOpen = false;

  tiposOrganizacion = [
    { value: 'estatal', label: 'Estatal' },
    { value: 'comunitario', label: 'Comunitario' },
    { value: 'educacion', label: 'Educación' },
    { value: 'merendero', label: 'Merendero' },
    { value: 'comedor', label: 'Comedor' },
    { value: 'deportiva', label: 'Deportiva' },
    { value: 'religiosa', label: 'Religiosa' },
    { value: 'centro vecinal', label: 'Centro Vecinal' },
    { value: 'otros', label: 'Otros' }
  ];

  poblacionVinculadaOptions = [
    { value: 'niños', label: 'Niños' },
    { value: 'adolescentes', label: 'Adolescentes' },
    { value: 'jovenes', label: 'Jóvenes' },
    { value: 'adultos', label: 'Adultos' },
    { value: 'mayores', label: 'Mayores' },
    { value: 'familias', label: 'Familias' }
  ];

  constructor(
    private fb: FormBuilder,
    private espacioService: EspacioService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.espacio) {
      this.loadEspacioData();
    }
    if (this.isReadOnly) {
      this.form.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isReadOnly'] && this.form) {
      if (this.isReadOnly) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      tipoOrganizacion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      direccion: [''],
      barrio: [''],
      encargado: [''],
      poblacionVinculada: [[]],
      diasHorarios: [''],
      actividadesPrincipales: [''],
      actividadesSecundarias: [''],
      coordenadas: this.fb.group({
        lat: [''],
        lng: ['']
      })
    });
  }

  getTipoOrganizacionLabel(value: string | undefined): string {
    if (!value) return '';
    const option = this.tiposOrganizacion.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  getPoblacionLabel(value: string): string {
    const option = this.poblacionVinculadaOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  get isSaveDisabled(): boolean {
    const nombre = this.form.get('nombre');
    const tipoOrganizacion = this.form.get('tipoOrganizacion');
    const telefono = this.form.get('telefono');

    return !(
      nombre?.valid &&
      tipoOrganizacion?.valid &&
      telefono?.valid
    );
  }

  private loadEspacioData(): void {
    if (this.espacio) {
      this.form.patchValue({
        nombre: this.espacio.nombre,
        tipoOrganizacion: this.espacio.tipoOrganizacion,
        telefono: this.espacio.telefono,
        direccion: this.espacio.direccion,
        barrio: this.espacio.barrio,
        encargado: this.espacio.encargado,
        poblacionVinculada: this.espacio.poblacionVinculada || [],
        diasHorarios: this.espacio.diasHorarios,
        actividadesPrincipales: this.espacio.actividadesPrincipales,
        actividadesSecundarias: this.espacio.actividadesSecundarias,
        coordenadas: {
          lat: this.espacio.coordenadas?.lat || '',
          lng: this.espacio.coordenadas?.lng || ''
        }
      });
    }
  }

  onSubmit(): void {
    if (this.isReadOnly) {
      return; // No hacer nada en modo read-only
    }

    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const espacioData: Espacio = {
        ...formValue,
        id: this.espacio?.id,
        coordenadas: {
          lat: parseFloat(formValue.coordenadas.lat) || 0,
          lng: parseFloat(formValue.coordenadas.lng) || 0
        }
      };

      const operation = this.espacio && this.espacio.id
        ? this.espacioService.updateEspacio(this.espacio.id, espacioData)
        : this.espacioService.createEspacio(espacioData);

      operation.subscribe({
        next: (result) => {
          this.isLoading = false;
          if (result) {
            this.guardado.emit(result);
            this.cerrar.emit();
            
            // Mostrar toast solo cuando se crea un espacio nuevo (no cuando se actualiza)
            if (!this.espacio?.id) {
              Swal.fire({
                position: 'top-end',
                title: 'Espacio creado correctamente',
                icon: 'success',
                showConfirmButton: false,
                timer: 3000,
                toast: true
              });
            }
          } else {
            this.errorMessage = 'Error al guardar el espacio.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error al guardar el espacio. Intente nuevamente.';
          console.error('Error saving espacio:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.cerrar.emit();
  }

  // Multi-select methods
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  isPoblacionSelected(value: string): boolean {
    const poblacion = this.form.get('poblacionVinculada')?.value || [];
    return poblacion.includes(value);
  }

  togglePoblacion(value: string): void {
    const poblacion = this.form.get('poblacionVinculada')?.value || [];
    const index = poblacion.indexOf(value);

    if (index > -1) {
      poblacion.splice(index, 1);
    } else {
      poblacion.push(value);
    }

    this.form.get('poblacionVinculada')?.setValue([...poblacion]);
  }

  removePoblacion(value: string): void {
    const poblacion = this.form.get('poblacionVinculada')?.value || [];
    const filtered = poblacion.filter((item: string) => item !== value);
    this.form.get('poblacionVinculada')?.setValue(filtered);
  }

  getOptionLabel(value: string): string {
    const option = this.poblacionVinculadaOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  getFormattedPoblacionVinculada(): string {
    const poblacion = this.form.get('poblacionVinculada')?.value || [];
    if (!poblacion || poblacion.length === 0) {
      return 'No especificado';
    }
    return poblacion.map((value: string) => this.getOptionLabel(value)).join(', ');
  }
}
