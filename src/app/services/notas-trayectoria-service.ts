import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { NotaTrayectoria } from '../models/nota-trayectoria.model';
import { MOCK_NOTAS_TRAYECTORIA } from '../shared/mocks/mock-notas-trayectoria';

@Injectable({
  providedIn: 'root'
})
export class NotasTrayectoriaService {

  constructor() { }

  // Get all notas de trayectoria
  getAll(): Observable<NotaTrayectoria[]> {
    return of(MOCK_NOTAS_TRAYECTORIA).pipe(delay(400));
  }

  // Get notas de trayectoria by USMYA id
  getNotasByIdUsmya(usmyaId: number): Observable<NotaTrayectoria[]> {
    const notas = MOCK_NOTAS_TRAYECTORIA.filter(nota => nota.idUsmya === usmyaId);
    return of(notas).pipe(delay(300));
  }

  // Get notas de trayectoria by Actor id (efector o referente)
  getNotasByIdActor(actorId: number): Observable<NotaTrayectoria[]> {
    const notas = MOCK_NOTAS_TRAYECTORIA.filter(nota => nota.idActor === actorId);
    return of(notas).pipe(delay(300));
  }

  // Get nota de trayectoria by ID
  getById(id: number): Observable<NotaTrayectoria | null> {
    const nota = MOCK_NOTAS_TRAYECTORIA.find(nota => nota.id === id);
    return of(nota || null).pipe(delay(200));
  }

  // Create new nota de trayectoria
  create(nota: Omit<NotaTrayectoria, 'id'>): Observable<NotaTrayectoria> {
    const newId = Math.max(...MOCK_NOTAS_TRAYECTORIA.map(n => n.id)) + 1;
    const newNota: NotaTrayectoria = {
      id: newId,
      ...nota
    };
    MOCK_NOTAS_TRAYECTORIA.push(newNota);
    return of(newNota).pipe(delay(500));
  }

  // Update existing nota de trayectoria
  update(id: number, updates: Partial<NotaTrayectoria>): Observable<NotaTrayectoria | null> {
    const index = MOCK_NOTAS_TRAYECTORIA.findIndex(nota => nota.id === id);
    if (index !== -1) {
      MOCK_NOTAS_TRAYECTORIA[index] = { ...MOCK_NOTAS_TRAYECTORIA[index], ...updates };
      return of(MOCK_NOTAS_TRAYECTORIA[index]).pipe(delay(400));
    }
    return of(null).pipe(delay(200));
  }

  // Delete nota de trayectoria
  delete(id: number): Observable<boolean> {
    const index = MOCK_NOTAS_TRAYECTORIA.findIndex(nota => nota.id === id);
    if (index !== -1) {
      MOCK_NOTAS_TRAYECTORIA.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(200));
  }

  // Get notas de trayectoria by date range
  getNotasByDateRange(usmyaId: number, startDate: string, endDate: string): Observable<NotaTrayectoria[]> {
    const notas = MOCK_NOTAS_TRAYECTORIA.filter(nota =>
      nota.idUsmya === usmyaId &&
      nota.fecha >= startDate &&
      nota.fecha <= endDate
    );
    return of(notas).pipe(delay(350));
  }

  // Get recent notas (últimas N notas de un USMYA)
  getRecentNotas(usmyaId: number, limit: number = 5): Observable<NotaTrayectoria[]> {
    const notas = MOCK_NOTAS_TRAYECTORIA
      .filter(nota => nota.idUsmya === usmyaId)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, limit);
    return of(notas).pipe(delay(250));
  }
}