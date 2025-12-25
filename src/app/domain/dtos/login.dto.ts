export interface LoginRequest {
  identifier: string;
  password: string;
  rememberMe?: boolean;
  role: Role;
}

export type Role = 'STUDENT' | 'DEAN' | 'SPECIALITY_HEAD' | 'TEACHER';
