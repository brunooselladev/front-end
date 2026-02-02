import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ChatService } from './chat-service';
import { Chat } from '../models/chat.model';
import { MOCK_CHATS } from '../shared/mocks/mock-chats';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService]
    });
    service = TestBed.inject(ChatService);
    
    // Resetear MOCK_CHATS antes de cada prueba
    MOCK_CHATS.length = 0;
    MOCK_CHATS.push(
      { id: 1, idUsmya: 17, tipo: 'general' },
      { id: 2, idUsmya: 18, tipo: 'general' },
      { id: 3, idUsmya: 19, tipo: 'general' },
      { id: 4, idUsmya: 17, tipo: 'tratante' },
      { id: 5, idUsmya: 18, tipo: 'tratante' },
      { id: 6, idUsmya: 19, tipo: 'tratante' }
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllChats', () => {
    it('should return all chats', (done) => {
      service.getAllChats().subscribe(chats => {
        expect(chats.length).toBe(6);
        expect(chats).toEqual(MOCK_CHATS);
        done();
      });
    });
  });

  describe('getChatById', () => {
    it('should return a chat by id', (done) => {
      service.getChatById(1).subscribe(chat => {
        expect(chat).toBeDefined();
        expect(chat?.id).toBe(1);
        expect(chat?.idUsmya).toBe(17);
        expect(chat?.tipo).toBe('general');
        done();
      });
    });

    it('should return null for non-existent chat id', (done) => {
      service.getChatById(999).subscribe(chat => {
        expect(chat).toBeNull();
        done();
      });
    });
  });

  describe('getChatsByUsmyaId', () => {
    it('should return all chats for a specific USMYA', (done) => {
      service.getChatsByUsmyaId(17).subscribe(chats => {
        expect(chats.length).toBe(2);
        expect(chats[0].idUsmya).toBe(17);
        expect(chats[1].idUsmya).toBe(17);
        expect(chats[0].tipo).toBe('general');
        expect(chats[1].tipo).toBe('tratante');
        done();
      });
    });

    it('should return empty array for USMYA without chats', (done) => {
      service.getChatsByUsmyaId(999).subscribe(chats => {
        expect(chats.length).toBe(0);
        done();
      });
    });
  });

  describe('getChatsByTipo', () => {
    it('should return all general chats', (done) => {
      service.getChatsByTipo('general').subscribe(chats => {
        expect(chats.length).toBe(3);
        chats.forEach(chat => {
          expect(chat.tipo).toBe('general');
        });
        done();
      });
    });

    it('should return all tratante chats', (done) => {
      service.getChatsByTipo('tratante').subscribe(chats => {
        expect(chats.length).toBe(3);
        chats.forEach(chat => {
          expect(chat.tipo).toBe('tratante');
        });
        done();
      });
    });
  });

  describe('createChat', () => {
    it('should create a new chat', (done) => {
      const newChatData: Omit<Chat, 'id'> = {
        idUsmya: 20,
        tipo: 'general'
      };

      service.createChat(newChatData).subscribe(newChat => {
        expect(newChat.id).toBeDefined();
        expect(newChat.id).toBe(7);
        expect(newChat.idUsmya).toBe(20);
        expect(newChat.tipo).toBe('general');
        expect(MOCK_CHATS.length).toBe(7);
        done();
      });
    });

    it('should create chat with incremental id', (done) => {
      const newChatData: Omit<Chat, 'id'> = {
        idUsmya: 21,
        tipo: 'tratante'
      };

      service.createChat(newChatData).subscribe(newChat => {
        expect(newChat.id).toBeGreaterThan(6);
        done();
      });
    });
  });

  describe('updateChat', () => {
    it('should update an existing chat', (done) => {
      const updateData: Partial<Chat> = {
        tipo: 'tratante'
      };

      service.updateChat(1, updateData).subscribe(updatedChat => {
        expect(updatedChat).toBeDefined();
        expect(updatedChat?.id).toBe(1);
        expect(updatedChat?.tipo).toBe('tratante');
        expect(updatedChat?.idUsmya).toBe(17); // No cambia
        done();
      });
    });

    it('should return null when updating non-existent chat', (done) => {
      service.updateChat(999, { tipo: 'general' }).subscribe(result => {
        expect(result).toBeNull();
        done();
      });
    });

    it('should update USMYA id in chat', (done) => {
      service.updateChat(2, { idUsmya: 25 }).subscribe(updatedChat => {
        expect(updatedChat?.idUsmya).toBe(25);
        expect(updatedChat?.tipo).toBe('general'); // No cambia
        done();
      });
    });
  });

  describe('deleteChat', () => {
    it('should delete an existing chat', (done) => {
      const initialLength = MOCK_CHATS.length;

      service.deleteChat(1).subscribe(result => {
        expect(result).toBeTruthy();
        expect(MOCK_CHATS.length).toBe(initialLength - 1);
        
        const deletedChat = MOCK_CHATS.find(c => c.id === 1);
        expect(deletedChat).toBeUndefined();
        done();
      });
    });

    it('should return false when deleting non-existent chat', (done) => {
      const initialLength = MOCK_CHATS.length;

      service.deleteChat(999).subscribe(result => {
        expect(result).toBeFalsy();
        expect(MOCK_CHATS.length).toBe(initialLength);
        done();
      });
    });
  });

  describe('chatExistsForUsmya', () => {
    it('should return true if USMYA has any chat', (done) => {
      service.chatExistsForUsmya(17).subscribe(exists => {
        expect(exists).toBeTruthy();
        done();
      });
    });

    it('should return false if USMYA has no chats', (done) => {
      service.chatExistsForUsmya(999).subscribe(exists => {
        expect(exists).toBeFalsy();
        done();
      });
    });

    it('should return true if USMYA has chat of specific tipo', (done) => {
      service.chatExistsForUsmya(17, 'general').subscribe(exists => {
        expect(exists).toBeTruthy();
        done();
      });
    });

    it('should return false if USMYA does not have chat of specific tipo', (done) => {
      // Eliminar todos los chats tratantes del USMYA 17
      const chatIndex = MOCK_CHATS.findIndex(c => c.idUsmya === 17 && c.tipo === 'tratante');
      MOCK_CHATS.splice(chatIndex, 1);

      service.chatExistsForUsmya(17, 'tratante').subscribe(exists => {
        expect(exists).toBeFalsy();
        done();
      });
    });

    it('should handle multiple chats of same tipo for same USMYA', (done) => {
      // Agregar otro chat general para USMYA 17
      MOCK_CHATS.push({ id: 10, idUsmya: 17, tipo: 'general' });

      service.chatExistsForUsmya(17, 'general').subscribe(exists => {
        expect(exists).toBeTruthy();
        done();
      });
    });
  });
});
