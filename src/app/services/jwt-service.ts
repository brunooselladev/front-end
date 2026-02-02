import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  setToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  removeToken() {
    localStorage.removeItem('jwtToken');
  }

  private decodeToken(): any {
    const token = this.getToken();
    // if (!token) return null;
    // const payload = token.split('.')[1];
    // if (!payload) return null;
    // try {
    //   return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    // } catch {
    //   return null;
    // }
    return JSON.parse(token || '{}');
  }

  getRole(): string | null {
    const decoded = this.decodeToken();
    return decoded?.role || null;
  }

  getEmail(): string | null {
    const decoded = this.decodeToken();
    return decoded?.email || null;
  }

  getIdEspacio(): number | null {
    const decoded = this.decodeToken();
    return decoded?.idEspacio || null;
  }
}
