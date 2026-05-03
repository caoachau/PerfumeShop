import { useEffect } from 'react';
import { fetchMe, tryRefreshSession } from '../../services/authService';
import { readAccessToken } from '../../lib/authStorage';
import { useAuthStore } from '../../store/authStore';

/**
 * Restores session on load: access token in localStorage, or refresh cookie.
 */
export default function AuthBootstrap() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const token = readAccessToken();
      if (token) {
        useAuthStore.setState({ accessToken: token });
      }

      try {
        if (token) {
          const user = await fetchMe();
          if (!cancelled) setUser(user, token);
        } else {
          const refreshed = await tryRefreshSession();
          if (refreshed && !cancelled) {
            setUser(refreshed.user, refreshed.accessToken);
          } else if (!cancelled) {
            logout();
          }
        }
      } catch {
        const refreshed = await tryRefreshSession();
        if (refreshed && !cancelled) {
          setUser(refreshed.user, refreshed.accessToken);
        } else if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [logout, setLoading, setUser]);

  return null;
}
