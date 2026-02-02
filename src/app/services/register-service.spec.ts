import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RegisterService } from './register-service';
import { Efector } from '../models/efector.model';
import { Agente } from '../models/agente.model';
import { Referente } from '../models/referente.model';
import { Usmya } from '../models/usmya.model';
import { Espacio } from '../models/espacio.model';
import { ReferenteUsmya } from '../models/efector-usmya.model';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegisterService]
    });
    service = TestBed.inject(RegisterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('postEfector', () => {
    it('should register an efector', (done) => {
      const efectorData: Efector = {
        nombre: 'Dr. Juan Pérez',
        email: 'juan.perez@hospital.com',
        telefono: '123456789',
        idEspacio: 1,
        tipoProfesional: 'Médico',
        password: 'password123',
        esETratante: true
      };

      service.postEfector(efectorData).subscribe(response => {
        expect(response.success).toBeTruthy();
        expect(response.message).toBe('Efector registrado exitosamente');
        expect(response.data).toBeDefined();
        expect(response.data.nombre).toBe('Dr. Juan Pérez');
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('postAgente', () => {
    it('should register an agente', (done) => {
      const agenteData: Agente = {
        nombre: 'María González',
        email: 'maria.gonzalez@comunidad.com',
        telefono: '987654321',
        idEspacio: 1,
        password: 'password456'
      };

      service.postAgente(agenteData).subscribe(response => {
        expect(response.success).toBeTruthy();
        expect(response.message).toBe('Agente registrado exitosamente');
        expect(response.data).toBeDefined();
        expect(response.data.nombre).toBe('María González');
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('postReferente', () => {
    it('should register a referente', (done) => {
      const referenteData: Referente = {
        nombre: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@referente.com',
        telefono: '555666777',
        password: 'password789',
        registroConUsmya: false
      };

      service.postReferente(referenteData).subscribe(response => {
        expect(response.success).toBeTruthy();
        expect(response.message).toBe('Referente registrado exitosamente');
        expect(response.data).toBeDefined();
        expect(response.data.nombre).toBe('Carlos Rodríguez');
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('postUsmya', () => {
    it('should register a usmya', (done) => {
      const usmyaData: Usmya = {
        nombre: 'Ana López',
        email: 'ana.lopez@usmya.com',
        telefono: '111222333',
        password: 'passwordABC',
        dni: 12345678,
        fechaNacimiento: '2005-01-15'
      };

      service.postUsmya(usmyaData).subscribe(response => {
        expect(response.success).toBeTruthy();
        expect(response.message).toBe('USMyA registrado exitosamente');
        expect(response.data).toBeDefined();
        expect(response.data.nombre).toBe('Ana López');
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('postEfectorUsmya', () => {
    it('should register efector and usmya', (done) => {
      const referenteUsmyaData: ReferenteUsmya = {
        referente: {
          nombre: 'Dr. Pedro García',
          email: 'pedro.garcia@hospital.com',
          telefono: '333444555',
          password: 'pass123',
          registroConUsmya: true
        },
        usmya: {
          nombre: 'Lucía Martínez',
          email: 'lucia.martinez@usmya.com',
          telefono: '666777888',
          password: 'passABC',
          dni: 87654321,
          fechaNacimiento: '2006-03-20'
        }
      };

      service.postEfectorUsmya(referenteUsmyaData).subscribe(response => {
        expect(response.success).toBeTruthy();
        expect(response.message).toBe('Efector y USMyA registrados exitosamente');
        expect(response.data).toBeDefined();
        expect(response.data.referente).toBeDefined();
        expect(response.data.usmya).toBeDefined();
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('registerEspacio', () => {
    it('should register an espacio', (done) => {
      const espacioData: Espacio = {
        nombre: 'Centro Comunitario Norte',
        telefono: '3515551001',
        tipoOrganizacion: 'comunitario',
        direccion: 'Av. Colon 1234',
        barrio: 'Centro',
        encargado: 'Pedro Ramirez',
        poblacionVinculada: ['niños', 'adolescentes', 'familias'],
        diasHorarios: 'Lunes a Viernes 9:00-18:00',
        actividadesPrincipales: 'Talleres de arte, apoyo escolar',
        actividadesSecundarias: 'Asesoramiento psicológico'
      };

      service.registerEspacio(espacioData).subscribe(response => {
        expect(response.success).toBeTruthy();
        expect(response.message).toBe('Espacio registrado exitosamente');
        expect(response.data).toBeDefined();
        expect(response.data.id).toBeGreaterThan(0);
        expect(response.data.nombre).toBe('Centro Comunitario Norte');
        done();
      });

      // No esperamos llamadas HTTP ya que usa mocks locales
    });
  });

  describe('registerEspacioInMongo', () => {
    it('should register espacio in MongoDB', (done) => {
      const espacioData: Espacio = {
        nombre: 'Centro Cultural',
        telefono: '3515552002',
        tipoOrganizacion: 'deportiva',
        direccion: 'Calle Falsa 123',
        barrio: 'Alberdi',
        encargado: 'Ana Pérez',
        poblacionVinculada: ['jovenes'],
        diasHorarios: 'Lunes a Sábado 10:00-20:00',
        actividadesPrincipales: 'Teatro, música',
        actividadesSecundarias: 'Talleres de escritura',
        coordenadas: { lat: -31.4201, lng: -64.1888 },
        cuentaConInternet: true,
        cuentaConDispositivo: true
      };

      service.registerEspacioInMongo(espacioData).subscribe(response => {
        expect(response).toBeDefined();
        done();
      });

      const req = httpMock.expectOne('/api/instituciones');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.nombre).toBe('Centro Cultural');
      expect(req.request.body.tipoOrganizacion).toBe('deportiva');
      req.flush({ success: true, id: 1 });
    });
  });
});
