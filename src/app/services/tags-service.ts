import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Tag, MOCK_TAGS, getAllTags, searchTags, getTagById, getTagsByIds } from '../shared/mocks/mock-tags';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor() { }

  /**
   * Obtiene todas las etiquetas disponibles
   * Simula una llamada HTTP GET
   */
  getAllTags(): Observable<Tag[]> {
    // Simular delay de red
    return of(getAllTags()).pipe(delay(300));
  }

  /**
   * Busca etiquetas por texto (nombre o descripción)
   * @param query Texto de búsqueda
   */
  searchTags(query: string): Observable<Tag[]> {
    return of(searchTags(query)).pipe(delay(150));
  }

  /**
   * Obtiene una etiqueta por su ID
   * @param id ID numérico de la etiqueta
   */
  getTagById(id: number): Observable<Tag | undefined> {
    return of(getTagById(id)).pipe(delay(100));
  }

  /**
   * Obtiene múltiples etiquetas por sus IDs
   * @param ids Array de IDs numéricos
   */
  getTagsByIds(ids: number[]): Observable<Tag[]> {
    return of(getTagsByIds(ids)).pipe(delay(200));
  }
}