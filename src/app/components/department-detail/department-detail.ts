import { Component, Input } from '@angular/core';
import { Department, Teacher } from '../../core/interfaces/stat';
import { ThemeService } from '../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-detail',
  imports: [CommonModule],
  templateUrl: './department-detail.html',
  styleUrl: './department-detail.scss',
})
export class DepartmentDetail {
  @Input() department: Department | null = null;
  @Input() teachers: Teacher[] = [];

  constructor(public themeService: ThemeService) {}

  getExamClass(completion: number): string {
    return completion > 100 ? 'exam-warning' : 'exam-good';
  }

  getTeacherStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
