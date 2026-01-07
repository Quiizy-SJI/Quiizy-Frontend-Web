import { inject, Injectable } from '@angular/core';
import { ApiClientService } from '../core/http/api-client.service';
import { Observable } from 'rxjs';
import {
  AcademicYearDto,
  ClassAcademicYearDto,
  CourseDto,
  TeacherDto,
} from '../domain/dtos/teacher';
import type { TeachingUnitDto } from '../domain/dtos/dean/dean-shared.dto';

@Injectable({
  providedIn: 'root',
})
export class HeadService {

  private api = inject(ApiClientService); 
 
  listAcademicYears(): Observable<AcademicYearDto[]> {
    return this.api.get<AcademicYearDto[]>('/dean/academic-years');
  }

  listTeachingUnits(): Observable<TeachingUnitDto[]> {
    return this.api.get<TeachingUnitDto[]>('/dean/teaching-units');
  }
  
  listCourses(academicYearId?: string): Observable<CourseDto[]> {
    const params = academicYearId ? { academicYearId: String(academicYearId) } : undefined;
    return this.api.get<CourseDto[]>('/mini-admin/courses', { params });
  }

  createCourse(dto: {
    level: string;
    credits: number;
    classAcademicYearId: string;
    teachingUnitId?: string;
    teacherId?: string;
  }): Observable<CourseDto> {
    return this.api.post<CourseDto>('/mini-admin/courses', dto);
  }

  updateCourse(
    id: string,
    dto: Partial<{
      level: string;
      credits: number;
      classAcademicYearId: string;
      teachingUnitId?: string | null;
      teacherId?: string | null;
    }>,
  ): Observable<CourseDto | null> {
    return this.api.patch<CourseDto | null>(`/mini-admin/courses/${id}`, dto);
  }

  deleteCourse(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/mini-admin/courses/${id}`);
  }

  listClasses(academicYearId?: string): Observable<ClassAcademicYearDto[]> {
    const params = academicYearId ? { academicYearId: String(academicYearId) } : undefined;
    return this.api.get<ClassAcademicYearDto[]>('/class-academic-years', { params });
  }

  createClass(dto: { name: string; level?: string }): Observable<{ id: string; name: string; level?: string }> {
    return this.api.post<{ id: string; name: string; level?: string }>('/mini-admin/classes', dto);
  }

  updateClass(
    classId: string,
    dto: Partial<{ name: string; level?: string }>,
  ): Observable<{ id: string; name: string; level?: string } | null> {
    return this.api.patch<{ id: string; name: string; level?: string } | null>(
      `/mini-admin/classes/${classId}`,
      dto,
    );
  }

  deleteClass(classId: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/mini-admin/classes/${classId}`);
  }

  createClassAcademicYear(dto: {
    classId: string;
    academicYearId: string;
    studentIds?: string[];
  }): Observable<ClassAcademicYearDto> {
    return this.api.post<ClassAcademicYearDto>('/class-academic-years', dto);
  }

  updateClassAcademicYear(
    id: string,
    dto: Partial<{ classId: string; academicYearId: string; studentIds: string[] }>,
  ): Observable<ClassAcademicYearDto | null> {
    return this.api.patch<ClassAcademicYearDto | null>(`/class-academic-years/${id}`, dto);
  }

  deleteClassAcademicYear(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/class-academic-years/${id}`);
  }

  listTeachers(): Observable<TeacherDto[]> {
    return this.api.get<TeacherDto[]>('/mini-admin/teachers');
  }

  createTeacher(dto: {
    name: string;
    surname: string;
    email: string;
    login: string;
    password: string;
  }): Observable<TeacherDto> {
    return this.api.post<TeacherDto>('/mini-admin/teachers', dto);
  }

  updateTeacher(
    id: string,
    dto: Partial<{
      name: string;
      surname: string;
      email: string;
      login: string;
      password: string;
    }>,
  ): Observable<TeacherDto | null> {
    return this.api.patch<TeacherDto | null>(`/mini-admin/teachers/${id}`, dto);
  }

  deleteTeacher(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/mini-admin/teachers/${id}`);
  }

  listStudents(academicYearId?: string): Observable<any[]> {
    const params = academicYearId ? { academicYearId: String(academicYearId) } : undefined;
    return this.api.get<any[]>('/mini-admin/students', { params });
  }

  createStudent(dto: {
    name: string;
    surname: string;
    email: string;
    login: string;
    password: string;
    matricule: string;
    classAcademicYearIds?: string[];
  }): Observable<any> {
    return this.api.post<any>('/mini-admin/students', dto);
  }

  updateStudent(
    id: string,
    dto: Partial<{
      name: string;
      surname: string;
      email: string;
      login: string;
      password: string;
      matricule: string;
      isActive: boolean;
      classAcademicYearIds: string[];
    }>,
  ): Observable<any> {
    return this.api.patch<any>(`/mini-admin/students/${id}`, dto);
  }

  deleteStudent(id: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`/mini-admin/students/${id}`);
  }
}