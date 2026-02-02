import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthService } from './auth-service';
import { Login } from '../models/login.model';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully with admin credentials', (done) => {
      const credentials: Login = {
        email: 'admin@test.com',
        password: 'Admin1234'
      };

      service.login(credentials).subscribe(response => {
        expect(response.success).toBeTruthy();
        expect(response.message).toBe('Login exitoso');
        expect(response.data).toBeDefined();
        expect(response.data.user).toBeDefined();
        expect(response.data.user.email).toBe('admin@test.com');
        expect(response.data.user.role).toBe('admin');
        expect(response.data.user.idEspacio).toBeNull();
        expect(response.data.token).toBeDefined();
        done();
      });
    });

    it('should login successfully with efector credentials', (done) => {
      const credentials: Login = {
        email: 'efector@test.com',
        password: 'Efector1234'
      };

      service.login(credentials).subscribe(response => {
        expect(response.success).toBeTruthy();
        expect(response.message).toBe('Login exitoso');
        expect(response.data.user.email).toBe('efector@test.com');
        expect(response.data.user.role).toBe('efector');
        expect(response.data.user.idEspacio).toBe(1);
        done();
      });
    });

    it('should login successfully with agente credentials', (done) => {
      const credentials: Login = {
        email: 'agente@test.com',
        password: 'Agente1234'
      };

      service.login(credentials).subscribe(response => {
        expect(response.success).toBeTruthy();
        expect(response.message).toBe('Login exitoso');
        expect(response.data.user.email).toBe('agente@test.com');
        expect(response.data.user.role).toBe('agente');
        expect(response.data.user.idEspacio).toBe(2);
        done();
      });
    });

    it('should login successfully with referente credentials', (done) => {
      const credentials: Login = {
        email: 'referente@test.com',
        password: 'Referente1234'
      };

      service.login(credentials).subscribe(response => {
        expect(response.success).toBeTruthy();
        expect(response.message).toBe('Login exitoso');
        expect(response.data.user.email).toBe('referente@test.com');
        expect(response.data.user.role).toBe('referente');
        expect(response.data.user.idEspacio).toBeNull();
        done();
      });
    });

    it('should login successfully with usmya credentials', (done) => {
      const credentials: Login = {
        email: 'usmya@test.com',
        password: 'Usmya1234'
      };

      service.login(credentials).subscribe(response => {
        expect(response.success).toBeTruthy();
        expect(response.message).toBe('Login exitoso');
        expect(response.data.user.email).toBe('usmya@test.com');
        expect(response.data.user.role).toBe('usmya');
        expect(response.data.user.idEspacio).toBeNull();
        done();
      });
    });

    it('should fail login with invalid email', (done) => {
      const credentials: Login = {
        email: 'invalid@test.com',
        password: 'Admin1234'
      };

      service.login(credentials).subscribe(response => {
        expect(response.success).toBeFalsy();
        expect(response.message).toBe('Credenciales inválidas');
        expect(response.data).toBeUndefined();
        done();
      });
    });

    it('should fail login with invalid password', (done) => {
      const credentials: Login = {
        email: 'admin@test.com',
        password: 'WrongPassword'
      };

      service.login(credentials).subscribe(response => {
        expect(response.success).toBeFalsy();
        expect(response.message).toBe('Credenciales inválidas');
        expect(response.data).toBeUndefined();
        done();
      });
    });

    it('should fail login with both invalid credentials', (done) => {
      const credentials: Login = {
        email: 'wrong@test.com',
        password: 'WrongPassword'
      };

      service.login(credentials).subscribe(response => {
        expect(response.success).toBeFalsy();
        expect(response.message).toBe('Credenciales inválidas');
        done();
      });
    });

    it('should return token in response for successful login', (done) => {
      const credentials: Login = {
        email: 'admin@test.com',
        password: 'Admin1234'
      };

      service.login(credentials).subscribe(response => {
        expect(response.data.token).toBeDefined();
        expect(typeof response.data.token).toBe('string');
        
        // Verificar que el token contiene información del usuario
        const tokenData = JSON.parse(response.data.token);
        expect(tokenData.email).toBe('admin@test.com');
        expect(tokenData.role).toBe('admin');
        done();
      });
    });

    it('should return user with id for successful login', (done) => {
      const credentials: Login = {
        email: 'agente@test.com',
        password: 'Agente1234'
      };

      service.login(credentials).subscribe(response => {
        expect(response.data.user.id).toBeDefined();
        expect(response.data.user.id).toBe(9);
        done();
      });
    });
  });
});
