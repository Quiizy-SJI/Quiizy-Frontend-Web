import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { TeacherApiService } from '../../../services/teacher-api.service';
import type { QuizDto } from '../../../domain/dtos/teacher/teacher-quiz.dto';

@Component({
  selector: 'app-teacher-mock-tests',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="mock-tests">
      <div class="page-header">
        <div class="header-content">
          <h1>Mock Tests</h1>
          <p>Create and manage practice tests to help students prepare for actual exams.</p>
        </div>
        <button class="create-mock-btn" (click)="createMockTest()">
          <mat-icon>add</mat-icon>
          Create Mock Test
        </button>
      </div>

      <div class="mock-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <mat-icon>psychology</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Active Mock Tests</h3>
            <p class="stat-number">{{ stats.activeMocks }}</p>
            <span class="stat-change">Total MOCK quizzes</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <mat-icon>groups</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Total Attempts</h3>
            <p class="stat-number">{{ stats.totalAttempts }}</p>
            <span class="stat-change">Students participated</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Average Score</h3>
            <p class="stat-number">{{ stats.averageScore | number:'1.0-0' }}%</p>
            <span class="stat-change">Overall performance</span>
          </div>
        </div>
      </div>

      <div class="filters-tabs">
        <button class="tab" [class.active]="activeFilter === 'all'" (click)="setFilter('all')">All Mock Tests</button>
        <button class="tab" [class.active]="activeFilter === 'active'" (click)="setFilter('active')">Active</button>
        <button class="tab" [class.active]="activeFilter === 'completed'" (click)="setFilter('completed')">Completed</button>
        <button class="tab" [class.active]="activeFilter === 'draft'" (click)="setFilter('draft')">Draft</button>
      </div>

      <div class="mock-tests-grid">
        <div class="mock-test-card active">
          <div class="card-header">
            <div class="test-info">
              <h3>Mathematics Practice Test #1</h3>
              <span class="subject-tag mathematics">Mathematics</span>
            </div>
            <span class="status-badge active">Active</span>
          </div>

          <div class="test-details">
            <div class="detail-row">
              <div class="detail-item">
                <mat-icon>schedule</mat-icon>
                <span>60 minutes</span>
              </div>
              <div class="detail-item">
                <mat-icon>quiz</mat-icon>
                <span>20 questions</span>
              </div>
              <div class="detail-item">
                <mat-icon>star</mat-icon>
                <span>Medium difficulty</span>
              </div>
            </div>
          </div>

          <div class="participation-stats">
            <div class="stat-item">
              <span class="stat-label">Attempts</span>
              <span class="stat-value">45</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Avg Score</span>
              <span class="stat-value">78%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Completion</span>
              <span class="stat-value">89%</span>
            </div>
          </div>

          <div class="progress-section">
            <div class="progress-header">
              <span>Student Progress</span>
              <span class="progress-count">40/45 completed</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 89%"></div>
            </div>
          </div>

          <div class="card-actions">
            <button class="action-btn secondary" (click)="viewAnalytics('math-practice-1')">
              <mat-icon>analytics</mat-icon>
              View Analytics
            </button>
            <button class="action-btn primary" (click)="editTest('math-practice-1')">
              <mat-icon>edit</mat-icon>
              Edit Test
            </button>
          </div>
        </div>

        <div class="mock-test-card completed">
          <div class="card-header">
            <div class="test-info">
              <h3>Physics Mechanics Review</h3>
              <span class="subject-tag physics">Physics</span>
            </div>
            <span class="status-badge completed">Completed</span>
          </div>

          <div class="test-details">
            <div class="detail-row">
              <div class="detail-item">
                <mat-icon>schedule</mat-icon>
                <span>90 minutes</span>
              </div>
              <div class="detail-item">
                <mat-icon>quiz</mat-icon>
                <span>25 questions</span>
              </div>
              <div class="detail-item">
                <mat-icon>star</mat-icon>
                <span>Hard difficulty</span>
              </div>
            </div>
          </div>

          <div class="completion-stats">
            <div class="completion-info">
              <mat-icon>check_circle</mat-icon>
              <span>Completed 3 days ago</span>
            </div>
            <div class="final-stats">
              <div class="final-stat">
                <span class="label">Final Average</span>
                <span class="value">74%</span>
              </div>
              <div class="final-stat">
                <span class="label">Total Attempts</span>
                <span class="value">38</span>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button class="action-btn secondary" (click)="exportResults('physics-mechanics')">
              <mat-icon>file_download</mat-icon>
              Export Results
            </button>
            <button class="action-btn secondary" (click)="duplicateTest('physics-mechanics')">
              <mat-icon>content_copy</mat-icon>
              Duplicate Test
            </button>
          </div>
        </div>

        <div class="mock-test-card draft">
          <div class="card-header">
            <div class="test-info">
              <h3>Chemistry Organic Compounds</h3>
              <span class="subject-tag chemistry">Chemistry</span>
            </div>
            <span class="status-badge draft">Draft</span>
          </div>

          <div class="test-details">
            <div class="detail-row">
              <div class="detail-item">
                <mat-icon>schedule</mat-icon>
                <span>75 minutes</span>
              </div>
              <div class="detail-item">
                <mat-icon>quiz</mat-icon>
                <span>12/30 questions</span>
              </div>
              <div class="detail-item">
                <mat-icon>star</mat-icon>
                <span>Medium difficulty</span>
              </div>
            </div>
          </div>

          <div class="draft-progress">
            <div class="progress-info">
              <mat-icon>edit</mat-icon>
              <span>40% complete - needs 18 more questions</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill draft" style="width: 40%"></div>
            </div>
          </div>

          <div class="card-actions">
            <button class="action-btn primary" (click)="continueEditing('chemistry-organic')">
              <mat-icon>edit</mat-icon>
              Continue Editing
            </button>
            <button class="action-btn secondary" (click)="deleteDraft('chemistry-organic')">
              <mat-icon>delete</mat-icon>
              Delete Draft
            </button>
          </div>
        </div>

        <div class="mock-test-card scheduled">
          <div class="card-header">
            <div class="test-info">
              <h3>Algebra Final Prep</h3>
              <span class="subject-tag mathematics">Mathematics</span>
            </div>
            <span class="status-badge scheduled">Scheduled</span>
          </div>

          <div class="test-details">
            <div class="detail-row">
              <div class="detail-item">
                <mat-icon>schedule</mat-icon>
                <span>120 minutes</span>
              </div>
              <div class="detail-item">
                <mat-icon>quiz</mat-icon>
                <span>35 questions</span>
              </div>
              <div class="detail-item">
                <mat-icon>star</mat-icon>
                <span>Hard difficulty</span>
              </div>
            </div>
          </div>

          <div class="schedule-info">
            <div class="schedule-item">
              <mat-icon>event</mat-icon>
              <div class="schedule-details">
                <span class="schedule-label">Start Date</span>
                <span class="schedule-value">January 15, 2025</span>
              </div>
            </div>
            <div class="schedule-item">
              <mat-icon>access_time</mat-icon>
              <div class="schedule-details">
                <span class="schedule-label">Available Until</span>
                <span class="schedule-value">January 22, 2025</span>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button class="action-btn secondary" (click)="previewTest('algebra-final-prep')">
              <mat-icon>visibility</mat-icon>
              Preview Test
            </button>
            <button class="action-btn primary" (click)="editSchedule('algebra-final-prep')">
              <mat-icon>edit</mat-icon>
              Edit Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mock-tests {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
      }
    }

    .header-content {
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

    .create-mock-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--color-primary-600);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: var(--color-primary-700);
      }
    }

    .mock-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;

      .stat-icon {
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

      .stat-content {
        flex: 1;

        h3 {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          margin-bottom: 0.25rem;
        }

        .stat-number {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }

        .stat-change {
          font-size: 0.75rem;
          color: var(--color-success-600);
        }
      }
    }

    .filters-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;

      .tab {
        padding: 0.75rem 1.5rem;
        border: 1px solid var(--color-border);
        background: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;

        &.active {
          background: var(--color-primary-600);
          color: white;
          border-color: var(--color-primary-600);
        }

        &:hover:not(.active) {
          background: var(--color-background-subtle);
        }
      }
    }

    .mock-tests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .mock-test-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-left: 4px solid;

      &.active { border-left-color: var(--color-success-500); }
      &.completed { border-left-color: var(--color-primary-500); }
      &.draft { border-left-color: var(--color-warning-500); }
      &.scheduled { border-left-color: var(--color-info-500); }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .test-info {
      h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--color-text-primary);
      }
    }

    .subject-tag {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;

      &.mathematics {
        background: var(--color-primary-100);
        color: var(--color-primary-700);
      }
      &.physics {
        background: var(--color-success-100);
        color: var(--color-success-700);
      }
      &.chemistry {
        background: var(--color-warning-100);
        color: var(--color-warning-700);
      }
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;

      &.active {
        background: var(--color-success-100);
        color: var(--color-success-700);
      }
      &.completed {
        background: var(--color-primary-100);
        color: var(--color-primary-700);
      }
      &.draft {
        background: var(--color-warning-100);
        color: var(--color-warning-700);
      }
      &.scheduled {
        background: var(--color-info-100);
        color: var(--color-info-700);
      }
    }

    .test-details {
      margin-bottom: 1rem;
    }

    .detail-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: var(--color-text-secondary);

      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    }

    .participation-stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding: 1rem;
      background: var(--color-background-subtle);
      border-radius: 8px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .stat-label {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        margin-bottom: 0.25rem;
      }

      .stat-value {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }
    }

    .progress-section {
      margin-bottom: 1rem;

      .progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;

        .progress-count {
          color: var(--color-text-secondary);
        }
      }

      .progress-bar {
        height: 8px;
        background: var(--color-background-muted);
        border-radius: 4px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          background: var(--color-success-500);
          transition: width 0.3s;

          &.draft {
            background: var(--color-warning-500);
          }
        }
      }
    }

    .completion-stats {
      margin-bottom: 1rem;

      .completion-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
        color: var(--color-text-secondary);

        mat-icon {
          color: var(--color-success-600);
        }
      }

      .final-stats {
        display: flex;
        gap: 2rem;

        .final-stat {
          display: flex;
          flex-direction: column;

          .label {
            font-size: 0.75rem;
            color: var(--color-text-secondary);
            margin-bottom: 0.25rem;
          }

          .value {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--color-text-primary);
          }
        }
      }
    }

    .draft-progress {
      margin-bottom: 1rem;

      .progress-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: var(--color-text-secondary);

        mat-icon {
          color: var(--color-warning-600);
        }
      }
    }

    .schedule-info {
      margin-bottom: 1rem;

      .schedule-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;

        mat-icon {
          color: var(--color-info-600);
        }

        .schedule-details {
          display: flex;
          flex-direction: column;

          .schedule-label {
            font-size: 0.75rem;
            color: var(--color-text-secondary);
          }

          .schedule-value {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--color-text-primary);
          }
        }
      }
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      &.primary {
        background: var(--color-primary-600);
        color: white;

        &:hover {
          background: var(--color-primary-700);
        }
      }

      &.secondary {
        background: var(--color-background-subtle);
        color: var(--color-text-primary);

        &:hover {
          background: var(--color-background-muted);
        }
      }

      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    }
  `]
})
export class TeacherMockTests implements OnInit {
  private readonly router = inject(Router);
  private readonly teacherApi = inject(TeacherApiService);

  activeFilter = 'all';

  // Mock test data from API (filtered by type = 'MOCK')
  allMockTests: QuizDto[] = [];
  filteredMockTests: QuizDto[] = [];
  isLoading = true;

  // Stats computed from API data
  stats = {
    activeMocks: 0,
    totalAttempts: 0,
    averageScore: 0,
  };

  ngOnInit(): void {
    this.loadMockTests();
  }

  private async loadMockTests(): Promise<void> {
    this.isLoading = true;
    try {
      const quizzes = await firstValueFrom(this.teacherApi.getMyQuizzes());
      // Filter for MOCK type quizzes
      this.allMockTests = quizzes.filter(q => q.type === 'MOCK');
      this.computeStats();
      this.applyFilter();
    } catch (error) {
      console.error('Error loading mock tests:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private computeStats(): void {
    this.stats.activeMocks = this.allMockTests.length;

    let totalAttempts = 0;
    let totalScore = 0;
    let totalMarks = 0;

    for (const mock of this.allMockTests) {
      if (mock.studentQuizes) {
        totalAttempts += mock.studentQuizes.length;
        for (const sq of mock.studentQuizes) {
          if (sq.rawScore !== null && sq.rawScore !== undefined && sq.totalMarks) {
            totalScore += sq.rawScore;
            totalMarks += sq.totalMarks;
          }
        }
      }
    }

    this.stats.totalAttempts = totalAttempts;
    this.stats.averageScore = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;
  }

  private applyFilter(): void {
    if (this.activeFilter === 'all') {
      this.filteredMockTests = this.allMockTests;
    } else {
      // For now, all mocks are shown - could add status filtering later
      this.filteredMockTests = this.allMockTests;
    }
  }

  createMockTest(): void {
    // Navigate to create exam with type pre-selected as MOCK
    sessionStorage.setItem('examFormStep1', JSON.stringify({ quizType: 'MOCK' }));
    this.router.navigate(['/teacher/create-exam']);
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  viewAnalytics(testId: string): void {
    this.router.navigate(['/teacher/statistics'], { queryParams: { test: testId } });
  }

  editTest(testId: string): void {
    console.log('Editing test:', testId);
    alert(`Edit test ${testId} functionality would be implemented here`);
  }

  exportResults(testId: string): void {
    console.log('Exporting results for test:', testId);
    alert(`Export results for ${testId} functionality would be implemented here`);
  }

  duplicateTest(testId: string): void {
    console.log('Duplicating test:', testId);
    alert(`Test ${testId} duplicated successfully`);
  }

  continueEditing(testId: string): void {
    console.log('Continue editing test:', testId);
    alert(`Continue editing ${testId} functionality would be implemented here`);
  }

  deleteDraft(testId: string): void {
    if (confirm('Are you sure you want to delete this draft test?')) {
      alert(`Draft test ${testId} deleted successfully`);
    }
  }

  previewTest(testId: string): void {
    console.log('Previewing test:', testId);
    alert(`Preview test ${testId} functionality would be implemented here`);
  }

  editSchedule(testId: string): void {
    console.log('Editing schedule for test:', testId);
    alert(`Edit schedule for ${testId} functionality would be implemented here`);
  }

  // Helper methods for template
  getAttemptCount(quiz: QuizDto): number {
    return quiz.studentQuizes?.length || 0;
  }

  getAverageScore(quiz: QuizDto): number {
    if (!quiz.studentQuizes?.length) return 0;
    let total = 0;
    let count = 0;
    for (const sq of quiz.studentQuizes) {
      if (sq.rawScore !== null && sq.rawScore !== undefined && sq.totalMarks) {
        total += (sq.rawScore / sq.totalMarks) * 100;
        count++;
      }
    }
    return count > 0 ? total / count : 0;
  }
}
