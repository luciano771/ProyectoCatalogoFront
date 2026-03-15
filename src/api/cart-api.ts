import { apiClient } from './client';

export interface CartItemFromApi {
  productId: string;
  name: string;
  price: string;
  imageCoverUrl: string | null;
  quantity: number;
}

export interface CartResponse {
  items: CartItemFromApi[];
}

export const getCart = async (slug: string): Promise<CartResponse> => {
  const { data } = await apiClient.get<CartResponse>(`/public/store/${slug}/cart`);
  return data;
};

export const addCartItem = async (
  slug: string,
  productId: string,
  quantity: number
): Promise<CartResponse> => {
  const { data } = await apiClient.post<CartResponse>(
    `/public/store/${slug}/cart/items`,
    { productId, quantity }
  );
  return data;
};

export const updateCartItem = async (
  slug: string,
  productId: string,
  quantity: number
): Promise<CartResponse> => {
  const { data } = await apiClient.patch<CartResponse>(
    `/public/store/${slug}/cart/items/${productId}`,
    { quantity }
  );
  return data;
};

export const removeCartItem = async (
  slug: string,
  productId: string
): Promise<CartResponse> => {
  const { data } = await apiClient.delete<CartResponse>(
    `/public/store/${slug}/cart/items/${productId}`
  );
  return data;
};

export const clearCartApi = async (slug: string): Promise<CartResponse> => {
  const { data } = await apiClient.delete<CartResponse>(`/public/store/${slug}/cart`);
  return data;
};
