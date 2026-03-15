import { apiClient } from './client';

export interface Product {
  id: string;
  name: string;
  marca?: string | null;
  modelo?: string | null;
  description?: string | null;
  price: string;
  imageCoverUrl?: string | null;
  stock?: number | null;
  active: boolean;
  categoryId?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  createdAt?: string;
}

export const listProducts = async (): Promise<{ products: Product[] }> => {
  const { data } = await apiClient.get<{ products: Product[] }>('/products');
  return data;
};

export const createProduct = async (payload: {
  name: string;
  marca?: string | null;
  modelo?: string | null;
  description?: string;
  price: number;
  categoryId?: string | null;
  imageCoverUrl?: string | null;
  stock?: number | null;
  active?: boolean;
}): Promise<{ product: Product }> => {
  const { data } = await apiClient.post<{ product: Product }>('/products', payload);
  return data;
};

export const updateProduct = async (
  id: string,
  payload: {
    name?: string;
    marca?: string | null;
    modelo?: string | null;
    description?: string | null;
    price?: number;
    categoryId?: string | null;
    imageCoverUrl?: string | null;
    stock?: number | null;
    active?: boolean;
  }
): Promise<{ product: Product }> => {
  const { data } = await apiClient.put<{ product: Product }>(`/products/${id}`, payload);
  return data;
};

export const deleteProduct = async (id: string): Promise<{ ok: boolean }> => {
  const { data } = await apiClient.delete<{ ok: boolean }>(`/products/${id}`);
  return data;
};

export const uploadProductImage = async (
  productId: string,
  file: File
): Promise<{ product: Product; url: string }> => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await apiClient.post<{ product: Product; url: string }>(
    `/products/${productId}/image`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
};

export interface BulkImportResult {
  created: number;
  errors: { row: number; message: string }[];
}

export const downloadBulkTemplate = async (): Promise<void> => {
  const response = await apiClient.get<Blob>('/products/bulk-template', {
    responseType: 'blob'
  });
  const data = response.data;
  const blob = data instanceof Blob ? data : new Blob([data]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'plantilla-productos.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 200);
};

export const bulkImportProducts = async (file: File): Promise<BulkImportResult> => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await apiClient.post<BulkImportResult>('/products/bulk-import', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};
