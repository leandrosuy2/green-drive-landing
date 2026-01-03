export interface Loja {
  id: number;
  nome: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
}

export interface LojaResponse {
  lojas?: Loja[];
}
