import { useEffect, useState } from 'react';
import { usuarioService } from '../services';
import { useAuthStore } from '../store/authStore';

export function useCurrentUser() {
  const authUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [currentUser, setCurrentUser] = useState(authUser || null);
  const [loading, setLoading] = useState(Boolean(isAuthenticated));

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      if (!isAuthenticated || !authUser) {
        if (mounted) {
          setCurrentUser(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        let user = null;

        if (authUser.id) {
          user = await usuarioService.getUserById(authUser.id);
        }

        if (!user && authUser.email) {
          const users = await usuarioService.getAllUsers();
          user = users.find((item) => item.email === authUser.email) || null;
        }

        if (mounted) {
          setCurrentUser(user || authUser);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setCurrentUser(authUser);
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [authUser, isAuthenticated]);

  return { currentUser, loading };
}

