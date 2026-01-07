export interface TelefoneNovo {
  ddd_fone: string;
  numero_fone: string;
  nome_fone?: string;
}

export interface EmailNovo {
  endereco_email: string;
  descricao_email?: string;
}

export interface CadastrarClienteRequest {
  cep_cli: string;
  cidade_cli: string;
  cpf_cli: string;
  senha_cli: string;
  endereco_rua_cli: string;
  identidade_cli?: string;
  org_identidade_cli?: string;
  nome_cli: string;
  tipo_pessoa_cli: number; // 1 = PF, 2 = PJ
  loja_id_cli: number;
  bairro_cli: string;
  endereco_num_cli: string;
  endereco_trabalho_cli?: string;
  endereco_uf_cli: string;
  fone_cli: string;
  hab_uf_cli: string;
  hab_validade_cli: string; // formato: YYYY-MM-DD
  habilitacao_cli: string;
  nascimento_cli?: string; // formato: YYYY-MM-DD
  primeiro_nome?: string;
  estadocivil_cli?: string;
  sexo_cli?: string;
  nome_mae_cli?: string;
  obs_cli?: string;
  pais_cli?: string;
  profissao_cli?: string;
  profissao2_cli?: string;
  fones_novos?: TelefoneNovo[];
  emails_novos?: EmailNovo[];
}

export interface ClienteResponse {
  id: number;
  nome_cli: string;
  cpf_cli: string;
  message?: string;
}

