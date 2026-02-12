import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { matchesSearch, withLatency } from './shared';

export const tagsService = {
  async getAllTags() {
    if (!USE_MOCKS) return apiFetch('/tags');
    return withLatency(mockStore.read('tags'), 220);
  },

  async searchTags(query) {
    if (!USE_MOCKS) return apiFetch(`/tags/search?query=${encodeURIComponent(query)}`);
    return withLatency(
      mockStore
        .read('tags')
        .filter((tag) => matchesSearch(tag.nombre, query) || matchesSearch(tag.descripcion, query)),
      220
    );
  },

  async getTagById(id) {
    if (!USE_MOCKS) return apiFetch(`/tags/${id}`);
    return withLatency(mockStore.findById('tags', id), 220);
  },

  async getTagsByIds(ids) {
    if (!USE_MOCKS) return apiFetch(`/tags/by-ids?ids=${ids.join(',')}`);
    const set = new Set(ids.map((item) => Number(item)));
    return withLatency(mockStore.read('tags').filter((tag) => set.has(Number(tag.id))), 220);
  },
};

