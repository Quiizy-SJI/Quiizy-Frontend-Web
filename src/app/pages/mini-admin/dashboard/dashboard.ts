import { Component } from '@angular/core';
import { Sidebar } from "../../../components/sidebar/sidebar";
import { Header } from "../../../components/header/header";
import { SelectComponent, StatCardComponent, TableColumn, TableComponent, InputComponent } from "../../../components/ui";
import { Filters } from "../../../components/filters/filters";
import { ThemeService } from '../../../core/services';
import { SortEvent } from '../../../components/ui/tables/table/table.component';
import { RecentActivity } from "../../../components/recent-activity/recent-activity";
import { UpcomingExams } from "../../../components/upcoming-exams/upcoming-exams";
import { BulkActions } from "../../../components/bulk-actions/bulk-actions";
import { CriticalAlertsTable } from "../../../components/critical-alerts-table/critical-alerts-table";

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, Header, SelectComponent, Filters, StatCardComponent, TableComponent, InputComponent, RecentActivity, UpcomingExams, BulkActions, CriticalAlertsTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
onFilterChange() {
throw new Error('Method not implemented.');
}
  constructor(public themeService: ThemeService){}
  
  tableColumns: TableColumn[] = [
    {key: 'id', label: 'ID', align: 'center'},
    {key: 'class', label: 'Class', sortable: true, align: 'center'},
    {key: 'level', label: 'Level', sortable: true, align: 'center'},
    {key: 'students', label: 'Students'},
    {key: 'teachers', label: 'Teachers'},
    // {key: 'status', label: "Status"} //Si la classe perform well or not
  ]

  rowData = [
    {'id': 'ISI4', 'class': 'ING 4 ISI EN', 'level': '4', 'students': 28, 'teachers': 4, },
    {'id': 'ISI3', 'class': 'ING 3 ISI EN', 'level': '3', 'students': 28, 'teachers': 4, },
  ]

  handleSort(t: SortEvent){
    console.log(t)
    let order = t.direction === 'asc' ? 1 : -1
    this.rowData = this.rowData.sort((a,b) => a.class >= b.class ? order : -1 * order )
  }
}
