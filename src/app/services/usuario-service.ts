import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_USERS } from '../shared/mocks/mock-users';
import { Usuario } from '../models/usuario.interface';
import { ReferenteUsmyaService } from './referente-usmya-service';
import { MOCK_REFERENTE_USMYA } from '../shared/mocks/mock-referente-usmya';
import { MOCK_EFECTOR_USMYA } from '../shared/mocks/mock-efector-usmya';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Devuelve todos los usuarios mockeados
  getAllUsers(): Observable<Usuario[]> {
    return of(MOCK_USERS).pipe(delay(600)); // Simula llamada HTTP
  }

  // Devuelve usuarios que requieren aprobación (para notificaciones de admin)
  getUsersPendingApproval(): Observable<Usuario[]> {
    return of(MOCK_USERS.filter(u => u.isVerified === 'pendiente')).pipe(delay(600));
  }

  // Devuelve usuarios por rol
  getUsersByRole(role: string): Observable<Usuario[]> {
    return of(MOCK_USERS.filter(u => u.role === role)).pipe(delay(600));
  }

  // Devuelve un usuario por ID
  getUserById(id: number): Observable<Usuario | null> {
    const user = MOCK_USERS.find(u => u.id === id);
    return of(user || null).pipe(delay(400));
  }

  // Devuelve USMYA creado por un referente específico
  getUsmyaByReferenteId(referenteId: number): Observable<Usuario | null> {
    const usmya = MOCK_USERS.find(u => 
      u.role === 'usmya' && 
      u.creadoPor === referenteId
    );
    return of(usmya || null).pipe(delay(300));
  }

  // Verifica si un referente tiene USMYA asociado
  referenteHasUsmya(referenteId: number): Observable<boolean> {
    const hasUsmya = MOCK_USERS.some(u => 
      u.role === 'usmya' && 
      u.creadoPor === referenteId
    );
    return of(hasUsmya).pipe(delay(200));
  }

  // Devuelve el creador (agente o efector) de un USMYA específico
  getCreadorByUsmyaId(usmyaId: number): Observable<Usuario | null> {
    const usmya = MOCK_USERS.find(u => u.id === usmyaId && u.role === 'usmya');
    if (usmya && usmya.creadoPor) {
      const creador = MOCK_USERS.find(u => u.id === usmya.creadoPor);
      return of(creador || null).pipe(delay(300));
    }
    return of(null).pipe(delay(300));
  }

  // Verifica si un USMYA tiene creador (agente o efector)
  usmyaHasCreador(usmyaId: number): Observable<boolean> {
    const usmya = MOCK_USERS.find(u => u.id === usmyaId && u.role === 'usmya');
    const hasCreador = !!(usmya && usmya.creadoPor && 
      MOCK_USERS.some(u => 
        u.id === usmya.creadoPor && 
        (u.role === 'agente' || u.role === 'efector')
      )
    );
    return of(hasCreador).pipe(delay(200));
  }

  // Aprueba un usuario
  approveUser(userId: number): Observable<boolean> {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      user.isVerified = 'aprobado';
    }
    return of(true).pipe(delay(400));
  }

  // Verifica un usuario (cambia estado a aprobado)
  postVerified(userId: number): Observable<boolean> {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      user.isVerified = 'aprobado';
    }
    return of(true).pipe(delay(400));
  }

  // Rechaza un usuario
  rejectUser(userId: number): Observable<boolean> {
    // En un escenario real, esto podría eliminarlo o marcarlo como rechazado
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      // Simulamos eliminación del array para el mock
      MOCK_USERS.splice(userIndex, 1);
    }
    return of(true).pipe(delay(400));
  }

  // Crea un nuevo usuario
  createUser(userData: Partial<Usuario>): Observable<Usuario> {
    const newUser: Usuario = {
      id: Math.max(...MOCK_USERS.map(u => u.id)) + 1,
      email: '',
      role: '',
      isVerified: 'pendiente',
      nombre: '',
      dni: null,
      fechaNacimiento: null,
      telefono: null,
      direccionResidencia: null,
      alias: null,
      generoAutoPercibido: null,
      estadoCivil: null,
      obraSocial: null,
      geolocalizacion: null,
      creadoPor: null,
      requiereAprobacion: true,
      idEspacio: null,
      tipoProfesional: null,
      esEfector: false,
      esETratante: false,
      registroConUsmya: false,
      ...userData
    };
    MOCK_USERS.push(newUser);
    return of(newUser).pipe(delay(500));
  }

  // Actualiza un usuario
  updateUser(userId: number, userData: Partial<Usuario>): Observable<Usuario | null> {
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...userData };
      return of(MOCK_USERS[userIndex]).pipe(delay(400));
    }
    return of(null).pipe(delay(400));
  }

  // Busca USMYA disponibles (no relacionados con el referente) filtrando por nombre, alias o DNI
  searchAvailableUsmya(searchTerm: string, referenteId: number): Observable<Usuario[]> {
    // Obtenemos directamente los IDs de USMYA relacionados con el referente desde el mock
    const relatedUsmyaIds = MOCK_REFERENTE_USMYA
      .filter((r: any) => r.idReferente === referenteId)
      .map((r: any) => r.idUsmya);

    // Filtramos USMYA que no estén relacionados con el referente
    let availableUsmya = MOCK_USERS.filter(u =>
      u.role === 'usmya' && !relatedUsmyaIds.includes(u.id)
    );

    // Si hay término de búsqueda, filtramos por nombre, alias o DNI
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      availableUsmya = availableUsmya.filter(u =>
        (u.nombre && u.nombre.toLowerCase().includes(term)) ||
        (u.alias && u.alias.toLowerCase().includes(term)) ||
        (u.dni && u.dni.toString().includes(term))
      );
    }

    return of(availableUsmya).pipe(delay(300));
  }

  // Busca USMYA disponibles para efector (no relacionados con el efector) filtrando por nombre, alias o DNI
  searchAvailableUsmyaForEfector(searchTerm: string, efectorId: number): Observable<Usuario[]> {
    // Obtenemos directamente los IDs de USMYA relacionados con el efector desde el mock
    const relatedUsmyaIds = MOCK_EFECTOR_USMYA
      .filter(r => r.idEfector === efectorId)
      .map(r => r.idUsmya);

    // Filtramos USMYA que no estén relacionados con el efector
    let availableUsmya = MOCK_USERS.filter(u =>
      u.role === 'usmya' && !relatedUsmyaIds.includes(u.id)
    );

    // Si hay término de búsqueda, filtramos por nombre, alias o DNI
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      availableUsmya = availableUsmya.filter(u =>
        (u.nombre && u.nombre.toLowerCase().includes(term)) ||
        (u.alias && u.alias.toLowerCase().includes(term)) ||
        (u.dni && u.dni.toString().includes(term))
      );
    }

    return of(availableUsmya).pipe(delay(300));
  }
}
