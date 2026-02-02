import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EspacioService } from './espacio-service';
import { Espacio } from '../models/espacio.model';
import { MOCK_ESPACIOS } from '../shared/mocks/mock-espacios';

describe('EspacioService', () => {
  let service: EspacioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EspacioService]
    });
    
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
    
    service = TestBed.inject(EspacioService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllEspacios', () => {
    it('should return all espacios', (done) => {
      service.getAllEspacios().subscribe(espacios => {
        expect(espacios.length).toBe(MOCK_ESPACIOS.length);
        expect(espacios[0].id).toBeDefined();
        expect(espacios[0].nombre).toBeDefined();
        expect(espacios[0].tipoOrganizacion).toBeDefined();
        done();
      });
    });
  });

  describe('getEspacioById', () => {
    it('should return an espacio by id', (done) => {
      service.getEspacioById(1).subscribe(espacio => {
        expect(espacio).toBeDefined();
        expect(espacio?.id).toBe(1);
        expect(espacio?.nombre).toBe('Las Aldeas');
        expect(espacio?.tipoOrganizacion).toBe('comunitario');
        done();
      });
    });

    it('should return null for non-existent id', (done) => {
      service.getEspacioById(9999).subscribe(espacio => {
        expect(espacio).toBeNull();
        done();
      });
    });
  });

  describe('createEspacio', () => {
    it('should create a new espacio', (done) => {
      const newEspacioData: Omit<Espacio, 'id'> = {
        nombre: 'Nuevo Espacio Test',
        telefono: '3511234567',
        tipoOrganizacion: 'comunitario',
        direccion: 'Calle Test 123',
        barrio: 'Barrio Test',
        encargado: 'Encargado Test',
        poblacionVinculada: ['niños', 'adolescentes'],
        diasHorarios: 'Lunes a Viernes 9:00-17:00',
        actividadesPrincipales: 'Actividades test'
      };

      service.createEspacio(newEspacioData).subscribe(newEspacio => {
        expect(newEspacio.id).toBeDefined();
        expect(newEspacio.nombre).toBe('Nuevo Espacio Test');
        expect(newEspacio.telefono).toBe('3511234567');
        expect(newEspacio.tipoOrganizacion).toBe('comunitario');
        
        // Verificar que se agregó a la lista
        service.getAllEspacios().subscribe(espacios => {
          expect(espacios.length).toBe(MOCK_ESPACIOS.length + 1);
          done();
        });
      });
    });

    it('should assign incremental id to new espacio', (done) => {
      const newEspacioData: Omit<Espacio, 'id'> = {
        nombre: 'Espacio Incremental',
        telefono: '3519876543',
        tipoOrganizacion: 'educacion',
        encargado: 'Test User',
        poblacionVinculada: ['jovenes'],
        diasHorarios: 'Martes 14:00-18:00'
      };

      service.createEspacio(newEspacioData).subscribe(newEspacio => {
        expect(newEspacio.id).toBeGreaterThan(MOCK_ESPACIOS.length);
        done();
      });
    });

    it('should save new espacio to localStorage', (done) => {
      const newEspacioData: Omit<Espacio, 'id'> = {
        nombre: 'Espacio LocalStorage',
        telefono: '3511111111',
        tipoOrganizacion: 'deportiva',
        encargado: 'Storage Test',
        poblacionVinculada: ['adolescentes'],
        diasHorarios: 'Sábados 10:00-12:00'
      };

      service.createEspacio(newEspacioData).subscribe(() => {
        const stored = localStorage.getItem('espacios');
        expect(stored).toBeDefined();
        
        const espacios = JSON.parse(stored!);
        expect(espacios.length).toBe(MOCK_ESPACIOS.length + 1);
        done();
      });
    });
  });

  describe('updateEspacio', () => {
    it('should update an existing espacio', (done) => {
      const updateData: Partial<Espacio> = {
        nombre: 'Nombre Actualizado',
        telefono: '3519999999'
      };

      service.updateEspacio(1, updateData).subscribe(updatedEspacio => {
        expect(updatedEspacio).toBeDefined();
        expect(updatedEspacio?.id).toBe(1);
        expect(updatedEspacio?.nombre).toBe('Nombre Actualizado');
        expect(updatedEspacio?.telefono).toBe('3519999999');
        done();
      });
    });

    it('should return null when updating non-existent espacio', (done) => {
      service.updateEspacio(9999, { nombre: 'Test' }).subscribe(result => {
        expect(result).toBeNull();
        done();
      });
    });

    it('should preserve unmodified fields when updating', (done) => {
      service.updateEspacio(1, { telefono: '3510000000' }).subscribe(updated => {
        expect(updated?.nombre).toBe('Las Aldeas'); // Original value
        expect(updated?.telefono).toBe('3510000000'); // Updated value
        expect(updated?.tipoOrganizacion).toBe('comunitario'); // Original value
        done();
      });
    });

    it('should save updated espacio to localStorage', (done) => {
      service.updateEspacio(1, { nombre: 'Updated Name' }).subscribe(() => {
        const stored = localStorage.getItem('espacios');
        const espacios = JSON.parse(stored!);
        const updated = espacios.find((e: Espacio) => e.id === 1);
        
        expect(updated.nombre).toBe('Updated Name');
        done();
      });
    });
  });

  describe('deleteEspacio', () => {
    it('should delete an existing espacio', (done) => {
      service.deleteEspacio(1).subscribe(result => {
        expect(result).toBeTruthy();
        
        // Verificar que se eliminó
        service.getAllEspacios().subscribe(espacios => {
          expect(espacios.length).toBe(MOCK_ESPACIOS.length - 1);
          
          const deleted = espacios.find(e => e.id === 1);
          expect(deleted).toBeUndefined();
          done();
        });
      });
    });

    it('should return false when deleting non-existent espacio', (done) => {
      service.deleteEspacio(9999).subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });

    it('should update localStorage after deletion', (done) => {
      service.deleteEspacio(2).subscribe(() => {
        const stored = localStorage.getItem('espacios');
        const espacios = JSON.parse(stored!);
        
        expect(espacios.length).toBe(MOCK_ESPACIOS.length - 1);
        
        const deleted = espacios.find((e: Espacio) => e.id === 2);
        expect(deleted).toBeUndefined();
        done();
      });
    });
  });

  describe('searchEspaciosByNombre', () => {
    it('should find espacios by partial name match', (done) => {
      service.searchEspaciosByNombre('aldeas').subscribe(espacios => {
        expect(espacios.length).toBeGreaterThan(0);
        espacios.forEach(e => {
          expect(e.nombre.toLowerCase()).toContain('aldeas');
        });
        done();
      });
    });

    it('should be case insensitive', (done) => {
      service.searchEspaciosByNombre('ALDEAS').subscribe(espacios => {
        expect(espacios.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should return empty array for non-matching search', (done) => {
      service.searchEspaciosByNombre('NonExistentName123').subscribe(espacios => {
        expect(espacios.length).toBe(0);
        done();
      });
    });
  });

  describe('getEspaciosByTipo', () => {
    it('should filter espacios by tipo comunitario', (done) => {
      service.getEspaciosByTipo('comunitario').subscribe(espacios => {
        expect(espacios.length).toBeGreaterThan(0);
        espacios.forEach(e => {
          expect(e.tipoOrganizacion).toBe('comunitario');
        });
        done();
      });
    });

    it('should filter espacios by tipo merendero', (done) => {
      service.getEspaciosByTipo('merendero').subscribe(espacios => {
        expect(espacios.length).toBeGreaterThan(0);
        espacios.forEach(e => {
          expect(e.tipoOrganizacion).toBe('merendero');
        });
        done();
      });
    });

    it('should filter espacios by tipo religiosa', (done) => {
      service.getEspaciosByTipo('religiosa').subscribe(espacios => {
        expect(espacios.length).toBeGreaterThan(0);
        espacios.forEach(e => {
          expect(e.tipoOrganizacion).toBe('religiosa');
        });
        done();
      });
    });
  });

  describe('getEspaciosByBarrio', () => {
    it('should filter espacios by barrio', (done) => {
      service.getEspaciosByBarrio('aldeas').subscribe(espacios => {
        expect(espacios.length).toBeGreaterThan(0);
        espacios.forEach(e => {
          expect(e.barrio?.toLowerCase()).toContain('aldeas');
        });
        done();
      });
    });

    it('should be case insensitive for barrio search', (done) => {
      service.getEspaciosByBarrio('VILLA').subscribe(espacios => {
        expect(espacios.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should return empty array for non-matching barrio', (done) => {
      service.getEspaciosByBarrio('BarrioInexistente999').subscribe(espacios => {
        expect(espacios.length).toBe(0);
        done();
      });
    });
  });

  describe('getEspaciosByPoblacion', () => {
    it('should filter espacios by poblacion niños', (done) => {
      service.getEspaciosByPoblacion('niños').subscribe(espacios => {
        expect(espacios.length).toBeGreaterThan(0);
        espacios.forEach(e => {
          expect(e.poblacionVinculada).toContain('niños');
        });
        done();
      });
    });

    it('should filter espacios by poblacion adolescentes', (done) => {
      service.getEspaciosByPoblacion('adolescentes').subscribe(espacios => {
        expect(espacios.length).toBeGreaterThan(0);
        espacios.forEach(e => {
          expect(e.poblacionVinculada).toContain('adolescentes');
        });
        done();
      });
    });

    it('should filter espacios by poblacion familias', (done) => {
      service.getEspaciosByPoblacion('familias').subscribe(espacios => {
        expect(espacios.length).toBeGreaterThan(0);
        espacios.forEach(e => {
          expect(e.poblacionVinculada).toContain('familias');
        });
        done();
      });
    });

    it('should handle espacios with multiple poblaciones', (done) => {
      service.getEspaciosByPoblacion('niños').subscribe(espacios => {
        const espacioConMultiples = espacios.find(e => e.poblacionVinculada.length > 1);
        expect(espacioConMultiples).toBeDefined();
        done();
      });
    });
  });
});
