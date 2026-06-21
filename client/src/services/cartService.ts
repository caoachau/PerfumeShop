import api from './api';

/** Một dòng sau populate (giống enrichCart trên server). */
export interface ServerCartLine {
  _id?: string;
  qty: number;
  engravingText?: string;
  variant?: {
    _id: string;
    size: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    sku?: string;
    product?: {
      _id: string;
      name: string;
      images?: string[];
      isEngravable?: boolean;
    };
  };
}

export async function syncServerCart(
  items: Array<{ variantId: string; qty: number; engravingText?: string | null }>,
): Promise<ServerCartLine[]> {
  const { data } = await api.post<{ success: boolean; data: { items: ServerCartLine[] } }>('/cart/sync', {
    items,
  });
  return data.data.items;
}

export async function fetchServerCart(): Promise<ServerCartLine[]> {
  const { data } = await api.get<{ success: boolean; data: { items: ServerCartLine[] } }>('/cart');
  return data.data.items;
}
