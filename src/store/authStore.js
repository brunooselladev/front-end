import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services';
import { mockStore } from '../mocks';

const safeParse = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(token);
  } catch {
    return null;
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      async login(email, password) {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          if (!response?.success) {
            set({ isLoading: false, error: response?.message || 'No fue posible iniciar sesión' });
            return { success: false, message: response?.message || 'No fue posible iniciar sesión' };
          }

          localStorage.setItem('jwtToken', response.data.token);

          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message || 'No fue posible iniciar sesión' });
          return { success: false, message: error.message || 'No fue posible iniciar sesión' };
        }
      },

      logout() {
        localStorage.removeItem('jwtToken');
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      restoreFromLegacyToken() {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        const decoded = safeParse(token);
        if (!decoded?.email || !decoded?.role) return;

        const users = mockStore.read('users');
        const user = users.find((item) => item.email === decoded.email);
        const normalizedUser = user
          ? {
              id: user.id,
              email: user.email,
              role: user.role,
              idEspacio: user.idEspacio,
              nombre: user.nombre,
            }
          : {
              id: decoded.id || null,
              email: decoded.email,
              role: decoded.role,
              idEspacio: decoded.idEspacio ?? null,
              nombre: decoded.nombre || null,
            };

        set({
          token,
          user: normalizedUser,
          isAuthenticated: true,
        });
      },

      getRole() {
        return get().user?.role || safeParse(get().token)?.role || null;
      },

      getEmail() {
        return get().user?.email || safeParse(get().token)?.email || null;
      },

      getIdEspacio() {
        const userValue = get().user?.idEspacio;
        if (userValue === null || userValue === undefined) {
          const decoded = safeParse(get().token);
          return decoded?.idEspacio ?? null;
        }
        return userValue;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

