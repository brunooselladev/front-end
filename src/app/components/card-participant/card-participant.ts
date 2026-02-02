import { Component, Input, OnInit, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Asistencia } from '../../models/asistencia.model';
import { Usuario } from '../../models/usuario.interface';
import { UsuarioService } from '../../services/usuario-service';
import { JwtService } from '../../services/jwt-service';

@Component({
  selector: 'app-card-participant',
  imports: [CommonModule],
  templateUrl: './card-participant.html',
  styleUrl: './card-participant.scss'
})
export class CardParticipant implements OnInit {
  @Input() asistencia!: Asistencia;
  @Output() openDetailsModal = new EventEmitter<Asistencia>();

  usuario$!: Observable<Usuario | null>;
  isMenuOpen = false;

  constructor(
    private usuarioService: UsuarioService,
    private elementRef: ElementRef,
    private router: Router,
    private jwtService: JwtService
  ) {}

  ngOnInit() {
    if (this.asistencia) {
      this.usuario$ = this.usuarioService.getUserById(this.asistencia.idUser);
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  onViewDetails() {
    this.openDetailsModal.emit(this.asistencia);
    this.closeMenu();
  }

  onViewProfile() {
    const userRole = this.jwtService.getRole();
    const basePath = userRole === 'efector'
      ? '/efector/asistencia/ver-ficha'
      : '/agente/asistencia/ver-ficha';
    
    this.router.navigate([basePath, this.asistencia.idUser]);
    this.closeMenu();
  }

}
