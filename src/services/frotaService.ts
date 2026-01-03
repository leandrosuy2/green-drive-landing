import publicApi from '@/lib/publicApi';
import type { Veiculo, FrotaResponse, FrotaFilters } from '@/types/frota';

export const frotaService = {
  /**
   * Busca todos os veículos da frota
   * Endpoint público - não requer autenticação
   */
  async listarVeiculos(filters?: FrotaFilters): Promise<Veiculo[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.categoria) params.append('categoria', filters.categoria);
      if (filters?.marca) params.append('marca', filters.marca);
      if (filters?.disponivel !== undefined) params.append('disponivel', String(filters.disponivel));
      if (filters?.preco_min) params.append('preco_min', String(filters.preco_min));
      if (filters?.preco_max) params.append('preco_max', String(filters.preco_max));
      if (filters?.pagina) params.append('pagina', String(filters.pagina));
      if (filters?.limite) params.append('limite', String(filters.limite));
      
      const queryString = params.toString();
      const url = queryString ? `/frota?${queryString}` : '/frota';
      
      const response = await publicApi.get<Veiculo[] | FrotaResponse>(url);
      
      // Verifica se a resposta é um array ou objeto com propriedade veiculos
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && 'veiculos' in response.data) {
        return response.data.veiculos;
      }
      
      return [];
    } catch (error: any) {
      throw this.handleError(error);
    }
  },

  /**
   * Busca um veículo específico por ID e estadoId
   */
  async buscarVeiculoPorId(id: number, estadoId: number): Promise<Veiculo> {
    try {
      const response = await publicApi.get<Veiculo>(`/frota/${id}`, {
        params: { estado: estadoId }
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  },

  /**
   * Busca categorias disponíveis de veículos
   */
  async listarCategorias(): Promise<string[]> {
    try {
      const response = await publicApi.get<string[]>('/frota/categorias');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  },

  /**
   * Busca marcas disponíveis de veículos
   */
  async listarMarcas(): Promise<string[]> {
    try {
      const response = await publicApi.get<string[]>('/frota/marcas');
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
      const message = error.response.data?.message || 'Erro ao buscar dados da frota';
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
