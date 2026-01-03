export interface Veiculo {
  id: number;
  nome: string;
  descricao?: string;
  valorDiaria: string;
  valorLocacao: string;
  estadoId: number;
  estado: string;
  imagem: string;
  seguroBasico?: string;
  seguroPlus?: string;
}

export interface FrotaResponse {
  veiculos: Veiculo[];
  total?: number;
  pagina?: number;
  limite?: number;
}

export interface FrotaFilters {
  categoria?: string;
  marca?: string;
  disponivel?: boolean;
  preco_min?: number;
  preco_max?: number;
  pagina?: number;
  limite?: number;
}
