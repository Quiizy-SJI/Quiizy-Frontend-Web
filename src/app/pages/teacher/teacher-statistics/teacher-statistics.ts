import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { StatCardComponent } from '../../../components/ui/cards/stat-card/stat-card.component';
import { ChartHostComponent } from '../../../components/charts/chart-host/chart-host.component';
import { TableComponent } from '../../../components/ui/tables/table/table.component';
import { firstValueFrom } from 'rxjs';

import { TeacherApiService } from '../../../services/teacher-api.service';
import type { QuizDto, CourseDto } from '../../../domain/dtos/teacher/teacher-quiz.dto';
import { getQuizQuestionCount } from '../../../domain/dtos/teacher/teacher-quiz.dto';

@Component({
  selector: 'app-teacher-statistics',
  standalone: true,
  imports: [CommonModule, MatIconModule, StatCardComponent, ChartHostComponent, TableComponent],
  template: `
    <div class="statistics">
      <div class="page-header">
        <h1>Statistics & Analytics</h1>
        <p>Overview of recent quizzes and student performance.</p>
      </div>

      <div class="stats-overview">
        <ui-stat-card label="Total Students" [value]="stats.totalStudents" color="primary" format="number"></ui-stat-card>
        <ui-stat-card label="Exams Conducted" [value]="stats.totalExams" color="accent" format="number"></ui-stat-card>
        <ui-stat-card label="Average Score" [value]="stats.averageScore" color="success" [showProgress]="true" [progress]="stats.averageScore" format="percent"></ui-stat-card>
        <ui-stat-card label="Avg Duration (min)" [value]="stats.avgDuration" color="info" format="number"></ui-stat-card>
      </div>

      <div class="analytics-grid">
        <div class="chart-section">
          <div class="chart-card">
            <div class="chart-header">
              <h3>Performance Trends</h3>
            </div>
            <ui-chart [type]="'line'" [data]="trendChartData" [options]="trendChartOptions" [disableAnimations]="false"></ui-chart>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h3>Score Distribution</h3>
              <button class="export-btn" (click)="exportData()">
                <mat-icon>file_download</mat-icon>
                Export
              </button>
            </div>
            <ui-chart [type]="'pie'" [data]="distributionChartData" [options]="distributionChartOptions" [disableAnimations]="false"></ui-chart>
          </div>
        </div>

        <div class="insights-section">
          <div class="top-performers-card">
            <h3>Top Performers</h3>
            <ui-table [columns]="topPerformerColumns" [data]="topPerformers" [showHeader]="true" [showPagination]="false" [rowClickable]="false"></ui-table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .statistics {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--color-text-primary);
      }

      p {
        color: var(--color-text-secondary);
        font-size: 1rem;
      }
    }

    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .overview-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;

      .card-icon {
        background: var(--color-primary-50);
        border-radius: 12px;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          color: var(--color-primary-600);
          font-size: 1.5rem;
          width: 1.5rem;
          height: 1.5rem;
        }
      }

      .card-content {
        flex: 1;

        h3 {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          margin-bottom: 0.25rem;
        }

        .main-stat {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }

        .trend {
          font-size: 0.75rem;
          font-weight: 500;

          &.positive { color: var(--color-success-600); }
          &.negative { color: var(--color-error-600); }
        }
      }
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .chart-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .chart-card, .insights-card, .top-performers-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      min-height: 320px;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }
    }

    /* Ensure ui-chart fills available card space */
    .chart-card ui-chart,
    .chart-card ui-chart .chart-host {
      height: 100%;
      min-height: 240px;
      display: block;
    }

    .time-filter, .subject-filter {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      font-size: 0.875rem;
    }

    .export-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 0.75rem;
      background: var(--color-primary-600);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: var(--color-primary-700);
      }
    }

    .chart-placeholder {
      height: 300px;
      border: 2px dashed var(--color-border);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--color-text-secondary);

      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        margin-bottom: 0.5rem;
      }
    }

    .score-distribution {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .score-range {
      display: grid;
      grid-template-columns: 80px 1fr 100px;
      align-items: center;
      gap: 1rem;

      .range-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
      }

      .range-bar {
        height: 8px;
        background: var(--color-background-muted);
        border-radius: 4px;
        overflow: hidden;

        .range-fill {
          height: 100%;
          transition: width 0.3s;

          &.excellent { background: var(--color-success-500); }
          &.good { background: var(--color-primary-500); }
          &.average { background: var(--color-warning-500); }
          &.below { background: var(--color-error-500); }
        }
      }

      .range-count {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        text-align: right;
      }
    }

    .insights-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .insights-card h3, .top-performers-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: var(--color-text-primary);
    }

    .insights-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .insight-item {
      display: flex;
      gap: 0.75rem;

      .insight-icon {
        padding: 0.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        mat-icon {
          font-size: 1.25rem;
          width: 1.25rem;
          height: 1.25rem;
        }

        &.positive {
          background: var(--color-success-100);
          mat-icon { color: var(--color-success-600); }
        }

        &.warning {
          background: var(--color-warning-100);
          mat-icon { color: var(--color-warning-600); }
        }

        &.info {
          background: var(--color-primary-100);
          mat-icon { color: var(--color-primary-600); }
        }
      }

      .insight-content {
        h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--color-text-primary);
        }

        p {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
        }
      }
    }

    .performers-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .performer-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--color-background-subtle);
      border-radius: 8px;

      .performer-rank {
        width: 2rem;
        height: 2rem;
        background: var(--color-primary-600);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.875rem;
      }

      .performer-info {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .performer-name {
          font-weight: 500;
          color: var(--color-text-primary);
        }

        .performer-score {
          font-weight: 600;
          color: var(--color-success-600);
        }
      }
    }

    .detailed-analytics {
      margin-bottom: 2rem;
    }

    .analytics-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }
    }

    .subject-stats {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .subject-stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }

    .subject-info {
      display: flex;
      flex-direction: column;

      .subject-name {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }

      .subject-exams {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
    }

    .subject-metrics {
      display: flex;
      gap: 2rem;

      @media (max-width: 768px) {
        gap: 1rem;
      }
    }

    .metric {
      display: flex;
      flex-direction: column;
      align-items: center;

      .metric-label {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        margin-bottom: 0.25rem;
      }

      .metric-value {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-text-primary);

        &.difficulty-medium {
          color: var(--color-warning-600);
        }

        &.difficulty-hard {
          color: var(--color-error-600);
        }
      }
    }
  `]
})
export class TeacherStatistics implements OnInit {
  private readonly teacherApi = inject(TeacherApiService);

  // Stats computed from API data
  stats = {
    totalStudents: 0,
    totalExams: 0,
    averageScore: 0,
    avgDuration: 0,
  };

  // Raw data
  quizzes: QuizDto[] = [];
  courses: CourseDto[] = [];
  isLoading = true;

  // Score distribution
  scoreDistribution = {
    excellent: { count: 0, percentage: 0 }, // 90-100
    good: { count: 0, percentage: 0 },      // 80-89
    average: { count: 0, percentage: 0 },   // 70-79
    below: { count: 0, percentage: 0 },     // 60-69
    failing: { count: 0, percentage: 0 },   // <60
  };

  // Chart data placeholders
  trendChartData: any = { labels: [], datasets: [] };
  trendChartOptions: any = {};

  distributionChartData: any = { labels: [], datasets: [] };
  distributionChartOptions: any = {};

  // Top performers table
  topPerformers: Array<{ rank: number; name: string; score: number; exams: number }> = [];
  topPerformerColumns = [
    { key: 'rank', label: 'Rank' },
    { key: 'name', label: 'Student' },
    { key: 'score', label: 'Avg Score' },
    { key: 'exams', label: 'Exams' },
  ];

  ngOnInit(): void {
    this.loadStatistics();
  }

  private async loadStatistics(): Promise<void> {
    this.isLoading = true;
    try {
      const [quizzes, courses] = await Promise.all([
        firstValueFrom(this.teacherApi.getMyQuizzes()),
        firstValueFrom(this.teacherApi.getMyCourses()),
      ]);

      this.quizzes = quizzes;
      this.courses = courses;
      this.computeStats();
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private computeStats(): void {
    this.stats.totalExams = this.quizzes.length;

    // Count unique students from studentQuizes
    const studentIds = new Set<string>();
    let totalScore = 0;
    let totalMarks = 0;
    let scoredStudents = 0;
    let totalDuration = 0;

    for (const quiz of this.quizzes) {
      totalDuration += quiz.durationMinutes || 0;

      if (quiz.studentQuizes) {
        for (const sq of quiz.studentQuizes) {
          if (sq.student?.id) {
            studentIds.add(sq.student.id);
          }
          if (sq.rawScore !== null && sq.rawScore !== undefined && sq.totalMarks) {
            totalScore += sq.rawScore;
            totalMarks += sq.totalMarks;
            scoredStudents++;

            // Compute score distribution
            const percentage = (sq.rawScore / sq.totalMarks) * 100;
            if (percentage >= 90) this.scoreDistribution.excellent.count++;
            else if (percentage >= 80) this.scoreDistribution.good.count++;
            else if (percentage >= 70) this.scoreDistribution.average.count++;
            else if (percentage >= 60) this.scoreDistribution.below.count++;
            else this.scoreDistribution.failing.count++;
          }
        }
      }
    }

    this.stats.totalStudents = studentIds.size;
    this.stats.averageScore = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;
    this.stats.avgDuration = this.quizzes.length > 0
      ? Math.round(totalDuration / this.quizzes.length)
      : 0;

    // Compute percentages for distribution
    if (scoredStudents > 0) {
      this.scoreDistribution.excellent.percentage = (this.scoreDistribution.excellent.count / scoredStudents) * 100;
      this.scoreDistribution.good.percentage = (this.scoreDistribution.good.count / scoredStudents) * 100;
      this.scoreDistribution.average.percentage = (this.scoreDistribution.average.count / scoredStudents) * 100;
      this.scoreDistribution.below.percentage = (this.scoreDistribution.below.count / scoredStudents) * 100;
      this.scoreDistribution.failing.percentage = (this.scoreDistribution.failing.count / scoredStudents) * 100;
    }

    // Build chart data: trend per quiz (average score per quiz)
    const trendLabels: string[] = [];
    const trendValues: number[] = [];
    for (const q of this.quizzes) {
      trendLabels.push(`${q.type}${q.date ? ' - ' + new Date(q.date).toLocaleDateString() : ''}`);
      let qTotal = 0;
      let qMarks = 0;
      if (q.studentQuizes) {
        for (const sq of q.studentQuizes) {
          if (sq.rawScore !== undefined && sq.rawScore !== null && sq.totalMarks) {
            qTotal += sq.rawScore;
            qMarks += sq.totalMarks;
          }
        }
      }
      trendValues.push(qMarks > 0 ? (qTotal / qMarks) * 100 : 0);
    }

    this.trendChartData = {
      labels: trendLabels,
      datasets: [
        {
          label: 'Average Score (%)',
          data: trendValues,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.2)',
          tension: 0.2,
        },
      ],
    };

    this.trendChartOptions = {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, max: 100 } },
    };

    // Distribution pie
    this.distributionChartData = {
      labels: ['90-100', '80-89', '70-79', '60-69', '<60'],
      datasets: [
        {
          data: [
            this.scoreDistribution.excellent.count,
            this.scoreDistribution.good.count,
            this.scoreDistribution.average.count,
            this.scoreDistribution.below.count,
            this.scoreDistribution.failing.count,
          ],
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
        },
      ],
    };

    this.distributionChartOptions = {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
    };

    // Compute top performers
    this.computeTopPerformers();
  }

  private computeTopPerformers(): void {
    const map = new Map<string, { name: string; totalRaw: number; totalMarks: number; exams: number }>();

    for (const q of this.quizzes) {
      if (!q.studentQuizes) continue;
      for (const sq of q.studentQuizes) {
        const id = sq.student?.id || (sq.student?.user?.id ?? `${q.id}-${Math.random()}`);
        const name = sq.student ? `${sq.student.user?.name || ''} ${sq.student.user?.surname || ''}`.trim() : 'Unknown';
        if (!map.has(id)) map.set(id, { name, totalRaw: 0, totalMarks: 0, exams: 0 });
        const entry = map.get(id)!;
        if (sq.rawScore !== undefined && sq.rawScore !== null && sq.totalMarks) {
          entry.totalRaw += sq.rawScore;
          entry.totalMarks += sq.totalMarks;
          entry.exams += 1;
        }
      }
    }

    const arr = Array.from(map.entries()).map(([_, v]) => ({
      name: v.name || 'Unknown',
      score: v.totalMarks > 0 ? Math.round((v.totalRaw / v.totalMarks) * 1000) / 10 : 0,
      exams: v.exams,
    }));

    arr.sort((a, b) => b.score - a.score);
    this.topPerformers = arr.slice(0, 10).map((p, i) => ({ rank: i + 1, name: p.name, score: p.score, exams: p.exams }));
  }

  exportData(): void {
    console.log('Exporting statistics data');
    const data = {
      stats: this.stats,
      // Questions are accessed through CourseQuiz → CourseQuizQuestion
      quizzes: this.quizzes.map(q => ({
        id: q.id,
        type: q.type,
        date: q.date,
        duration: q.durationMinutes,
        questionsCount: getQuizQuestionCount(q),
        studentsCount: q.studentQuizes?.length || 0,
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teacher-statistics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
