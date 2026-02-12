import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { dateOnly, matchesSearch, withLatency } from './shared';

export const activitiesService = {
  async getAllActivities() {
    if (!USE_MOCKS) return apiFetch('/actividades');
    return withLatency(mockStore.read('actividades'), 300);
  },

  async getUnverifiedActivities() {
    if (!USE_MOCKS) return apiFetch('/actividades?isVerified=false');
    return withLatency(mockStore.read('actividades').filter((a) => !a.isVerified), 280);
  },

  async getActivityById(id) {
    if (!USE_MOCKS) return apiFetch(`/actividades/${id}`);
    return withLatency(mockStore.findById('actividades', id), 220);
  },

  async getActivitiesByEspacioId(espacioId) {
    if (!USE_MOCKS) return apiFetch(`/actividades?espacioId=${espacioId}`);
    return withLatency(
      mockStore.read('actividades').filter((a) => Number(a.espacioId) === Number(espacioId)),
      220
    );
  },

  async getFixedActivities() {
    if (!USE_MOCKS) return apiFetch('/actividades?esFija=true');
    return withLatency(mockStore.read('actividades').filter((a) => Boolean(a.esFija)), 220);
  },

  async getActivitiesByDate(date) {
    const dateValue = dateOnly(date);
    if (!USE_MOCKS) return apiFetch(`/actividades?dia=${dateValue}`);
    return withLatency(mockStore.read('actividades').filter((a) => dateOnly(a.dia) === dateValue), 220);
  },

  async createActivity(payload) {
    if (!USE_MOCKS)
      return apiFetch('/actividades', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    return withLatency(mockStore.insert('actividades', payload), 260);
  },

  async updateActivity(id, patch) {
    if (!USE_MOCKS)
      return apiFetch(`/actividades/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
    return withLatency(mockStore.update('actividades', id, patch), 240);
  },

  async deleteActivity(id) {
    if (!USE_MOCKS)
      return apiFetch(`/actividades/${id}`, {
        method: 'DELETE',
      });
    return withLatency(mockStore.remove('actividades', id), 220);
  },

  async getCurrentWeekActivities() {
    if (!USE_MOCKS) return apiFetch('/actividades/current-week');

    const today = new Date();
    const day = today.getDay() === 0 ? 7 : today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - day + 1);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const activities = mockStore.read('actividades').filter((item) => {
      const date = new Date(item.dia);
      return date >= monday && date <= sunday;
    });

    return withLatency(activities, 280);
  },

  async searchActivities(query) {
    if (!USE_MOCKS) return apiFetch(`/actividades/search?query=${encodeURIComponent(query)}`);

    return withLatency(
      mockStore
        .read('actividades')
        .filter(
          (a) =>
            matchesSearch(a.nombre, query) ||
            matchesSearch(a.descripcion, query) ||
            matchesSearch(a.responsable, query)
        ),
      220
    );
  },
};

