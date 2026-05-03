import api from './api';

export interface StoreBrandRef {
  _id?: string;
  name: string;
  slug?: string;
  logo?: string;
  country?: string;
}

export interface StoreCategoryRef {
  _id?: string;
  name: string;
  slug?: string;
}

export interface StoreVariant {
  _id: string;
  sku: string;
  size: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  isActive?: boolean;
}

export interface StoreProductListItem {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  description?: string;
  concentration?: string;
  fragranceFamily?: string;
  gender?: string;
  isActive?: boolean;
  brand?: StoreBrandRef;
  category?: StoreCategoryRef;
  variants: StoreVariant[];
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  avgRating?: number;
  reviewCount?: number;
}

export interface ListProductsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function fetchStoreProducts(params: {
  page?: number;
  limit?: number;
  sort?: string;
  q?: string;
  brand?: string;
  category?: string;
  gender?: string;
  fragranceFamily?: string;
}) {
  const { data } = await api.get<{ success: boolean; data: StoreProductListItem[]; meta: ListProductsMeta }>(
    '/products',
    { params },
  );
  return data;
}

export interface ProductDetailPayload extends StoreProductListItem {
  variants: StoreVariant[];
  relatedProducts: StoreProductListItem[];
}

export async function fetchProductBySlug(slug: string) {
  const { data } = await api.get<{ success: boolean; data: ProductDetailPayload }>(`/products/slug/${encodeURIComponent(slug)}`);
  return data.data;
}

export interface StoreReviewRow {
  _id: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  user?: { name?: string; avatar?: string };
}

export async function fetchProductReviews(productId: string, page = 1, limit = 10) {
  const { data } = await api.get<{ success: boolean; data: StoreReviewRow[]; meta: ListProductsMeta }>(
    `/products/${productId}/reviews`,
    { params: { page, limit } },
  );
  return data;
}
