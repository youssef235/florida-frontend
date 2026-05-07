const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const getImageUrl = (img?: string) => {
  if (!img) return "";

  const base = serverUrl.endsWith("/")
    ? serverUrl.slice(0, -1)
    : serverUrl;

  const path = img.startsWith("/") ? img : `/${img}`;

  return `${base}${path}`;
};