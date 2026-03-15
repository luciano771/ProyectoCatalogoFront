import { apiClient } from './client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  isActive?: boolean;
  sortOrder?: number | null;
  createdAt?: string;
}

export const listCategories = async (): Promise<{ categories: Category[] }> => {
  const { data } = await apiClient.get<{ categories: Category[] }>('/categories');
  return data;
};

export const createCategory = async (payload: {
  name: string;
  sortOrder?: number;
}): Promise<{ category: Category }> => {
  const { data } = await apiClient.post<{ category: Category }>('/categories', payload);
  return data;
};

export const updateCategory = async (
  id: string,
  payload: { name?: string; isActive?: boolean; sortOrder?: number }
): Promise<{ category: Category }> => {
  const { data } = await apiClient.put<{ category: Category }>(`/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id: string): Promise<{ ok: boolean }> => {
  const { data } = await apiClient.delete<{ ok: boolean }>(`/categories/${id}`);
  return data;
};
