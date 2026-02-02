import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputSummary, SummaryData } from '../../../../components/input-summary/input-summary';
import { ButtonComponent } from "../../../../components/button/button.component";
import { TagsService } from '../../../../services/tags-service';
import { Tag } from '../../../../shared/mocks/mock-tags';
import { CommonModule } from '@angular/common';
import { LoadingOverlayComponent } from '../../../../components/loading-overlay/loading-overlay';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-summary',
  imports: [ReactiveFormsModule, InputSummary, ButtonComponent, CommonModule, LoadingOverlayComponent],
  templateUrl: './form-summary.html',
  styleUrl: './form-summary.scss'
})
export class FormSummary implements OnInit {
  @Input() isAgentRegistration: boolean = false;
  @Input() isUsmya: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();

  // FormControls para cada sección
  necesidadesControl = new FormControl<SummaryData>({
    text: '',
    selectedOptions: []
  });
  deseosControl = new FormControl<SummaryData>({
    text: '',
    selectedOptions: []
  });
  demandasControl = new FormControl<SummaryData>({
    text: '',
    selectedOptions: []
  });
  interesesControl = new FormControl<SummaryData>({
    text: '',
    selectedOptions: []
  });

  // Opciones dinámicas para cada sección (se cargan desde el servicio)
  necesidadesOptions: { label: string; value: string }[] = [];
  deseosOptions: { label: string; value: string }[] = [];
  demandasOptions: { label: string; value: string }[] = [];
  interesesOptions: { label: string; value: string }[] = [];

  // Estado de carga
  isLoadingTags = true;
  loadingError: string | null = null;

  constructor(private tagsService: TagsService) {
    // Suscribirse a cambios en los formularios
    this.necesidadesControl.valueChanges.subscribe(value => {
      console.log('Necesidades actualizadas:', value);
    });

    this.deseosControl.valueChanges.subscribe(value => {
      console.log('Deseos actualizados:', value);
    });

    this.demandasControl.valueChanges.subscribe(value => {
      console.log('Demandas actualizadas:', value);
    });

    this.interesesControl.valueChanges.subscribe(value => {
      console.log('Intereses actualizados:', value);
    });
  }

  ngOnInit(): void {
    // Establecer valores iniciales condicionalmente basado en isAgentRegistration
    const defaultTextNecesidades = this.isAgentRegistration ? '' : '-RETOMAR TRATAMIENTO DE TUBERCULOSIS -OCUPAR EL TIEMPO-OCUPAR EL TIEMPO-HACER DEPORTE-REGULAR EL SUEÑO-COMER BIEN-TOMAR AGUA';
    const defaultTextDeseos = this.isAgentRegistration ? '' : '-DEJAR DE CONSUMIR -JUGAR AL FÚTBOL -ESTAR FACHERO -CONSUMIR';
    const defaultTextDemandas = this.isAgentRegistration ? '' : 'ATENDERSE UNA HERNIA DE INGLE QUE TIENE HACE MUCHOS AÑOS (ÚLTIMA VEZ, SE ATENDIÓ EN EL CAPS)';
    const defaultTextIntereses = this.isAgentRegistration ? '' : 'LEER LA BIBLIA - ESTAR CON OTRAS PERSONAS QUE ME TRATEN BIEN';

    this.necesidadesControl.setValue({
      text: defaultTextNecesidades,
      selectedOptions: []
    });

    this.deseosControl.setValue({
      text: defaultTextDeseos,
      selectedOptions: []
    });

    this.demandasControl.setValue({
      text: defaultTextDemandas,
      selectedOptions: []
    });

    this.interesesControl.setValue({
      text: defaultTextIntereses,
      selectedOptions: []
    });

    this.loadTags();
  }

  /**
   * Carga las etiquetas desde el servicio
   */
  loadTags(): void {
    this.isLoadingTags = true;
    this.loadingError = null;

    // Cargar todas las etiquetas disponibles (son generales para todas las secciones)
    this.tagsService.getAllTags()
      .subscribe({
        next: (tags) => {
          // Convertir las etiquetas al formato esperado por el componente
          const tagOptions = tags.map(tag => ({
            label: tag.nombre,
            value: tag.id.toString()
          }));

          // Todas las secciones usan las mismas etiquetas generales
          this.necesidadesOptions = [...tagOptions];
          this.deseosOptions = [...tagOptions];
          this.demandasOptions = [...tagOptions];
          this.interesesOptions = [...tagOptions];

          this.isLoadingTags = false;
          console.log('Etiquetas generales cargadas exitosamente');
        },
        error: (error) => {
          console.error('Error al cargar etiquetas:', error);
          this.loadingError = 'Error al cargar las etiquetas. Intente nuevamente.';
          this.isLoadingTags = false;
        }
      });
  }

  onSaveSummary(): void {
    const summaryData = {
      necesidades: this.necesidadesControl.value,
      deseos: this.deseosControl.value,
      demandas: this.demandasControl.value,
      intereses: this.interesesControl.value
    };

    console.log('Guardando resumen completo:', summaryData);
    // Aquí iría la llamada al servicio para guardar el resumen
    // this.userService.updateSummary(summaryData).subscribe(...)
  }

  onSave(): void {
    Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Resumen actilizado',
            showConfirmButton: false,
            timer: 3000,
            toast: true
          });
  }

  onCancel(): void {
    if (this.isAgentRegistration) {
      this.onPrevious();
    } else {
      this.cancel.emit();
    }
  }

  onNext(): void {
    const summaryData = {
      necesidades: this.necesidadesControl.value,
      deseos: this.deseosControl.value,
      demandas: this.demandasControl.value,
      intereses: this.interesesControl.value
    };
    this.next.emit(summaryData);
  }

  onPrevious(): void {
    this.previous.emit();
  }
}
