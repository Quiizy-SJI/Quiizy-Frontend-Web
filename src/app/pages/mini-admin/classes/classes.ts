import { Component } from '@angular/core';
import { TableColumn, TableComponent, StatCardComponent, SelectComponent } from "../../../components/ui";
import { SortEvent } from '../../../components/ui/tables/table/table.component';
import { Header } from "../../../components/header/header";
import { Sidebar } from "../../../components/sidebar/sidebar";
import { Filters } from "../../../components/filters/filters";
import { ThemeService } from '../../../core/services';
import { BulkActions } from "../../../components/bulk-actions/bulk-actions";
import { StudentClass } from '../../../core/interfaces/student-class';
import { CommonModule } from '@angular/common';
import { RecentActivity } from "../../../components/recent-activity/recent-activity";

@Component({
  selector: 'app-classes',
  imports: [TableComponent, Header, Sidebar, Filters, SelectComponent, BulkActions, CommonModule, RecentActivity],
  templateUrl: './classes.html',
  styleUrl: './classes.scss',
})
export class Classes {
onFilterChange() {
throw new Error('Method not implemented.');
}
    constructor(public themeService: ThemeService){}
  
  
    tableColumns: TableColumn[] = [
      {key: 'class', label: 'Class', sortable: true},
      {key: 'level', label: 'Level', sortable: true},
      {key: 'students', label: 'Students'},
      {key: 'teachers', label: 'Teachers'},
      // {key: 'status', label: "Status"} //Si la classe perform well or not
    ]
  
    rowData = [
      { 'class': 'ING 4 ISI EN', 'level': '4', 'students': 28, 'teachers': 4, },
      { 'class': 'ING 3 ISI EN', 'level': '3', 'students': 28, 'teachers': 4, }
    ]
  
    handleSort(t: SortEvent){
      console.log(t)
      let order = t.direction === 'asc' ? 1 : -1
      this.rowData = this.rowData.sort((a,b) => a.class >= b.class ? order : -1 * order )
    }

    classDetail: StudentClass = {
      name: 'ING 4 ISI EN',
      level: '4',
      department: 'ISI',
      studentsEnrolled: 0,
      status: 'Active',
      teachers: [],
      subjects: []
    }

}
