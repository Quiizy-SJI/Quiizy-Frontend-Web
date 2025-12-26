import type { Role } from '../../domain/dtos/login.dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: Role;
  entityId: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface AuthSession {
  user: AuthUser;
  tokens: AuthTokens;
  createdAt: string;
}
