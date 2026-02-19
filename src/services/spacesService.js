﻿import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import {
  fromWorkspaceDTO,
  matchesSearch,
  normalizeEntityResponse,
  normalizeListResponse,
  toWorkspaceDTO,
  toWorkspaceUpdateDTO,
  withLatency,
} from './shared';

export const espacioService = {
  async getAllEspacios() {
    if (!USE_MOCKS) {
      const data = await apiFetch('/workspace?PageNumber=1&PageSize=100');
      return normalizeListResponse(data).map(fromWorkspaceDTO);
    }
    return withLatency(mockStore.read('espacios'), 300);
  },

  async getEspacioById(id) {
    if (!USE_MOCKS) {
      const spaces = await this.getAllEspacios();
      return spaces.find((item) => String(item.id) === String(id)) || null;
    }
    return withLatency(mockStore.findById('espacios', id), 240);
  },

  async createEspacio(data) {
    if (!USE_MOCKS) {
      const payload = toWorkspaceDTO(data);
      const response = await apiFetch('/workspace', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const entity = normalizeEntityResponse(response);
      return entity ? fromWorkspaceDTO(entity) : null;
    }
    return withLatency(mockStore.insert('espacios', data), 260);
  },

  async updateEspacio(id, data) {
    if (!USE_MOCKS) {
      const payload = toWorkspaceUpdateDTO(id, data);
      const response = await apiFetch(`/workspace/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const entity = normalizeEntityResponse(response);
      return entity ? fromWorkspaceDTO(entity) : null;
    }
    return withLatency(mockStore.update('espacios', id, data), 240);
  },

  async deleteEspacio(id) {
    if (!USE_MOCKS)
      return apiFetch(`/workspace/${id}`, {
        method: 'DELETE',
      });
    return withLatency(mockStore.remove('espacios', id), 240);
  },

  async searchEspaciosByNombre(nombre) {
    if (!USE_MOCKS) return apiFetch(`/workspace?Name=${encodeURIComponent(nombre)}`);
    return withLatency(
      mockStore.read('espacios').filter((item) => matchesSearch(item.nombre, nombre)),
      220,
    );
  },

  async getEspaciosByTipo(tipo) {
    if (!USE_MOCKS) return apiFetch(`/workspace?Type=${encodeURIComponent(tipo)}`);
    return withLatency(mockStore.read('espacios').filter((item) => item.tipoOrganizacion === tipo), 220);
  },

  async getEspaciosByBarrio(barrio) {
    if (!USE_MOCKS) {
      const spaces = await this.getAllEspacios();
      return spaces.filter((item) => matchesSearch(item.barrio, barrio));
    }
    return withLatency(mockStore.read('espacios').filter((item) => matchesSearch(item.barrio, barrio)), 220);
  },

  async getEspaciosByPoblacion(poblacion) {
    if (!USE_MOCKS) {
      const spaces = await this.getAllEspacios();
      return spaces.filter((item) => (item.poblacionVinculada || []).includes(poblacion));
    }
    return withLatency(
      mockStore.read('espacios').filter((item) => (item.poblacionVinculada || []).includes(poblacion)),
      220,
    );
  },
};
