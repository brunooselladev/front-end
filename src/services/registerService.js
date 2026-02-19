﻿import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { withLatency } from './shared';

const buildUserPayload = (role, payload) => ({
  role,
  email: payload.email,
  nombre: payload.nombre,
  telefono: payload.telefono || null,
  dni: payload.dni || null,
  fechaNacimiento: payload.fechaNacimiento || null,
  direccionResidencia: payload.direccionResidencia || null,
  alias: payload.alias || null,
  generoAutoPercibido: payload.generoAutoPercibido || null,
  estadoCivil: payload.estadoCivil || null,
  obraSocial: payload.obraSocial || null,
  geolocalizacion: payload.geolocalizacion || null,
  creadoPor: payload.creadoPor || null,
  requiereAprobacion: payload.requiereAprobacion ?? true,
  idEspacio: payload.idEspacio || null,
  tipoProfesional: payload.tipoProfesional || null,
  esEfector: role === 'efector',
  esETratante: payload.esETratante || false,
  registroConUsmya: payload.registroConUsmya || false,
  isVerified: 'pending',
});

export const registerService = {
  
  async postEfector(efector) {
    if (!USE_MOCKS)
      return apiFetch('/user', {
        method: 'POST',
        body: JSON.stringify({ ...efector, role: 'efector' }),
      });

    const user = mockStore.insert('users', buildUserPayload('efector', efector));
    mockStore.insert('authUsers', {
      email: efector.email,
      password: efector.password,
      userId: user.id,
    });

    return withLatency({ success: true, message: 'Efector registrado exitosamente', data: user }, 450);
  },

  async postAgente(agente) {
    if (!USE_MOCKS)
      return apiFetch('/user', {
        method: 'POST',
        body: JSON.stringify({ ...agente, role: 'agente' }),
      });

    const user = mockStore.insert('users', buildUserPayload('agente', agente));
    mockStore.insert('authUsers', {
      email: agente.email,
      password: agente.password,
      userId: user.id,
    });

    return withLatency({ success: true, message: 'Agente registrado exitosamente', data: user }, 450);
  },

  async postReferente(referente) {
    if (!USE_MOCKS)
      return apiFetch('/user', {
        method: 'POST',
        body: JSON.stringify({ ...referente, role: 'referente' }),
      });

    const user = mockStore.insert('users', buildUserPayload('referente', referente));
    mockStore.insert('authUsers', {
      email: referente.email,
      password: referente.password,
      userId: user.id,
    });

    return withLatency({ success: true, message: 'Referente registrado exitosamente', data: user }, 450);
  },

  async postUsmya(usmya) {
    if (!USE_MOCKS)
      return apiFetch('/user', {
        method: 'POST',
        body: JSON.stringify({ ...usmya, role: 'usmya' }),
      });

    const user = mockStore.insert(
      'users',
      buildUserPayload('usmya', {
        ...usmya,
        email: usmya.email || `usmya.${Date.now()}@test.com`,
      })
    );

    if (usmya.password) {
      mockStore.insert('authUsers', {
        email: user.email,
        password: usmya.password,
        userId: user.id,
      });
    }

    return withLatency({ success: true, message: 'USMYA registrado exitosamente', data: user }, 450);

  },

  async postEfectorUsmya(referenteUsmya) {

    if (!USE_MOCKS) {
      const referenteResponse = await apiFetch('/user', {
        method: 'POST',
        body: JSON.stringify({ ...referenteUsmya.referente, role: 'referente' }),
      });

      const usmyaResponse = await apiFetch('/user', {
        method: 'POST',
        body: JSON.stringify({
          ...referenteUsmya.usmya,
          role: 'usmya',
          creadoPor: referenteResponse?.response?.uuid || referenteResponse?.data?.id || 0,
          password: 'Usmya2024*',
        }),
      });

      return {
        success: true,
        message: 'Referente y USMYA registrados exitosamente',
        data: {
          referente: referenteResponse,
          usmya: usmyaResponse,
        },
      };
    }

    const referenteResponse = await this.postReferente(referenteUsmya.referente);

    const usmyaResponse = await this.postUsmya({
      ...referenteUsmya.usmya,
      creadoPor: referenteResponse.data.id,
    });

    mockStore.insert('referenteUsmya', {
      idReferente: referenteResponse.data.id,
      idUsmya: usmyaResponse.data.id,
    });

    return withLatency(
      {
        success: true,
        message: 'Referente y USMYA registrados exitosamente',
        data: {
          referente: referenteResponse.data,
          usmya: usmyaResponse.data,
        },
      },
      520
    );
  },

  async registerEspacio(espacio) {
    if (!USE_MOCKS)
      return apiFetch('/workspace', {
        method: 'POST',
        body: JSON.stringify({
          name: espacio.nombre || espacio.name,
          nationalId: espacio.nationalId || '',
          address: `${espacio.direccion || espacio.address || ''}, ${espacio.barrio || espacio.neighborhood || ''}`.trim().replace(/^,|,$/g, ''),          type: espacio.tipoOrganizacion || espacio.type,
          phoneNumber: espacio.telefono || espacio.phoneNumber || null,
          assignee: espacio.encargado || espacio.assignee || null,
          categories: espacio.poblacionVinculada || espacio.categories || [],
          hours: espacio.diasHorarios || espacio.hours || '',
          mainActivity: espacio.actividadesPrincipales || espacio.mainActivity || '',
          secondaryActivity: espacio.actividadesSecundarias || espacio.secondaryActivity || '',
        }),
      });

    const entity = mockStore.insert('espacios', espacio);
    return withLatency({ success: true, message: 'Espacio registrado exitosamente', data: entity }, 450);
  },

  async registerEspacioInMongo(espacio) {
    if (!USE_MOCKS)
      return apiFetch('/instituciones', {
        method: 'POST',
        body: JSON.stringify(espacio),
      });

    return this.registerEspacio(espacio);
  },
};