import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { withLatency } from './shared';

export const notasTrayectoriaService = {
  async getAll() {
    if (!USE_MOCKS) return apiFetch('/notas-trayectoria');
    return withLatency(mockStore.read('notasTrayectoria'), 220);
  },

  async getNotasByIdUsmya(usmyaId) {
    if (!USE_MOCKS) return apiFetch(`/notas-trayectoria?usmyaId=${usmyaId}`);
    return withLatency(
      mockStore.read('notasTrayectoria').filter((item) => Number(item.idUsmya) === Number(usmyaId)),
      220
    );
  },

  async getNotasByIdActor(actorId) {
    if (!USE_MOCKS) return apiFetch(`/notas-trayectoria?actorId=${actorId}`);
    return withLatency(
      mockStore.read('notasTrayectoria').filter((item) => Number(item.idActor) === Number(actorId)),
      220
    );
  },

  async getById(id) {
    if (!USE_MOCKS) return apiFetch(`/notas-trayectoria/${id}`);
    return withLatency(mockStore.findById('notasTrayectoria', id), 220);
  },

  async create(payload) {
    if (!USE_MOCKS)
      return apiFetch('/notas-trayectoria', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    return withLatency(mockStore.insert('notasTrayectoria', payload), 220);
  },

  async update(id, patch) {
    if (!USE_MOCKS)
      return apiFetch(`/notas-trayectoria/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
    return withLatency(mockStore.update('notasTrayectoria', id, patch), 220);
  },

  async delete(id) {
    if (!USE_MOCKS)
      return apiFetch(`/notas-trayectoria/${id}`, {
        method: 'DELETE',
      });
    return withLatency(mockStore.remove('notasTrayectoria', id), 220);
  },

  async getNotasByDateRange(usmyaId, startDate, endDate) {
    const list = await this.getNotasByIdUsmya(usmyaId);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return list.filter((item) => {
      const current = new Date(item.fecha);
      return current >= start && current <= end;
    });
  },

  async getRecentNotas(usmyaId, limit = 5) {
    const list = await this.getNotasByIdUsmya(usmyaId);
    return list.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, limit);
  },
};

