import { USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { matchesSearch, unsupportedByContract, withLatency } from './shared';

export const tagsService = {
  async getAllTags() {
    if (!USE_MOCKS) unsupportedByContract('Tags API no definida en Swagger');
    return withLatency(mockStore.read('tags'), 220);
  },

  async searchTags(query) {
    if (!USE_MOCKS) unsupportedByContract('Tags API no definida en Swagger');
    return withLatency(
      mockStore
        .read('tags')
        .filter((tag) => matchesSearch(tag.nombre, query) || matchesSearch(tag.descripcion, query)),
      220
    );
  },

  async getTagById(id) {
    if (!USE_MOCKS) unsupportedByContract('Tags API no definida en Swagger');
    return withLatency(mockStore.findById('tags', id), 220);
  },

  async getTagsByIds(ids) {
    if (!USE_MOCKS) unsupportedByContract('Tags API no definida en Swagger');
    const set = new Set(ids.map((item) => Number(item)));
    return withLatency(mockStore.read('tags').filter((tag) => set.has(Number(tag.id))), 220);
  },
};

