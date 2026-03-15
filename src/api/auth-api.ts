import { apiClient } from './client';

export interface AuthUser {
  id: string;
  email: string;
  role: 'MERCHANT' | 'ADMIN';
  merchantProfile?: {
    id: string;
    businessName: string;
    slug: string;
    active: boolean;
  } | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  merchantProfile?: AuthUser['merchantProfile'];
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password });
  return data;
};

export const registerMerchant = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', {
    name,
    email,
    password
  });
  return data;
};

export const getMe = async (): Promise<{ user: AuthUser }> => {
  const { data } = await apiClient.get<{ user: AuthUser }>('/auth/me');
  return data;
};

