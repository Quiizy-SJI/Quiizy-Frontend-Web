export interface CreateAcademicYearDto {
  start: string;
  end: string;
  cloneClassesFromLatest?: boolean;
}

export interface UpdateAcademicYearDto {
  start?: string;
  end?: string;
}
