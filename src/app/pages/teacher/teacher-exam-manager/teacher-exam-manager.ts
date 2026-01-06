import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { TeacherApiService } from '../../../services/teacher-api.service';
import type { QuizDto, QuizType, QuizStatus, QuizCollaboratorDto } from '../../../domain/dtos/teacher/teacher-quiz.dto';
import { getQuizQuestionCount, isQuizDraft, isQuizPublished, calculateQuizTotalMarks } from '../../../domain/dtos/teacher/teacher-quiz.dto';

@Component({
  selector: 'app-teacher-exam-manager',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, FormsModule],
  template: `
    <div class="exam-manager">
      <div class="page-header">
        <div class="header-content">
          <h1>Exam Manager</h1>
          <p>Manage all your exams, view results, and track student progress.</p>
        </div>
        <button class="create-btn" (click)="navigateToCreateExam()">
          <mat-icon>add</mat-icon>
          Create New Exam
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <mat-icon>refresh</mat-icon>
        <p>Loading exams...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage" class="error-state">
        <mat-icon>error</mat-icon>
        <p>{{ errorMessage }}</p>
        <button class="action-btn secondary" (click)="loadQuizzes()">Retry</button>
      </div>

      <ng-container *ngIf="!isLoading && !errorMessage">
        <!-- Stats Summary Bar -->
        <div class="stats-bar">
          <div class="stat-item">
            <span class="stat-count">{{ getDraftCount() }}</span>
            <span class="stat-label">Drafts</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-count published">{{ getPublishedCount() }}</span>
            <span class="stat-label">Published</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-count active">{{ getActiveCount() }}</span>
            <span class="stat-label">Active</span>
          </div>
        </div>

        <div class="filters-section">
          <div class="filter-tabs">
            <button class="tab" [class.active]="activeFilter === 'all'" (click)="setFilter('all')">
              All Exams
              <span class="count-badge" *ngIf="allQuizzes.length">{{ allQuizzes.length }}</span>
            </button>
            <button class="tab" [class.active]="activeFilter === 'active'" (click)="setFilter('active')">
              Active
              <span class="count-badge success" *ngIf="getActiveCount()">{{ getActiveCount() }}</span>
            </button>
            <button class="tab" [class.active]="activeFilter === 'completed'" (click)="setFilter('completed')">
              Completed
            </button>
            <button class="tab" [class.active]="activeFilter === 'draft'" (click)="setFilter('draft')">
              Draft
              <span class="count-badge warning" *ngIf="getDraftCount()">{{ getDraftCount() }}</span>
            </button>
          </div>
          <div class="search-filter">
            <input type="text" placeholder="Search exams..." class="search-input" [(ngModel)]="searchTerm" (input)="onSearch()">
            <select class="filter-select" [(ngModel)]="selectedSubject" (change)="onSubjectFilter()">
              <option value="">All Subjects</option>
              <option *ngFor="let subj of subjects" [value]="subj">{{ subj }}</option>
            </select>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredQuizzes.length === 0" class="empty-state">
          <mat-icon>quiz</mat-icon>
          <h3>No exams found</h3>
          <p>Create your first exam or adjust your filters.</p>
          <button class="create-btn" (click)="navigateToCreateExam()">
            <mat-icon>add</mat-icon>
            Create New Exam
          </button>
        </div>

        <div class="exams-grid" *ngIf="filteredQuizzes.length > 0">
          <div
            class="exam-card"
            [class.active]="getQuizStatus(quiz) === 'active'"
            [class.completed]="getQuizStatus(quiz) === 'completed'"
            [class.draft]="getQuizStatus(quiz) === 'draft'"
            *ngFor="let quiz of filteredQuizzes"
          >
            <div class="exam-header">
              <div class="exam-info">
                <h3>{{ getQuizTypeLabel(quiz.type) }}</h3>
                <span class="exam-subject">{{ getQuizSubject(quiz) }}</span>
              </div>
              <div class="status-badges">
                <!-- Workflow status badge (DRAFT/PUBLISHED) -->
                <span class="workflow-badge" [class.draft]="isQuizDraft(quiz)" [class.published]="isQuizPublished(quiz)">
                  <mat-icon>{{ isQuizDraft(quiz) ? 'edit_note' : 'check_circle' }}</mat-icon>
                  {{ quiz.status }}
                </span>
                <!-- Active status badge (timing-based) -->
                <span class="exam-status" [class]="getQuizStatus(quiz)">
                  {{ getQuizStatus(quiz) | titlecase }}
                </span>
              </div>
            </div>

            <!-- Collaborators Indicator (for drafts with collaborators) -->
            <div class="collaborators-row" *ngIf="quiz.collaborators && quiz.collaborators.length > 1">
              <mat-icon>group</mat-icon>
              <span>{{ quiz.collaborators.length }} collaborators</span>
              <div class="collaborator-avatars">
                <span class="avatar" *ngFor="let collab of quiz.collaborators.slice(0, 3)" [title]="collab.teacher?.user?.name || 'Teacher'">
                  {{ getInitials(collab.teacher?.user?.name, collab.teacher?.user?.surname) }}
                </span>
                <span class="avatar more" *ngIf="quiz.collaborators.length > 3">+{{ quiz.collaborators.length - 3 }}</span>
              </div>
            </div>

            <div class="exam-details">
              <div class="detail-item">
                <mat-icon>schedule</mat-icon>
                <span>Duration: {{ quiz.durationMinutes || 60 }} minutes</span>
              </div>
              <div class="detail-item">
                <mat-icon>quiz</mat-icon>
                <span>{{ getQuestionCount(quiz) }} Questions ({{ getTotalMarks(quiz) }} marks)</span>
              </div>
              <div class="detail-item" *ngIf="isQuizPublished(quiz)">
                <mat-icon>groups</mat-icon>
                <span>{{ getStudentCount(quiz) }} Students</span>
              </div>
              <div class="detail-item" *ngIf="quiz.date">
                <mat-icon>event</mat-icon>
                <span>{{ quiz.date | date:'medium' }}</span>
              </div>
            </div>

            <!-- Active: Show progress -->
            <div class="exam-progress" *ngIf="getQuizStatus(quiz) === 'active'">
              <div class="progress-info">
                <span>Completion: {{ getCompletedCount(quiz) }}/{{ getStudentCount(quiz) }} ({{ getCompletionPercent(quiz) }}%)</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getCompletionPercent(quiz)"></div>
              </div>
            </div>

            <!-- Completed: Show stats -->
            <div class="exam-stats" *ngIf="getQuizStatus(quiz) === 'completed'">
              <div class="stat">
                <span class="stat-label">Completed</span>
                <span class="stat-value">{{ getCompletedCount(quiz) }}/{{ getStudentCount(quiz) }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Completion</span>
                <span class="stat-value">{{ getCompletionPercent(quiz) }}%</span>
              </div>
            </div>

            <!-- Draft: Show progress and publish readiness -->
            <div class="exam-progress draft-info" *ngIf="getQuizStatus(quiz) === 'draft'">
              <div class="progress-info">
                <span>{{ getQuestionCount(quiz) }} questions added</span>
              </div>
              <!-- Publish readiness indicator -->
              <div class="publish-readiness" [class.ready]="canPublish(quiz)" [class.not-ready]="!canPublish(quiz)">
                <mat-icon>{{ canPublish(quiz) ? 'check_circle' : 'warning' }}</mat-icon>
                <span>{{ canPublish(quiz) ? 'Ready to publish' : 'Add questions to publish' }}</span>
              </div>
            </div>

            <!-- Actions based on status -->
            <div class="exam-actions">
              <!-- Active exam actions -->
              <ng-container *ngIf="getQuizStatus(quiz) === 'active'">
                <button class="action-btn secondary" (click)="viewResults(quiz)">
                  <mat-icon>visibility</mat-icon>
                  View Results
                </button>
                <button class="action-btn primary" (click)="editExam(quiz)">
                  <mat-icon>edit</mat-icon>
                  Edit
                </button>
              </ng-container>

              <!-- Completed exam actions -->
              <ng-container *ngIf="getQuizStatus(quiz) === 'completed'">
                <button class="action-btn secondary" (click)="viewAnalytics(quiz)">
                  <mat-icon>analytics</mat-icon>
                  View Analytics
                </button>
                <button class="action-btn secondary" (click)="exportResults(quiz)">
                  <mat-icon>file_download</mat-icon>
                  Export Results
                </button>
              </ng-container>

              <!-- Draft exam actions -->
              <ng-container *ngIf="getQuizStatus(quiz) === 'draft'">
                <button class="action-btn publish" (click)="publishQuiz(quiz)" [disabled]="!canPublish(quiz) || isPublishing">
                  <mat-icon>{{ isPublishing ? 'hourglass_empty' : 'publish' }}</mat-icon>
                  {{ isPublishing ? 'Publishing...' : 'Publish' }}
                </button>
                <button class="action-btn primary" (click)="continueEditing(quiz)">
                  <mat-icon>edit</mat-icon>
                  Edit
                </button>
                <button class="action-btn secondary" (click)="inviteCollaborators(quiz)" title="Invite teachers to collaborate">
                  <mat-icon>person_add</mat-icon>
                </button>
                <button class="action-btn danger" (click)="deleteDraft(quiz)">
                  <mat-icon>delete</mat-icon>
                </button>
              </ng-container>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .exam-manager {
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

    .create-btn {
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

    /* Stats Summary Bar */
    .stats-bar {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;

      .stat-count {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-warning-600);

        &.published { color: var(--color-primary-600); }
        &.active { color: var(--color-success-600); }
      }

      .stat-label {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .stat-divider {
      width: 1px;
      height: 2rem;
      background: var(--color-border);
    }

    .filters-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;

      .tab {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid var(--color-border);
        background: white;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;

        &.active {
          background: var(--color-primary-600);
          color: white;
          border-color: var(--color-primary-600);

          .count-badge {
            background: white;
            color: var(--color-primary-600);
          }
        }

        &:hover:not(.active) {
          background: var(--color-background-subtle);
        }
      }
    }

    .count-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.25rem;
      height: 1.25rem;
      padding: 0 0.375rem;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: 600;
      background: var(--color-primary-100);
      color: var(--color-primary-700);

      &.success {
        background: var(--color-success-100);
        color: var(--color-success-700);
      }

      &.warning {
        background: var(--color-warning-100);
        color: var(--color-warning-700);
      }
    }

    .search-filter {
      display: flex;
      gap: 1rem;

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    .search-input, .filter-select {
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      font-size: 0.875rem;
    }

    .search-input {
      flex: 1;
    }

    .exams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 1.5rem;
    }

    .exam-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-left: 4px solid;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &.active { border-left-color: var(--color-success-500); }
      &.completed { border-left-color: var(--color-primary-500); }
      &.draft { border-left-color: var(--color-warning-500); }
    }

    .exam-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 0.75rem;
    }

    .exam-info {
      h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: var(--color-text-primary);
      }

      .exam-subject {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
    }

    .status-badges {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.375rem;
    }

    .workflow-badge {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      mat-icon {
        font-size: 0.875rem;
        width: 0.875rem;
        height: 0.875rem;
      }

      &.draft {
        background: var(--color-warning-100);
        color: var(--color-warning-700);
      }

      &.published {
        background: var(--color-success-100);
        color: var(--color-success-700);
      }
    }

    .exam-status {
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
    }

    /* Collaborators Row */
    .collaborators-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: var(--color-primary-50);
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.8125rem;
      color: var(--color-primary-700);

      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }

      .collaborator-avatars {
        display: flex;
        margin-left: auto;
      }

      .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        background: var(--color-primary-600);
        color: white;
        font-size: 0.625rem;
        font-weight: 600;
        margin-left: -0.375rem;
        border: 2px solid white;

        &:first-child {
          margin-left: 0;
        }

        &.more {
          background: var(--color-primary-200);
          color: var(--color-primary-700);
        }
      }
    }

    .exam-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--color-text-secondary);

      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    }

    .exam-progress {
      margin-bottom: 1rem;

      .progress-info {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        margin-bottom: 0.5rem;
      }

      .progress-bar {
        height: 6px;
        background: var(--color-background-muted);
        border-radius: 3px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          background: var(--color-primary-500);
          transition: width 0.3s;
        }
      }

      &.draft-info {
        .progress-info {
          margin-bottom: 0.75rem;
        }
      }
    }

    .publish-readiness {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8125rem;

      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }

      &.ready {
        background: var(--color-success-50);
        color: var(--color-success-700);
      }

      &.not-ready {
        background: var(--color-warning-50);
        color: var(--color-warning-700);
      }
    }

    .exam-stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;

      .stat {
        display: flex;
        flex-direction: column;

        .stat-label {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-primary);
        }
      }
    }

    .exam-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
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

      &.publish {
        background: var(--color-success-600);
        color: white;

        &:hover:not(:disabled) {
          background: var(--color-success-700);
        }

        &:disabled {
          background: var(--color-success-300);
          cursor: not-allowed;
        }
      }

      &.danger {
        background: var(--color-error-50);
        color: var(--color-error-600);

        &:hover {
          background: var(--color-error-100);
        }
      }

      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    }

    .loading-state, .error-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        margin-bottom: 1rem;
        color: var(--color-text-secondary);
      }

      h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--color-text-secondary);
        margin-bottom: 1rem;
      }
    }

    .loading-state mat-icon {
      animation: spin 1s linear infinite;
    }

    .error-state mat-icon {
      color: var(--color-error-500);
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class TeacherExamManager implements OnInit {
  private readonly teacherApi = inject(TeacherApiService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  activeFilter = 'all';
  searchTerm = '';
  selectedSubject = '';

  // API state
  isLoading = false;
  isPublishing = false;
  errorMessage = '';

  // Quizzes from API
  allQuizzes: QuizDto[] = [];
  filteredQuizzes: QuizDto[] = [];

  // Derived subjects from courses
  subjects: string[] = [];

  // Re-export utility functions for template use
  isQuizDraft = isQuizDraft;
  isQuizPublished = isQuizPublished;

  async ngOnInit(): Promise<void> {
    await this.loadQuizzes();
  }

  async loadQuizzes(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.allQuizzes = await firstValueFrom(this.teacherApi.getMyQuizzes());
      this.extractSubjects();
      this.applyFilters();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load quizzes.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  extractSubjects(): void {
    const subjectSet = new Set<string>();
    this.allQuizzes.forEach(q => {
      const tuName = this.getQuizSubject(q);
      if (tuName && tuName !== 'Unknown Subject') subjectSet.add(tuName);
    });
    this.subjects = Array.from(subjectSet).sort();
  }

  getQuizSubject(quiz: QuizDto): string {
    // Get subject from the first course quiz's teaching unit
    const courseQuiz = quiz.courseQuizes?.[0];
    return courseQuiz?.course?.teachingUnit?.name ?? 'Unknown Subject';
  }

  // ============================================
  // Stats Helpers for Summary Bar
  // ============================================

  /**
   * Count quizzes in DRAFT status.
   * Drafts are quizzes still being edited/reviewed.
   */
  getDraftCount(): number {
    return this.allQuizzes.filter(q => isQuizDraft(q)).length;
  }

  /**
   * Count quizzes in PUBLISHED status.
   * Published quizzes have StudentQuiz entries created.
   */
  getPublishedCount(): number {
    return this.allQuizzes.filter(q => isQuizPublished(q)).length;
  }

  /**
   * Count active quizzes (published and currently in progress).
   */
  getActiveCount(): number {
    return this.allQuizzes.filter(q => this.getQuizStatus(q) === 'active').length;
  }

  applyFilters(): void {
    let filtered = [...this.allQuizzes];

    // Filter by status
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(q => this.getQuizStatus(q) === this.activeFilter);
    }

    // Filter by subject
    if (this.selectedSubject) {
      filtered = filtered.filter(q => this.getQuizSubject(q) === this.selectedSubject);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(q =>
        (this.getQuizTypeLabel(q.type)?.toLowerCase().includes(term)) ||
        (this.getQuizSubject(q).toLowerCase().includes(term))
      );
    }

    this.filteredQuizzes = filtered;
  }

  /**
   * Determine UI status of quiz based on workflow status and timing.
   *
   * Business Logic:
   * - If quiz is DRAFT status → show as draft
   * - If quiz is PUBLISHED:
   *   - If end time has passed → completed
   *   - If date not reached → scheduled (show as draft for now)
   *   - Otherwise → active
   */
  getQuizStatus(quiz: QuizDto): 'active' | 'completed' | 'draft' {
    const now = new Date();
    const quizDate = quiz.date ? new Date(quiz.date) : null;

    // Use the quiz status field from the backend
    if (isQuizDraft(quiz)) return 'draft';

    // If quiz is published, check if it's completed based on date
    if (quizDate) {
      const endTime = new Date(quizDate.getTime() + (quiz.durationMinutes || 60) * 60000);
      if (endTime < now) return 'completed';
      if (quizDate > now) return 'draft'; // Scheduled but not started
    }

    // Active if published and has students
    return 'active';
  }

  getQuizTypeLabel(type: QuizType | undefined): string {
    const labels: Record<QuizType, string> = {
      CA: 'Continuous Assessment',
      FINAL: 'Final Exam',
      MOCK: 'Mock Test',
      MEDIAN: 'Midterm',
    };
    return type ? labels[type] : 'Unknown';
  }

  /**
   * Get question count for a quiz.
   * Questions are accessed through CourseQuiz → CourseQuizQuestion.
   */
  getQuestionCount(quiz: QuizDto): number {
    return getQuizQuestionCount(quiz);
  }

  /**
   * Get total marks for a quiz.
   * Marks are quiz-specific (from CourseQuizQuestion.markAllocation).
   */
  getTotalMarks(quiz: QuizDto): number {
    return calculateQuizTotalMarks(quiz);
  }

  getStudentCount(quiz: QuizDto): number {
    return quiz.studentQuizes?.length ?? 0;
  }

  getCompletedCount(quiz: QuizDto): number {
    return quiz.studentQuizes?.filter(sq => sq.status === 'SUBMITTED').length ?? 0;
  }

  getCompletionPercent(quiz: QuizDto): number {
    const total = this.getStudentCount(quiz);
    if (!total) return 0;
    return Math.round((this.getCompletedCount(quiz) / total) * 100);
  }

  /**
   * Check if a quiz is ready to be published.
   * A quiz can be published if it has at least one question.
   */
  canPublish(quiz: QuizDto): boolean {
    return isQuizDraft(quiz) && this.getQuestionCount(quiz) > 0;
  }

  /**
   * Get initials from first and last name for avatar display.
   */
  getInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.charAt(0)?.toUpperCase() ?? '';
    const last = lastName?.charAt(0)?.toUpperCase() ?? '';
    return first + last || '?';
  }

  navigateToCreateExam(): void {
    this.router.navigate(['/teacher/create-exam']);
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onSubjectFilter(): void {
    this.applyFilters();
  }

  viewResults(quiz: QuizDto): void {
    this.router.navigate(['/teacher/statistics'], { queryParams: { exam: quiz.id } });
  }

  editExam(quiz: QuizDto): void {
    this.router.navigate(['/teacher/create-exam'], { queryParams: { edit: quiz.id } });
  }

  viewAnalytics(quiz: QuizDto): void {
    this.router.navigate(['/teacher/statistics'], { queryParams: { exam: quiz.id, view: 'analytics' } });
  }

  async exportResults(quiz: QuizDto): Promise<void> {
    try {
      const results = await firstValueFrom(this.teacherApi.getQuizResults(quiz.id));
      // Simple CSV export
      const csv = this.generateResultsCsv(results);
      this.downloadCsv(csv, `${this.getQuizTypeLabel(quiz.type)}-results.csv`);
    } catch (err) {
      alert('Failed to export results.');
    }
  }

  private generateResultsCsv(results: import('../../../domain/dtos/teacher/teacher-quiz.dto').QuizResultsResponseDto): string {
    const header = 'Student,Matricule,Status,Score,Total Answers\\n';
    const rows = results.studentResults.map(r =>
      `${r.studentName},${r.studentMatricule},${r.status},${r.rawScore ?? 'N/A'},${r.answers?.length ?? 0}`
    ).join('\\n');
    return header + rows;
  }

  private downloadCsv(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  continueEditing(quiz: QuizDto): void {
    this.router.navigate(['/teacher/create-exam'], { queryParams: { draft: quiz.id } });
  }

  /**
   * Publish a draft quiz.
   *
   * Business Logic:
   * - Publishing creates StudentQuiz entries for all students in linked courses
   * - Quiz status changes from DRAFT to PUBLISHED
   * - Once published, quiz cannot be unpublished
   */
  async publishQuiz(quiz: QuizDto): Promise<void> {
    if (!this.canPublish(quiz)) return;

    const confirmed = confirm(
      `Are you sure you want to publish this ${this.getQuizTypeLabel(quiz.type)}?\n\n` +
      `This will:\n` +
      `• Make the exam visible to students\n` +
      `• Create invitations for all students in linked courses\n` +
      `• The exam cannot be unpublished after this action.`
    );

    if (!confirmed) return;

    this.isPublishing = true;
    try {
      await firstValueFrom(this.teacherApi.publishQuiz(quiz.id));
      await this.loadQuizzes();
    } catch (err) {
      alert('Failed to publish quiz. Please try again.');
    } finally {
      this.isPublishing = false;
      this.cdr.markForCheck();
    }
  }

  /**
   * Open collaborator invitation modal/page for a draft quiz.
   * Currently navigates to create-exam with invite query param.
   */
  inviteCollaborators(quiz: QuizDto): void {
    // TODO: Implement modal for inviting collaborators
    // For now, navigate to edit page with invite intent
    this.router.navigate(['/teacher/create-exam'], {
      queryParams: { draft: quiz.id, action: 'invite' }
    });
  }

  async deleteDraft(quiz: QuizDto): Promise<void> {
    if (confirm('Are you sure you want to delete this draft exam?')) {
      try {
        await firstValueFrom(this.teacherApi.deleteQuiz(quiz.id));
        await this.loadQuizzes();
      } catch (err) {
        alert('Failed to delete draft.');
      }
    }
  }
}
