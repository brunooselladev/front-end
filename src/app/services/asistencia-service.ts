import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Asistencia } from '../models/asistencia.model';
import { MOCK_ASISTENCIAS } from '../shared/mocks/mock-asistencias';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  constructor() { }

  // CRUD Operations

  /**
   * Obtener todas las asistencias
   */
  getAllAsistencias(): Observable<Asistencia[]> {
    return of(MOCK_ASISTENCIAS);
  }

  /**
   * Obtener asistencia por ID
   */
  getAsistenciaById(id: number): Observable<Asistencia | undefined> {
    const asistencia = MOCK_ASISTENCIAS.find(a => a.id === id);
    return of(asistencia);
  }

  /**
   * Obtener asistencias por actividad
   */
  getAsistenciasByActividadId(actividadId: number): Observable<Asistencia[]> {
    const asistencias = MOCK_ASISTENCIAS.filter(a => a.idActividad === actividadId);
    return of(asistencias);
  }

  /**
   * Crear nueva asistencia
   */
  createAsistencia(asistencia: Omit<Asistencia, 'id'>): Observable<Asistencia> {
    const newId = Math.max(...MOCK_ASISTENCIAS.map(a => a.id)) + 1;
    const newAsistencia: Asistencia = {
      id: newId,
      ...asistencia
    };
    MOCK_ASISTENCIAS.push(newAsistencia);
    return of(newAsistencia);
  }

  /**
   * Actualizar asistencia existente
   */
  updateAsistencia(id: number, asistencia: Partial<Asistencia>): Observable<Asistencia | null> {
    const index = MOCK_ASISTENCIAS.findIndex(a => a.id === id);
    if (index !== -1) {
      MOCK_ASISTENCIAS[index] = { ...MOCK_ASISTENCIAS[index], ...asistencia };
      return of(MOCK_ASISTENCIAS[index]);
    }
    return of(null);
  }

  /**
   * Obtener asistencias por USMYA
   */
  getAsistenciasByUsmyaId(usmyaId: number): Observable<Asistencia[]> {
    const asistencias = MOCK_ASISTENCIAS.filter(a => a.idUser === usmyaId);
    return of(asistencias);
  }

  // Business Logic Methods

  /**
   * Obtener asistencias por actividad
   */
  getAsistenciasByActividad(idActividad: number): Observable<Asistencia[]> {
    const asistencias = MOCK_ASISTENCIAS.filter(a => a.idActividad === idActividad);
    return of(asistencias);
  }

  /**
   * Obtener asistencias por usuario USMYA
   */
  getAsistenciasByUser(idUser: number): Observable<Asistencia[]> {
    const asistencias = MOCK_ASISTENCIAS.filter(a => a.idUser === idUser);
    return of(asistencias);
  }

  /**
   * Obtener asistencias por estado
   */
  getAsistenciasByEstado(estado: 'presente' | 'ausente'): Observable<Asistencia[]> {
    const asistencias = MOCK_ASISTENCIAS.filter(a => a.estado === estado);
    return of(asistencias);
  }

  /**
   * Marcar asistencia como presente
   */
  marcarPresente(id: number, observacion?: string): Observable<Asistencia | null> {
    return this.updateAsistencia(id, {
      estado: 'presente',
      observacion: observacion || 'Asistencia confirmada'
    });
  }

  /**
   * Marcar asistencia como ausente
   */
  marcarAusente(id: number, observacion?: string): Observable<Asistencia | null> {
    return this.updateAsistencia(id, {
      estado: 'ausente',
      observacion: observacion || 'Ausencia registrada'
    });
  }

  /**
   * Obtener estadísticas de asistencia por actividad
   */
  getEstadisticasByActividad(idActividad: number): Observable<{
    total: number;
    presentes: number;
    ausentes: number;
    porcentajeAsistencia: number;
  }> {
    const asistencias = MOCK_ASISTENCIAS.filter(a => a.idActividad === idActividad);
    const total = asistencias.length;
    const presentes = asistencias.filter(a => a.estado === 'presente').length;
    const ausentes = total - presentes;
    const porcentajeAsistencia = total > 0 ? (presentes / total) * 100 : 0;

    return of({
      total,
      presentes,
      ausentes,
      porcentajeAsistencia
    });
  }

  /**
   * Verificar si un usuario asistió a una actividad específica
   */
  verificarAsistencia(idActividad: number, idUser: number): Observable<Asistencia | null> {
    const asistencia = MOCK_ASISTENCIAS.find(a =>
      a.idActividad === idActividad && a.idUser === idUser
    );
    return of(asistencia || null);
  }

  /**
   * Registrar asistencia múltiple para una actividad
   */
  registrarAsistenciasMasivo(idActividad: number, asistencias: { idUser: number; estado: 'presente' | 'ausente'; observacion?: string }[]): Observable<Asistencia[]> {
    const nuevasAsistencias: Asistencia[] = [];

    asistencias.forEach(({ idUser, estado, observacion }) => {
      // Verificar si ya existe una asistencia para este usuario en esta actividad
      const existente = MOCK_ASISTENCIAS.find(a => a.idActividad === idActividad && a.idUser === idUser);

      if (existente) {
        // Actualizar existente
        this.updateAsistencia(existente.id, { estado, observacion });
        nuevasAsistencias.push({ ...existente, estado, observacion: observacion || '' });
      } else {
        // Crear nueva
        this.createAsistencia({
          idActividad,
          idUser,
          estado,
          observacion: observacion || ''
        }).subscribe(asistencia => {
          nuevasAsistencias.push(asistencia);
        });
      }
    });

    return of(nuevasAsistencias);
  }
}