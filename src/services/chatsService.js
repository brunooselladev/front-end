import { USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { unsupportedByContract, withLatency } from './shared';

export const chatService = {
  async getAllChats() {
    if (!USE_MOCKS) unsupportedByContract('Chat API no definida en Swagger');
    return withLatency(mockStore.read('chats'), 220);
  },

  async getChatById(id) {
    if (!USE_MOCKS) unsupportedByContract('Chat API no definida en Swagger');
    return withLatency(mockStore.findById('chats', id), 220);
  },

  async getChatsByUsmyaId(usmyaId) {
    if (!USE_MOCKS) unsupportedByContract('Chat API no definida en Swagger');
    return withLatency(mockStore.read('chats').filter((c) => Number(c.idUsmya) === Number(usmyaId)), 220);
  },

  async getChatsByTipo(tipo) {
    if (!USE_MOCKS) unsupportedByContract('Chat API no definida en Swagger');
    return withLatency(mockStore.read('chats').filter((c) => c.tipo === tipo), 220);
  },

  async createChat(payload) {
    if (!USE_MOCKS) unsupportedByContract('Chat API no definida en Swagger');
    return withLatency(mockStore.insert('chats', payload), 220);
  },

  async updateChat(id, patch) {
    if (!USE_MOCKS) unsupportedByContract('Chat API no definida en Swagger');
    return withLatency(mockStore.update('chats', id, patch), 220);
  },

  async deleteChat(id) {
    if (!USE_MOCKS) unsupportedByContract('Chat API no definida en Swagger');
    return withLatency(mockStore.remove('chats', id), 220);
  },

  async chatExistsForUsmya(usmyaId, tipo) {
    const chats = await this.getChatsByUsmyaId(usmyaId);
    if (!tipo) return chats.length > 0;
    return chats.some((item) => item.tipo === tipo);
  },
};

export const integrantesChatService = {
  async getAllIntegrantes() {
    if (!USE_MOCKS) unsupportedByContract('Chat members API no definida en Swagger');
    return withLatency(mockStore.read('integrantesChat'), 220);
  },

  async getIntegranteById(id) {
    if (!USE_MOCKS) unsupportedByContract('Chat members API no definida en Swagger');
    return withLatency(mockStore.findById('integrantesChat', id), 220);
  },

  async getIntegrantesByChatId(chatId) {
    if (!USE_MOCKS) unsupportedByContract('Chat members API no definida en Swagger');
    return withLatency(
      mockStore.read('integrantesChat').filter((item) => Number(item.idChat) === Number(chatId)),
      220,
    );
  },

  async getChatsByUserId(userId) {
    if (!USE_MOCKS) unsupportedByContract('Chat members API no definida en Swagger');
    return withLatency(
      mockStore.read('integrantesChat').filter((item) => Number(item.idUser) === Number(userId)),
      220,
    );
  },

  async isUserInChat(chatId, userId) {
    const members = await this.getIntegrantesByChatId(chatId);
    return members.some((m) => Number(m.idUser) === Number(userId));
  },

  async addIntegranteToChat(chatId, userId) {
    return this.createIntegrante({ idChat: chatId, idUser: userId });
  },

  async removeIntegranteFromChat(chatId, userId) {
    const collection = mockStore.read('integrantesChat');
    const item = collection.find((m) => Number(m.idChat) === Number(chatId) && Number(m.idUser) === Number(userId));
    if (!item) return false;
    if (!USE_MOCKS) unsupportedByContract('Chat members API no definida en Swagger');
    return withLatency(mockStore.remove('integrantesChat', item.id), 220);
  },

  async createIntegrante(payload) {
    if (!USE_MOCKS) unsupportedByContract('Chat members API no definida en Swagger');

    const exists = mockStore
      .read('integrantesChat')
      .some((m) => Number(m.idChat) === Number(payload.idChat) && Number(m.idUser) === Number(payload.idUser));

    if (exists) {
      throw new Error('El usuario ya está en el chat');
    }

    return withLatency(mockStore.insert('integrantesChat', payload), 220);
  },

  async updateIntegrante(id, patch) {
    if (!USE_MOCKS) unsupportedByContract('Chat members API no definida en Swagger');
    return withLatency(mockStore.update('integrantesChat', id, patch), 220);
  },

  async deleteIntegrante(id) {
    if (!USE_MOCKS) unsupportedByContract('Chat members API no definida en Swagger');
    return withLatency(mockStore.remove('integrantesChat', id), 220);
  },
};

