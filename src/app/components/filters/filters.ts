import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services';
import { AlertComponent, SelectComponent, InputComponent } from "../ui";

@Component({
  selector: 'app-filters',
  imports: [CommonModule, FormsModule, SelectComponent, InputComponent],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters {
  @Input() selectStatus= false
  @Input() selectSubject = false
  @Input() selectDept = false

  @Output() filtersChange = new EventEmitter<any>();
  
  academicYear = '2025';
  department = 'All';
  status = 'Any';
  searchText = '';

  constructor(public themeService: ThemeService) {}

  onFilterChange() {
    this.filtersChange.emit({
      academicYear: this.academicYear,
      department: this.department,
      status: this.status,
      searchText: this.searchText
    });
  }
}
