import type { SemesterStatus } from './dean-shared.dto';

// Backend expects ISO date strings (YYYY-MM-DD format via @IsDateString())
export interface CreateSemesterDto {
  name: string;
  shortCode: string;
  classAcademicYearId: string;
  startDate?: string; // ISO date string (YYYY-MM-DD)
  endDate?: string;   // ISO date string (YYYY-MM-DD)
  status?: SemesterStatus;
}

export interface UpdateSemesterDto {
  name?: string;
  shortCode?: string;
  startDate?: string; // ISO date string (YYYY-MM-DD)
  endDate?: string;   // ISO date string (YYYY-MM-DD)
  status?: SemesterStatus;
}
