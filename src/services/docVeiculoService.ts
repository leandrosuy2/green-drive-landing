import api from "@/lib/api";

const docVeiculoService = {
  async getDocLink(idCarro: number): Promise<string> {
    const response = await api.get<string>(`/folders/link-carro`, {
      params: { idCarro: String(idCarro) }
    });
    return response.data;
  },
};

export default docVeiculoService;
