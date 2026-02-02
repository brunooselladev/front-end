import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from "../../../layouts/navbar";
import { SidebarComponent } from "../../../layouts/sidebar";
import { NotificationTabsComponent } from "../../../components/notification-tabs/notification-tabs.component";
import { FormPersonalData } from "./form-personal-data/form-personal-data";
import { FormSummary } from "./form-summary/form-summary";
import { Usmya } from "../../../models/usmya.model";

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    SidebarComponent,
    NotificationTabsComponent,
    FormPersonalData,
    FormSummary
  ],
  templateUrl: './my-profile.html',
  styleUrls: ['./my-profile.scss']
})
export class MyProfile implements OnInit {
  userData?: Partial<Usmya>;

  // Configuración de tabs
  activeTab = 'datos';
  tabs = [
    { label: 'Datos Personales', icon: '', value: 'datos' },
    { label: 'Resumen', icon: '', value: 'resumen' }
  ];

  ngOnInit(): void {
    // Cargar datos del usuario desde un servicio
    this.loadUserData();
  }

  loadUserData(): void {
    // Datos de ejemplo - reemplazar con llamada al servicio
    this.userData = {
      nombre: 'Hector',
      dni: 12345678,
      fechaNacimiento: '1995-01-15',
      telefono: '+54 11 1234-5678',
      direccionResidencia: 'Calle Ejemplo 123, Buenos Aires',
      alias: 'Hector',
      generoAutoPercibido: 'masculino',
      estadoCivil: 'soltero',
      obraSocial: 'OSDE'
    };
  }

  onTabChange(tabValue: string): void {
    this.activeTab = tabValue;
  }

  onSaveProfile(formData: Partial<Usmya>): void {
    console.log('Datos del formulario:', formData);
    // Aquí iría la llamada al servicio para guardar los datos
    // this.userService.updateUser(formData).subscribe(...)
  }

  onCancelEdit(): void {
    // Recargar datos originales si es necesario
    this.loadUserData();
  }
}

