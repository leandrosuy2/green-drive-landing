import publicApi from '@/lib/publicApi';
import type { Loja, LojaResponse } from '@/types/loja';

export const lojaService = {
  /**
   * Busca lojas por grupo de localização (estadoId)
   * Endpoint público - não requer autenticação
   */
  async listarLojas(idGrupoLoc: number): Promise<Loja[]> {
    try {
      const response = await publicApi.get<Loja[] | LojaResponse>('/loja', {
        params: { id_grupo_loc: idGrupoLoc }
      });
      
      // Verifica se a resposta é um array ou objeto com propriedade lojas
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && 'lojas' in response.data) {
        return response.data.lojas || [];
      }
      
      return [];
    } catch (error: any) {
      throw this.handleError(error);
    }
  },

  /**
   * Tratamento de erros
   */
  handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || 'Erro ao buscar lojas';
      return new Error(message);
    }
    
    if (error.request) {
      return new Error('Sem resposta do servidor. Verifique sua conexão.');
    }
    
    return new Error('Erro ao processar requisição');
  }
};
