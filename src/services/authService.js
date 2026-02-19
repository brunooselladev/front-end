import { apiFetch, USE_MOCKS } from './apiClient';
import { mockStore } from '../mocks';
import { withLatency } from './shared';

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

      // Transformamos la respuesta real del backend para que coincida con la
      // estructura que el frontend espera (basada en los mocks).
      if (apiResponse.success && apiResponse.response) {
        const backendUser = apiResponse.response;

        // Mapeamos el rol "Administrador" a "admin" para que coincida con la config del frontend.
        const roleMapping = {
          administrador: 'admin',
        };
        const rawRole = (backendUser.role || '').toLowerCase();
        const role = roleMapping[rawRole] || rawRole;

        return {
          success: true,
          message: apiResponse.message,
          data: {
            token: backendUser.token,
            user: { ...backendUser, role, nombre: `${backendUser.name} ${backendUser.lastname}` },
          },
        };
      }

      // Si la respuesta no fue exitosa o no tiene la forma esperada, la devolvemos como está.
      return apiResponse;
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
