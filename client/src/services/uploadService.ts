import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function authHeaders(json = false): Record<string, string> {
  const token = useAuthStore.getState().accessToken;
  const h: Record<string, string> = {};
  if (token) h.Authorization = `Bearer ${token}`;
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

export interface UploadImageResult {
  success: boolean;
  url: string;
  publicId: string;
}

export interface UploadedProductImage {
  url: string;
  publicId: string;
}

export async function uploadProductImage(file: File): Promise<UploadImageResult> {
  const form = new FormData();
  form.append('image', file);
  const { data } = await axios.post<UploadImageResult>(`${API_BASE}/upload`, form, {
    withCredentials: true,
    headers: authHeaders(),
  });
  return data;
}

/** Upload up to 15 files per request (server limit). Call multiple times for larger batches. */
export async function uploadProductImages(files: File[]): Promise<UploadedProductImage[]> {
  if (!files.length) return [];
  const form = new FormData();
  for (const f of files) {
    form.append('images', f);
  }
  const { data } = await axios.post<{ success: boolean; files: UploadedProductImage[] }>(
    `${API_BASE}/upload/multiple`,
    form,
    {
      withCredentials: true,
      headers: authHeaders(),
    },
  );
  return data.files ?? [];
}

export async function deleteCloudinaryAsset(params: { publicId?: string; url?: string }): Promise<void> {
  const body: { publicId?: string; url?: string } = {};
  if (params.publicId?.trim()) body.publicId = params.publicId.trim();
  if (params.url?.trim()) body.url = params.url.trim();
  await axios.post(`${API_BASE}/upload/destroy`, body, {
    withCredentials: true,
    headers: authHeaders(true),
  });
}
