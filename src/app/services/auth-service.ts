import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(data: Login): Observable<any> {
    // Simulación - devolver respuesta mockeada
    const mockUsers = [
      { email: 'admin@test.com', password: 'Admin1234', role: 'admin', token: 'mock-jwt-admin-token', idEspacio: null },
      { email: 'efector@test.com', password: 'Efector1234', role: 'efector', token: 'mock-jwt-efector-token', idEspacio: 1 },
      { email: 'agente@test.com', password: 'Agente1234', role: 'agente', token: 'mock-jwt-agente-token', idEspacio: 2 },
      { email: 'referente@test.com', password: 'Referente1234', role: 'referente', token: 'mock-jwt-referente-token', idEspacio: null },
      { email: 'usmya@test.com', password: 'Usmya1234', role: 'usmya', token: 'mock-jwt-usmya-token', idEspacio: null }
    ];

    const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
    
    if (user) {
      
      return of({
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            email: user.email,
            role: user.role,
            idEspacio: user.idEspacio,
            id: 9
          },
          token: JSON.stringify({email: user.email, role: user.role, idEspacio: user.idEspacio})
        }
      }).pipe(delay(1300)); // Simular demora de 1.3 segundos
    } else {
      return of({
        success: false,
        message: 'Credenciales inválidas'
      }).pipe(delay(800)); // Simular demora de 0.8 segundos
    }

    // Código real (comentado):
    // return this.http.post(`${this.apiUrl}/Auth/login`, credentials);
  }
}
