import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';

import { TeacherApiService } from '../../../services/teacher-api.service';
import type { QuizDto, CourseDto } from '../../../domain/dtos/teacher/teacher-quiz.dto';
import { getQuizQuestionCount } from '../../../domain/dtos/teacher/teacher-quiz.dto';

@Component({
  selector: 'app-teacher-statistics',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="statistics">
      <div class="page-header">
        <h1>Statistics & Analytics</h1>
        <p>Comprehensive insights into student performance and exam analytics.</p>
      </div>

      <div class="stats-overview">
        <div class="overview-card">
          <div class="card-icon">
            <mat-icon>groups</mat-icon>
          </div>
          <div class="card-content">
            <h3>Total Students</h3>
            <p class="main-stat">{{ stats.totalStudents }}</p>
            <span class="trend neutral">Across all quizzes</span>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <mat-icon>assignment</mat-icon>
          </div>
          <div class="card-content">
            <h3>Exams Conducted</h3>
            <p class="main-stat">{{ stats.totalExams }}</p>
            <span class="trend neutral">Total created</span>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="card-content">
            <h3>Average Score</h3>
            <p class="main-stat">{{ stats.averageScore | number:'1.1-1' }}%</p>
            <span class="trend neutral">Overall performance</span>
          </div>
        </div>

        <div class="overview-card">
          <div class="card-icon">
            <mat-icon>schedule</mat-icon>
          </div>
          <div class="card-content">
            <h3>Avg Duration</h3>
            <p class="main-stat">{{ stats.avgDuration }} min</p>
            <span class="trend neutral">Exam duration</span>
          </div>
        </div>
      </div>

      <div class="analytics-grid">
        <div class="chart-section">
          <div class="chart-card">
            <div class="chart-header">
              <h3>Performance Trends</h3>
              <select class="time-filter">
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>This year</option>
              </select>
            </div>
            <div class="chart-placeholder">
              <mat-icon>show_chart</mat-icon>
              <p>Performance trend chart would be displayed here</p>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h3>Score Distribution</h3>
              <button class="export-btn" (click)="exportData()">
                <mat-icon>file_download</mat-icon>
                Export
              </button>
            </div>
            <div class="score-distribution">
              <div class="score-range">
                <span class="range-label">90-100%</span>
                <div class="range-bar">
                  <div class="range-fill excellent" style="width: 25%"></div>
                </div>
                <span class="range-count">62 students</span>
              </div>
              <div class="score-range">
                <span class="range-label">80-89%</span>
                <div class="range-bar">
                  <div class="range-fill good" style="width: 35%"></div>
                </div>
                <span class="range-count">87 students</span>
              </div>
              <div class="score-range">
                <span class="range-label">70-79%</span>
                <div class="range-bar">
                  <div class="range-fill average" style="width: 28%"></div>
                </div>
                <span class="range-count">69 students</span>
              </div>
              <div class="score-range">
                <span class="range-label">60-69%</span>
                <div class="range-bar">
                  <div class="range-fill below" style="width: 12%"></div>
                </div>
                <span class="range-count">30 students</span>
              </div>
            </div>
          </div>
        </div>

        <div class="insights-section">
          <div class="insights-card">
            <h3>Key Insights</h3>
            <div class="insights-list">
              <div class="insight-item">
                <div class="insight-icon positive">
                  <mat-icon>trending_up</mat-icon>
                </div>
                <div class="insight-content">
                  <h4>Improved Performance</h4>
                  <p>Mathematics scores increased by 15% after implementing practice tests.</p>
                </div>
              </div>

              <div class="insight-item">
                <div class="insight-icon warning">
                  <mat-icon>warning</mat-icon>
                </div>
                <div class="insight-content">
                  <h4>Attention Needed</h4>
                  <p>Physics concepts show consistent low scores across multiple exams.</p>
                </div>
              </div>

              <div class="insight-item">
                <div class="insight-icon info">
                  <mat-icon>lightbulb</mat-icon>
                </div>
                <div class="insight-content">
                  <h4>Recommendation</h4>
                  <p>Consider shorter exam durations to improve completion rates.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="top-performers-card">
            <h3>Top Performers</h3>
            <div class="performers-list">
              <div class="performer-item">
                <div class="performer-rank">1</div>
                <div class="performer-info">
                  <span class="performer-name">Sarah Johnson</span>
                  <span class="performer-score">94.5%</span>
                </div>
              </div>
              <div class="performer-item">
                <div class="performer-rank">2</div>
                <div class="performer-info">
                  <span class="performer-name">Michael Chen</span>
                  <span class="performer-score">92.8%</span>
                </div>
              </div>
              <div class="performer-item">
                <div class="performer-rank">3</div>
                <div class="performer-info">
                  <span class="performer-name">Emma Davis</span>
                  <span class="performer-score">91.2%</span>
                </div>
              </div>
              <div class="performer-item">
                <div class="performer-rank">4</div>
                <div class="performer-info">
                  <span class="performer-name">James Wilson</span>
                  <span class="performer-score">89.7%</span>
                </div>
              </div>
              <div class="performer-item">
                <div class="performer-rank">5</div>
                <div class="performer-info">
                  <span class="performer-name">Lisa Anderson</span>
                  <span class="performer-score">88.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="detailed-analytics">
        <div class="analytics-card">
          <div class="card-header">
            <h3>Subject Performance Breakdown</h3>
            <div class="header-actions">
              <select class="subject-filter">
                <option>All Subjects</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
              </select>
            </div>
          </div>
          <div class="subject-stats">
            <div class="subject-stat">
              <div class="subject-info">
                <span class="subject-name">Mathematics</span>
                <span class="subject-exams">15 exams</span>
              </div>
              <div class="subject-metrics">
                <div class="metric">
                  <span class="metric-label">Avg Score</span>
                  <span class="metric-value">82.3%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Completion</span>
                  <span class="metric-value">94%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Difficulty</span>
                  <span class="metric-value difficulty-medium">Medium</span>
                </div>
              </div>
            </div>

            <div class="subject-stat">
              <div class="subject-info">
                <span class="subject-name">Physics</span>
                <span class="subject-exams">12 exams</span>
              </div>
              <div class="subject-metrics">
                <div class="metric">
                  <span class="metric-label">Avg Score</span>
                  <span class="metric-value">74.8%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Completion</span>
                  <span class="metric-value">89%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Difficulty</span>
                  <span class="metric-value difficulty-hard">Hard</span>
                </div>
              </div>
            </div>

            <div class="subject-stat">
              <div class="subject-info">
                <span class="subject-name">Chemistry</span>
                <span class="subject-exams">18 exams</span>
              </div>
              <div class="subject-metrics">
                <div class="metric">
                  <span class="metric-label">Avg Score</span>
                  <span class="metric-value">78.9%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Completion</span>
                  <span class="metric-value">91%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Difficulty</span>
                  <span class="metric-value difficulty-medium">Medium</span>
                </div>
              </div>
            </div>
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
