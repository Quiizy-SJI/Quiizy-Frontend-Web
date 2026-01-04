export interface CreateExamTypeDto {
  name: string;
  description?: string;
  active?: boolean;
}

export interface UpdateExamTypeDto {
  name?: string;
  description?: string;
  active?: boolean;
}
