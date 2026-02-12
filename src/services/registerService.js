import { apiFetch, USE_MOCKS } from './apiClient';
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
  isVerified: 'pendiente',
});

export const registerService = {
  async postEfector(efector) {
    if (!USE_MOCKS)
      return apiFetch('/register/efector', {
        method: 'POST',
        body: JSON.stringify(efector),
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
      return apiFetch('/register/agente', {
        method: 'POST',
        body: JSON.stringify(agente),
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
      return apiFetch('/register/referente', {
        method: 'POST',
        body: JSON.stringify(referente),
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
      return apiFetch('/register/usmya', {
        method: 'POST',
        body: JSON.stringify(usmya),
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
    if (!USE_MOCKS)
      return apiFetch('/register/referente-usmya', {
        method: 'POST',
        body: JSON.stringify(referenteUsmya),
      });

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
      return apiFetch('/espacios', {
        method: 'POST',
        body: JSON.stringify(espacio),
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

