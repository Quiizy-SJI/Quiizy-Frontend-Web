import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatsCards } from '../../../components/stats-cards/stats-cards';
import { Semester, QuestionBank, ActivityAlert } from '../../../core/interfaces/semester';
import { ThemeService } from '../../../core/services';
import { ActivityAlerts } from '../../../components/activity-alerts/activity-alerts';
import { QuestionBankComponent } from '../../../components/question-bank/question-bank';
import { Sidebar } from "../../../components/sidebar/sidebar";
import { Header } from "../../../components/header/header";
import { Filters } from "../../../components/filters/filters";

@Component({
  selector: 'app-academic-overview',
  imports: [CommonModule,
    QuestionBankComponent,
    ActivityAlerts, Sidebar, Header, Filters],
  templateUrl: './academic-overview.html',
  styleUrl: './academic-overview.scss',
})
export class AcademicOverview {
  studentsCount = 320;
  teachersCount = 24;
  questionOwnerCoverage = 92;

  semesters: Semester[] = [
    {
      id: 1,
      name: 'Semester 1',
      dateRange: 'Sep 02 - Dec 20',
      status: 'Active',
      color: '#6366f1'
    },
    {
      id: 2,
      name: 'Semester 2',
      dateRange: 'Jan 08 - Apr 25',
      status: 'Scheduled',
      color: '#10b981'
    },
    {
      id: 3,
      name: 'Semester 3',
      dateRange: 'Awaiting dates',
      status: 'Scheduled',
      color: '#f59e0b'
    }
  ];

  questionBanks: QuestionBank[] = [
    {
      id: 'ISI402',
      name: 'Advanced DB Systems',
      status: 'Active',
      questionsCount: 42,
      notes: 'Ready - 42 questions'
    },
    {
      id: 'ISI405',
      name: 'AI Reasoning',
      status: 'Pending',
      questionsCount: 0,
      notes: 'Pending owner - awaiting open response'
    }
  ];

  activityAlerts: ActivityAlert[] = [
    {
      type: 'info',
      color: '#6366f1',
      title: 'Spring 25 evaluation pack drafted',
      description: '36 logs · Mini-admin',
      time: 'Just now'
    },
    {
      type: 'warning',
      color: '#f59e0b',
      title: 'Question bank lacks owner',
      description: 'Assign coordinators',
      time: '2h ago'
    },
    {
      type: 'success',
      color: '#10b981',
      title: 'Departments synced',
      description: 'Question catalogs updated',
      time: '10m ago'
    }
  ];

  constructor(public themeService: ThemeService) {}

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  onFiltersChange(filters: any) {
    console.log('Filters changed:', filters);
    // Apply filters to units
  }
}
