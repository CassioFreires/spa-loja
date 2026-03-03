// src/utils/getImageUrl.ts
export function getImageUrl(path?: string) {
  if (!path) return '/placeholder.png';

  // Se já for URL completa (ex: http://...)
  if (path.startsWith('http')) return path;

  const baseUrl = import.meta.env.VITE_API_URL;

  // Garante que sempre tenha /uploads/
  return `${baseUrl}/uploads/${path}`;
}