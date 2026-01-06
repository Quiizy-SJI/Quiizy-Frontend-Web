import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { TeacherApiService } from '../../../services/teacher-api.service';
import type { QuizDto, CourseDto } from '../../../domain/dtos/teacher/teacher-quiz.dto';
import { getQuizQuestionCount, isQuizDraft, isQuizPublished } from '../../../domain/dtos/teacher/teacher-quiz.dto';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="teacher-dashboard">
      <div class="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <p>Welcome back! Here's an overview of your teaching activities.</p>
      </div>

      <div class="stats-grid">
        <!-- Draft Quizzes -->
        <div class="stat-card warning-accent" (click)="navigateToDrafts()">
          <div class="stat-icon warning">
            <mat-icon>edit_note</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Draft Exams</h3>
            <p class="stat-number">{{ stats.draftQuizzes }}</p>
            <span class="stat-change warning">Awaiting publication</span>
          </div>
        </div>

        <!-- Published/Active Quizzes -->
        <div class="stat-card success-accent" (click)="navigateToExamManager()">
          <div class="stat-icon success">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Published Exams</h3>
            <p class="stat-number">{{ stats.publishedQuizzes }}</p>
            <span class="stat-change success">Active & completed</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <mat-icon>groups</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Total Students</h3>
            <p class="stat-number">{{ stats.totalStudents }}</p>
            <span class="stat-change neutral">Across all courses</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <mat-icon>quiz</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Questions Created</h3>
            <p class="stat-number">{{ stats.totalQuestions }}</p>
            <span class="stat-change neutral">In question bank</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <mat-icon>school</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Courses</h3>
            <p class="stat-number">{{ stats.totalCourses }}</p>
            <span class="stat-change neutral">Assigned to you</span>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="recent-activity">
          <div class="section-header">
            <h2>Recent Quizzes</h2>
            <button class="view-all-btn" (click)="navigateToExamManager()">View All</button>
          </div>
          <div class="activity-list">
            @if (isLoading) {
              <div class="activity-item">
                <mat-icon>hourglass_empty</mat-icon>
                <div class="activity-details">
                  <p>Loading recent activity...</p>
                </div>
              </div>
            } @else if (recentQuizzes.length === 0) {
              <div class="activity-item empty">
                <mat-icon>info</mat-icon>
                <div class="activity-details">
                  <p>No quizzes created yet. Create your first exam!</p>
                </div>
              </div>
            } @else {
              @for (quiz of recentQuizzes; track quiz.id) {
                <div class="activity-item clickable" (click)="navigateToQuiz(quiz)">
                  <mat-icon>assignment</mat-icon>
                  <div class="activity-details">
                    <div class="activity-title">
                      <span class="quiz-type">{{ quiz.type }}</span>
                      <span class="status-badge" [class.draft]="isQuizDraft(quiz)" [class.published]="isQuizPublished(quiz)">
                        {{ quiz.status }}
                      </span>
                    </div>
                    <div class="activity-meta">
                      <span>{{ getQuestionCount(quiz) }} questions</span>
                      <span class="separator">•</span>
                      <span>{{ quiz.durationMinutes }} min</span>
                      @if (quiz.collaborators && quiz.collaborators.length > 1) {
                        <span class="separator">•</span>
                        <span class="collaborators-info">
                          <mat-icon>group</mat-icon>
                          {{ quiz.collaborators.length }}
                        </span>
                      }
                    </div>
                    <span class="activity-time">{{ quiz.date | date:'mediumDate' }}</span>
                  </div>
                  <mat-icon class="activity-arrow">chevron_right</mat-icon>
                </div>
              }
            }
          </div>
        </div>

        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <button class="action-btn primary" (click)="navigateToCreateExam()">
              <mat-icon>add</mat-icon>
              Create New Exam
            </button>
            <button class="action-btn secondary" (click)="navigateToQuestionBank()">
              <mat-icon>quiz</mat-icon>
              Question Bank
            </button>
            <button class="action-btn secondary" (click)="navigateToStatistics()">
              <mat-icon>analytics</mat-icon>
              View Statistics
            </button>
            @if (stats.draftQuizzes > 0) {
              <button class="action-btn warning" (click)="navigateToDrafts()">
                <mat-icon>edit_note</mat-icon>
                Continue Drafts ({{ stats.draftQuizzes }})
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .teacher-dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &.warning-accent {
        border-left: 4px solid var(--color-warning-500);
      }

      &.success-accent {
        border-left: 4px solid var(--color-success-500);
      }
    }

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

      &.warning {
        background: var(--color-warning-50);
        mat-icon { color: var(--color-warning-600); }
      }

      &.success {
        background: var(--color-success-50);
        mat-icon { color: var(--color-success-600); }
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
        font-weight: 500;

        &.positive { color: var(--color-success-600); }
        &.negative { color: var(--color-error-600); }
        &.neutral { color: var(--color-text-secondary); }
        &.warning { color: var(--color-warning-600); }
        &.success { color: var(--color-success-600); }
      }
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .recent-activity, .quick-actions {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--color-text-primary);
      }
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      h2 {
        margin-bottom: 0;
      }
    }

    .view-all-btn {
      background: none;
      border: none;
      color: var(--color-primary-600);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: background 0.2s;

      &:hover {
        background: var(--color-primary-50);
      }
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 8px;
      background: var(--color-background-subtle);
      transition: background 0.2s;

      &.clickable {
        cursor: pointer;

        &:hover {
          background: var(--color-background-muted);
        }
      }

      &.empty {
        opacity: 0.7;
      }

      > mat-icon {
        color: var(--color-primary-600);
        margin-top: 0.125rem;
      }

      .activity-arrow {
        color: var(--color-text-tertiary);
        margin-left: auto;
        align-self: center;
      }

      .activity-details {
        flex: 1;
        min-width: 0;

        p {
          margin-bottom: 0.25rem;
          color: var(--color-text-primary);
        }

        .activity-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;

          .quiz-type {
            font-weight: 600;
            color: var(--color-text-primary);
          }
        }

        .activity-meta {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: var(--color-text-secondary);
          margin-bottom: 0.25rem;

          .separator {
            color: var(--color-text-tertiary);
          }

          .collaborators-info {
            display: flex;
            align-items: center;
            gap: 0.125rem;
            color: var(--color-primary-600);

            mat-icon {
              font-size: 0.875rem;
              width: 0.875rem;
              height: 0.875rem;
            }
          }
        }

        .activity-time {
          font-size: 0.75rem;
          color: var(--color-text-tertiary);
        }
      }
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem 0.5rem;
      border-radius: 10px;
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &.draft {
        background: var(--color-warning-100);
        color: var(--color-warning-700);
      }

      &.published {
        background: var(--color-success-100);
        color: var(--color-success-700);
      }
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
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

      &.warning {
        background: var(--color-warning-100);
        color: var(--color-warning-700);

        &:hover {
          background: var(--color-warning-200);
        }
      }
    }
  `]
})
export class TeacherDashboard implements OnInit {
  private readonly router = inject(Router);
  private readonly teacherApi = inject(TeacherApiService);

  // Re-export utility functions for template use
  isQuizDraft = isQuizDraft;
  isQuizPublished = isQuizPublished;

  /**
   * Dashboard statistics computed from API data.
   *
   * Business Logic:
   * - draftQuizzes: Count of quizzes in DRAFT status (not yet published)
   * - publishedQuizzes: Count of quizzes in PUBLISHED status
   * - totalStudents: Estimated from StudentQuiz entries
   * - totalQuestions: Count of questions in question bank
   * - totalCourses: Courses assigned to this teacher
   */
  stats = {
    draftQuizzes: 0,
    publishedQuizzes: 0,
    totalStudents: 0,
    totalQuestions: 0,
    totalCourses: 0,
  };

  // Recent quizzes for activity feed
  recentQuizzes: QuizDto[] = [];
  courses: CourseDto[] = [];

  isLoading = true;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Get question count for a quiz using the utility function.
   * Questions are accessed through CourseQuiz → CourseQuizQuestion.
   */
  getQuestionCount(quiz: QuizDto): number {
    return getQuizQuestionCount(quiz);
  }

  private async loadDashboardData(): Promise<void> {
    this.isLoading = true;
    try {
      // Load courses and quizzes in parallel
      const [courses, quizzes] = await Promise.all([
        firstValueFrom(this.teacherApi.getMyCourses()),
        firstValueFrom(this.teacherApi.getMyQuizzes()),
      ]);

      this.courses = courses;
      // Sort by date descending, then take last 5 for activity
      this.recentQuizzes = [...quizzes]
        .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
        .slice(0, 5);

      // Compute stats
      this.stats.totalCourses = courses.length;

      // Count drafts vs published quizzes
      this.stats.draftQuizzes = quizzes.filter(q => isQuizDraft(q)).length;
      this.stats.publishedQuizzes = quizzes.filter(q => isQuizPublished(q)).length;

      // Count total questions across all quizzes
      // Questions are accessed through CourseQuiz → CourseQuizQuestion
      this.stats.totalQuestions = quizzes.reduce(
        (sum, quiz) => sum + getQuizQuestionCount(quiz),
        0
      );

      // Estimate students from courses (unique students in classes)
      const studentCount = quizzes.reduce(
        (sum, quiz) => sum + (quiz.studentQuizes?.length || 0),
        0
      );
      this.stats.totalStudents = studentCount;
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  navigateToCreateExam(): void {
    this.router.navigate(['/teacher/create-exam']);
  }

  navigateToQuestionBank(): void {
    this.router.navigate(['/teacher/question-bank']);
  }

  navigateToStatistics(): void {
    this.router.navigate(['/teacher/statistics']);
  }

  navigateToExamManager(): void {
    this.router.navigate(['/teacher/exam-manager']);
  }

  /**
   * Navigate to exam manager filtered by drafts.
   */
  navigateToDrafts(): void {
    this.router.navigate(['/teacher/exam-manager'], { queryParams: { filter: 'draft' } });
  }

  /**
   * Navigate to a specific quiz (edit for drafts, view results for published).
   */
  navigateToQuiz(quiz: QuizDto): void {
    if (isQuizDraft(quiz)) {
      // Drafts go to edit mode
      this.router.navigate(['/teacher/create-exam'], { queryParams: { draft: quiz.id } });
    } else {
      // Published quizzes go to statistics/results
      this.router.navigate(['/teacher/statistics'], { queryParams: { exam: quiz.id } });
    }
  }
}
