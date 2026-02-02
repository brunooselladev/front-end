import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EfectorUsmyaService } from './efector-usmya-service';
import { EfectorUsmya } from '../models/efector-usmya.model';
import { MOCK_EFECTOR_USMYA } from '../shared/mocks/mock-efector-usmya';

describe('EfectorUsmyaService', () => {
  let service: EfectorUsmyaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EfectorUsmyaService]
    });
    service = TestBed.inject(EfectorUsmyaService);
    
    // Resetear MOCK_EFECTOR_USMYA antes de cada prueba
    MOCK_EFECTOR_USMYA.length = 0;
    MOCK_EFECTOR_USMYA.push(
      { id: 1, idEfector: 9, idUsmya: 17 },
      { id: 2, idEfector: 9, idUsmya: 18 },
      { id: 3, idEfector: 9, idUsmya: 19 },
      { id: 4, idEfector: 9, idUsmya: 20 }
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all efector-usmya relationships', (done) => {
      service.getAll().subscribe(relationships => {
        expect(relationships.length).toBe(4);
        done();
      });
    });
  });

  describe('getByUsmyaId', () => {
    it('should return all relationships for a specific usmya', (done) => {
      service.getByUsmyaId(17).subscribe(relationships => {
        expect(relationships.length).toBe(1);
        expect(relationships[0].idUsmya).toBe(17);
        expect(relationships[0].idEfector).toBe(9);
        done();
      });
    });

    it('should return empty array for usmya without relationships', (done) => {
      service.getByUsmyaId(999).subscribe(relationships => {
        expect(relationships.length).toBe(0);
        done();
      });
    });
  });

  describe('getByEfectorId', () => {
    it('should return all relationships for a specific efector', (done) => {
      service.getByEfectorId(9).subscribe(relationships => {
        expect(relationships.length).toBe(4);
        relationships.forEach(r => expect(r.idEfector).toBe(9));
        done();
      });
    });

    it('should return empty array for efector without relationships', (done) => {
      service.getByEfectorId(999).subscribe(relationships => {
        expect(relationships.length).toBe(0);
        done();
      });
    });
  });

  describe('getUsmyaUsersByEfectorId', () => {
    it('should return usmya users for a specific efector', (done) => {
      service.getUsmyaUsersByEfectorId(9).subscribe(usmyas => {
        expect(usmyas.length).toBeGreaterThan(0);
        usmyas.forEach(usmya => {
          expect(usmya.id).toBeDefined();
          expect(usmya.nombre).toBeDefined();
        });
        done();
      });
    });

    it('should return empty array for efector without usmyas', (done) => {
      service.getUsmyaUsersByEfectorId(999).subscribe(usmyas => {
        expect(usmyas.length).toBe(0);
        done();
      });
    });

    it('should convert Usuario to Usmya format', (done) => {
      service.getUsmyaUsersByEfectorId(9).subscribe(usmyas => {
        if (usmyas.length > 0) {
          const usmya = usmyas[0];
          expect(usmya.dni).toBeDefined();
          expect(usmya.fechaNacimiento).toBeDefined();
          expect(usmya.telefono).toBeDefined();
        }
        done();
      });
    });
  });

  describe('create', () => {
    it('should create a new efector-usmya relationship', (done) => {
      const newRelationship: Omit<EfectorUsmya, 'id'> = {
        idEfector: 10,
        idUsmya: 21
      };

      service.create(newRelationship).subscribe(relationship => {
        expect(relationship.id).toBeDefined();
        expect(relationship.id).toBe(5);
        expect(relationship.idEfector).toBe(10);
        expect(relationship.idUsmya).toBe(21);
        expect(MOCK_EFECTOR_USMYA.length).toBe(5);
        done();
      });
    });

    it('should assign incremental id', (done) => {
      const newRelationship: Omit<EfectorUsmya, 'id'> = {
        idEfector: 11,
        idUsmya: 22
      };

      service.create(newRelationship).subscribe(relationship => {
        expect(relationship.id).toBeGreaterThan(4);
        done();
      });
    });
  });

  describe('delete', () => {
    it('should delete an existing relationship by id', (done) => {
      service.delete(1).subscribe(result => {
        expect(result).toBeTruthy();
        expect(MOCK_EFECTOR_USMYA.length).toBe(3);
        
        const deleted = MOCK_EFECTOR_USMYA.find(r => r.id === 1);
        expect(deleted).toBeUndefined();
        done();
      });
    });

    it('should return false when deleting non-existent relationship', (done) => {
      service.delete(999).subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });
  });

  describe('deleteByIds', () => {
    it('should delete relationship by efector and usmya ids', (done) => {
      service.deleteByIds(9, 17).subscribe(result => {
        expect(result).toBeTruthy();
        expect(MOCK_EFECTOR_USMYA.length).toBe(3);
        
        const deleted = MOCK_EFECTOR_USMYA.find(r => r.idEfector === 9 && r.idUsmya === 17);
        expect(deleted).toBeUndefined();
        done();
      });
    });

    it('should return false for non-matching ids', (done) => {
      service.deleteByIds(999, 999).subscribe(result => {
        expect(result).toBeFalsy();
        expect(MOCK_EFECTOR_USMYA.length).toBe(4);
        done();
      });
    });
  });

  describe('multiple relationships', () => {
    it('should handle efector with multiple usmyas', (done) => {
      service.getByEfectorId(9).subscribe(relationships => {
        const usmyaIds = relationships.map(r => r.idUsmya);
        expect(usmyaIds).toContain(17);
        expect(usmyaIds).toContain(18);
        expect(usmyaIds).toContain(19);
        expect(usmyaIds).toContain(20);
        done();
      });
    });

    it('should allow same usmya with different efectores', (done) => {
      const newRelationship: Omit<EfectorUsmya, 'id'> = {
        idEfector: 10,
        idUsmya: 17 // Mismo USMYA, diferente efector
      };

      service.create(newRelationship).subscribe(() => {
        service.getByUsmyaId(17).subscribe(relationships => {
          expect(relationships.length).toBe(2);
          const efectorIds = relationships.map(r => r.idEfector);
          expect(efectorIds).toContain(9);
          expect(efectorIds).toContain(10);
          done();
        });
      });
    });
  });

  describe('cascade operations', () => {
    it('should verify relationships after creation', (done) => {
      const newRelationship: Omit<EfectorUsmya, 'id'> = {
        idEfector: 11,
        idUsmya: 23
      };

      service.create(newRelationship).subscribe(() => {
        service.getByEfectorId(11).subscribe(relationships => {
          expect(relationships.length).toBe(1);
          expect(relationships[0].idUsmya).toBe(23);
          done();
        });
      });
    });

    it('should verify relationships after deletion', (done) => {
      service.delete(1).subscribe(() => {
        service.getByEfectorId(9).subscribe(relationships => {
          expect(relationships.length).toBe(3);
          const usmyaIds = relationships.map(r => r.idUsmya);
          expect(usmyaIds).not.toContain(17);
          done();
        });
      });
    });
  });
});
