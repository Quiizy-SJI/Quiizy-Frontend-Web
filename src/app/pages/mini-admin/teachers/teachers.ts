import { Component } from '@angular/core';
import { ThemeService } from '../../../core/services';
import { Sidebar } from "../../../components/sidebar/sidebar";
import { Header } from "../../../components/header/header";
import { Filters } from "../../../components/filters/filters";
import { BulkActions } from "../../../components/bulk-actions/bulk-actions";
import { SelectComponent, TableColumn, TableComponent, ButtonGroupComponent, ButtonComponent } from "../../../components/ui";
import { SortEvent } from '../../../components/ui/tables/table/table.component';
import { QuickActions } from "../../../components/quick-actions/quick-actions";
import { Student } from '../../../core/interfaces/student-class';
import { CommonModule } from '@angular/common';
import { ActivityAlerts } from "../../../components/activity-alerts/activity-alerts";
import { Teacher } from '../../../core/interfaces/stat';


@Component({
  selector: 'app-teachers',
  imports: [Sidebar, Header, Filters, BulkActions, SelectComponent, TableComponent, QuickActions, CommonModule, ActivityAlerts, ButtonGroupComponent, ButtonComponent],
  templateUrl: './teachers.html',
  styleUrl: './teachers.scss',
})
export class Teachers {


  selectedTeacher: Teacher = {
    name: 'James Smith',
    subjects: ['Analysis', 'Algebra'],
    classes: 2,
    examCompletion: 0,
    email: 'james.smith@example.com',
    status: 'Healthy'
  };

  classes = ['ISI 4 EN', 'ISI 3 CS']

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'subjects', label: 'Subjects' },
    { key: 'classes', label: 'Classes' },
    { key: 'email', label: 'Email' },

    // {key: 'status', label: "Status"} //Si la classe perform well or not
  ]

  rowData = [
    { 'name': 'Jerry George', 'subjects': ['Math', 'Physics'], 'classes': 3, 'email': 'jerry.george@example.com' },
    { 'name': 'Tom Krin', 'subjects': ['Chemistry', 'Biology'], 'classes': 2, 'email': 'tom.krin@example.com' },
  ]

  handleSort(t: SortEvent) {
    console.log(t)
    let order = t.direction === 'asc' ? 1 : -1
    // this.rowData = this.rowData.sort((a,b) => a. >= b.class ? order : -1 * order )
  }
  onFilterChange() {
    throw new Error('Method not implemented.');
  }
  constructor(public themeService: ThemeService) { }
}

