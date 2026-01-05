import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { ApiClientService } from '../core/http/api-client.service';
import type {
  AcademicYearDto,
  SemesterDto,
  ExamTypeDto,
  TeachingUnitDto,
  SpecialityDto,
  MiniAdminDto,
} from '../domain/dtos/dean/dean-shared.dto';
import type {
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
} from '../domain/dtos/dean/academic-year.dto';
import type { CreateSemesterDto, UpdateSemesterDto } from '../domain/dtos/dean/semester.dto';
import type { CreateExamTypeDto, UpdateExamTypeDto } from '../domain/dtos/dean/exam-type.dto';
import type { CreateTeachingUnitDto, UpdateTeachingUnitDto } from '../domain/dtos/dean/teaching-unit.dto';
import type { CreateSpecialityDto } from '../domain/dtos/dean/create-speciality.dto';
import type { UpdateSpecialityDto } from '../domain/dtos/dean/update-speciality.dto';
import type { CreateMiniAdminDto, UpdateMiniAdminDto } from '../domain/dtos/dean/mini-admin.dto';
import type { DeanDashboardStatsDto } from '../domain/dtos/dean/stats.dto';
import type { DeanAiAnalyticsDto } from '../domain/dtos/dean/ai-analytics.dto';

@Injectable({
  providedIn: 'root',
})
export class DeanApiService {
  constructor(private readonly api: ApiClientService) {}

  // Academic years
  listAcademicYears(): Observable<AcademicYearDto[]> {
    return this.api.get<AcademicYearDto[]>('/dean/academic-years');
  }

  createAcademicYear(dto: CreateAcademicYearDto): Observable<AcademicYearDto> {
    return this.api.post<AcademicYearDto>('/dean/academic-years', dto);
  }

  updateAcademicYear(id: string, dto: UpdateAcademicYearDto): Observable<AcademicYearDto | null> {
    return this.api.patch<AcademicYearDto | null>(`/dean/academic-years/${id}`, dto);
  }

  deleteAcademicYear(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/dean/academic-years/${id}`);
  }

  // Semesters
  listSemesters(academicYearId?: string): Observable<SemesterDto[]> {
    return this.api.get<SemesterDto[]>('/dean/semesters', {
      params: academicYearId ? { academicYearId } : undefined,
    });
  }

  createSemester(dto: CreateSemesterDto): Observable<SemesterDto> {
    return this.api.post<SemesterDto>('/dean/semesters', dto);
  }

  updateSemester(id: string, dto: UpdateSemesterDto): Observable<SemesterDto | null> {
    return this.api.patch<SemesterDto | null>(`/dean/semesters/${id}`, dto);
  }

  deleteSemester(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/dean/semesters/${id}`);
  }

  // Exam types
  listExamTypes(): Observable<ExamTypeDto[]> {
    return this.api.get<ExamTypeDto[]>('/dean/exam-types');
  }

  createExamType(dto: CreateExamTypeDto): Observable<ExamTypeDto> {
    return this.api.post<ExamTypeDto>('/dean/exam-types', dto);
  }

  updateExamType(id: string, dto: UpdateExamTypeDto): Observable<ExamTypeDto | null> {
    return this.api.patch<ExamTypeDto | null>(`/dean/exam-types/${id}`, dto);
  }

  deleteExamType(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/dean/exam-types/${id}`);
  }

  // Teaching units
  listTeachingUnits(): Observable<TeachingUnitDto[]> {
    return this.api.get<TeachingUnitDto[]>('/dean/teaching-units');
  }

  createTeachingUnit(dto: CreateTeachingUnitDto): Observable<TeachingUnitDto> {
    return this.api.post<TeachingUnitDto>('/dean/teaching-units', dto);
  }

  updateTeachingUnit(id: string, dto: UpdateTeachingUnitDto): Observable<TeachingUnitDto | null> {
    return this.api.patch<TeachingUnitDto | null>(`/dean/teaching-units/${id}`, dto);
  }

  deleteTeachingUnit(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/dean/teaching-units/${id}`);
  }

  // Mini-admins
  listMiniAdmins(): Observable<MiniAdminDto[]> {
    return this.api.get<MiniAdminDto[]>('/dean/mini-admins');
  }

  // Specialities
  listSpecialities(): Observable<SpecialityDto[]> {
    return this.api.get<SpecialityDto[]>('/dean/specialities');
  }

  createSpeciality(dto: CreateSpecialityDto): Observable<SpecialityDto> {
    return this.api.post<SpecialityDto>('/dean/specialities', dto);
  }

  updateSpeciality(id: string, dto: UpdateSpecialityDto): Observable<SpecialityDto | null> {
    return this.api.patch<SpecialityDto | null>(`/dean/specialities/${id}`, dto);
  }

  deleteSpeciality(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/dean/specialities/${id}`);
  }

  assignSpecialityHead(id: string, headId?: string | null): Observable<SpecialityDto | null> {
    // Backend expects: { headId: string } to assign, or { } / { headId: undefined } to unassign
    // @IsOptional() @IsString() means null is not valid, only undefined or a string
    const body = headId ? { headId } : {};
    console.log("Update head ", body);
    return this.api.patch<SpecialityDto | null>(`/dean/specialities/${id}/head`, body);
  }

  createMiniAdmin(dto: CreateMiniAdminDto): Observable<MiniAdminDto> {
    return this.api.post<MiniAdminDto>('/dean/mini-admins', dto);
  }

  updateMiniAdmin(id: string, dto: UpdateMiniAdminDto): Observable<MiniAdminDto | null> {
    return this.api.patch<MiniAdminDto | null>(`/dean/mini-admins/${id}`, dto);
  }

  deleteMiniAdmin(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/dean/mini-admins/${id}`);
  }

  // AI analytics
  getAiAnalytics(academicYearId?: string): Observable<DeanAiAnalyticsDto> {
    academicYearId = academicYearId ? String(academicYearId) : undefined;
    return this.api.get<DeanAiAnalyticsDto>('/dean/ai-analytics', {
      params: academicYearId ? { academicYearId } : undefined,
    });
  }

  // Stats
  getStats(academicYearId?: string): Observable<DeanDashboardStatsDto> {
    return this.api.get<DeanDashboardStatsDto>('/dean/stats', {
      params: academicYearId ? { academicYearId } : undefined,
    });
  }

  publishStats(academicYearId?: string): Observable<{ published: boolean }> {
    return this.api.post<{ published: boolean }>('/dean/stats/publish', {}, {
      params: academicYearId ? { academicYearId } : undefined,
    });
  }
}
