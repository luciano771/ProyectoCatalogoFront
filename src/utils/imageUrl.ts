import { env } from '../config/env';

/** Ruta de la imagen por defecto cuando no hay logo, portada o imagen de producto */
export const DEFAULT_IMAGE = '/defaultImages/sinimagen.svg';

/**
 * Convierte una URL de imagen para usar en <img src={...}>.
 * - Si ya es http(s), se devuelve tal cual.
 * - Si es una ruta (empieza con /): en el navegador se devuelve la ruta para que
 *   la pida al mismo origen (y el proxy de Vite la envíe al backend). En Node se
 *   antepone el origen del API.
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const u = url.trim();
  if (!u) return '';
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  if (typeof window !== 'undefined') return u.startsWith('/') ? u : `/${u}`;
  let base = env.API_BASE_URL.replace(/\/api\/?$/, '').trim() || 'http://localhost:4000';
  return `${base}${u.startsWith('/') ? u : `/${u}`}`;
}

/** Devuelve la URL de la imagen o la imagen por defecto si no hay URL */
export function getImageUrlOrDefault(url: string | null | undefined): string {
  const resolved = getImageUrl(url);
  return resolved || DEFAULT_IMAGE;
}
