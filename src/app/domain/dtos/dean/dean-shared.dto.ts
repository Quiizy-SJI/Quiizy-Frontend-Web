export interface BaseEntityDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYearDto extends BaseEntityDto {
  start: string;
  end: string;
  classAcademicYears?: ClassAcademicYearDto[];
}

export interface ClassAcademicYearDto extends BaseEntityDto {
  academicYear?: AcademicYearDto;
  class?: {
    id: string;
    name: string;
    level?: string;
  };
}

export type SemesterStatus = 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | string;

export interface SemesterDto extends BaseEntityDto {
  name: string;
  shortCode: string;
  startDate?: string | null;
  endDate?: string | null;
  status: SemesterStatus;
  classAcademicYear: ClassAcademicYearDto;
}

export interface ExamTypeDto extends BaseEntityDto {
  name: string;
  description?: string | null;
  active: boolean;
}

export interface TeachingUnitDto extends BaseEntityDto {
  name: string;
}

export interface SpecialityDto extends BaseEntityDto {
  name: string;
  head?: {
    id: string;
    user: UserDto;
  } | null;
}

export interface UserDto extends BaseEntityDto {
  name: string;
  surname: string;
  email: string;
  login: string;
}

export interface MiniAdminDto extends BaseEntityDto {
  user: UserDto;
  speciality?: SpecialityDto | null;
}
