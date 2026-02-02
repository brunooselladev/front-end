import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MensajeService } from './mensaje-service';
import { Mensaje } from '../models/mensaje.model';
import { MOCK_MENSAJES } from '../shared/mocks/mock-mensajes';

describe('MensajeService', () => {
  let service: MensajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MensajeService]
    });
    service = TestBed.inject(MensajeService);
    
    // Resetear MOCK_MENSAJES antes de cada prueba
    MOCK_MENSAJES.length = 0;
    MOCK_MENSAJES.push(
      { id: 1, descripcion: 'Mensaje 1', idEmisor: 5, idChat: 1, fecha: '2025-11-01', hora: '09:30' },
      { id: 2, descripcion: 'Mensaje 2', idEmisor: 9, idChat: 1, fecha: '2025-11-01', hora: '09:35' },
      { id: 3, descripcion: 'Mensaje 3', idEmisor: 13, idChat: 1, fecha: '2025-11-01', hora: '09:40' },
      { id: 4, descripcion: 'Mensaje 4', idEmisor: 5, idChat: 2, fecha: '2025-11-02', hora: '10:00' },
      { id: 5, descripcion: 'Mensaje 5', idEmisor: 9, idChat: 2, fecha: '2025-11-02', hora: '10:05' }
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllMensajes', () => {
    it('should return all mensajes', (done) => {
      service.getAllMensajes().subscribe(mensajes => {
        expect(mensajes.length).toBe(5);
        done();
      });
    });
  });

  describe('getMensajeById', () => {
    it('should return a mensaje by id', (done) => {
      service.getMensajeById(1).subscribe(mensaje => {
        expect(mensaje).toBeDefined();
        expect(mensaje?.id).toBe(1);
        expect(mensaje?.descripcion).toBe('Mensaje 1');
        done();
      });
    });

    it('should return null for non-existent id', (done) => {
      service.getMensajeById(999).subscribe(mensaje => {
        expect(mensaje).toBeNull();
        done();
      });
    });
  });

  describe('getMensajesByChatId', () => {
    it('should return all mensajes for a specific chat', (done) => {
      service.getMensajesByChatId(1).subscribe(mensajes => {
        expect(mensajes.length).toBe(3);
        mensajes.forEach(m => expect(m.idChat).toBe(1));
        done();
      });
    });

    it('should return empty array for chat without mensajes', (done) => {
      service.getMensajesByChatId(999).subscribe(mensajes => {
        expect(mensajes.length).toBe(0);
        done();
      });
    });
  });

  describe('getMensajesByChatIdOrdered', () => {
    it('should return mensajes ordered by date descending', (done) => {
      service.getMensajesByChatIdOrdered(1).subscribe(mensajes => {
        expect(mensajes.length).toBe(3);
        expect(mensajes[0].id).toBe(3); // Más reciente
        expect(mensajes[2].id).toBe(1); // Más antiguo
        done();
      });
    });
  });

  describe('getUltimosMensajes', () => {
    it('should return last N mensajes of a chat', (done) => {
      service.getUltimosMensajes(1, 2).subscribe(mensajes => {
        expect(mensajes.length).toBe(2);
        expect(mensajes[0].id).toBe(3);
        expect(mensajes[1].id).toBe(2);
        done();
      });
    });

    it('should return all mensajes if count is larger than available', (done) => {
      service.getUltimosMensajes(2, 10).subscribe(mensajes => {
        expect(mensajes.length).toBe(2);
        done();
      });
    });
  });

  describe('getMensajesByEmisor', () => {
    it('should return all mensajes from a specific emisor', (done) => {
      service.getMensajesByEmisor(5).subscribe(mensajes => {
        expect(mensajes.length).toBe(2);
        mensajes.forEach(m => expect(m.idEmisor).toBe(5));
        done();
      });
    });

    it('should return empty array for emisor without mensajes', (done) => {
      service.getMensajesByEmisor(999).subscribe(mensajes => {
        expect(mensajes.length).toBe(0);
        done();
      });
    });
  });

  describe('getMensajesByChatAndEmisor', () => {
    it('should return mensajes from specific chat and emisor', (done) => {
      service.getMensajesByChatAndEmisor(1, 5).subscribe(mensajes => {
        expect(mensajes.length).toBe(1); // Solo mensaje 1 tiene chat 1 y emisor 5
        mensajes.forEach(m => {
          expect(m.idChat).toBe(1);
          expect(m.idEmisor).toBe(5);
        });
        done();
      });
    });

    it('should return empty array for non-matching combination', (done) => {
      service.getMensajesByChatAndEmisor(999, 999).subscribe(mensajes => {
        expect(mensajes.length).toBe(0);
        done();
      });
    });
  });

  describe('enviarMensaje', () => {
    it('should create and send a new mensaje', (done) => {
      const newMensaje: Omit<Mensaje, 'id'> = {
        descripcion: 'Nuevo mensaje',
        idEmisor: 10,
        idChat: 3,
        fecha: '2025-11-03',
        hora: '11:00'
      };

      service.enviarMensaje(newMensaje).subscribe(mensaje => {
        expect(mensaje.id).toBeDefined();
        expect(mensaje.id).toBe(6);
        expect(mensaje.descripcion).toBe('Nuevo mensaje');
        expect(MOCK_MENSAJES.length).toBe(6);
        done();
      });
    });
  });

  describe('createMensaje', () => {
    it('should create a new mensaje (alias)', (done) => {
      const newMensaje: Omit<Mensaje, 'id'> = {
        descripcion: 'Mensaje alias',
        idEmisor: 11,
        idChat: 4,
        fecha: '2025-11-04',
        hora: '12:00'
      };

      service.createMensaje(newMensaje).subscribe(mensaje => {
        expect(mensaje.id).toBe(6);
        expect(mensaje.descripcion).toBe('Mensaje alias');
        done();
      });
    });
  });

  describe('updateMensaje', () => {
    it('should update an existing mensaje', (done) => {
      service.updateMensaje(1, { descripcion: 'Mensaje editado' }).subscribe(mensaje => {
        expect(mensaje).toBeDefined();
        expect(mensaje?.id).toBe(1);
        expect(mensaje?.descripcion).toBe('Mensaje editado');
        done();
      });
    });

    it('should return null when updating non-existent mensaje', (done) => {
      service.updateMensaje(999, { descripcion: 'Test' }).subscribe(mensaje => {
        expect(mensaje).toBeNull();
        done();
      });
    });
  });

  describe('deleteMensaje', () => {
    it('should delete an existing mensaje', (done) => {
      const initialLength = MOCK_MENSAJES.length;

      service.deleteMensaje(1).subscribe(result => {
        expect(result).toBeTruthy();
        expect(MOCK_MENSAJES.length).toBe(initialLength - 1);
        done();
      });
    });

    it('should return false when deleting non-existent mensaje', (done) => {
      service.deleteMensaje(999).subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });
  });
});
