import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Mensaje } from '../models/mensaje.model';
import { MOCK_MENSAJES } from '../shared/mocks/mock-mensajes';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  // Devuelve todos los mensajes
  getAllMensajes(): Observable<Mensaje[]> {
    return of(MOCK_MENSAJES).pipe(delay(500));
  }

  // Devuelve un mensaje por ID
  getMensajeById(id: number): Observable<Mensaje | null> {
    const mensaje = MOCK_MENSAJES.find(m => m.id === id);
    return of(mensaje || null).pipe(delay(300));
  }

  // Devuelve todos los mensajes de un chat específico
  getMensajesByChatId(chatId: number): Observable<Mensaje[]> {
    const mensajes = MOCK_MENSAJES.filter(m => m.idChat === chatId);
    return of(mensajes).pipe(delay(400));
  }

  // Devuelve mensajes de un chat ordenados por fecha y hora (más recientes primero)
  getMensajesByChatIdOrdered(chatId: number): Observable<Mensaje[]> {
    const mensajes = MOCK_MENSAJES
      .filter(m => m.idChat === chatId)
      .sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.hora}`);
        const dateB = new Date(`${b.fecha}T${b.hora}`);
        return dateB.getTime() - dateA.getTime(); // Más recientes primero
      });
    return of(mensajes).pipe(delay(400));
  }

  // Devuelve los últimos N mensajes de un chat
  getUltimosMensajes(chatId: number, cantidad: number = 10): Observable<Mensaje[]> {
    const mensajes = MOCK_MENSAJES
      .filter(m => m.idChat === chatId)
      .sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.hora}`);
        const dateB = new Date(`${b.fecha}T${b.hora}`);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, cantidad);
    return of(mensajes).pipe(delay(350));
  }

  // Devuelve mensajes de un emisor específico
  getMensajesByEmisor(emisorId: number): Observable<Mensaje[]> {
    const mensajes = MOCK_MENSAJES.filter(m => m.idEmisor === emisorId);
    return of(mensajes).pipe(delay(400));
  }

  // Devuelve mensajes de un chat por un emisor específico
  getMensajesByChatAndEmisor(chatId: number, emisorId: number): Observable<Mensaje[]> {
    const mensajes = MOCK_MENSAJES.filter(m =>
      m.idChat === chatId && m.idEmisor === emisorId
    );
    return of(mensajes).pipe(delay(350));
  }

  // Envía un nuevo mensaje
  enviarMensaje(mensajeData: Omit<Mensaje, 'id'>): Observable<Mensaje> {
    const newMensaje: Mensaje = {
      id: Math.max(...MOCK_MENSAJES.map(m => m.id || 0)) + 1,
      ...mensajeData
    };
    MOCK_MENSAJES.push(newMensaje);
    return of(newMensaje).pipe(delay(600));
  }

  // Crea un nuevo mensaje (alias de enviarMensaje)
  createMensaje(mensajeData: Omit<Mensaje, 'id'>): Observable<Mensaje> {
    return this.enviarMensaje(mensajeData);
  }

  // Actualiza un mensaje (útil para editar mensajes)
  updateMensaje(mensajeId: number, mensajeData: Partial<Mensaje>): Observable<Mensaje | null> {
    const mensajeIndex = MOCK_MENSAJES.findIndex(m => m.id === mensajeId);
    if (mensajeIndex > -1) {
      MOCK_MENSAJES[mensajeIndex] = { ...MOCK_MENSAJES[mensajeIndex], ...mensajeData };
      return of(MOCK_MENSAJES[mensajeIndex]).pipe(delay(500));
    }
    return of(null).pipe(delay(300));
  }

  // Elimina un mensaje
  deleteMensaje(mensajeId: number): Observable<boolean> {
    const mensajeIndex = MOCK_MENSAJES.findIndex(m => m.id === mensajeId);
    if (mensajeIndex > -1) {
      MOCK_MENSAJES.splice(mensajeIndex, 1);
      return of(true).pipe(delay(400));
    }
    return of(false).pipe(delay(300));
  }

  // Obtiene el último mensaje de un chat
  getUltimoMensaje(chatId: number): Observable<Mensaje | null> {
    const mensajes = MOCK_MENSAJES.filter(m => m.idChat === chatId);
    if (mensajes.length === 0) {
      return of(null).pipe(delay(200));
    }

    const ultimoMensaje = mensajes.reduce((prev, current) => {
      const prevDate = new Date(`${prev.fecha}T${prev.hora}`);
      const currentDate = new Date(`${current.fecha}T${current.hora}`);
      return currentDate > prevDate ? current : prev;
    });

    return of(ultimoMensaje).pipe(delay(300));
  }

  // Cuenta mensajes en un chat
  countMensajesByChat(chatId: number): Observable<number> {
    const count = MOCK_MENSAJES.filter(m => m.idChat === chatId).length;
    return of(count).pipe(delay(200));
  }

  // Obtiene mensajes después de una fecha específica
  getMensajesAfterDate(chatId: number, fecha: string, hora: string = '00:00'): Observable<Mensaje[]> {
    const fechaLimite = new Date(`${fecha}T${hora}`);
    const mensajes = MOCK_MENSAJES.filter(m => {
      if (m.idChat !== chatId) return false;
      const mensajeDate = new Date(`${m.fecha}T${m.hora}`);
      return mensajeDate > fechaLimite;
    });
    return of(mensajes).pipe(delay(400));
  }
}