import { apiClient } from './client';

export interface PublicMerchantProfile {
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

export interface PublicProduct {
  id: string;
  name: string;
  marca?: string | null;
  modelo?: string | null;
  description?: string | null;
  price: string;
  imageCoverUrl?: string | null;
  active: boolean;
  categoryId?: string | null;
  stock?: number | null;
}

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
}

export interface StoreData {
  profile: PublicMerchantProfile;
  categories: PublicCategory[];
  products: PublicProduct[];
}

export const getStoreBySlug = async (slug: string): Promise<StoreData> => {
  const { data } = await apiClient.get<StoreData>(
    `/public/store/${slug}/catalog`
  );
  return data;
};

export interface ProductDetailData {
  profile: PublicMerchantProfile;
  product: PublicProduct & { categoryName: string | null };
  related: PublicProduct[];
}

export const getStoreProduct = async (
  slug: string,
  productId: string
): Promise<ProductDetailData> => {
  const { data } = await apiClient.get<ProductDetailData>(
    `/public/store/${slug}/products/${productId}`
  );
  return data;
};

