import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatCardComponent } from "../ui";
import { Stat } from '../../core/interfaces/stat';

@Component({
  selector: 'app-stats-cards',
  imports: [CommonModule, StatCardComponent],
  templateUrl: './stats-cards.html',
  styleUrl: './stats-cards.scss',
})
export class StatsCards {
  stats: Stat[] = [
    {
      label: 'Eligible Participants',
      value: '12,480',
      trendValue: '+5% this month',
      color: 'success',
      showIcon: true,
      showTrend: true
    },
    {
      label: 'Active Evaluations',
      value: '48',
      trendValue: '12 pending publication',
      color: 'warning',
      showIcon: true
    },
    {
      label: 'Course Coordinators',
      value: '320',
      trendValue: '8 newly accredited',
      color: 'primary',
      showIcon: true
    },
    {
      label: 'Evaluation Health',
      value: '99.95%',
      description: 'All services operational',
      color: 'info',
      showIcon: true,
      showProgress: true,
      progress: 99.95
    }
  ];
}
