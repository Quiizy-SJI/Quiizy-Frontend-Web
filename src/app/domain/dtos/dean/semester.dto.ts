import type { SemesterStatus } from './dean-shared.dto';

export interface CreateSemesterDto {
  name: string;
  shortCode: string;
  classAcademicYearId: string;
  startDate?: string;
  endDate?: string;
  status?: SemesterStatus;
}

export interface UpdateSemesterDto {
  name?: string;
  shortCode?: string;
  startDate?: string;
  endDate?: string;
  status?: SemesterStatus;
}
