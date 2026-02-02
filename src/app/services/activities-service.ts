import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { MOCK_ACTIVIDADES } from '../shared/mocks/mock-actividades';
import { Actividad } from '../models/actividad.model';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  // Estado local reactivo para mantener las actividades
  private activitiesSubject = new BehaviorSubject<Actividad[]>(MOCK_ACTIVIDADES);
  public activities$ = this.activitiesSubject.asObservable();

  // ID counter para nuevas actividades
  private nextId = Math.max(...MOCK_ACTIVIDADES.map(a => a.id || 0)) + 1;

  constructor() { }

  // GET: Obtener todas las actividades
  getAllActivities(): Observable<Actividad[]> {
    return of(MOCK_ACTIVIDADES).pipe(delay(600)); // Simula llamada HTTP
  }

  // GET: Obtener actividades no verificadas
  getUnverifiedActivities(): Observable<Actividad[]> {
    const unverified = MOCK_ACTIVIDADES.filter(a => !a.isVerified);
    return of(unverified).pipe(delay(500));
  }

  // GET: Obtener actividad por ID
  getActivityById(id: number): Observable<Actividad | null> {
    const activity = MOCK_ACTIVIDADES.find(a => a.id === id);
    return of(activity || null).pipe(delay(400));
  }

  // GET: Obtener actividades por espacio
  getActivitiesByEspacioId(espacioId: number): Observable<Actividad[]> {
    const activities = MOCK_ACTIVIDADES.filter(a => a.espacioId === espacioId);
    return of(activities).pipe(delay(500));
  }

  // GET: Obtener actividades fijas
  getFixedActivities(): Observable<Actividad[]> {
    const activities = MOCK_ACTIVIDADES.filter(a => a.esFija);
    return of(activities).pipe(delay(500));
  }

  // GET: Obtener actividades por fecha
  getActivitiesByDate(date: Date): Observable<Actividad[]> {
    const activities = MOCK_ACTIVIDADES.filter(a => {
      const activityDate = new Date(a.dia);
      return activityDate.toDateString() === date.toDateString();
    });
    return of(activities).pipe(delay(500));
  }

  // POST: Crear nueva actividad
  createActivity(activity: Omit<Actividad, 'id'>): Observable<Actividad> {
    const newActivity: Actividad = {
      ...activity,
      id: this.nextId++
    };

    // Simular creación en "backend"
    MOCK_ACTIVIDADES.push(newActivity);

    // Actualizar estado local
    this.activitiesSubject.next([...MOCK_ACTIVIDADES]);

    return of(newActivity).pipe(delay(800));
  }

  // PUT: Actualizar actividad existente
  updateActivity(id: number, updates: Partial<Actividad>): Observable<Actividad | null> {
    const index = MOCK_ACTIVIDADES.findIndex(a => a.id === id);

    if (index === -1) {
      return of(null).pipe(delay(400));
    }

    // Actualizar actividad
    const updatedActivity = { ...MOCK_ACTIVIDADES[index], ...updates };
    MOCK_ACTIVIDADES[index] = updatedActivity;

    // Actualizar estado local
    this.activitiesSubject.next([...MOCK_ACTIVIDADES]);

    return of(updatedActivity).pipe(delay(600));
  }

  // DELETE: Eliminar actividad
  deleteActivity(id: number): Observable<boolean> {
    const index = MOCK_ACTIVIDADES.findIndex(a => a.id === id);

    if (index === -1) {
      return of(false).pipe(delay(400));
    }

    // Eliminar actividad
    MOCK_ACTIVIDADES.splice(index, 1);

    // Actualizar estado local
    this.activitiesSubject.next([...MOCK_ACTIVIDADES]);

    return of(true).pipe(delay(500));
  }

  // GET: Obtener actividades de la semana actual
  getCurrentWeekActivities(): Observable<Actividad[]> {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo

    const weekActivities = MOCK_ACTIVIDADES.filter(activity => {
      const activityDate = new Date(activity.dia);
      return activityDate >= startOfWeek && activityDate <= endOfWeek;
    });

    return of(weekActivities).pipe(delay(700));
  }

  // GET: Buscar actividades por nombre o descripción
  searchActivities(query: string): Observable<Actividad[]> {
    const lowerQuery = query.toLowerCase();
    const results = MOCK_ACTIVIDADES.filter(activity =>
      activity.nombre.toLowerCase().includes(lowerQuery) ||
      activity.descripcion.toLowerCase().includes(lowerQuery) ||
      activity.responsable.toLowerCase().includes(lowerQuery)
    );

    return of(results).pipe(delay(400));
  }
}