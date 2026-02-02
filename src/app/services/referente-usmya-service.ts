import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ReferenteUsmya } from '../models/referente-usmya.model';
import { MOCK_REFERENTE_USMYA } from '../shared/mocks/mock-referente-usmya';

@Injectable({
  providedIn: 'root'
})
export class ReferenteUsmyaService {
  private referenteUsmyaData: ReferenteUsmya[] = [...MOCK_REFERENTE_USMYA];

  constructor() { }

  // Obtener todos los registros
  getAll(): Observable<ReferenteUsmya[]> {
    return of(this.referenteUsmyaData).pipe(delay(500)); // Simular delay de API
  }

  // Obtener por ID
  getById(id: number): Observable<ReferenteUsmya | undefined> {
    const item = this.referenteUsmyaData.find(r => r.id === id);
    return of(item).pipe(delay(300));
  }

  // Obtener por ID de referente
  getByIdReferente(idReferente: number): Observable<ReferenteUsmya[]> {
    const items = this.referenteUsmyaData.filter(r => r.idReferente === idReferente);
    return of(items).pipe(delay(300));
  }

  // Crear nuevo registro
  create(referenteUsmya: Omit<ReferenteUsmya, 'id'>): Observable<ReferenteUsmya> {
    const newId = Math.max(...this.referenteUsmyaData.map(r => r.id)) + 1;
    const newItem: ReferenteUsmya = { ...referenteUsmya, id: newId };
    this.referenteUsmyaData.push(newItem);
    return of(newItem).pipe(delay(500));
  }

  // Actualizar registro
  update(id: number, referenteUsmya: Partial<ReferenteUsmya>): Observable<ReferenteUsmya | null> {
    const index = this.referenteUsmyaData.findIndex(r => r.id === id);
    if (index !== -1) {
      this.referenteUsmyaData[index] = { ...this.referenteUsmyaData[index], ...referenteUsmya };
      return of(this.referenteUsmyaData[index]).pipe(delay(500));
    }
    return of(null).pipe(delay(300));
  }

  // Eliminar registro
  delete(id: number): Observable<boolean> {
    const index = this.referenteUsmyaData.findIndex(r => r.id === id);
    if (index !== -1) {
      this.referenteUsmyaData.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(300));
  }

  // Obtener por ID de efector
  getByIdEfector(idUsmya: number): Observable<ReferenteUsmya[]> {
    const items = this.referenteUsmyaData.filter(r => r.idUsmya === idUsmya);
    return of(items).pipe(delay(300));
  }
}