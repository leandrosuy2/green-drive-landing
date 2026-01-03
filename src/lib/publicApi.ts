import axios from 'axios';
import { config } from './config';

/**
 * Cliente API público (sem autenticação)
 * Use para endpoints que não requerem JWT
 */
const publicApi = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: config.api.timeout,
});

// Interceptor para tratamento de respostas
publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default publicApi;
