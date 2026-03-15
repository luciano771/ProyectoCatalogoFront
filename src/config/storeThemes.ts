/**
 * Templates (themes) para la tienda pública.
 * Cada tema define identidad visual: colores, fondos, acentos.
 * Filtro por estilo y badges para el selector en perfil.
 */

export type ThemeStyleFilter =
  | 'minimalista'
  | 'premium'
  | 'urbano'
  | 'natural'
  | 'delicado'
  | 'tech'
  | 'artesanal'
  | 'food'
  | 'kids'
  | 'corporativo';

export type ThemeBadge = 'popular' | 'nuevo' | null;

export interface StoreTheme {
  id: string;
  name: string;
  description: string;
  /** Para filtrar en el selector */
  style: ThemeStyleFilter;
  /** Badge opcional en la card */
  badge: ThemeBadge;
  /** Colores para swatch y preview */
  swatches: [string, string];
}

export const STORE_THEMES: StoreTheme[] = [
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Estilo minimalista, mucho espacio en blanco. Ideal para productos premium o tiendas modernas. Tipografía elegante, colores neutros.',
    style: 'minimalista',
    badge: 'popular',
    swatches: ['#1f2937', '#6b7280']
  },
  {
    id: 'dark-luxury',
    name: 'Dark Luxury',
    description: 'Fondo oscuro, look sofisticado y premium. Ideal para moda, relojes, perfumes o productos high-ticket. Fuerte contraste visual.',
    style: 'premium',
    badge: 'popular',
    swatches: ['#0f172a', '#eab308']
  },
  {
    id: 'organic-nature',
    name: 'Organic Nature',
    description: 'Inspirado en marcas eco y naturales. Tonos verdes, beige y tierra. Look cálido, amigable y artesanal. Cosmética natural, alimentos, bienestar.',
    style: 'natural',
    badge: null,
    swatches: ['#427b2c', '#a16207']
  },
  {
    id: 'bold-streetwear',
    name: 'Bold Streetwear',
    description: 'Estilo urbano, joven, agresivo. Tipografías grandes, banners impactantes. Ideal para ropa, sneakers o accesorios modernos.',
    style: 'urbano',
    badge: 'nuevo',
    swatches: ['#000000', '#ef4444']
  },
  {
    id: 'feminine-boutique',
    name: 'Feminine Boutique',
    description: 'Diseño delicado, elegante y visualmente suave. Ideal para indumentaria femenina, accesorios, belleza. Estética boutique.',
    style: 'delicado',
    badge: null,
    swatches: ['#be185d', '#f9a8d4']
  },
  {
    id: 'tech-store',
    name: 'Tech Store',
    description: 'Estilo tecnológico, moderno y algo futurista. Tarjetas limpias, secciones tipo specs. Ideal para gadgets, electrónica o accesorios tech.',
    style: 'tech',
    badge: null,
    swatches: ['#0ea5e9', '#6366f1']
  },
  {
    id: 'artisan-handmade',
    name: 'Artisan Handmade',
    description: 'Estilo artesanal y humano. Bloques menos rígidos, sensación de marca personal. Ideal para velas, cerámica, productos hechos a mano.',
    style: 'artesanal',
    badge: null,
    swatches: ['#78350f', '#b45309']
  },
  {
    id: 'food-drinks',
    name: 'Food & Drinks',
    description: 'Visual cálido y apetitoso. Ideal para cafeterías, pastelería, bebidas o food brands. Uso fuerte de imágenes y secciones promocionales.',
    style: 'food',
    badge: null,
    swatches: ['#c2410c', '#ea580c']
  },
  {
    id: 'kids-fun',
    name: 'Kids & Fun',
    description: 'Estilo colorido, amigable, divertido. Ideal para juguetes, ropa infantil o productos familiares. Formas suaves y layout alegre.',
    style: 'kids',
    badge: 'nuevo',
    swatches: ['#7c3aed', '#22d3ee']
  },
  {
    id: 'corporate-catalog',
    name: 'Corporate Catalog',
    description: 'Look sobrio, claro y profesional. Ideal para negocios que quieren mostrar productos sin tanta estética emocional. Pymes, distribuidores, B2B.',
    style: 'corporativo',
    badge: null,
    swatches: ['#1e40af', '#64748b']
  }
];

export const DEFAULT_STORE_THEME_ID = 'minimal-clean';

export const STYLE_FILTER_OPTIONS: { value: ThemeStyleFilter; label: string }[] = [
  { value: 'minimalista', label: 'Minimalista' },
  { value: 'premium', label: 'Premium' },
  { value: 'urbano', label: 'Urbano' },
  { value: 'natural', label: 'Natural' },
  { value: 'delicado', label: 'Delicado' },
  { value: 'tech', label: 'Tech' },
  { value: 'artesanal', label: 'Artesanal' },
  { value: 'food', label: 'Food & Drinks' },
  { value: 'kids', label: 'Kids & Fun' },
  { value: 'corporativo', label: 'Corporativo' }
];

export function getStoreTheme(id: string | null | undefined): StoreTheme {
  const found = STORE_THEMES.find(t => t.id === (id || DEFAULT_STORE_THEME_ID));
  return found ?? STORE_THEMES[0];
}

export function getThemesByStyle(style: ThemeStyleFilter | 'todos'): StoreTheme[] {
  if (style === 'todos') return STORE_THEMES;
  return STORE_THEMES.filter(t => t.style === style);
}
