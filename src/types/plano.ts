export interface Plano {
  id: number;
  titulo: string;
  qtdDiasLocado: number;
  qtdDiasPagar: number;
  tipoPlano: string;
  percentual: number;
  qtdMinDias: number;
  valorDiaria: string;
  observacao: string | null;
  data: string;
  grupoId: number;
  valorPretendido: string;
  estadoId: number;
}

export interface PlanoResponse {
  data?: Plano[];
  planos?: Plano[];
}
