/**
 * Variables de entorno (definidas en .env, ver .env.example).
 * Vite solo expone las que empiezan con VITE_.
 */
export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api'
};

