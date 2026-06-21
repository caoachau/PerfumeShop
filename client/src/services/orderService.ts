import api from './api';

export interface ShippingAddressPayload {
  name: string;
  phone: string;
  email?: string;
  street: string;
  ward: string;
  district: string;
  province: string;
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddressPayload;
  /** VND — tối đa 2 tr (đồng bộ schema server). */
  shippingFee?: number;
  paymentMethod: 'cod' | 'bank_transfer';
  note?: string;
}

export interface CreatedOrderDto {
  _id: string;
  finalTotal: number;
  shippingFee?: number;
  orderStatus?: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<{
  order: CreatedOrderDto & Record<string, unknown>;
  payment: unknown;
}> {
  const { data } = await api.post<{
    success: boolean;
    data: { order: CreatedOrderDto & Record<string, unknown>; payment: unknown };
  }>(`/orders`, payload);
  return data.data;
}

export async function fetchMyOrders(page = 1, limit = 10) {
  const { data } = await api.get<{ success: boolean; data: unknown[]; meta: unknown }>(
    `/orders/me`,
    { params: { page, limit } },
  );
  return data;
}

export async function fetchMyOrderById(orderId: string) {
  const { data } = await api.get<{ success: boolean; data: unknown }>(`/orders/me/${orderId}`);
  return data;
}
