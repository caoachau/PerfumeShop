import api from './api';

export interface CategoryNode {
  _id: string;
  name: string;
  slug: string;
  children?: CategoryNode[];
}

export async function fetchCategories(): Promise<CategoryNode[]> {
  const { data } = await api.get<{ success: boolean; data: CategoryNode[] }>('/categories');
  return data.data;
}

export interface BrandRow {
  _id: string;
  name: string;
  slug: string;
  country?: string;
}

export async function fetchBrands(): Promise<BrandRow[]> {
  const { data } = await api.get<{ success: boolean; data: BrandRow[] }>('/brands');
  return data.data;
}
