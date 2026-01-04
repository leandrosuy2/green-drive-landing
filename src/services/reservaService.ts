import api from "@/lib/api";
import { CriarReservaRequest, ReservaResponse } from "@/types/reserva";

export const reservaService = {
  /**
   * Cria uma nova reserva
   */
  criarReserva: async (data: CriarReservaRequest): Promise<ReservaResponse> => {
    const response = await api.post<ReservaResponse>("/reserva", data);
    return response.data;
  },


  /**
   * Busca reservas do usuário
   */
  minhasReservas: async (): Promise<ReservaResponse[]> => {
    const response = await api.get<ReservaResponse[]>("/reserva/minhas");
    return response.data;
  },

  /**
   * Busca todas as reservas (admin ou painel)
   */
  listarReservas: async (): Promise<ReservaResponse[]> => {
    const response = await api.get<ReservaResponse[]>("/reserva");
    return response.data;
  },

  /**
   * Busca uma reserva específica por ID
   */
  buscarReservaPorId: async (id: number): Promise<ReservaResponse> => {
    const response = await api.get<ReservaResponse>(`/reserva/${id}`);
    return response.data;
  },

  /**
   * Cancela uma reserva
   */
  /**
   * Cancela uma reserva com motivo
   */
  cancelarReserva: async (id: number, motivo: string): Promise<void> => {
    await api.patch(`/reserva/${id}/cancelar`, { motivo });
  },
};
