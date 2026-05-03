import api from './api';

export interface ListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminVariant {
  _id: string;
  sku: string;
  size: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  isActive: boolean;
}

export interface AdminProductRow {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  images: string[];
  brand?: { _id: string; name: string };
  category?: { _id: string; name: string };
  variants: AdminVariant[];
  totalStock: number;
}

/** Full product document from GET /admin/products/:id (spread product + variants). */
export interface AdminProductDetail extends Omit<AdminProductRow, 'totalStock'> {
  fragranceFamily: FragranceFamily;
  concentration: Concentration;
  gender: 'male' | 'female' | 'unisex';
  season: Array<'spring' | 'summer' | 'autumn' | 'winter' | 'all'>;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  description?: string;
  isEngravable: boolean;
  totalStock?: number;
}

export async function adminListProducts(params: { page?: number; limit?: number; q?: string }) {
  const { data } = await api.get<{ success: boolean; data: AdminProductRow[]; meta: ListMeta }>(
    '/admin/products',
    { params },
  );
  return data;
}

export async function adminGetProduct(id: string) {
  const { data } = await api.get<{ success: boolean; data: AdminProductDetail }>(`/admin/products/${id}`);
  return data.data;
}

export type FragranceFamily =
  | 'Floral'
  | 'Woody'
  | 'Fresh'
  | 'Oriental'
  | 'Gourmand'
  | 'Citrus'
  | 'Aquatic'
  | 'Aromatic';

export type Concentration = 'EDT' | 'EDP' | 'EDP Intense' | 'Parfum' | 'EDC';

export interface AdminCreateProductBody {
  name: string;
  slug?: string;
  brandId: string;
  categoryId: string;
  fragranceFamily: FragranceFamily;
  concentration: Concentration;
  gender?: 'male' | 'female' | 'unisex';
  season?: Array<'spring' | 'summer' | 'autumn' | 'winter' | 'all'>;
  images?: string[];
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  description?: string;
  isEngravable?: boolean;
  isActive?: boolean;
  variants: Array<{
    sku: string;
    size: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    isActive?: boolean;
  }>;
}

export async function adminCreateProduct(body: AdminCreateProductBody) {
  const { data } = await api.post<{ success: boolean; data: unknown }>('/admin/products', body);
  return data.data;
}

export async function adminUpdateProduct(id: string, body: Partial<AdminCreateProductBody>) {
  const { data } = await api.put<{ success: boolean; data: unknown }>(`/admin/products/${id}`, body);
  return data.data;
}

export async function adminDeactivateProduct(id: string) {
  await api.delete(`/admin/products/${id}`);
}

export async function adminAddVariant(
  productId: string,
  body: AdminCreateProductBody['variants'][0],
) {
  const { data } = await api.post<{ success: boolean; data: AdminVariant[] }>(
    `/admin/products/${productId}/variants`,
    body,
  );
  return data.data;
}

export async function adminUpdateVariant(variantId: string, body: Partial<AdminCreateProductBody['variants'][0]>) {
  const { data } = await api.put<{ success: boolean; data: AdminVariant }>(
    `/admin/products/variants/${variantId}`,
    body,
  );
  return data.data;
}

export async function adminDeactivateVariant(variantId: string) {
  await api.delete(`/admin/products/variants/${variantId}`);
}
