import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { ApiClientService } from '../core/http/api-client.service';
import {
  toString,
  toStringRequired,
  toBoolean,
  toDateString,
  removeUndefined,
} from '../core/utils/payload-sanitizer';
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
    const payload: Record<string, unknown> = {
      start: toStringRequired(dto.start),
      end: toStringRequired(dto.end),
      cloneClassesFromLatest: toBoolean(dto.cloneClassesFromLatest),
    };
    return this.api.post<AcademicYearDto>('/dean/academic-years', removeUndefined(payload));
  }

  updateAcademicYear(id: string, dto: UpdateAcademicYearDto): Observable<AcademicYearDto | null> {
    const payload: Record<string, unknown> = {
      start: toString(dto.start),
      end: toString(dto.end),
    };
    return this.api.patch<AcademicYearDto | null>(`/dean/academic-years/${id}`, removeUndefined(payload));
  }

  deleteAcademicYear(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/dean/academic-years/${id}`);
  }

  // Semesters
  listSemesters(academicYearId?: string): Observable<SemesterDto[]> {
    const params = academicYearId ? { academicYearId: String(academicYearId) } : undefined;
    return this.api.get<SemesterDto[]>('/dean/semesters', { params });
  }

  createSemester(dto: CreateSemesterDto): Observable<SemesterDto> {
    const payload: Record<string, unknown> = {
      name: toStringRequired(dto.name),
      shortCode: toStringRequired(dto.shortCode),
      classAcademicYearId: toStringRequired(dto.classAcademicYearId),
      startDate: toDateString(dto.startDate),
      endDate: toDateString(dto.endDate),
      status: dto.status ? String(dto.status) : undefined,
    };
    return this.api.post<SemesterDto>('/dean/semesters', removeUndefined(payload));
  }

  updateSemester(id: string, dto: UpdateSemesterDto): Observable<SemesterDto | null> {
    const payload: Record<string, unknown> = {
      name: toString(dto.name),
      shortCode: toString(dto.shortCode),
      startDate: toDateString(dto.startDate),
      endDate: toDateString(dto.endDate),
      status: dto.status ? String(dto.status) : undefined,
    };
    return this.api.patch<SemesterDto | null>(`/dean/semesters/${id}`, removeUndefined(payload));
  }

  deleteSemester(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/dean/semesters/${id}`);
  }

  // Exam types
  listExamTypes(): Observable<ExamTypeDto[]> {
    return this.api.get<ExamTypeDto[]>('/dean/exam-types');
  }

  createExamType(dto: CreateExamTypeDto): Observable<ExamTypeDto> {
    const payload: Record<string, unknown> = {
      name: toStringRequired(dto.name),
      description: toString(dto.description),
      active: toBoolean(dto.active),
    };
    return this.api.post<ExamTypeDto>('/dean/exam-types', removeUndefined(payload));
  }

  updateExamType(id: string, dto: UpdateExamTypeDto): Observable<ExamTypeDto | null> {
    const payload: Record<string, unknown> = {
      name: toString(dto.name),
      description: toString(dto.description),
      active: toBoolean(dto.active),
    };
    return this.api.patch<ExamTypeDto | null>(`/dean/exam-types/${id}`, removeUndefined(payload));
  }

  deleteExamType(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/dean/exam-types/${id}`);
  }

  // Teaching units
  listTeachingUnits(): Observable<TeachingUnitDto[]> {
    return this.api.get<TeachingUnitDto[]>('/dean/teaching-units');
  }

  createTeachingUnit(dto: CreateTeachingUnitDto): Observable<TeachingUnitDto> {
    const payload: Record<string, unknown> = {
      name: toStringRequired(dto.name),
    };
    return this.api.post<TeachingUnitDto>('/dean/teaching-units', payload);
  }

  updateTeachingUnit(id: string, dto: UpdateTeachingUnitDto): Observable<TeachingUnitDto | null> {
    const payload: Record<string, unknown> = {
      name: toString(dto.name),
    };
    return this.api.patch<TeachingUnitDto | null>(`/dean/teaching-units/${id}`, removeUndefined(payload));
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
    const payload: Record<string, unknown> = {
      name: toStringRequired(dto.name),
    };
    return this.api.post<SpecialityDto>('/dean/specialities', payload);
  }

  updateSpeciality(id: string, dto: UpdateSpecialityDto): Observable<SpecialityDto | null> {
    const payload: Record<string, unknown> = {
      name: toString(dto.name),
    };
    return this.api.patch<SpecialityDto | null>(`/dean/specialities/${id}`, removeUndefined(payload));
  }

  deleteSpeciality(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/dean/specialities/${id}`);
  }

  assignSpecialityHead(id: string, headId?: string | null): Observable<SpecialityDto | null> {
    // Backend expects: { headId: string } to assign, or {} to unassign
    // @IsOptional() @IsString() means null is not valid, only undefined or a string
    const sanitizedHeadId = toString(headId);
    const body = sanitizedHeadId ? { headId: sanitizedHeadId } : {};
    return this.api.patch<SpecialityDto | null>(`/dean/specialities/${id}/head`, body);
  }

  createMiniAdmin(dto: CreateMiniAdminDto): Observable<MiniAdminDto> {
    const payload: Record<string, unknown> = {
      name: toStringRequired(dto.name),
      surname: toStringRequired(dto.surname),
      email: toStringRequired(dto.email),
      login: toStringRequired(dto.login),
      password: toStringRequired(dto.password),
      specialityId: toString(dto.specialityId),
    };
    return this.api.post<MiniAdminDto>('/dean/mini-admins', removeUndefined(payload));
  }

  updateMiniAdmin(id: string, dto: UpdateMiniAdminDto): Observable<MiniAdminDto | null> {
    const payload: Record<string, unknown> = {
      name: toString(dto.name),
      surname: toString(dto.surname),
      email: toString(dto.email),
      login: toString(dto.login),
      password: toString(dto.password),
      // For specialityId, null means "unassign", undefined means "don't change"
      specialityId: dto.specialityId === null ? null : toString(dto.specialityId),
    };
    return this.api.patch<MiniAdminDto | null>(`/dean/mini-admins/${id}`, removeUndefined(payload));
  }

  deleteMiniAdmin(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/dean/mini-admins/${id}`);
  }

  // AI analytics
  getAiAnalytics(academicYearId?: string): Observable<DeanAiAnalyticsDto> {
    const params = academicYearId ? { academicYearId: String(academicYearId) } : undefined;
    return this.api.get<DeanAiAnalyticsDto>('/dean/ai-analytics', { params });
  }

  // Stats
  getStats(academicYearId?: string): Observable<DeanDashboardStatsDto> {
    const params = academicYearId ? { academicYearId: String(academicYearId) } : undefined;
    return this.api.get<DeanDashboardStatsDto>('/dean/stats', { params });
  }

  publishStats(academicYearId?: string): Observable<{ published: boolean }> {
    const params = academicYearId ? { academicYearId: String(academicYearId) } : undefined;
    return this.api.post<{ published: boolean }>('/dean/stats/publish', {}, { params });
  }
}
