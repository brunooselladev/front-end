import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { withLatency } from './shared';

export const referenteUsmyaService = {
  async getAll() {
    if (!USE_MOCKS) return apiFetch('/referente-usmya');
    return withLatency(mockStore.read('referenteUsmya'), 220);
  },

  async getById(id) {
    if (!USE_MOCKS) return apiFetch(`/referente-usmya/${id}`);
    return withLatency(mockStore.findById('referenteUsmya', id), 220);
  },

  async getByIdReferente(idReferente) {
    if (!USE_MOCKS) return apiFetch(`/referente-usmya?referenteId=${idReferente}`);
    return withLatency(
      mockStore.read('referenteUsmya').filter((item) => Number(item.idReferente) === Number(idReferente)),
      220
    );
  },

  async create(payload) {
    if (!USE_MOCKS)
      return apiFetch('/referente-usmya', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    return withLatency(mockStore.insert('referenteUsmya', payload), 220);
  },

  async update(id, patch) {
    if (!USE_MOCKS)
      return apiFetch(`/referente-usmya/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
    return withLatency(mockStore.update('referenteUsmya', id, patch), 220);
  },

  async delete(id) {
    if (!USE_MOCKS)
      return apiFetch(`/referente-usmya/${id}`, {
        method: 'DELETE',
      });
    return withLatency(mockStore.remove('referenteUsmya', id), 220);
  },

  async getByIdEfector(idUsmya) {
    if (!USE_MOCKS) return apiFetch(`/referente-usmya?usmyaId=${idUsmya}`);
    return withLatency(
      mockStore.read('referenteUsmya').filter((item) => Number(item.idUsmya) === Number(idUsmya)),
      220
    );
  },
};

export const efectorUsmyaService = {
  async getAll() {
    if (!USE_MOCKS) return apiFetch('/efector-usmya');
    return withLatency(mockStore.read('efectorUsmya'), 220);
  },

  async getByUsmyaId(usmyaId) {
    if (!USE_MOCKS) return apiFetch(`/efector-usmya?usmyaId=${usmyaId}`);
    return withLatency(
      mockStore.read('efectorUsmya').filter((item) => Number(item.idUsmya) === Number(usmyaId)),
      220
    );
  },

  async getByEfectorId(efectorId) {
    if (!USE_MOCKS) return apiFetch(`/efector-usmya?efectorId=${efectorId}`);
    return withLatency(
      mockStore.read('efectorUsmya').filter((item) => Number(item.idEfector) === Number(efectorId)),
      220
    );
  },

  async getUsmyaUsersByEfectorId(efectorId) {
    const links = await this.getByEfectorId(efectorId);
    const ids = links.map((item) => item.idUsmya);
    const users = mockStore.read('users').filter((user) => user.role === 'usmya' && ids.includes(user.id));
    return withLatency(users, 220);
  },

  async create(payload) {
    if (!USE_MOCKS)
      return apiFetch('/efector-usmya', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    return withLatency(mockStore.insert('efectorUsmya', payload), 220);
  },

  async delete(id) {
    if (!USE_MOCKS)
      return apiFetch(`/efector-usmya/${id}`, {
        method: 'DELETE',
      });
    return withLatency(mockStore.remove('efectorUsmya', id), 220);
  },

  async deleteByIds(efectorId, usmyaId) {
    const list = mockStore.read('efectorUsmya');
    const item = list.find((x) => Number(x.idEfector) === Number(efectorId) && Number(x.idUsmya) === Number(usmyaId));
    if (!item) return withLatency(false, 220);
    return this.delete(item.id);
  },
};

