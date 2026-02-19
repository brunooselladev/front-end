﻿import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { normalizeEntityResponse, toUserDTO, toWorkspaceDTO, unsupportedByContract, withLatency } from './shared';

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
        body: JSON.stringify(toUserDTO({ ...efector, role: 'Efector' })),
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
        body: JSON.stringify(toUserDTO({ ...agente, role: 'agente' })),
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
        body: JSON.stringify(toUserDTO({ ...referente, role: 'referente' })),
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
      {
        const nationalId = String(usmya.nationalId ?? usmya.dni ?? '').trim();
        const fallbackEmail = nationalId ? `usmya.${nationalId}@mappa.local` : null;
        const baseDto = toUserDTO({
          ...usmya,
          role: 'usmya',
          lastname: usmya.lastname || usmya.apellido || 'Sin apellido',
          phoneNumber: usmya.phoneNumber || usmya.telefono || '0',
          email: usmya.email ?? fallbackEmail,
          type: usmya.type ?? 'Usmya',
        });

        return apiFetch('/user', {
          method: 'POST',
          body: JSON.stringify({
            ...baseDto,
            direccionResidencia: usmya.direccionResidencia ?? null,
            alias: usmya.alias ?? null,
            generoAutoPercibido: usmya.generoAutoPercibido ?? null,
            estadoCivil: usmya.estadoCivil ?? null,
            obraSocial: usmya.obraSocial ?? null,
          }),
        });
      }

    const user = mockStore.insert(
      'users',
      buildUserPayload('usmya', {
        ...usmya,
        email: usmya.email || `usmya.${Date.now()}@test.com`,
      }),
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
        body: JSON.stringify(toUserDTO({ ...referenteUsmya.referente, role: 'referente' })),
      });

      const referente = normalizeEntityResponse(referenteResponse);
      const referenteId = referente?.uuid || referente?.id || null;

      const usmyaResponse = await apiFetch('/user', {
        method: 'POST',
        body: JSON.stringify({
          ...toUserDTO({
            ...referenteUsmya.usmya,
            nationalId:
              referenteUsmya.usmya.nationalId ??
              referenteUsmya.usmya.dni ??
              referenteUsmya.usmya.usmyaDni,
            role: 'usmya',
            lastname: referenteUsmya.usmya.lastname || referenteUsmya.usmya.apellido || 'Sin apellido',
            phoneNumber: referenteUsmya.usmya.phoneNumber || referenteUsmya.usmya.telefono || '0',
            email:
              referenteUsmya.usmya.email ??
              (referenteUsmya.usmya.nationalId || referenteUsmya.usmya.dni || referenteUsmya.usmya.usmyaDni
                ? `usmya.${referenteUsmya.usmya.nationalId || referenteUsmya.usmya.dni || referenteUsmya.usmya.usmyaDni}@mappa.local`
                : null),
            type: referenteUsmya.usmya.type ?? 'Usmya',
            createdBy: referenteId,
            password: 'Usmya2024*',
          }),
          direccionResidencia: referenteUsmya.usmya.direccionResidencia ?? null,
          alias: referenteUsmya.usmya.alias ?? null,
          generoAutoPercibido: referenteUsmya.usmya.generoAutoPercibido ?? null,
          estadoCivil: referenteUsmya.usmya.estadoCivil ?? null,
          obraSocial: referenteUsmya.usmya.obraSocial ?? null,
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
      520,
    );
  },

  async registerEspacio(espacio) {
    if (!USE_MOCKS)
      return apiFetch('/workspace', {
        method: 'POST',
        body: JSON.stringify(
          toWorkspaceDTO({
            ...espacio,
            address: `${espacio.direccion || espacio.address || ''}, ${espacio.barrio || espacio.neighborhood || ''}`
              .trim()
              .replace(/^,|,$/g, ''),
          }),
        ),
      });

    const entity = mockStore.insert('espacios', espacio);
    return withLatency({ success: true, message: 'Espacio registrado exitosamente', data: entity }, 450);
  },

  async registerEspacioInMongo(espacio) {
    if (!USE_MOCKS) unsupportedByContract('Endpoint /instituciones no existe en Swagger');

    return this.registerEspacio(espacio);
  },
};