import axios from 'axios';
import { config } from './config';

const api = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: config.api.timeout,
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Apenas remover token em rotas específicas de autenticação
      const isAuthRoute = error.config?.url?.includes('/auth/');

      console.warn('[api.ts] Recebido 401 na rota:', error.config?.url, 'isAuthRoute:', isAuthRoute);
      if (!isAuthRoute) {
        // Não fazer logout automático em outras rotas
        console.warn('[api.ts] Token pode estar expirado. Tentando renovar...');
      } else {
        console.warn('[api.ts] 401 em rota de autenticação. Token será removido.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
