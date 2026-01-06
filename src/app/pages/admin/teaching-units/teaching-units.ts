import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TeachingUnit } from '../../../core/interfaces/teaching-unit';
import { ThemeService } from '../../../core/services';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Header } from '../../../components/header/header';
import { BulkActions } from '../../../components/bulk-actions/bulk-actions';
import { Filters } from '../../../components/filters/filters';
import { Pagination } from '../../../components/pagination/pagination';
import { TeachingUnitsTable } from '../../../components/teaching-units-table/teaching-units-table';

@Component({
  selector: 'app-teaching-units',
  imports: [
    CommonModule,
    Sidebar,
    Header,
    Filters,
    BulkActions,
    TeachingUnitsTable,
    Pagination
  ],
  templateUrl: './teaching-units.html',
  styleUrl: './teaching-units.scss',
})
export class TeachingUnits {
  allUnits: TeachingUnit[] = [
    {
      code: 'ISI402',
      name: 'Advanced DB Systems',
      department: 'Computer Science',
      credits: 6,
      status: 'Ready'
    },
    {
      code: 'ISI405',
      name: 'AI Reasoning',
      department: 'Computer Science',
      credits: 5,
      status: 'Awaiting Specialty'
    },
    {
      code: 'ISI312',
      name: 'Networks & Security',
      department: 'Networks',
      credits: 4,
      status: 'Needs Review'
    }
  ];

   filteredUnits = [...this.allUnits];
  currentPage = 1;
  totalPages = 16;
  totalItems = 128;

  constructor(public themeService: ThemeService) {}

  onNewSubject() {
    console.log('Create new subject clicked');
  }

  onFiltersChange(filters: any) {
    console.log('Filters changed:', filters);
    // Apply filters to units
  }

  onEditUnit(unit: TeachingUnit) {
    console.log('Edit unit:', unit);
  }

  onViewUnit(unit: TeachingUnit) {
    console.log('View unit:', unit);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    console.log('Page changed to:', page);
  }
}
