﻿import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import {
  dateOnly,
  matchesSearch,
  normalizeListResponse,
  toActivityDTO,
  unsupportedByContract,
  withLatency,
} from './shared';

const fromActivityDTO = (item = {}) => ({
  ...item,
  id: item.uuid ?? item.id,
  nombre: item.nombre ?? item.name,
  descripcion: item.descripcion ?? item.description,
  dia: item.dia ?? item.assignmentDate,
  hora: item.hora ?? (item.assignmentDate ? new Date(item.assignmentDate).toISOString().slice(11, 16) : ''),
  esFija: item.esFija ?? item.fixed,
  espacioId: item.espacioId ?? item.workspaceNationalId,
  status: item.status,
});

export const activitiesService = {
  async getAllActivities() {
    if (!USE_MOCKS) {
      const data = await apiFetch('/activity?pageNumber=1&pageSize=100');
      return normalizeListResponse(data).map(fromActivityDTO);
    }
    return withLatency(mockStore.read('actividades'), 300);
  },

  async getUnverifiedActivities() {
    if (!USE_MOCKS) {
      const data = await apiFetch('/activity?Status=Pendiente&pageNumber=1&pageSize=100');
      return normalizeListResponse(data).map(fromActivityDTO);
    }
    return withLatency(mockStore.read('actividades').filter((a) => !a.isVerified), 280);
  },

  async getActivityById(id) {
    if (!USE_MOCKS) {
      const list = await this.getAllActivities();
      return list.find((item) => String(item.id) === String(id)) || null;
    }
    return withLatency(mockStore.findById('actividades', id), 220);
  },

  async getActivitiesByEspacioId(espacioId) {
    if (!USE_MOCKS) {
      const data = await apiFetch(`/activity?Workspace=${espacioId}`);
      return normalizeListResponse(data).map(fromActivityDTO);
    }
    return withLatency(
      mockStore.read('actividades').filter((a) => Number(a.espacioId) === Number(espacioId)),
      220,
    );
  },

  async getFixedActivities() {
    if (!USE_MOCKS) {
      const list = await this.getAllActivities();
      return list.filter((item) => Boolean(item.esFija));
    }
    return withLatency(mockStore.read('actividades').filter((a) => Boolean(a.esFija)), 220);
  },

  async getActivitiesByDate(date) {
    const dateValue = dateOnly(date);
    if (!USE_MOCKS) {
      const list = await this.getAllActivities();
      return list.filter((item) => item.dia && dateOnly(item.dia) === dateValue);
    }
    return withLatency(mockStore.read('actividades').filter((a) => dateOnly(a.dia) === dateValue), 220);
  },

  async createActivity(payload) {
    if (!USE_MOCKS) {
      const dto = toActivityDTO(payload, {
        workspaceNationalId: payload.workspaceNationalId ?? payload.espacioId,
      });
      return apiFetch('/activity', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
    }
    return withLatency(mockStore.insert('actividades', payload), 260);
  },

  async updateActivity(id, patch) {
    if (!USE_MOCKS) {
      const status =
        patch?.status ??
        (patch?.isVerified === true ? 'Aprobada' : patch?.isVerified === false ? 'Pendiente' : null);

      if (!status) {
        unsupportedByContract('Activity PATCH solo permite actualizar status (uuid, status)');
      }

      return apiFetch('/activity', {
        method: 'PATCH',
        body: JSON.stringify({ uuid: id, status }),
      });
    }
    return withLatency(mockStore.update('actividades', id, patch), 240);
  },

  async deleteActivity(id) {
    if (!USE_MOCKS) unsupportedByContract('Activity DELETE no existe en Swagger');
    return withLatency(mockStore.remove('actividades', id), 220);
  },

  async getCurrentWeekActivities() {

    if (!USE_MOCKS) {
      const activities = await this.getAllActivities();
      const today = new Date();
      const day = today.getDay() === 0 ? 7 : today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - day + 1);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      return activities.filter((item) => {
        const date = new Date(item.dia);
        return date >= monday && date <= sunday;
      });
    }

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
    if (!USE_MOCKS) {
      const activities = await this.getAllActivities();
      return activities.filter(
        (a) =>
          matchesSearch(a.nombre, query) ||
          matchesSearch(a.descripcion, query) ||
          matchesSearch(a.responsable, query),
      );
    }

    return withLatency(
      mockStore
        .read('actividades')
        .filter(
          (a) =>
            matchesSearch(a.nombre, query) ||
            matchesSearch(a.descripcion, query) ||
            matchesSearch(a.responsable, query),
        ),
      220,
    );
  },
};
