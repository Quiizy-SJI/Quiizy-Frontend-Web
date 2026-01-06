import { Component, Input } from '@angular/core';
import { ExamStats } from '../../core/interfaces/stat';
import { ThemeService } from '../../core/services';

@Component({
  selector: 'app-exam-statistics',
  imports: [],
  templateUrl: './exam-statistics.html',
  styleUrl: './exam-statistics.scss',
})
export class ExamStatistics {
   @Input() stats: ExamStats = { published: 0, draft: 0, scheduled: 0 };

  constructor(public themeService: ThemeService) {}
}
