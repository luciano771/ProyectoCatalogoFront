/**
 * Datos mock para preview de templates y demos.
 * Misma base para todos los themes; cada uno la renderiza con su identidad visual.
 */

import type { PublicMerchantProfile, PublicProduct, PublicCategory } from '../api/store-api';

export const MOCK_STORE_PROFILE: PublicMerchantProfile = {
  businessName: 'Mi Tienda',
  slug: 'mi-tienda',
  description: 'Descubre productos seleccionados con la mejor experiencia de compra.',
  logoUrl: null,
  bannerUrl: null,
  instagramUrl: null,
  paymentAlias: null,
  active: true,
  backgroundColor: null,
  themeId: null
};

export const MOCK_CATEGORIES: PublicCategory[] = [
  { id: 'cat-1', name: 'Destacados', slug: 'destacados' },
  { id: 'cat-2', name: 'Novedades', slug: 'novedades' },
  { id: 'cat-3', name: 'Ofertas', slug: 'ofertas' }
];

export const MOCK_PRODUCTS: PublicProduct[] = [
  {
    id: 'prod-1',
    name: 'Producto destacado',
    marca: 'Marca',
    modelo: 'A1',
    description: 'Descripción breve del producto.',
    price: '2999.99',
    imageCoverUrl: null,
    active: true,
    categoryId: 'cat-1',
    stock: 10
  },
  {
    id: 'prod-2',
    name: 'Segundo producto',
    marca: 'Marca',
    modelo: 'B2',
    description: 'Otro producto de ejemplo.',
    price: '1599.50',
    imageCoverUrl: null,
    active: true,
    categoryId: 'cat-2',
    stock: 5
  },
  {
    id: 'prod-3',
    name: 'Tercer producto',
    marca: 'Marca',
    modelo: 'C3',
    description: 'Más opciones para vos.',
    price: '4499.00',
    imageCoverUrl: null,
    active: true,
    categoryId: 'cat-1',
    stock: null
  }
];

export interface MockBanner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  cta?: string;
}

export const MOCK_BANNERS: MockBanner[] = [
  { id: 'b1', title: 'Nueva colección', subtitle: 'Mirá lo último', cta: 'Ver más' },
  { id: 'b2', title: 'Envíos a todo el país', subtitle: 'Comprá tranquilo', cta: 'Cómo comprar' }
];

export interface MockTestimonial {
  id: string;
  author: string;
  text: string;
  role?: string;
}

export const MOCK_TESTIMONIALS: MockTestimonial[] = [
  { id: 't1', author: 'María G.', text: 'Excelente atención y productos de calidad. Super recomendable.', role: 'Cliente' },
  { id: 't2', author: 'Juan P.', text: 'Rápido envío y todo llegó perfecto. Volveré a comprar.', role: 'Cliente' }
];

export interface MockBenefit {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export const MOCK_BENEFITS: MockBenefit[] = [
  { id: 'b1', title: 'Envío seguro', description: 'Embalaje cuidado a todo el país.', icon: '📦' },
  { id: 'b2', title: 'Pago flexible', description: 'Múltiples medios de pago.', icon: '💳' },
  { id: 'b3', title: 'Atención al cliente', description: 'Respondemos tus consultas.', icon: '💬' }
];

export const MOCK_STORE_DATA = {
  profile: MOCK_STORE_PROFILE,
  categories: MOCK_CATEGORIES,
  products: MOCK_PRODUCTS,
  banners: MOCK_BANNERS,
  testimonials: MOCK_TESTIMONIALS,
  benefits: MOCK_BENEFITS
} as const;
