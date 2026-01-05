export interface CriarReservaRequest {
  id_loja: number;
  loja_dev: null;
  data_retirada: string;
  hora_retirada: string;
  data_devolucao: string;
  hora_devolucao: string;
  grupo_escolhido: number;
  plano_escolhido: number;
  categoria: "premium" | "basico";
  vlr_doado: null;
  seguro_escolhido: string;
  qtd_dias: number;
  origem_agen: "site";
}

export interface ReservaResponse {
  id: number;
  dataRegistro: string;
  lojaRetirada: {
    id: number;
    nome: string;
    cidade: string;
    estado: string;
  };
  lojaDevolucao: number | null;
  periodo: {
    retirada: {
      data: string;
      hora: string;
    };
    devolucao: {
      data: string;
      hora: string;
    };
  };
  grupo: {
    id: number;
    nome: string;
    imagem: string;
  };
  planoId: number;
  categoria: string;
  valorDoado: string | null;
  seguro: string;
  qtdDias: number;
  origem: string;
  status: "pendente" | "confirmada" | "cancelada" | "concluida";
  cancelamento: {
    data: string;
    motivo: string;
  } | null;
}
