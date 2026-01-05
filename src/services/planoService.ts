import publicApi from '@/lib/publicApi';
import type { Plano, PlanoResponse } from '@/types/plano';

export const planoService = {
  /**
   * Busca planos promocionais por grupo e estado
   * Endpoint público - não requer autenticação
   */
  async listarPlanos(grupoId: number, estadoId: number): Promise<Plano[]> {
    try {
      const response = await publicApi.get<Plano[] | PlanoResponse>('/planos', {
        params: { 
          grupo_id: grupoId,
          estado_id: estadoId 
        }
      });
      
      // Verifica se a resposta é um array ou objeto com propriedade data/planos
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && 'data' in response.data) {
        return response.data.data || [];
      } else if (response.data && 'planos' in response.data) {
        return response.data.planos || [];
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      throw error;
    }
  },
};
