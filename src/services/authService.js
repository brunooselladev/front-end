import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { fromUserDTO, normalizeEntityResponse, withLatency } from './shared';

export const authService = {
  async login(credentials) {
    const data =
      typeof credentials === 'object'
        ? credentials
        : { email: arguments[0], password: arguments[1] };

    if (!USE_MOCKS) {
      const apiResponse = await apiFetch('/user/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const entity = normalizeEntityResponse(apiResponse);
      const roleMapping = { administrador: 'admin' };
      const rawRole = String(entity?.role || '').toLowerCase();
      const role = roleMapping[rawRole] || rawRole || null;

      const user = entity ? { ...fromUserDTO(entity), role } : null;
      const token = entity?.token || apiResponse?.token || apiResponse?.data?.token || null;

      if (!user || !token) {
        return {
          success: false,
          message: apiResponse?.message || 'Respuesta de login invalida',
        };
      }

      return {
        success: true,
        message: apiResponse?.message,
        data: {
          token,
          user,
        },
      };
    }

    const authUsers = mockStore.read('authUsers');
    const users = mockStore.read('users');

    const authUser = authUsers.find(
      (item) => item.email === data.email && item.password === data.password
    );

    if (!authUser) {
      return withLatency({ success: false, message: 'Credenciales inválidas' }, 500);
    }

    const user = users.find((item) => item.id === authUser.userId);
    if (!user) {
      return withLatency({ success: false, message: 'Usuario no encontrado' }, 500);
    }

    const token = JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      idEspacio: user.idEspacio,
    });

    return withLatency(
      {
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            idEspacio: user.idEspacio,
            nombre: user.nombre,
          },
          token,
        },
      },
      800
    );
  },
};
