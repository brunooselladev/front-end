import { TestBed } from '@angular/core/testing';

import { JwtService } from './jwt-service';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtService]
    });
    service = TestBed.inject(JwtService);
    
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setToken', () => {
    it('should store token in localStorage', () => {
      const token = JSON.stringify({ email: 'test@test.com', role: 'admin', idEspacio: null });
      service.setToken(token);
      
      const stored = localStorage.getItem('jwtToken');
      expect(stored).toBe(token);
    });
  });

  describe('getToken', () => {
    it('should retrieve token from localStorage', () => {
      const token = JSON.stringify({ email: 'test@test.com', role: 'admin' });
      localStorage.setItem('jwtToken', token);
      
      const retrieved = service.getToken();
      expect(retrieved).toBe(token);
    });

    it('should return null when no token exists', () => {
      const retrieved = service.getToken();
      expect(retrieved).toBeNull();
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      const token = JSON.stringify({ email: 'test@test.com', role: 'admin' });
      localStorage.setItem('jwtToken', token);
      
      service.removeToken();
      
      const stored = localStorage.getItem('jwtToken');
      expect(stored).toBeNull();
    });
  });

  describe('getRole', () => {
    it('should return role from decoded token', () => {
      const token = JSON.stringify({ email: 'test@test.com', role: 'admin', idEspacio: null });
      service.setToken(token);
      
      const role = service.getRole();
      expect(role).toBe('admin');
    });

    it('should return null when no token exists', () => {
      const role = service.getRole();
      expect(role).toBeNull();
    });

    it('should return null when token has no role', () => {
      const token = JSON.stringify({ email: 'test@test.com' });
      service.setToken(token);
      
      const role = service.getRole();
      expect(role).toBeNull();
    });
  });

  describe('getEmail', () => {
    it('should return email from decoded token', () => {
      const token = JSON.stringify({ email: 'test@test.com', role: 'efector', idEspacio: 1 });
      service.setToken(token);
      
      const email = service.getEmail();
      expect(email).toBe('test@test.com');
    });

    it('should return null when no token exists', () => {
      const email = service.getEmail();
      expect(email).toBeNull();
    });

    it('should return null when token has no email', () => {
      const token = JSON.stringify({ role: 'agente' });
      service.setToken(token);
      
      const email = service.getEmail();
      expect(email).toBeNull();
    });
  });

  describe('getIdEspacio', () => {
    it('should return idEspacio from decoded token', () => {
      const token = JSON.stringify({ email: 'efector@test.com', role: 'efector', idEspacio: 5 });
      service.setToken(token);
      
      const idEspacio = service.getIdEspacio();
      expect(idEspacio).toBe(5);
    });

    it('should return null when no token exists', () => {
      const idEspacio = service.getIdEspacio();
      expect(idEspacio).toBeNull();
    });

    it('should return null when token has no idEspacio', () => {
      const token = JSON.stringify({ email: 'admin@test.com', role: 'admin' });
      service.setToken(token);
      
      const idEspacio = service.getIdEspacio();
      expect(idEspacio).toBeNull();
    });

    it('should handle idEspacio as null explicitly', () => {
      const token = JSON.stringify({ email: 'admin@test.com', role: 'admin', idEspacio: null });
      service.setToken(token);
      
      const idEspacio = service.getIdEspacio();
      expect(idEspacio).toBeNull();
    });
  });

  describe('token lifecycle', () => {
    it('should handle complete token lifecycle', () => {
      const token = JSON.stringify({ 
        email: 'user@test.com', 
        role: 'agente', 
        idEspacio: 3 
      });
      
      // Set token
      service.setToken(token);
      expect(service.getToken()).toBe(token);
      expect(service.getEmail()).toBe('user@test.com');
      expect(service.getRole()).toBe('agente');
      expect(service.getIdEspacio()).toBe(3);
      
      // Remove token
      service.removeToken();
      expect(service.getToken()).toBeNull();
      expect(service.getEmail()).toBeNull();
      expect(service.getRole()).toBeNull();
      expect(service.getIdEspacio()).toBeNull();
    });
  });

  describe('different user roles', () => {
    it('should handle admin token', () => {
      const token = JSON.stringify({ email: 'admin@test.com', role: 'admin', idEspacio: null });
      service.setToken(token);
      
      expect(service.getRole()).toBe('admin');
      expect(service.getIdEspacio()).toBeNull();
    });

    it('should handle efector token with idEspacio', () => {
      const token = JSON.stringify({ email: 'efector@test.com', role: 'efector', idEspacio: 1 });
      service.setToken(token);
      
      expect(service.getRole()).toBe('efector');
      expect(service.getIdEspacio()).toBe(1);
    });

    it('should handle referente token', () => {
      const token = JSON.stringify({ email: 'referente@test.com', role: 'referente', idEspacio: null });
      service.setToken(token);
      
      expect(service.getRole()).toBe('referente');
      expect(service.getIdEspacio()).toBeNull();
    });

    it('should handle usmya token', () => {
      const token = JSON.stringify({ email: 'usmya@test.com', role: 'usmya', idEspacio: null });
      service.setToken(token);
      
      expect(service.getRole()).toBe('usmya');
    });
  });
});
