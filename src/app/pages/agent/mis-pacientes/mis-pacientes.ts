import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../layouts/navbar";
import { SidebarComponent } from '../../../layouts/sidebar';
import { CardParticipant } from '../../../components/card-participant/card-participant';
import { AsistenciaService } from '../../../services/asistencia-service';
import { Asistencia } from '../../../models/asistencia.model';

@Component({
  selector: 'app-mis-pacientes',
  imports: [NavbarComponent, SidebarComponent, CardParticipant, CommonModule],
  templateUrl: './mis-pacientes.html',
  styleUrl: './mis-pacientes.scss',
})
export class MisPacientes {

  
  participants: Asistencia[]= [];

  constructor(private asistenciaService: AsistenciaService) {
    this.asistenciaService.getAllAsistencias().subscribe(asistencias => {
      this.participants = asistencias;
    });
  }
}
