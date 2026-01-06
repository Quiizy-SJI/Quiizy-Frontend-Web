import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Header } from '../../../components/header/header';
import { StatsCards } from '../../../components/stats-cards/stats-cards';
import { RecentActivity } from '../../../components/recent-activity/recent-activity';
import { UpcomingExams } from '../../../components/upcoming-exams/upcoming-exams';
import { EvaluationPipeline } from '../../../components/evaluation-pipeline/evaluation-pipeline';
import { QuickActions } from '../../../components/quick-actions/quick-actions';
import { RecentExamPublishing } from '../../../components/recent-exam-publishing/recent-exam-publishing';

@Component({
  selector: 'app-dashboard',
 imports: [
    CommonModule,
    Sidebar,
    Header,
    StatsCards,
    RecentActivity,
    UpcomingExams,
    QuickActions,
    EvaluationPipeline,
    RecentExamPublishing
  ], 
   templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}

