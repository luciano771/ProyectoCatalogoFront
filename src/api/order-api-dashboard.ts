import { apiClient } from './client';

export interface OrderListItem {
  id: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string | null;
  totalAmount: string;
  status: string;
  createdAt: string;
}

export const listMerchantOrders = async (): Promise<{ orders: OrderListItem[] }> => {
  const { data } = await apiClient.get<{ orders: OrderListItem[] }>('/orders');
  return data;
};

export const getMerchantOrderDetail = async (
  id: string
): Promise<{ order: any }> => {
  const { data } = await apiClient.get<{ order: any }>(`/orders/${id}`);
  return data;
};

export const updateOrderStatus = async (
  id: string,
  status: string
): Promise<{ order: any }> => {
  const { data } = await apiClient.patch<{ order: any }>(
    `/orders/${id}/status`,
    { status }
  );
  return data;
};

