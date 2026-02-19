import { USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { unsupportedByContract, withLatency } from './shared';

export const mensajeService = {
  async getAllMensajes() {
    if (!USE_MOCKS) unsupportedByContract('Messages API no definida en Swagger');
    return withLatency(mockStore.read('mensajes'), 220);
  },

  async getMensajeById(id) {
    if (!USE_MOCKS) unsupportedByContract('Messages API no definida en Swagger');
    return withLatency(mockStore.findById('mensajes', id), 220);
  },

  async getMensajesByChatId(chatId) {
    if (!USE_MOCKS) unsupportedByContract('Messages API no definida en Swagger');
    return withLatency(
      mockStore.read('mensajes').filter((message) => Number(message.idChat) === Number(chatId)),
      220
    );
  },

  async getMensajesByChatIdOrdered(chatId) {
    const list = await this.getMensajesByChatId(chatId);
    return list.sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));
  },

  async getUltimosMensajes(chatId, cantidad = 10) {
    const list = await this.getMensajesByChatIdOrdered(chatId);
    return list.slice(-cantidad);
  },

  async getMensajesByEmisor(emisorId) {
    if (!USE_MOCKS) unsupportedByContract('Messages API no definida en Swagger');
    return withLatency(
      mockStore.read('mensajes').filter((message) => Number(message.idEmisor) === Number(emisorId)),
      220
    );
  },

  async getMensajesByChatAndEmisor(chatId, emisorId) {
    const list = await this.getMensajesByChatId(chatId);
    return list.filter((message) => Number(message.idEmisor) === Number(emisorId));
  },

  async enviarMensaje(payload) {
    if (!USE_MOCKS) unsupportedByContract('Messages API no definida en Swagger');
    return withLatency(mockStore.insert('mensajes', payload), 220);
  },

  async createMensaje(payload) {
    return this.enviarMensaje(payload);
  },

  async updateMensaje(id, patch) {
    if (!USE_MOCKS) unsupportedByContract('Messages API no definida en Swagger');
    return withLatency(mockStore.update('mensajes', id, patch), 220);
  },

  async deleteMensaje(id) {
    if (!USE_MOCKS) unsupportedByContract('Messages API no definida en Swagger');
    return withLatency(mockStore.remove('mensajes', id), 220);
  },

  async getUltimoMensaje(chatId) {
    const list = await this.getMensajesByChatIdOrdered(chatId);
    return list[list.length - 1] || null;
  },

  async countMensajesByChat(chatId) {
    const list = await this.getMensajesByChatId(chatId);
    return list.length;
  },

  async getMensajesAfterDate(chatId, fecha, hora = '00:00') {
    const limit = new Date(`${fecha}T${hora}`);
    const list = await this.getMensajesByChatId(chatId);
    return list.filter((message) => new Date(`${message.fecha}T${message.hora}`) > limit);
  },
};

