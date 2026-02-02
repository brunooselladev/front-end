import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Asistencia } from '../../models/asistencia.model';
import { Usuario } from '../../models/usuario.interface';
import { UsuarioService } from '../../services/usuario-service';
import { AsistenciaService } from '../../services/asistencia-service';
import { JwtService } from '../../services/jwt-service';

@Component({
  selector: 'app-participant-details-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './participant-details-modal.html',
  styleUrl: './participant-details-modal.scss'
})
export class ParticipantDetailsModal implements OnInit, OnChanges {
  @Input() asistencia!: Asistencia;
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() asistenciaUpdated = new EventEmitter<Asistencia>();

  participantForm!: FormGroup;
  usuario$!: Observable<Usuario | null>;
  isSubmitting = false;
  isEfector = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private asistenciaService: AsistenciaService,
    private jwtService: JwtService
  ) {}

  ngOnInit() {
    this.initForm();
    this.isEfector = this.jwtService.getRole() === 'efector';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['asistencia'] && this.asistencia) {
      this.loadParticipantData();
      this.updateForm();
    }
  }

  private initForm() {
    this.participantForm = this.fb.group({
      estado: ['presente', Validators.required],
      observacion: ['']
    });
  }

  private loadParticipantData() {
    if (this.asistencia) {
      this.usuario$ = this.usuarioService.getUserById(this.asistencia.idUser);
    }
  }

  private updateForm() {
    if (this.participantForm && this.asistencia) {
      this.participantForm.patchValue({
        estado: this.asistencia.estado,
        observacion: this.asistencia.observacion || ''
      });
    }
  }

  onSubmit() {
    if (this.participantForm.valid && this.asistencia) {
      this.isSubmitting = true;

      const updatedAsistencia: Asistencia = {
        ...this.asistencia,
        estado: this.participantForm.value.estado,
        observacion: this.participantForm.value.observacion
      };

      // Aquí iría la llamada al servicio para actualizar
      // Por ahora emitimos el evento
      this.asistenciaUpdated.emit(updatedAsistencia);
      this.isSubmitting = false;
      this.close();
    }
  }

  onRequestTreatmentTeam() {
    // Lógica para solicitar ser equipo tratante
    console.log('Solicitando ser equipo tratante para el participante:', this.asistencia.idUser);
    // Aquí iría la implementación real
  }

  close() {
    this.isOpen = false;
    this.closeEvent.emit();
  }
}
