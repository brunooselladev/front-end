import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Chat } from '../models/chat.model';
import { MOCK_CHATS } from '../shared/mocks/mock-chats';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // Devuelve todos los chats
  getAllChats(): Observable<Chat[]> {
    return of(MOCK_CHATS).pipe(delay(500));
  }

  // Devuelve un chat por ID
  getChatById(id: number): Observable<Chat | null> {
    const chat = MOCK_CHATS.find(c => c.id === id);
    return of(chat || null).pipe(delay(300));
  }

  // Devuelve chats por ID de USMYA
  getChatsByUsmyaId(usmyaId: number): Observable<Chat[]> {
    const chats = MOCK_CHATS.filter(c => c.idUsmya === usmyaId);
    return of(chats).pipe(delay(400));
  }

  // Devuelve chats por tipo
  getChatsByTipo(tipo: 'general' | 'tratante'): Observable<Chat[]> {
    const chats = MOCK_CHATS.filter(c => c.tipo === tipo);
    return of(chats).pipe(delay(400));
  }

  // Crea un nuevo chat
  createChat(chatData: Omit<Chat, 'id'>): Observable<Chat> {
    const newChat: Chat = {
      id: Math.max(...MOCK_CHATS.map(c => c.id || 0)) + 1,
      ...chatData
    };
    MOCK_CHATS.push(newChat);
    return of(newChat).pipe(delay(600));
  }

  // Actualiza un chat
  updateChat(chatId: number, chatData: Partial<Chat>): Observable<Chat | null> {
    const chatIndex = MOCK_CHATS.findIndex(c => c.id === chatId);
    if (chatIndex > -1) {
      MOCK_CHATS[chatIndex] = { ...MOCK_CHATS[chatIndex], ...chatData };
      return of(MOCK_CHATS[chatIndex]).pipe(delay(500));
    }
    return of(null).pipe(delay(300));
  }

  // Elimina un chat
  deleteChat(chatId: number): Observable<boolean> {
    const chatIndex = MOCK_CHATS.findIndex(c => c.id === chatId);
    if (chatIndex > -1) {
      MOCK_CHATS.splice(chatIndex, 1);
      return of(true).pipe(delay(400));
    }
    return of(false).pipe(delay(300));
  }

  // Verifica si existe un chat para un USMYA específico
  chatExistsForUsmya(usmyaId: number, tipo?: 'general' | 'tratante'): Observable<boolean> {
    let chats = MOCK_CHATS.filter(c => c.idUsmya === usmyaId);
    if (tipo) {
      chats = chats.filter(c => c.tipo === tipo);
    }
    return of(chats.length > 0).pipe(delay(200));
  }
}