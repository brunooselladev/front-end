import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { withLatency } from './shared';

export const asistenciaService = {
  async getAllAsistencias() {
    if (!USE_MOCKS) return apiFetch('/asistencias');
    return withLatency(mockStore.read('asistencias'), 220);
  },

  async getAsistenciaById(id) {
    if (!USE_MOCKS) return apiFetch(`/asistencias/${id}`);
    return withLatency(mockStore.findById('asistencias', id), 220);
  },

  async getAsistenciasByActividadId(actividadId) {
    if (!USE_MOCKS) return apiFetch(`/asistencias?actividadId=${actividadId}`);
    return withLatency(
      mockStore.read('asistencias').filter((a) => Number(a.idActividad) === Number(actividadId)),
      220
    );
  },

  async createAsistencia(asistencia) {
    if (!USE_MOCKS)
      return apiFetch('/asistencias', {
        method: 'POST',
        body: JSON.stringify(asistencia),
      });
    return withLatency(mockStore.insert('asistencias', asistencia), 220);
  },

  async updateAsistencia(id, patch) {
    if (!USE_MOCKS)
      return apiFetch(`/asistencias/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
    return withLatency(mockStore.update('asistencias', id, patch), 220);
  },

  async getAsistenciasByUsmyaId(usmyaId) {
    return this.getAsistenciasByUser(usmyaId);
  },

  async getAsistenciasByActividad(idActividad) {
    return this.getAsistenciasByActividadId(idActividad);
  },

  async getAsistenciasByUser(idUser) {
    if (!USE_MOCKS) return apiFetch(`/asistencias?idUser=${idUser}`);
    return withLatency(mockStore.read('asistencias').filter((a) => Number(a.idUser) === Number(idUser)), 220);
  },

  async getAsistenciasByEstado(estado) {
    if (!USE_MOCKS) return apiFetch(`/asistencias?estado=${estado}`);
    return withLatency(mockStore.read('asistencias').filter((a) => a.estado === estado), 220);
  },

  async marcarPresente(id, observacion = 'Asistencia confirmada') {
    return this.updateAsistencia(id, { estado: 'presente', observacion });
  },

  async marcarAusente(id, observacion = 'Ausencia registrada') {
    return this.updateAsistencia(id, { estado: 'ausente', observacion });
  },

  async getEstadisticasByActividad(idActividad) {
    const asistencias = await this.getAsistenciasByActividadId(idActividad);
    const total = asistencias.length;
    const presentes = asistencias.filter((a) => a.estado === 'presente').length;
    const ausentes = total - presentes;
    const porcentajeAsistencia = total ? (presentes / total) * 100 : 0;
    return { total, presentes, ausentes, porcentajeAsistencia };
  },

  async verificarAsistencia(idActividad, idUser) {
    const list = await this.getAsistenciasByActividadId(idActividad);
    return list.find((a) => Number(a.idUser) === Number(idUser)) || null;
  },

  async registrarAsistenciasMasivo(idActividad, asistencias) {
    const out = [];
    for (const item of asistencias) {
      const existing = await this.verificarAsistencia(idActividad, item.idUser);
      if (existing) {
        const updated = await this.updateAsistencia(existing.id, item);
        out.push(updated);
      } else {
        const created = await this.createAsistencia({ ...item, idActividad });
        out.push(created);
      }
    }
    return out;
  },
};

