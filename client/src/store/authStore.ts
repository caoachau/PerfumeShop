import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: AuthUser, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user, token) =>
      set({ user, accessToken: token, isAuthenticated: true, isLoading: false }),

    logout: () =>
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false }),

    setLoading: (isLoading) => set({ isLoading }),
  })),
);
