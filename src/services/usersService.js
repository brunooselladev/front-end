import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import {
  fromUserDTO,
  matchesSearch,
  normalizeEntityResponse,
  normalizeListResponse,
  toUserDTO,
  unsupportedByContract,
  withLatency,
} from './shared';

export const usuarioService = {
  async getAllUsers() {
    if (!USE_MOCKS) {
      const data = await apiFetch('/user?pageNumber=1&pageSize=100');
      return normalizeListResponse(data).map(fromUserDTO);
    }
    return withLatency(mockStore.read('users'), 350);
  },

  async getUsersPendingApproval() {
    if (!USE_MOCKS) {
      const data = await apiFetch('/user?Status=Pendiente&pageNumber=1&pageSize=100');
      const views = normalizeListResponse(data);
      return views
        .map(fromUserDTO)
        .filter((u) => String(u.status || '').toLowerCase() === 'pendiente')
        .map((u) => ({
          id: u.id,
          nombre: `${u.name} ${u.lastname}`,
          email: u.email,
          dni: u.nationalId,
          telefono: u.phoneNumber,
          direccionResidencia: u.direccionResidencia ?? u.address ?? null,
          idEspacio: u.idEspacio ?? null,
          creadoPor: u.creadoPor ?? null,
          role: u.role?.toLowerCase(),
          roleOriginal: u.role,
          status: u.status,
          registeredDate: u.registeredDate,
        }));
    }
    return withLatency(mockStore.read('users').filter((u) => u.isVerified === 'pendiente'), 350);
  },
  
  async getUsersByRole(role) {
    if (!USE_MOCKS) {
      const data = await apiFetch(`/user?Role=${encodeURIComponent(role)}&pageNumber=1&pageSize=100`);
      return normalizeListResponse(data).map(fromUserDTO);
    }
    return withLatency(mockStore.read('users').filter((u) => u.role === role), 350);
  },

  async getUserById(id) {
    if (!USE_MOCKS) {
      const data = await apiFetch(`/user/${id}`);
      return fromUserDTO(normalizeEntityResponse(data));
    }
    return withLatency(mockStore.findById('users', id), 220);
  },

  async getUsmyaByReferenteId(referenteId) {
    if (!USE_MOCKS) {
      unsupportedByContract('Relacion Referente-USMYA no definida en Swagger');
    }
    const item = mockStore
      .read('users')
      .find((u) => u.role === 'usmya' && Number(u.creadoPor) === Number(referenteId));
    return withLatency(item || null, 220);
  },

  async referenteHasUsmya(referenteId) {
    if (!USE_MOCKS) {
      unsupportedByContract('Relacion Referente-USMYA no definida en Swagger');
    }
    const has = mockStore
      .read('users')
      .some((u) => u.role === 'usmya' && Number(u.creadoPor) === Number(referenteId));
    return withLatency(has, 220);
  },

  async getCreadorByUsmyaId(usmyaId) {
    if (!USE_MOCKS) {
      unsupportedByContract('Relacion USMYA-creador no definida en Swagger');
    }
    const usmya = mockStore
      .read('users')
      .find((u) => u.role === 'usmya' && Number(u.id) === Number(usmyaId));
    if (!usmya?.creadoPor) return withLatency(null, 220);
    return withLatency(mockStore.findById('users', usmya.creadoPor), 220);
  },

  async usmyaHasCreador(usmyaId) {
    if (!USE_MOCKS) {
      unsupportedByContract('Relacion USMYA-creador no definida en Swagger');
    }
    const usmya = mockStore
      .read('users')
      .find((u) => u.role === 'usmya' && Number(u.id) === Number(usmyaId));
    return withLatency(Boolean(usmya?.creadoPor), 220);
  },

  async approveUser(userId, role) {
    if (!USE_MOCKS)
      return apiFetch(`/user/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ uuid: userId, role: role }),
      });
    mockStore.update('users', userId, { isVerified: 'aprobado' });
    return withLatency(true, 220);
  },

  async postVerified(userId, role) {
    return this.approveUser(userId, role);
  },

  async rejectUser(userId) {
    if (!USE_MOCKS)
      return apiFetch(`/user/${userId}`, {
        method: 'DELETE',
      });
    mockStore.remove('users', userId);
    return withLatency(true, 220);
  },

  async createUser(userData) {
    if (!USE_MOCKS)
      return apiFetch('/user', {
        method: 'POST',
        body: JSON.stringify(toUserDTO(userData)),
      });

    const entity = mockStore.insert('users', {
      email: '',
      role: '',
      isVerified: 'pendiente',
      nombre: '',
      dni: null,
      fechaNacimiento: null,
      telefono: null,
      direccionResidencia: null,
      alias: null,
      generoAutoPercibido: null,
      estadoCivil: null,
      obraSocial: null,
      geolocalizacion: null,
      creadoPor: null,
      requiereAprobacion: true,
      idEspacio: null,
      tipoProfesional: null,
      esEfector: false,
      esETratante: false,
      registroConUsmya: false,
      ...userData,
    });

    return withLatency(entity, 250);
  },

  async updateUser(userId, userData) {
    if (!USE_MOCKS) unsupportedByContract('No existe PATCH /user/{uuid} en Swagger');
    return withLatency(mockStore.update('users', userId, userData), 220);
  },

  async searchAvailableUsmya(searchTerm, referenteId) {
    if (!USE_MOCKS) {
      const users = await this.getUsersByRole('usmya');
      return users.filter((u) => {
        if (!searchTerm) return true;
        return (
          matchesSearch(u.nombre, searchTerm) ||
          matchesSearch(u.alias, searchTerm) ||
          matchesSearch(u.dni, searchTerm)
        );
      });
    }

    const relationships = mockStore.read('referenteUsmya');
    const relatedIds = relationships
      .filter((item) => Number(item.idReferente) === Number(referenteId))
      .map((item) => item.idUsmya);

    const filtered = mockStore
      .read('users')
      .filter((u) => u.role === 'usmya' && !relatedIds.includes(u.id))
      .filter((u) => {
        if (!searchTerm) return true;
        return (
          matchesSearch(u.nombre, searchTerm) ||
          matchesSearch(u.alias, searchTerm) ||
          matchesSearch(u.dni, searchTerm)
        );
      });

    return withLatency(filtered, 250);
  },

  async searchAvailableUsmyaForEfector(searchTerm, efectorId) {
    if (!USE_MOCKS) {
      const users = await this.getUsersByRole('usmya');
      return users.filter((u) => {
        if (!searchTerm) return true;
        return (
          matchesSearch(u.nombre, searchTerm) ||
          matchesSearch(u.alias, searchTerm) ||
          matchesSearch(u.dni, searchTerm)
        );
      });
    }

    const relationships = mockStore.read('efectorUsmya');
    const relatedIds = relationships
      .filter((item) => Number(item.idEfector) === Number(efectorId))
      .map((item) => item.idUsmya);

    const filtered = mockStore
      .read('users')
      .filter((u) => u.role === 'usmya' && !relatedIds.includes(u.id))
      .filter((u) => {
        if (!searchTerm) return true;
        return (
          matchesSearch(u.nombre, searchTerm) ||
          matchesSearch(u.alias, searchTerm) ||
          matchesSearch(u.dni, searchTerm)
        );
      });

    return withLatency(filtered, 250);
  },
};
