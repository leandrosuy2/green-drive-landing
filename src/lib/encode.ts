/**
 * Utilitários para encode/decode de IDs nas URLs
 */

export const encodeId = (id: number, estadoId: number): string => {
  const combined = `${id}-${estadoId}`;
  return btoa(combined); // Base64 encode
};

export const decodeId = (encoded: string): { id: number; estadoId: number } | null => {
  try {
    const decoded = atob(encoded); // Base64 decode
    const [id, estadoId] = decoded.split('-').map(Number);
    
    if (isNaN(id) || isNaN(estadoId)) {
      return null;
    }
    
    return { id, estadoId };
  } catch {
    return null;
  }
};
