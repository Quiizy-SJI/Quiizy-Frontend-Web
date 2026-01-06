import { Component } from '@angular/core';
import { Keyword, SentimentAlert } from '../../../core/interfaces/sentiment-alert';
import { ThemeService } from '../../../core/services';
import { Keywords } from "../../../components/keywords/keywords";
import { CriticalAlertsTable } from "../../../components/critical-alerts-table/critical-alerts-table";
import { Filters } from "../../../components/filters/filters";
import { Header } from "../../../components/header/header";
import { CommonModule } from '@angular/common';
import { Sidebar } from "../../../components/sidebar/sidebar";

@Component({
  selector: 'app-sentiment-analysis',
  imports: [CommonModule,
    Keywords, CriticalAlertsTable, Filters, Header, Sidebar],
  templateUrl: './sentiment-analysis.html',
  styleUrl: './sentiment-analysis.scss',
})
export class SentimentAnalysis {
  totalEssays = 2847;
  positiveSentiment = 72;
  criticalAlerts = 18;

  topKeywords: Keyword[] = [
    { text: '#stress', count: 342 },
    { text: '#burnout', count: 218 },
    { text: '#sleep', count: 186 },
    { text: '#support', count: 124 },
    { text: '#motivation', count: 98 }
  ];

  sentimentAlerts: SentimentAlert[] = [
    {
      student: 'Student 43A',
      department: 'ISI 4',
      exam: 'AI Midterm',
      mood: 'Burnout',
      moodPercentage: 78,
      flagged: '2 hours ago',
      severity: 'critical'
    },
    {
      student: 'Student 87B',
      department: 'ISI 3',
      exam: 'Networks',
      mood: 'Stress',
      moodPercentage: 64,
      flagged: '5 hours ago',
      severity: 'warning'
    }
  ];

  constructor(public themeService: ThemeService) {}
}
