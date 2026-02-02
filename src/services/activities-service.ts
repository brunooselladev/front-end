import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Actividad } from '../models/actividad.model';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private http: HttpClient) { }

  getAllActivities(): Observable<Actividad[]> {
    // TODO: Implementar llamada real a la API
    // return this.http.get<Actividad[]>('/api/actividades');

    // Datos de ejemplo por ahora
    const mockActivities: Actividad[] = [
      {
        id: 1,
        nombre: 'Taller de Arte',
        descripcion: 'Taller creativo para niños',
        tipo: 'Educativo',
        fechaInicio: new Date('2024-01-15'),
        fechaFin: new Date('2024-12-15'),
        estado: 'activa',
        espacioId: 1,
        espacioNombre: 'Centro Comunitario Norte'
      },
      {
        id: 2,
        nombre: 'Clases de Música',
        descripcion: 'Aprendizaje de instrumentos musicales',
        tipo: 'Cultural',
        fechaInicio: new Date('2024-02-01'),
        estado: 'activa',
        espacioId: 2,
        espacioNombre: 'Escuela Municipal'
      }
    ];

    return of(mockActivities);
  }

  createActivity(actividad: Omit<Actividad, 'id'>): Observable<Actividad> {
    // TODO: Implementar llamada real a la API
    // return this.http.post<Actividad>('/api/actividades', actividad);

    const newActivity: Actividad = {
      ...actividad,
      id: Date.now() // ID temporal
    };

    return of(newActivity);
  }

  updateActivity(id: number, actividad: Partial<Actividad>): Observable<Actividad> {
    // TODO: Implementar llamada real a la API
    // return this.http.put<Actividad>(`/api/actividades/${id}`, actividad);

    const updatedActivity: Actividad = {
      id,
      nombre: 'Actividad Actualizada',
      descripcion: 'Descripción actualizada',
      tipo: 'Tipo actualizado',
      fechaInicio: new Date(),
      estado: 'activa'
    };

    return of(updatedActivity);
  }

  deleteActivity(id: number): Observable<void> {
    // TODO: Implementar llamada real a la API
    // return this.http.delete<void>(`/api/actividades/${id}`);

    return of(void 0);
  }
}