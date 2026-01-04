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
   * Busca uma reserva específica por ID
   */
  buscarReservaPorId: async (id: number): Promise<ReservaResponse> => {
    const response = await api.get<ReservaResponse>(`/reserva/${id}`);
    return response.data;
  },

  /**
   * Cancela uma reserva
   */
  cancelarReserva: async (id: number): Promise<void> => {
    await api.delete(`/reserva/${id}`);
  },
};
