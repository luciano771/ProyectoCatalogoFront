import { apiClient } from './client';

export interface MerchantProfile {
  id: string;
  businessName: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  instagramUrl?: string | null;
  paymentAlias?: string | null;
  active: boolean;
  backgroundColor?: string | null;
  themeId?: string | null;
}

export const getMyProfile = async (): Promise<{ profile: MerchantProfile }> => {
  const { data } = await apiClient.get<{ profile: MerchantProfile }>(
    '/merchant/profile'
  );
  return data;
};

export const updateMyProfile = async (
  payload: Partial<MerchantProfile>
): Promise<{ profile: MerchantProfile }> => {
  const { data } = await apiClient.put<{ profile: MerchantProfile }>(
    '/merchant/profile',
    payload
  );
  return data;
};

export const uploadLogo = async (file: File): Promise<{ profile: MerchantProfile; url: string }> => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await apiClient.post<{ profile: MerchantProfile; url: string }>(
    '/merchant/profile/logo',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
};

export const uploadBanner = async (file: File): Promise<{ profile: MerchantProfile; url: string }> => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await apiClient.post<{ profile: MerchantProfile; url: string }>(
    '/merchant/profile/banner',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
};
