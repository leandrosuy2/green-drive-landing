export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthResponse {
  access_token?: string;
  token?: string;
  user?: {
    id: number;
    nome: string;
    email: string;
  };
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
