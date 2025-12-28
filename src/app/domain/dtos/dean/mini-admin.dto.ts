export interface CreateMiniAdminDto {
  name: string;
  surname: string;
  email: string;
  login: string;
  password: string;
  specialityId?: string;
}

export interface UpdateMiniAdminDto {
  name?: string;
  surname?: string;
  email?: string;
  login?: string;
  password?: string;
  specialityId?: string | null;
}
