import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Department } from '../../core/interfaces/stat';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services';

@Component({
  selector: 'app-departments-catalog',
  imports: [CommonModule],
  templateUrl: './departments-catalog.html',
  styleUrl: './departments-catalog.scss',
})
export class DepartmentsCatalog {
   @Input() departments: Department[] = [];
  @Output() departmentSelect = new EventEmitter<Department>();
  
   constructor(public themeService: ThemeService) {}


getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
