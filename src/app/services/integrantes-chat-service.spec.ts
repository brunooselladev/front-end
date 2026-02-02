import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { IntegrantesChatService } from './integrantes-chat-service';
import { IntegrantesChat } from '../models/integrantes-chat.model';
import { MOCK_INTEGRANTES_CHAT } from '../shared/mocks/mock-integrantes-chat';

describe('IntegrantesChatService', () => {
  let service: IntegrantesChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IntegrantesChatService]
    });
    service = TestBed.inject(IntegrantesChatService);
    
    // Resetear MOCK_INTEGRANTES_CHAT antes de cada prueba
    MOCK_INTEGRANTES_CHAT.length = 0;
    MOCK_INTEGRANTES_CHAT.push(
      { id: 1, idChat: 1, idUser: 6 },
      { id: 2, idChat: 1, idUser: 9 },
      { id: 3, idChat: 1, idUser: 13 },
      { id: 4, idChat: 2, idUser: 7 },
      { id: 5, idChat: 2, idUser: 10 },
      { id: 6, idChat: 2, idUser: 14 }
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllIntegrantes', () => {
    it('should return all integrantes', (done) => {
      service.getAllIntegrantes().subscribe(integrantes => {
        expect(integrantes.length).toBe(6);
        done();
      });
    });
  });

  describe('getIntegranteById', () => {
    it('should return an integrante by id', (done) => {
      service.getIntegranteById(1).subscribe(integrante => {
        expect(integrante).toBeDefined();
        expect(integrante?.id).toBe(1);
        expect(integrante?.idChat).toBe(1);
        expect(integrante?.idUser).toBe(6);
        done();
      });
    });

    it('should return null for non-existent id', (done) => {
      service.getIntegranteById(999).subscribe(integrante => {
        expect(integrante).toBeNull();
        done();
      });
    });
  });

  describe('getIntegrantesByChatId', () => {
    it('should return all integrantes for a specific chat', (done) => {
      service.getIntegrantesByChatId(1).subscribe(integrantes => {
        expect(integrantes.length).toBe(3);
        integrantes.forEach(i => expect(i.idChat).toBe(1));
        done();
      });
    });

    it('should return empty array for chat without integrantes', (done) => {
      service.getIntegrantesByChatId(999).subscribe(integrantes => {
        expect(integrantes.length).toBe(0);
        done();
      });
    });
  });

  describe('getChatsByUserId', () => {
    it('should return all chats for a specific user', (done) => {
      service.getChatsByUserId(6).subscribe(chats => {
        expect(chats.length).toBe(1);
        expect(chats[0].idUser).toBe(6);
        expect(chats[0].idChat).toBe(1);
        done();
      });
    });

    it('should return empty array for user not in any chat', (done) => {
      service.getChatsByUserId(999).subscribe(chats => {
        expect(chats.length).toBe(0);
        done();
      });
    });
  });

  describe('isUserInChat', () => {
    it('should return true if user is in chat', (done) => {
      service.isUserInChat(1, 6).subscribe(isIntegrante => {
        expect(isIntegrante).toBeTruthy();
        done();
      });
    });

    it('should return false if user is not in chat', (done) => {
      service.isUserInChat(1, 999).subscribe(isIntegrante => {
        expect(isIntegrante).toBeFalsy();
        done();
      });
    });

    it('should return false for non-existent chat', (done) => {
      service.isUserInChat(999, 6).subscribe(isIntegrante => {
        expect(isIntegrante).toBeFalsy();
        done();
      });
    });
  });

  describe('addIntegranteToChat', () => {
    it('should add a new integrante to chat', (done) => {
      service.addIntegranteToChat(3, 15).subscribe(integrante => {
        expect(integrante.id).toBeDefined();
        expect(integrante.idChat).toBe(3);
        expect(integrante.idUser).toBe(15);
        expect(MOCK_INTEGRANTES_CHAT.length).toBe(7);
        done();
      });
    });

    it('should throw error if user already in chat', () => {
      expect(() => {
        service.addIntegranteToChat(1, 6).subscribe();
      }).toThrow();
    });
  });

  describe('removeIntegranteFromChat', () => {
    it('should remove an integrante from chat', (done) => {
      const initialLength = MOCK_INTEGRANTES_CHAT.length;

      service.removeIntegranteFromChat(1, 6).subscribe(result => {
        expect(result).toBeTruthy();
        expect(MOCK_INTEGRANTES_CHAT.length).toBe(initialLength - 1);
        
        service.isUserInChat(1, 6).subscribe(exists => {
          expect(exists).toBeFalsy();
          done();
        });
      });
    });

    it('should return false when removing non-existent integrante', (done) => {
      service.removeIntegranteFromChat(999, 999).subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });
  });

  describe('createIntegrante', () => {
    it('should create a new integrante', (done) => {
      const newIntegrante: Omit<IntegrantesChat, 'id'> = {
        idChat: 3,
        idUser: 20
      };

      service.createIntegrante(newIntegrante).subscribe(integrante => {
        expect(integrante.id).toBeDefined();
        expect(integrante.id).toBe(7);
        expect(integrante.idChat).toBe(3);
        expect(integrante.idUser).toBe(20);
        done();
      });
    });
  });

  describe('updateIntegrante', () => {
    it('should update an existing integrante', (done) => {
      service.updateIntegrante(1, { idUser: 25 }).subscribe(integrante => {
        expect(integrante).toBeDefined();
        expect(integrante?.id).toBe(1);
        expect(integrante?.idUser).toBe(25);
        expect(integrante?.idChat).toBe(1); // No cambia
        done();
      });
    });

    it('should return null when updating non-existent integrante', (done) => {
      service.updateIntegrante(999, { idUser: 25 }).subscribe(integrante => {
        expect(integrante).toBeNull();
        done();
      });
    });
  });

  describe('deleteIntegrante', () => {
    it('should delete an existing integrante', (done) => {
      const initialLength = MOCK_INTEGRANTES_CHAT.length;

      service.deleteIntegrante(1).subscribe(result => {
        expect(result).toBeTruthy();
        expect(MOCK_INTEGRANTES_CHAT.length).toBe(initialLength - 1);
        done();
      });
    });

    it('should return false when deleting non-existent integrante', (done) => {
      service.deleteIntegrante(999).subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });
  });

  describe('chat management', () => {
    it('should handle multiple users in same chat', (done) => {
      service.getIntegrantesByChatId(1).subscribe(integrantes => {
        const userIds = integrantes.map(i => i.idUser);
        expect(userIds).toContain(6);
        expect(userIds).toContain(9);
        expect(userIds).toContain(13);
        done();
      });
    });

    it('should handle user in multiple chats', (done) => {
      // Agregar user 9 a chat 2
      MOCK_INTEGRANTES_CHAT.push({ id: 7, idChat: 2, idUser: 9 });

      service.getChatsByUserId(9).subscribe(chats => {
        expect(chats.length).toBe(2);
        const chatIds = chats.map(c => c.idChat);
        expect(chatIds).toContain(1);
        expect(chatIds).toContain(2);
        done();
      });
    });
  });
});
