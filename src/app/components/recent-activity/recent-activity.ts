import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../../core/services';

@Component({
  selector: 'app-recent-activity',
  imports: [CommonModule],
  templateUrl: './recent-activity.html',
  styleUrl: './recent-activity.scss',
})
export class RecentActivity {

  constructor(public themeService: ThemeService) {}
   activities = [
    {
      text: 'Mini-admin Sarah created Exam "DB Systems CC"',
      time: '5 min ago',
      color: '#6366f1'
    },
    {
      text: '40 students submitted Operating Systems Final',
      time: '25 min ago',
      color: '#10b981'
    },
    {
      text: 'Grading backlog exceeds SLA in ISI 4',
      time: '1 hr ago',
      color: '#f59e0b'
    },
    {
      text: 'System maintenance scheduled Nov 12 02:00 UTC',
      time: 'Today',
      color: '#ef4444'
    }
  ]
}
