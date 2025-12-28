export interface CreateSemesterDto {
  name: string;
  shortCode: string;
  classAcademicYearId: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface UpdateSemesterDto {
  name?: string;
  shortCode?: string;
  classAcademicYearId?: string;
  startDate?: string | null;
  endDate?: string | null;
  status?: string;
}
