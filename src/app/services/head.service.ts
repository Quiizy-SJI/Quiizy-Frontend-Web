import { inject, Injectable } from '@angular/core';
import { ApiClientService } from '../core/http/api-client.service';
import { Observable } from 'rxjs';
import { AcademicYearDto, ClassAcademicYearDto, CourseDto } from '../domain/dtos/teacher';

@Injectable({
  providedIn: 'root',
})
export class HeadService {

  private api = inject(ApiClientService); 
 
  listAcademicYears(): Observable<AcademicYearDto[]> {
    return this.api.get<AcademicYearDto[]>('/dean/academic-years');
  }
  
  listCourses(): Observable<CourseDto[]> {
    return this.api.get<CourseDto[]>('/mini-admin/courses');
  }

  listClasses(): Observable<ClassAcademicYearDto[]> {
    return this.api.get<ClassAcademicYearDto[]>('/class-academic-years');
  }
}