import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EfectorUsmya } from '../models/efector-usmya.model';
import { MOCK_EFECTOR_USMYA } from '../shared/mocks/mock-efector-usmya';
import { MOCK_USERS } from '../shared/mocks/mock-users';
import { Usuario } from '../models/usuario.interface';
import { Usmya } from '../models/usmya.model';

@Injectable({
  providedIn: 'root'
})
export class EfectorUsmyaService {

  constructor() { }

  // Get all EfectorUsmya relationships
  getAll(): Observable<EfectorUsmya[]> {
    return of(MOCK_EFECTOR_USMYA);
  }

  // Get EfectorUsmya by USMYA id
  getByUsmyaId(usmyaId: number): Observable<EfectorUsmya[]> {
    const relationships = MOCK_EFECTOR_USMYA.filter(relation => relation.idUsmya === usmyaId);
    return of(relationships);
  }

  // Get EfectorUsmya by Efector id
  getByEfectorId(efectorId: number): Observable<EfectorUsmya[]> {
    const relationships = MOCK_EFECTOR_USMYA.filter(relation => relation.idEfector === efectorId);
    return of(relationships);
  }

  // Get USMYA users related to an Efector (with full Usmya data)
  getUsmyaUsersByEfectorId(efectorId: number): Observable<Usmya[]> {
    const relationships = MOCK_EFECTOR_USMYA.filter(relation => relation.idEfector === efectorId);
    const usmyaIds = relationships.map(relation => relation.idUsmya);
    const usmyaUsers = MOCK_USERS.filter(user => usmyaIds.includes(user.id) && user.role === 'usmya');

    // Convert Usuario objects to Usmya objects
    const usmyaData: Usmya[] = usmyaUsers.map(user => ({
      id: user.id,
      nombre: user.nombre,
      dni: user.dni || 0,
      fechaNacimiento: user.fechaNacimiento || '',
      telefono: user.telefono || '',
      direccionResidencia: user.direccionResidencia || undefined,
      alias: user.alias || undefined,
      generoAutoPercibido: user.generoAutoPercibido || undefined,
      estadoCivil: user.estadoCivil || undefined,
      obraSocial: user.obraSocial || undefined,
      geolocalizacion: user.geolocalizacion || undefined,
      password: user.password || undefined,
      creadoPor: user.creadoPor || undefined,
      requiereAprobacion: user.requiereAprobacion || undefined,
      email: user.email || undefined
    }));

    return of(usmyaData);
  }

  // Create new EfectorUsmya relationship
  create(efectorUsmya: Omit<EfectorUsmya, 'id'>): Observable<EfectorUsmya> {
    const newId = Math.max(...MOCK_EFECTOR_USMYA.map(item => item.id)) + 1;
    const newRelationship: EfectorUsmya = {
      id: newId,
      ...efectorUsmya
    };

    // Simulate adding to mock data
    MOCK_EFECTOR_USMYA.push(newRelationship);
    return of(newRelationship);
  }

  // Delete EfectorUsmya relationship
  delete(id: number): Observable<boolean> {
    const index = MOCK_EFECTOR_USMYA.findIndex(relation => relation.id === id);
    if (index !== -1) {
      MOCK_EFECTOR_USMYA.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  // Delete by Efector and USMYA ids
  deleteByIds(efectorId: number, usmyaId: number): Observable<boolean> {
    const index = MOCK_EFECTOR_USMYA.findIndex(relation =>
      relation.idEfector === efectorId && relation.idUsmya === usmyaId
    );
    if (index !== -1) {
      MOCK_EFECTOR_USMYA.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
