import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ReferenteUsmyaService } from './referente-usmya-service';
import { ReferenteUsmya } from '../models/referente-usmya.model';
import { MOCK_REFERENTE_USMYA } from '../shared/mocks/mock-referente-usmya';

describe('ReferenteUsmyaService', () => {
  let service: ReferenteUsmyaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReferenteUsmyaService]
    });
    service = TestBed.inject(ReferenteUsmyaService);
    
    // Resetear MOCK_REFERENTE_USMYA antes de cada prueba
    MOCK_REFERENTE_USMYA.length = 0;
    MOCK_REFERENTE_USMYA.push(
      { id: 1, idUsmya: 17, idReferente: 14 },
      { id: 2, idUsmya: 18, idReferente: 14 },
      { id: 3, idUsmya: 19, idReferente: 14 },
      { id: 4, idUsmya: 20, idReferente: 14 }
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all referente-usmya relationships', (done) => {
      service.getAll().subscribe(relationships => {
        expect(relationships.length).toBe(4);
        done();
      });
    });
  });

  describe('getById', () => {
    it('should return a relationship by id', (done) => {
      service.getById(1).subscribe(relationship => {
        expect(relationship).toBeDefined();
        expect(relationship?.id).toBe(1);
        expect(relationship?.idUsmya).toBe(17);
        expect(relationship?.idReferente).toBe(14);
        done();
      });
    });

    it('should return undefined for non-existent id', (done) => {
      service.getById(999).subscribe(relationship => {
        expect(relationship).toBeUndefined();
        done();
      });
    });
  });

  describe('getByIdReferente', () => {
    it('should return all relationships for a specific referente', (done) => {
      service.getByIdReferente(14).subscribe(relationships => {
        expect(relationships.length).toBe(4);
        relationships.forEach(r => expect(r.idReferente).toBe(14));
        done();
      });
    });

    it('should return empty array for referente without relationships', (done) => {
      service.getByIdReferente(999).subscribe(relationships => {
        expect(relationships.length).toBe(0);
        done();
      });
    });
  });

  describe('getByIdEfector', () => {
    it('should return all relationships for a specific usmya', (done) => {
      service.getByIdEfector(17).subscribe(relationships => {
        expect(relationships.length).toBe(1);
        expect(relationships[0].idUsmya).toBe(17);
        done();
      });
    });

    it('should return empty array for usmya without relationships', (done) => {
      service.getByIdEfector(999).subscribe(relationships => {
        expect(relationships.length).toBe(0);
        done();
      });
    });
  });

  describe('create', () => {
    it('should create a new referente-usmya relationship', (done) => {
      const newRelationship: Omit<ReferenteUsmya, 'id'> = {
        idUsmya: 21,
        idReferente: 15
      };

      service.create(newRelationship).subscribe(relationship => {
        expect(relationship.id).toBeDefined();
        expect(relationship.id).toBe(5);
        expect(relationship.idUsmya).toBe(21);
        expect(relationship.idReferente).toBe(15);
        done();
      });
    });

    it('should add the new relationship to the data array', (done) => {
      const newRelationship: Omit<ReferenteUsmya, 'id'> = {
        idUsmya: 22,
        idReferente: 16
      };

      service.create(newRelationship).subscribe(() => {
        service.getAll().subscribe(relationships => {
          expect(relationships.length).toBe(5);
          done();
        });
      });
    });
  });

  describe('update', () => {
    it('should update an existing relationship', (done) => {
      service.update(1, { idReferente: 15 }).subscribe(relationship => {
        expect(relationship).toBeDefined();
        expect(relationship?.id).toBe(1);
        expect(relationship?.idReferente).toBe(15);
        expect(relationship?.idUsmya).toBe(17); // No cambia
        done();
      });
    });

    it('should return null when updating non-existent relationship', (done) => {
      service.update(999, { idReferente: 15 }).subscribe(relationship => {
        expect(relationship).toBeNull();
        done();
      });
    });

    it('should update usmya id in relationship', (done) => {
      service.update(2, { idUsmya: 25 }).subscribe(relationship => {
        expect(relationship?.idUsmya).toBe(25);
        expect(relationship?.idReferente).toBe(14); // No cambia
        done();
      });
    });
  });

  describe('delete', () => {
    it('should delete an existing relationship', (done) => {
      service.delete(1).subscribe(result => {
        expect(result).toBeTruthy();
        
        service.getAll().subscribe(relationships => {
          expect(relationships.length).toBe(3);
          const deleted = relationships.find(r => r.id === 1);
          expect(deleted).toBeUndefined();
          done();
        });
      });
    });

    it('should return false when deleting non-existent relationship', (done) => {
      service.delete(999).subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });
  });

  describe('multiple referentes', () => {
    it('should handle multiple usmyas for same referente', (done) => {
      service.getByIdReferente(14).subscribe(relationships => {
        const usmyaIds = relationships.map(r => r.idUsmya);
        expect(usmyaIds).toContain(17);
        expect(usmyaIds).toContain(18);
        expect(usmyaIds).toContain(19);
        expect(usmyaIds).toContain(20);
        done();
      });
    });

    it('should create relationships for different referentes', (done) => {
      const newRelationship: Omit<ReferenteUsmya, 'id'> = {
        idUsmya: 17, // Mismo USMYA
        idReferente: 15 // Diferente referente
      };

      service.create(newRelationship).subscribe(() => {
        service.getByIdEfector(17).subscribe(relationships => {
          expect(relationships.length).toBe(2);
          done();
        });
      });
    });
  });
});
