import publicApi from '@/lib/publicApi';
import type { CadastrarClienteRequest, ClienteResponse } from '@/types/cliente';

export const clienteService = {
  /**
   * Cadastra um novo cliente
   */
  async cadastrarCliente(data: CadastrarClienteRequest): Promise<ClienteResponse> {
    try {
      const response = await publicApi.post<ClienteResponse>('/clientes', data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  },

  /**
   * Tratamento de erros da API
   */
  handleError(error: any): Error {
    if (error.response) {
      // Erro retornado pela API
      const message = error.response.data?.message || error.response.data?.error || 'Erro ao processar requisição';
      return new Error(message);
    } else if (error.request) {
      // Requisição feita mas sem resposta
      return new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } else {
      // Erro na configuração da requisição
      return new Error('Erro ao configurar requisição');
    }
  }
};

