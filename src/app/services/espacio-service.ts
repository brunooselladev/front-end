import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_ESPACIOS } from '../shared/mocks/mock-espacios';
import { Espacio } from '../models/espacio.model';

const STORAGE_KEY = 'espacios';

@Injectable({
  providedIn: 'root'
})
export class EspacioService {
  private espacios: Espacio[];

  constructor() {
    // Limpiar localStorage y siempre usar los datos mock para desarrollo
    localStorage.removeItem(STORAGE_KEY);
    this.espacios = [...MOCK_ESPACIOS];
    this.saveToLocalStorage();
  }  private saveToLocalStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.espacios));
  }

  // Obtener todos los espacios
  getAllEspacios(): Observable<Espacio[]> {
    return of(this.espacios).pipe(delay(600)); // Simula llamada HTTP
  }

  // Obtener un espacio por ID
  getEspacioById(id: number): Observable<Espacio | null> {
    console.log(this.espacios);
    
    const espacio = this.espacios.find(e => e.id === id);
    return of(espacio || null).pipe(delay(400));
  }

  // Crear un nuevo espacio
  createEspacio(espacioData: Omit<Espacio, 'id'>): Observable<Espacio> {
    const nextId = Math.max(...this.espacios.map(e => e.id || 0)) + 1;
    console.log('Creando espacio con ID:', nextId);
    
    const newEspacio: Espacio = {
      ...espacioData,
      id: nextId
    };
    
    console.log('Nuevo espacio a crear:', newEspacio);
    this.espacios.push(newEspacio);
    this.saveToLocalStorage();
    return of(newEspacio).pipe(delay(500));
  }

  // Actualizar un espacio existente
  updateEspacio(id: number, espacioData: Partial<Espacio>): Observable<Espacio | null> {
    const espacioIndex = this.espacios.findIndex(e => e.id === id);
    if (espacioIndex > -1) {
      this.espacios[espacioIndex] = { ...this.espacios[espacioIndex], ...espacioData };
      this.saveToLocalStorage();
      return of(this.espacios[espacioIndex]).pipe(delay(400));
    }
    return of(null).pipe(delay(400));
  }

  // Eliminar un espacio
  deleteEspacio(id: number): Observable<boolean> {
    const espacioIndex = this.espacios.findIndex(e => e.id === id);
    if (espacioIndex > -1) {
      this.espacios.splice(espacioIndex, 1);
      this.saveToLocalStorage();
      return of(true).pipe(delay(400));
    }
    return of(false).pipe(delay(400));
  }

  // Buscar espacios por nombre
  searchEspaciosByNombre(nombre: string): Observable<Espacio[]> {
    const espacios = this.espacios.filter(e =>
      e.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    return of(espacios).pipe(delay(300));
  }

  // Filtrar espacios por tipo de organización
  getEspaciosByTipo(tipo: Espacio['tipoOrganizacion']): Observable<Espacio[]> {
    const espacios = this.espacios.filter(e => e.tipoOrganizacion === tipo);
    return of(espacios).pipe(delay(300));
  }

  // Filtrar espacios por barrio
  getEspaciosByBarrio(barrio: string): Observable<Espacio[]> {
    const espacios = MOCK_ESPACIOS.filter(e =>
      e.barrio?.toLowerCase().includes(barrio.toLowerCase())
    );
    return of(espacios).pipe(delay(300));
  }

  // Obtener espacios que atienden a una población específica
  getEspaciosByPoblacion(poblacion: Espacio['poblacionVinculada'][0]): Observable<Espacio[]> {
    const espacios = MOCK_ESPACIOS.filter(e =>
      e.poblacionVinculada.includes(poblacion)
    );
    return of(espacios).pipe(delay(300));
  }
}
