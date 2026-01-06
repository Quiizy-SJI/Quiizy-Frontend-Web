import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeachingUnit } from '../../core/interfaces/teaching-unit';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services';

@Component({
  selector: 'app-teaching-units-table',
  imports: [CommonModule],
  templateUrl: './teaching-units-table.html',
  styleUrl: './teaching-units-table.scss',
})
export class TeachingUnitsTable {
   @Input() units: TeachingUnit[] = [];
  @Output() editUnit = new EventEmitter<TeachingUnit>();
  @Output() viewUnit = new EventEmitter<TeachingUnit>();

  constructor (public themeService: ThemeService) {}
  getStatusClass(status: string): string {
    switch (status) {
      case 'Ready': return 'status-ready';
      case 'Awaiting Specialty': return 'status-awaiting';
      case 'Needs Review': return 'status-needs-review';
      default: return '';
    }
  }

  fixExcel(unit: TeachingUnit) {
    console.log('Fix Excel for:', unit);
  }
}
