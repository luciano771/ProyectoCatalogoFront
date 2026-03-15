import { apiClient } from './client';

export interface CreateOrderPayload {
  buyer: {
    fullName: string;
    phone: string;
    email?: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface OrderResponse {
  order: {
    id: string;
    totalAmount: string;
    status: string;
    items: Array<{
      id: string;
      productId: string;
      productName: string;
      unitPrice: string;
      quantity: number;
      subtotal: string;
    }>;
  };
}

export const createPublicOrder = async (
  slug: string,
  payload: CreateOrderPayload
): Promise<OrderResponse> => {
  const { data } = await apiClient.post<OrderResponse>(
    `/public/store/${slug}/orders`,
    payload
  );
  return data;
};

