export function getImageUrl(path?: string) {
  if (!path) return '/placeholder.png';

  if (path.startsWith('http')) return path;

  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

  return `${baseUrl}${path}`;
}