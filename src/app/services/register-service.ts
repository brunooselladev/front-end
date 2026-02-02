import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Efector } from '../models/efector.model';
import { Agente } from '../models/agente.model';
import { Referente } from '../models/referente.model';
import { Usmya } from '../models/usmya.model';
import { Espacio } from '../models/espacio.model';
import { ReferenteUsmya } from '../models/efector-usmya.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  // Mock users data
  private mockUsers = {
    efector: {
      id: 1,
      nombre: 'Dr. Juan Pérez',
      email: 'juan.perez@hospital.com',
      telefono: '123456789',
      espacio: 'Hospital Central',
      tipoProfesional: 'Médico',
      password: 'password123',
      esETratante: true
    },
    agente: {
      id: 2,
      nombre: 'María González',
      email: 'maria.gonzalez@comunidad.com',
      telefono: '987654321',
      espacio: 'Centro Comunitario Norte',
      password: 'password456',
      esETratante: false
    },
    referente: {
      id: 3,
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@referente.com',
      telefono: '555666777',
      espacio: 'Referente Afectivo',
      password: 'password789',
      esETratante: false
    },
    usmya: {
      id: 4,
      nombre: 'Ana López',
      email: 'ana.lopez@usmya.com',
      telefono: '111222333',
      espacio: 'USMyA Centro',
      password: 'passwordABC',
      esETratante: false
    },
    espacio: {
      id: 1,
      nombre: 'Centro Comunitario Norte',
      telefono: '3515551001',
      tipoOrganizacion: 'comunitario',
      direccion: 'Av. Colon 1234',
      barrio: 'Centro',
      encargado: 'Pedro Ramirez',
      poblacionVinculada: ['niños', 'adolescentes', 'familias'],
      diasHorarios: 'Lunes a Viernes 9:00-18:00',
      actividadesPrincipales: 'Talleres de arte, apoyo escolar, actividades recreativas',
      actividadesSecundarias: 'Asesoramiento psicológico, distribución de alimentos'
    }
  };

  postEfector(efector: Efector): Observable<any> {
    // Mock response - return mock efector data
    return of({
      success: true,
      message: 'Efector registrado exitosamente',
      data: this.mockUsers.efector
    }).pipe(delay(1500)); // Simular demora de 1.5 segundos
    // return this.http.post('https://localhost:7030/api/Users/register/efector', efector);
  }

  postAgente(agente: Agente): Observable<any> {
    // Mock response - return mock agente data
    return of({
      success: true,
      message: 'Agente registrado exitosamente',
      data: this.mockUsers.agente
    }).pipe(delay(1200)); // Simular demora de 1.2 segundos
    // return this.http.post('https://localhost:7030/api/Users/register/agente', agente);
  }

  postReferente(referente: Referente): Observable<any> {
    // Mock response - return mock referente data
    return of({
      success: true,
      message: 'Referente registrado exitosamente',
      data: this.mockUsers.referente
    }).pipe(delay(1800)); // Simular demora de 1.8 segundos
    // return this.http.post('https://localhost:7030/api/Users/register/referente', referente);
  }

  postUsmya(usmya: Usmya): Observable<any> {
    // Mock response - return mock usmya data
    return of({
      success: true,
      message: 'USMyA registrado exitosamente',
      data: this.mockUsers.usmya
    }).pipe(delay(1000)); // Simular demora de 1 segundo
    // return this.http.post('https://localhost:7030/api/Users/register/usmya', usmya);
  }

  postEfectorUsmya(referenteUsmya: ReferenteUsmya): Observable<any> {
    // Mock response - return mock efector and usmya data
    return of({
      success: true,
      message: 'Efector y USMyA registrados exitosamente',
      data: {
        referente: {
          id: 1,
          ...referenteUsmya.referente
        },
        usmya: {
          id: 1,
          ...referenteUsmya.usmya
        }
      }
    }).pipe(delay(2000)); // Simular demora de 2 segundos
    // return this.http.post('https://localhost:7030/api/Users/register/efector-usmya', efectorUsmya);
  }

  registerEspacio(espacio: Espacio): Observable<any> {
    // Mock response - return mock espacio data
    return of({
      success: true,
      message: 'Espacio registrado exitosamente',
      data: {
        id: Math.floor(Math.random() * 1000) + 1,
        ...espacio
      }
    }).pipe(delay(1500)); // Simular demora de 1.5 segundos
    // return this.http.post('https://localhost:7030/api/Espacios/register', espacio);
  }

  registerEspacioInMongo(espacio: Espacio): Observable<any> {
    const payload = {
      nombre: espacio.nombre,
      telefono: espacio.telefono,
      tipoOrganizacion: Array.isArray(espacio.tipoOrganizacion) ? espacio.tipoOrganizacion[0] : espacio.tipoOrganizacion,
      direccion: espacio.direccion,
      barrio: espacio.barrio,
      encargado: espacio.encargado,
      poblacionVinculada: espacio.poblacionVinculada,
      diasHorarios: espacio.diasHorarios,
      actividadEspacio: espacio.actividadEspacio,
      coordenadas: espacio.coordenadas,
      cuentaConInternet: espacio.cuentaConInternet,
      cuentaConDispositivo: espacio.cuentaConDispositivo
    };
    return this.http.post('/api/instituciones', payload);
  }
}
