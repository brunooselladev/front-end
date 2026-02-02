import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ActivitiesService } from './activities-service';
import { MOCK_ACTIVIDADES } from '../shared/mocks/mock-actividades';

describe('ActivitiesService', () => {
  let service: ActivitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllActivities', () => {
    it('should return all activities', (done) => {
      service.getAllActivities().subscribe(activities => {
        expect(activities).toEqual(MOCK_ACTIVIDADES);
        expect(activities.length).toBeGreaterThan(0);
        done();
      });
    });
  });

  describe('getActivityById', () => {
    it('should return activity by id', (done) => {
      const testId = 1;
      service.getActivityById(testId).subscribe(activity => {
        expect(activity).toBeTruthy();
        expect(activity?.id).toBe(testId);
        done();
      });
    });

    it('should return null for non-existent id', (done) => {
      const nonExistentId = 999;
      service.getActivityById(nonExistentId).subscribe(activity => {
        expect(activity).toBeNull();
        done();
      });
    });
  });

  describe('createActivity', () => {
    it('should create a new activity', (done) => {
      const newActivity = {
        nombre: 'Nueva Actividad Test',
        descripcion: 'Descripción de prueba',
        dia: new Date('2025-10-25'),
        hora: '15:00',
        responsable: 'Test User',
        espacioId: 1,
        lugar: 'Sala de Pruebas',
        esFija: false
      };

      const initialLength = MOCK_ACTIVIDADES.length;

      service.createActivity(newActivity).subscribe(created => {
        expect(created).toBeTruthy();
        expect(created.id).toBeDefined();
        expect(created.nombre).toBe(newActivity.nombre);
        expect(MOCK_ACTIVIDADES.length).toBe(initialLength + 1);
        done();
      });
    });
  });

  describe('updateActivity', () => {
    it('should update an existing activity', (done) => {
      const updateData = { nombre: 'Nombre Actualizado' };
      const testId = 1;

      service.updateActivity(testId, updateData).subscribe(updated => {
        expect(updated).toBeTruthy();
        expect(updated?.nombre).toBe(updateData.nombre);
        done();
      });
    });

    it('should return null for non-existent activity', (done) => {
      const updateData = { nombre: 'Nombre Actualizado' };
      const nonExistentId = 999;

      service.updateActivity(nonExistentId, updateData).subscribe(result => {
        expect(result).toBeNull();
        done();
      });
    });
  });

  describe('deleteActivity', () => {
    it('should delete an existing activity', (done) => {
      const testId = 2;
      const initialLength = MOCK_ACTIVIDADES.length;

      service.deleteActivity(testId).subscribe(deleted => {
        expect(deleted).toBeTruthy();
        expect(MOCK_ACTIVIDADES.length).toBe(initialLength - 1);
        done();
      });
    });

    it('should return false for non-existent activity', (done) => {
      const nonExistentId = 999;

      service.deleteActivity(nonExistentId).subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });
  });

  describe('getActivitiesByEspacioId', () => {
    it('should return activities for specific espacio', (done) => {
      const espacioId = 1;

      service.getActivitiesByEspacioId(espacioId).subscribe(activities => {
        expect(activities).toBeTruthy();
        expect(activities.length).toBeGreaterThan(0);
        activities.forEach(activity => {
          expect(activity.espacioId).toBe(espacioId);
        });
        done();
      });
    });
  });

  describe('getFixedActivities', () => {
    it('should return only fixed activities', (done) => {
      service.getFixedActivities().subscribe(activities => {
        expect(activities).toBeTruthy();
        activities.forEach(activity => {
          expect(activity.esFija).toBeTruthy();
        });
        done();
      });
    });
  });

  describe('getUnverifiedActivities', () => {
    it('should return only unverified activities', (done) => {
      service.getUnverifiedActivities().subscribe(activities => {
        expect(activities).toBeTruthy();
        activities.forEach(activity => {
          expect(activity.isVerified).toBeFalsy();
        });
        done();
      });
    });
  });

  describe('getActivitiesByDate', () => {
    it('should return activities for specific date', (done) => {
      const testDate = new Date('2025-01-15');

      service.getActivitiesByDate(testDate).subscribe(activities => {
        expect(activities).toBeTruthy();
        activities.forEach(activity => {
          const activityDate = new Date(activity.dia);
          expect(activityDate.toDateString()).toBe(testDate.toDateString());
        });
        done();
      });
    });
  });

  describe('getCurrentWeekActivities', () => {
    it('should return activities for current week', (done) => {
      service.getCurrentWeekActivities().subscribe(activities => {
        expect(activities).toBeTruthy();
        
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        activities.forEach(activity => {
          const activityDate = new Date(activity.dia);
          expect(activityDate >= startOfWeek && activityDate <= endOfWeek).toBeTruthy();
        });
        done();
      });
    });
  });

  describe('searchActivities', () => {
    it('should find activities by name', (done) => {
      const query = 'Taller';

      service.searchActivities(query).subscribe(activities => {
        expect(activities).toBeTruthy();
        activities.forEach(activity => {
          const lowerQuery = query.toLowerCase();
          const matchesName = activity.nombre.toLowerCase().includes(lowerQuery);
          const matchesDesc = activity.descripcion.toLowerCase().includes(lowerQuery);
          const matchesResp = activity.responsable.toLowerCase().includes(lowerQuery);
          
          expect(matchesName || matchesDesc || matchesResp).toBeTruthy();
        });
        done();
      });
    });

    it('should return empty array for non-matching query', (done) => {
      const query = 'XYZ123NonExistent';

      service.searchActivities(query).subscribe(activities => {
        expect(activities).toBeTruthy();
        expect(activities.length).toBe(0);
        done();
      });
    });
  });

  describe('activities$ observable', () => {
    it('should emit activities when updated', (done) => {
      const newActivity = {
        nombre: 'Observable Test',
        descripcion: 'Test observable',
        dia: new Date(),
        hora: '10:00',
        responsable: 'Test',
        espacioId: 1,
        lugar: 'Test',
        esFija: false
      };

      service.activities$.subscribe(activities => {
        expect(activities).toBeTruthy();
        expect(Array.isArray(activities)).toBeTruthy();
      });

      service.createActivity(newActivity).subscribe(() => {
        done();
      });
    });
  });
});