import api from "@/lib/api";

export interface Locacao {
  id_loc: number;
  dataLoc: string;
  dataPrev: string;
  dataDevolucao: string;
  clienteId: number;
  id_car: number;
  placa_car: string;
  modelo_car: string;
  descricao_ctg: string;
  nome_marca: string;
}

const locacaoService = {
  async listarLocacoes(): Promise<Locacao[]> {
    const response = await api.get<Locacao[]>("/locacao");
    return response.data;
  },
};

export default locacaoService;
