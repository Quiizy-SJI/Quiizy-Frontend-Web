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

@Component({
  selector: 'app-students',
  imports: [Sidebar, Header, Filters, BulkActions, SelectComponent, TableComponent, QuickActions, CommonModule, ActivityAlerts, ButtonGroupComponent, ButtonComponent],
  templateUrl: './students.html',
  styleUrl: './students.scss',
})
export class Students {

selectedStudent: Student = {
  matricule: '2223i279',
  name: 'JAMES',
  surname: 'George',
  email: 'george.james@example.com',
  status: 'Enrolled',
  className: 'ISI 4 EN',
  numCarryOver: 2
};

carriedOver = ['Algorithm', 'Mechanics']

tableColumns: TableColumn[] = [
      {key: 'matricule', label: 'Matricule'},
      {key: 'name', label: 'Name', sortable: true},
      {key: 'surname', label: 'Surname'},
      {key: 'className', label: 'Class'},
      {key: 'numCarryOver', label: 'Carry overs', sortable: true},
      {key: 'email', label: 'Email'},
      // {key: 'status', label: "Status"} //Si la classe perform well or not
    ]
  
    rowData = [
      { 'matricule': '2325i768', 'name': 'Jerry', 'surname': 'Goerge', 'className': 'ISI 4 EN', 'email': 'jerry.goerge@example.com' , 'numCarryOver': 3 },
      { 'matricule': '2325i456', 'name': 'Tom', 'surname': 'Krin', 'className': 'ISI 4 EN', 'email': 'tom.krin@example.com', 'numCarryOver': 0 },
    ]
  
    handleSort(t: SortEvent){
      console.log(t)
      let order = t.direction === 'asc' ? 1 : -1
      // this.rowData = this.rowData.sort((a,b) => a. >= b.class ? order : -1 * order )
    }
onFilterChange() {
throw new Error('Method not implemented.');
}
  constructor(public themeService: ThemeService) {}
}
