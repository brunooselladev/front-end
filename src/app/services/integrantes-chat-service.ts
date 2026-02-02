import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IntegrantesChat } from '../models/integrantes-chat.model';
import { MOCK_INTEGRANTES_CHAT } from '../shared/mocks/mock-integrantes-chat';

@Injectable({
  providedIn: 'root'
})
export class IntegrantesChatService {

  // Devuelve todos los integrantes de chat
  getAllIntegrantes(): Observable<IntegrantesChat[]> {
    return of(MOCK_INTEGRANTES_CHAT).pipe(delay(500));
  }

  // Devuelve un integrante por ID
  getIntegranteById(id: number): Observable<IntegrantesChat | null> {
    const integrante = MOCK_INTEGRANTES_CHAT.find(i => i.id === id);
    return of(integrante || null).pipe(delay(300));
  }

  // Devuelve todos los integrantes de un chat específico
  getIntegrantesByChatId(chatId: number): Observable<IntegrantesChat[]> {
    const integrantes = MOCK_INTEGRANTES_CHAT.filter(i => i.idChat === chatId);
    return of(integrantes).pipe(delay(400));
  }

  // Devuelve todos los chats donde participa un usuario específico
  getChatsByUserId(userId: number): Observable<IntegrantesChat[]> {
    const chatsUsuario = MOCK_INTEGRANTES_CHAT.filter(i => i.idUser === userId);
    return of(chatsUsuario).pipe(delay(400));
  }

  // Verifica si un usuario es integrante de un chat
  isUserInChat(chatId: number, userId: number): Observable<boolean> {
    const isIntegrante = MOCK_INTEGRANTES_CHAT.some(i =>
      i.idChat === chatId && i.idUser === userId
    );
    return of(isIntegrante).pipe(delay(200));
  }

  // Agrega un integrante a un chat
  addIntegranteToChat(chatId: number, userId: number): Observable<IntegrantesChat> {
    // Verificar que no exista ya
    const exists = MOCK_INTEGRANTES_CHAT.some(i =>
      i.idChat === chatId && i.idUser === userId
    );

    if (exists) {
      throw new Error('El usuario ya es integrante de este chat');
    }

    const newIntegrante: IntegrantesChat = {
      id: Math.max(...MOCK_INTEGRANTES_CHAT.map(i => i.id || 0)) + 1,
      idChat: chatId,
      idUser: userId
    };

    MOCK_INTEGRANTES_CHAT.push(newIntegrante);
    return of(newIntegrante).pipe(delay(500));
  }

  // Remueve un integrante de un chat
  removeIntegranteFromChat(chatId: number, userId: number): Observable<boolean> {
    const integranteIndex = MOCK_INTEGRANTES_CHAT.findIndex(i =>
      i.idChat === chatId && i.idUser === userId
    );

    if (integranteIndex > -1) {
      MOCK_INTEGRANTES_CHAT.splice(integranteIndex, 1);
      return of(true).pipe(delay(400));
    }
    return of(false).pipe(delay(300));
  }

  // Crea un nuevo integrante
  createIntegrante(integranteData: Omit<IntegrantesChat, 'id'>): Observable<IntegrantesChat> {
    const newIntegrante: IntegrantesChat = {
      id: Math.max(...MOCK_INTEGRANTES_CHAT.map(i => i.id || 0)) + 1,
      ...integranteData
    };
    MOCK_INTEGRANTES_CHAT.push(newIntegrante);
    return of(newIntegrante).pipe(delay(500));
  }

  // Actualiza un integrante
  updateIntegrante(integranteId: number, integranteData: Partial<IntegrantesChat>): Observable<IntegrantesChat | null> {
    const integranteIndex = MOCK_INTEGRANTES_CHAT.findIndex(i => i.id === integranteId);
    if (integranteIndex > -1) {
      MOCK_INTEGRANTES_CHAT[integranteIndex] = { ...MOCK_INTEGRANTES_CHAT[integranteIndex], ...integranteData };
      return of(MOCK_INTEGRANTES_CHAT[integranteIndex]).pipe(delay(400));
    }
    return of(null).pipe(delay(300));
  }

  // Elimina un integrante
  deleteIntegrante(integranteId: number): Observable<boolean> {
    const integranteIndex = MOCK_INTEGRANTES_CHAT.findIndex(i => i.id === integranteId);
    if (integranteIndex > -1) {
      MOCK_INTEGRANTES_CHAT.splice(integranteIndex, 1);
      return of(true).pipe(delay(400));
    }
    return of(false).pipe(delay(300));
  }
}