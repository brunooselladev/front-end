import { TestBed } from '@angular/core/testing';

import { AsistenciaService } from './asistencia-service';
import { Asistencia } from '../models/asistencia.model';
import { MOCK_ASISTENCIAS } from '../shared/mocks/mock-asistencias';

describe('AsistenciaService', () => {
  let service: AsistenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AsistenciaService]
    });
    service = TestBed.inject(AsistenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllAsistencias', () => {
    it('should return all asistencias', (done) => {
      service.getAllAsistencias().subscribe(asistencias => {
        expect(asistencias).toEqual(MOCK_ASISTENCIAS);
        expect(asistencias.length).toBeGreaterThan(0);
        done();
      });
    });
  });

  describe('getAsistenciaById', () => {
    it('should return asistencia by id', (done) => {
      const testId = MOCK_ASISTENCIAS[0]?.id || 1;

      service.getAsistenciaById(testId).subscribe(asistencia => {
        expect(asistencia).toBeTruthy();
        expect(asistencia?.id).toBe(testId);
        done();
      });
    });

    it('should return undefined for non-existent id', (done) => {
      const nonExistentId = 999999;

      service.getAsistenciaById(nonExistentId).subscribe(asistencia => {
        expect(asistencia).toBeUndefined();
        done();
      });
    });
  });

  describe('getAsistenciasByActividadId', () => {
    it('should return asistencias for specific actividad', (done) => {
      const actividadId = MOCK_ASISTENCIAS[0]?.idActividad || 1;

      service.getAsistenciasByActividadId(actividadId).subscribe(asistencias => {
        expect(asistencias).toBeTruthy();
        asistencias.forEach(asistencia => {
          expect(asistencia.idActividad).toBe(actividadId);
        });
        done();
      });
    });
  });

  describe('getAsistenciasByUsmyaId', () => {
    it('should return asistencias for specific USMYA', (done) => {
      const usmyaId = MOCK_ASISTENCIAS[0]?.idUser || 1;

      service.getAsistenciasByUsmyaId(usmyaId).subscribe(asistencias => {
        expect(asistencias).toBeTruthy();
        asistencias.forEach(asistencia => {
          expect(asistencia.idUser).toBe(usmyaId);
        });
        done();
      });
    });
  });

  describe('createAsistencia', () => {
    it('should create a new asistencia', (done) => {
      const newAsistencia = {
        idActividad: 1,
        idUser: 10,
        estado: 'presente' as const,
        observacion: 'Asistencia de prueba'
      };

      const initialLength = MOCK_ASISTENCIAS.length;

      service.createAsistencia(newAsistencia).subscribe(created => {
        expect(created).toBeTruthy();
        expect(created.id).toBeGreaterThan(0);
        expect(created.idActividad).toBe(newAsistencia.idActividad);
        expect(created.idUser).toBe(newAsistencia.idUser);
        expect(created.estado).toBe(newAsistencia.estado);
        expect(MOCK_ASISTENCIAS.length).toBe(initialLength + 1);
        done();
      });
    });
  });

  describe('updateAsistencia', () => {
    it('should update an existing asistencia', (done) => {
      const testId = MOCK_ASISTENCIAS[0]?.id || 1;
      const updateData = { observacion: 'Observación actualizada' };

      service.updateAsistencia(testId, updateData).subscribe(updated => {
        expect(updated).toBeTruthy();
        expect(updated?.id).toBe(testId);
        expect(updated?.observacion).toBe(updateData.observacion);
        done();
      });
    });

    it('should return null for non-existent asistencia', (done) => {
      const nonExistentId = 999999;
      const updateData = { observacion: 'Test' };

      service.updateAsistencia(nonExistentId, updateData).subscribe(result => {
        expect(result).toBeNull();
        done();
      });
    });
  });

  describe('getAsistenciasByActividad', () => {
    it('should return asistencias for specific actividad', (done) => {
      const actividadId = MOCK_ASISTENCIAS[0]?.idActividad || 1;

      service.getAsistenciasByActividad(actividadId).subscribe(asistencias => {
        expect(asistencias).toBeTruthy();
        asistencias.forEach(asistencia => {
          expect(asistencia.idActividad).toBe(actividadId);
        });
        done();
      });
    });
  });

  describe('getAsistenciasByUser', () => {
    it('should return asistencias for specific user', (done) => {
      const userId = MOCK_ASISTENCIAS[0]?.idUser || 1;

      service.getAsistenciasByUser(userId).subscribe(asistencias => {
        expect(asistencias).toBeTruthy();
        asistencias.forEach(asistencia => {
          expect(asistencia.idUser).toBe(userId);
        });
        done();
      });
    });
  });

  describe('getAsistenciasByEstado', () => {
    it('should return asistencias with estado presente', (done) => {
      service.getAsistenciasByEstado('presente').subscribe(asistencias => {
        expect(asistencias).toBeTruthy();
        asistencias.forEach(asistencia => {
          expect(asistencia.estado).toBe('presente');
        });
        done();
      });
    });

    it('should return asistencias with estado ausente', (done) => {
      service.getAsistenciasByEstado('ausente').subscribe(asistencias => {
        expect(asistencias).toBeTruthy();
        asistencias.forEach(asistencia => {
          expect(asistencia.estado).toBe('ausente');
        });
        done();
      });
    });
  });

  describe('marcarPresente', () => {
    it('should mark asistencia as presente', (done) => {
      const testId = MOCK_ASISTENCIAS[0]?.id || 1;

      service.marcarPresente(testId, 'Usuario confirmado').subscribe(result => {
        expect(result).toBeTruthy();
        expect(result?.estado).toBe('presente');
        expect(result?.observacion).toBe('Usuario confirmado');
        done();
      });
    });

    it('should use default observacion if not provided', (done) => {
      const testId = MOCK_ASISTENCIAS[0]?.id || 1;

      service.marcarPresente(testId).subscribe(result => {
        expect(result).toBeTruthy();
        expect(result?.estado).toBe('presente');
        expect(result?.observacion).toBe('Asistencia confirmada');
        done();
      });
    });
  });

  describe('marcarAusente', () => {
    it('should mark asistencia as ausente', (done) => {
      const testId = MOCK_ASISTENCIAS[0]?.id || 1;

      service.marcarAusente(testId, 'No asistió').subscribe(result => {
        expect(result).toBeTruthy();
        expect(result?.estado).toBe('ausente');
        expect(result?.observacion).toBe('No asistió');
        done();
      });
    });

    it('should use default observacion if not provided', (done) => {
      const testId = MOCK_ASISTENCIAS[0]?.id || 1;

      service.marcarAusente(testId).subscribe(result => {
        expect(result).toBeTruthy();
        expect(result?.estado).toBe('ausente');
        expect(result?.observacion).toBe('Ausencia registrada');
        done();
      });
    });
  });

  describe('getEstadisticasByActividad', () => {
    it('should return statistics for actividad', (done) => {
      const actividadId = MOCK_ASISTENCIAS[0]?.idActividad || 1;

      service.getEstadisticasByActividad(actividadId).subscribe(stats => {
        expect(stats).toBeTruthy();
        expect(stats.total).toBeGreaterThanOrEqual(0);
        expect(stats.presentes).toBeGreaterThanOrEqual(0);
        expect(stats.ausentes).toBeGreaterThanOrEqual(0);
        expect(stats.presentes + stats.ausentes).toBe(stats.total);
        expect(stats.porcentajeAsistencia).toBeGreaterThanOrEqual(0);
        expect(stats.porcentajeAsistencia).toBeLessThanOrEqual(100);
        done();
      });
    });
  });

  describe('verificarAsistencia', () => {
    it('should find existing asistencia', (done) => {
      const testAsistencia = MOCK_ASISTENCIAS[0];

      service.verificarAsistencia(testAsistencia.idActividad, testAsistencia.idUser).subscribe(result => {
        expect(result).toBeTruthy();
        expect(result?.idActividad).toBe(testAsistencia.idActividad);
        expect(result?.idUser).toBe(testAsistencia.idUser);
        done();
      });
    });

    it('should return null for non-existent combination', (done) => {
      service.verificarAsistencia(999999, 999999).subscribe(result => {
        expect(result).toBeNull();
        done();
      });
    });
  });

  describe('registrarAsistenciasMasivo', () => {
    it('should register multiple asistencias', (done) => {
      const actividadId = 100;
      const asistencias = [
        { idUser: 501, estado: 'presente' as const, observacion: 'Usuario 1' },
        { idUser: 502, estado: 'ausente' as const, observacion: 'Usuario 2' }
      ];

      service.registrarAsistenciasMasivo(actividadId, asistencias).subscribe(result => {
        expect(result).toBeTruthy();
        expect(result.length).toBe(asistencias.length);
        done();
      });
    });
  });
});
