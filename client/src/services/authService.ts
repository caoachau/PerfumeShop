import axios from 'axios';
import api from './api';
import { clearAccessToken } from '../lib/authStorage';
import type { AuthUser } from '../store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  user: AuthUser;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    clearAccessToken();
  }
}

export async function fetchMe(): Promise<AuthUser> {
  const { data } = await api.get<{ success: boolean; user: AuthUser }>('/auth/me');
  return data.user;
}

/** Refresh access token using httpOnly refresh cookie (no Bearer). */
export async function tryRefreshSession(): Promise<LoginResponse | null> {
  try {
    const { data } = await axios.post<LoginResponse>(
      `${API_BASE}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    return data;
  } catch {
    return null;
  }
}
