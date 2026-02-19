﻿import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { matchesSearch, withLatency } from './shared';

export const espacioService = {
  async getAllEspacios() {
    if (!USE_MOCKS) {
      const data = await apiFetch('/workspace?PageNumber=1&PageSize=100');
      const views = data?.response?.views || data?.response?.items || data?.views || data?.items || [];

      return views.map((item) => ({
        id: item.uuid,
        nombre: item.name,
        telefono: item.phoneNumber,
        direccion: item.address,
        barrio: item.neighborhood ?? '',
        encargado: item.assignee,
        tipoOrganizacion: item.workspaceType,
        cuentaConInternet: item.internet,
        cuentaConDispositivo: item.device,
        diasHorarios: item.hours,
        actividadesPrincipales: item.mainActivity,
        actividadesSecundarias: item.secondaryActivity,
        poblacionVinculada: item.categories ?? [],
      }));
    }
    return withLatency(mockStore.read('espacios'), 300);
  },

  async getEspacioById(id) {
    if (!USE_MOCKS) return apiFetch(`/workspace/${id}`);
    return withLatency(mockStore.findById('espacios', id), 240);
  },

  async createEspacio(data) {
    if (!USE_MOCKS)
      return apiFetch('/workspace', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    return withLatency(mockStore.insert('espacios', data), 260);
  },

  async updateEspacio(id, data) {
    if (!USE_MOCKS)
      return apiFetch(`/workspace/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
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
      220
    );
  },

  async getEspaciosByTipo(tipo) {
    if (!USE_MOCKS) return apiFetch(`/workspace?Type=${encodeURIComponent(tipo)}`);
    return withLatency(mockStore.read('espacios').filter((item) => item.tipoOrganizacion === tipo), 220);
  },

  async getEspaciosByBarrio(barrio) {
    if (!USE_MOCKS) return apiFetch(`/espacios?barrio=${encodeURIComponent(barrio)}`);
    return withLatency(mockStore.read('espacios').filter((item) => matchesSearch(item.barrio, barrio)), 220);
  },

  async getEspaciosByPoblacion(poblacion) {
    if (!USE_MOCKS) return apiFetch(`/espacios?poblacion=${encodeURIComponent(poblacion)}`);
    return withLatency(
      mockStore.read('espacios').filter((item) => (item.poblacionVinculada || []).includes(poblacion)),
      220
    );
  },
};
