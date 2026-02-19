﻿import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { dateOnly, matchesSearch, withLatency } from './shared';

export const activitiesService = {
  async getAllActivities() {
    if (!USE_MOCKS) {
      const data = await apiFetch('/activity?pageNumber=1&pageSize=100');
      // The API might wrap the list in `response` or `response.items`.
      // We also handle the case where it returns an array directly.
      return data?.response?.items || data?.response || data || [];
    }
    return withLatency(mockStore.read('actividades'), 300);
  },

  async getUnverifiedActivities() {
    if (!USE_MOCKS) {
      const data = await apiFetch('/activity?Status=pending&pageNumber=1&pageSize=100');
      return data?.response?.items || data?.response || data || [];
    }
    return withLatency(mockStore.read('actividades').filter((a) => !a.isVerified), 280);
  },

  async getActivityById(id) {
    if (!USE_MOCKS) return apiFetch(`/activity/${id}`);
    return withLatency(mockStore.findById('actividades', id), 220);
  },

  async getActivitiesByEspacioId(espacioId) {
    if (!USE_MOCKS) return apiFetch(`/activity?Workspace=${espacioId}`);
    return withLatency(
      mockStore.read('actividades').filter((a) => Number(a.espacioId) === Number(espacioId)),
      220
    );
  },

  async getFixedActivities() {
    if (!USE_MOCKS) return apiFetch('/activity?fixed=true');
    return withLatency(mockStore.read('actividades').filter((a) => Boolean(a.esFija)), 220);
  },

  async getActivitiesByDate(date) {
    const dateValue = dateOnly(date);
    if (!USE_MOCKS) return apiFetch(`/activity?assignmentDate=${dateValue}`);
    return withLatency(mockStore.read('actividades').filter((a) => dateOnly(a.dia) === dateValue), 220);
  },

  async createActivity(payload) {
    if (!USE_MOCKS)
      return apiFetch('/activity', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    return withLatency(mockStore.insert('actividades', payload), 260);
  },

  async updateActivity(id, patch) {
    if (!USE_MOCKS)
      return apiFetch('/activity', {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
    return withLatency(mockStore.update('actividades', id, patch), 240);
  },

  async deleteActivity(id) {
    if (!USE_MOCKS)
      return apiFetch(`/activity/${id}`, {
        method: 'DELETE',
      });
    return withLatency(mockStore.remove('actividades', id), 220);
  },

  async getCurrentWeekActivities() {

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
    if (!USE_MOCKS) return apiFetch(`/activity/search?query=${encodeURIComponent(query)}`);

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
