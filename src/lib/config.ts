/**
 * Configurações do ambiente
 * Centraliza todas as variáveis de ambiente da aplicação
 */

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
  },
} as const;
