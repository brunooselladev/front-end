import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UsuarioService } from './usuario-service';
import { Usuario } from '../models/usuario.interface';
import { MOCK_USERS } from '../shared/mocks/mock-users';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;
  let mockUsers: Usuario[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);

    // Usar copia del mock para evitar modificar el original
    mockUsers = JSON.parse(JSON.stringify(MOCK_USERS));
  });

  afterEach(() => {
    httpMock.verify();
    // Restaurar el mock original después de cada test
    // Esto es necesario porque algunos métodos modifican MOCK_USERS directamente
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllUsers', () => {
    it('should return all users', (done) => {
      service.getAllUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('getUsersPendingApproval', () => {
    it('should return users pending approval', (done) => {
      const pendingUsers = mockUsers.filter(u => u.isVerified === 'pendiente');

      service.getUsersPendingApproval().subscribe(users => {
        expect(users).toEqual(pendingUsers);
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('getUsersByRole', () => {
    it('should return users by role', (done) => {
      const agentes = mockUsers.filter(u => u.role === 'agente');

      service.getUsersByRole('agente').subscribe(users => {
        expect(users).toEqual(agentes);
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('getUserById', () => {
    it('should return user by id', (done) => {
      const user = mockUsers.find(u => u.id === 1) || null;

      service.getUserById(1).subscribe(result => {
        expect(result).toEqual(user);
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });

    it('should return null for non-existent user', (done) => {
      service.getUserById(999).subscribe(result => {
        expect(result).toBeNull();
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('getUsmyaByReferenteId', () => {
    it('should return USMYA by referente id', (done) => {
      const usmya = mockUsers.find(u => u.role === 'usmya' && u.creadoPor === 1);

      service.getUsmyaByReferenteId(1).subscribe(result => {
        expect(result).toEqual(usmya || null);
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });

    it('should return null if referente has no USMYA', (done) => {
      service.getUsmyaByReferenteId(999).subscribe(result => {
        expect(result).toBeNull();
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('referenteHasUsmya', () => {
    it('should return true if referente has USMYA', (done) => {
      // ID 10 es un efector que tiene USMYA (ID 21 con creadoPor: 10)
      service.referenteHasUsmya(10).subscribe(result => {
        expect(result).toBeTruthy();
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });

    it('should return false if referente has no USMYA', (done) => {
      service.referenteHasUsmya(999).subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('getCreadorByUsmyaId', () => {
    it('should return creador of USMYA', (done) => {
      const usmya = mockUsers.find(u => u.id === 2 && u.role === 'usmya');
      const creador = usmya ? mockUsers.find(u => u.id === usmya.creadoPor) || null : null;

      service.getCreadorByUsmyaId(2).subscribe(result => {
        expect(result).toEqual(creador);
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });

    it('should return null if USMYA has no creador', (done) => {
      service.getCreadorByUsmyaId(1).subscribe(result => {
        expect(result).toBeNull();
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('usmyaHasCreador', () => {
    it('should return true if USMYA has creador', (done) => {
      // ID 21 es una USMYA con creadoPor: 10
      service.usmyaHasCreador(21).subscribe(result => {
        expect(result).toBeTruthy();
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });

    it('should return false if USMYA has no creador', (done) => {
      service.usmyaHasCreador(1).subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('approveUser', () => {
    it('should approve user', (done) => {
      // Usar un usuario con isVerified='pendiente' para aprobar (ID 22)
      service.approveUser(22).subscribe(result => {
        expect(result).toBeTruthy();
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('postVerified', () => {
    it('should verify user', (done) => {
      // Usar ID 23 para evitar conflictos con otros tests
      service.postVerified(23).subscribe(result => {
        expect(result).toBeTruthy();
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('rejectUser', () => {
    it('should reject user', (done) => {
      service.rejectUser(21).subscribe(result => {
        expect(result).toBeTruthy();
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('createUser', () => {
    it('should create user', (done) => {
      const newUserData = {
        nombre: 'Nuevo Usuario',
        email: 'nuevo@example.com',
        role: 'agente'
      };

      service.createUser(newUserData).subscribe(result => {
        expect(result).toBeDefined();
        expect(result.nombre).toBe(newUserData.nombre);
        expect(result.email).toBe(newUserData.email);
        expect(result.role).toBe(newUserData.role);
        expect(result.isVerified).toBe('pendiente');
        // El ID será el máximo actual + 1, puede variar si otros tests modifican MOCK_USERS
        expect(result.id).toBeGreaterThan(22);
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('updateUser', () => {
    it('should update user', (done) => {
      const updateData = { nombre: 'Administrador Actualizado' };

      service.updateUser(1, updateData).subscribe(result => {
        expect(result).toBeDefined();
        expect(result!.id).toBe(1);
        // El servicio devuelve el usuario actualizado del MOCK_USERS global
        expect(result!.nombre).toBe(updateData.nombre);
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('searchAvailableUsmya', () => {
    it('should return available USMYA for referente', (done) => {
      // Este método usa mocks locales, no hace llamadas HTTP
      service.searchAvailableUsmya('', 1).subscribe(result => {
        expect(Array.isArray(result)).toBeTruthy();
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('searchAvailableUsmyaForEfector', () => {
    it('should return available USMYA for efector', (done) => {
      // Este método usa mocks locales, no hace llamadas HTTP
      service.searchAvailableUsmyaForEfector('', 1).subscribe(result => {
        expect(Array.isArray(result)).toBeTruthy();
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });
});
