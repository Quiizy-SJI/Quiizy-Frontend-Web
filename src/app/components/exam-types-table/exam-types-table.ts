import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExamType } from '../../core/interfaces/mini-admin';
import { ThemeService } from '../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-types-table',
  imports: [CommonModule],
  templateUrl: './exam-types-table.html',
  styleUrl: './exam-types-table.scss',
})
export class ExamTypesTable {
@Input() examTypes: ExamType[] = [];
  @Output() addType = new EventEmitter<void>();
  @Output() editType = new EventEmitter<ExamType>();

  constructor(public themeService: ThemeService) {}

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
