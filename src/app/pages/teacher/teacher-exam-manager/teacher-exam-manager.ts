import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

      <div class="filters-section">
        <div class="filter-tabs">
          <button class="tab" [class.active]="activeFilter === 'all'" (click)="setFilter('all')">All Exams</button>
          <button class="tab" [class.active]="activeFilter === 'active'" (click)="setFilter('active')">Active</button>
          <button class="tab" [class.active]="activeFilter === 'completed'" (click)="setFilter('completed')">Completed</button>
          <button class="tab" [class.active]="activeFilter === 'draft'" (click)="setFilter('draft')">Draft</button>
        </div>
        <div class="search-filter">
          <input type="text" placeholder="Search exams..." class="search-input" [(ngModel)]="searchTerm" (input)="onSearch()">
          <select class="filter-select" [(ngModel)]="selectedSubject" (change)="onSubjectFilter()">
            <option value="">All Subjects</option>
            <option value="mathematics">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </div>
      </div>

      <div class="exams-grid">
        <div class="exam-card active">
          <div class="exam-header">
            <div class="exam-info">
              <h3>Mathematics Midterm</h3>
              <span class="exam-subject">Mathematics</span>
            </div>
            <span class="exam-status active">Active</span>
          </div>
          <div class="exam-details">
            <div class="detail-item">
              <mat-icon>schedule</mat-icon>
              <span>Duration: 90 minutes</span>
            </div>
            <div class="detail-item">
              <mat-icon>quiz</mat-icon>
              <span>25 Questions</span>
            </div>
            <div class="detail-item">
              <mat-icon>groups</mat-icon>
              <span>45 Students</span>
            </div>
          </div>
          <div class="exam-progress">
            <div class="progress-info">
              <span>Completion: 32/45 (71%)</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 71%"></div>
            </div>
          </div>
          <div class="exam-actions">
            <button class="action-btn secondary" (click)="viewResults('math-midterm')">
              <mat-icon>visibility</mat-icon>
              View Results
            </button>
            <button class="action-btn primary" (click)="editExam('math-midterm')">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
          </div>
        </div>

        <div class="exam-card completed">
          <div class="exam-header">
            <div class="exam-info">
              <h3>Physics Quiz #3</h3>
              <span class="exam-subject">Physics</span>
            </div>
            <span class="exam-status completed">Completed</span>
          </div>
          <div class="exam-details">
            <div class="detail-item">
              <mat-icon>schedule</mat-icon>
              <span>Duration: 45 minutes</span>
            </div>
            <div class="detail-item">
              <mat-icon>quiz</mat-icon>
              <span>15 Questions</span>
            </div>
            <div class="detail-item">
              <mat-icon>groups</mat-icon>
              <span>38 Students</span>
            </div>
          </div>
          <div class="exam-stats">
            <div class="stat">
              <span class="stat-label">Average Score</span>
              <span class="stat-value">82%</span>
            </div>
            <div class="stat">
              <span class="stat-label">Highest Score</span>
              <span class="stat-value">96%</span>
            </div>
          </div>
          <div class="exam-actions">
            <button class="action-btn secondary" (click)="viewAnalytics('physics-quiz-3')">
              <mat-icon>analytics</mat-icon>
              View Analytics
            </button>
            <button class="action-btn secondary" (click)="exportResults('physics-quiz-3')">
              <mat-icon>file_download</mat-icon>
              Export Results
            </button>
          </div>
        </div>

        <div class="exam-card draft">
          <div class="exam-header">
            <div class="exam-info">
              <h3>Chemistry Final Exam</h3>
              <span class="exam-subject">Chemistry</span>
            </div>
            <span class="exam-status draft">Draft</span>
          </div>
          <div class="exam-details">
            <div class="detail-item">
              <mat-icon>schedule</mat-icon>
              <span>Duration: 120 minutes</span>
            </div>
            <div class="detail-item">
              <mat-icon>quiz</mat-icon>
              <span>8/30 Questions</span>
            </div>
            <div class="detail-item">
              <mat-icon>groups</mat-icon>
              <span>Not assigned</span>
            </div>
          </div>
          <div class="exam-progress">
            <div class="progress-info">
              <span>Progress: 27% complete</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 27%"></div>
            </div>
          </div>
          <div class="exam-actions">
            <button class="action-btn primary" (click)="continueEditing('chemistry-final')">
              <mat-icon>edit</mat-icon>
              Continue Editing
            </button>
            <button class="action-btn secondary" (click)="deleteDraft('chemistry-final')">
              <mat-icon>delete</mat-icon>
              Delete Draft
            </button>
          </div>
        </div>
      </div>
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
      
      .tab {
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
        }
        
        &:hover:not(.active) {
          background: var(--color-background-subtle);
        }
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
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .exam-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-left: 4px solid;
      
      &.active { border-left-color: var(--color-success-500); }
      &.completed { border-left-color: var(--color-primary-500); }
      &.draft { border-left-color: var(--color-warning-500); }
    }

    .exam-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
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
export class TeacherExamManager {
  activeFilter = 'all';
  searchTerm = '';
  selectedSubject = '';

  constructor(private router: Router) {}

  navigateToCreateExam(): void {
    this.router.navigate(['/teacher/create-exam']);
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    console.log('Filter set to:', filter);
    // Here you would typically filter the exams based on the selected filter
  }

  onSearch(): void {
    console.log('Searching for:', this.searchTerm);
    // Here you would typically filter exams based on search term
  }

  onSubjectFilter(): void {
    console.log('Subject filter:', this.selectedSubject);
    // Here you would typically filter exams based on selected subject
  }

  viewResults(examId: string): void {
    console.log('Viewing results for exam:', examId);
    // Navigate to results page or show results modal
    this.router.navigate(['/teacher/statistics'], { queryParams: { exam: examId } });
  }

  editExam(examId: string): void {
    console.log('Editing exam:', examId);
    // Navigate to edit exam page
    this.router.navigate(['/teacher/create-exam'], { queryParams: { edit: examId } });
  }

  viewAnalytics(examId: string): void {
    console.log('Viewing analytics for exam:', examId);
    // Navigate to analytics page
    this.router.navigate(['/teacher/statistics'], { queryParams: { exam: examId, view: 'analytics' } });
  }

  exportResults(examId: string): void {
    console.log('Exporting results for exam:', examId);
    // Trigger export functionality
    alert('Export functionality would be implemented here');
  }

  continueEditing(examId: string): void {
    console.log('Continue editing exam:', examId);
    // Navigate to edit exam page
    this.router.navigate(['/teacher/create-exam'], { queryParams: { draft: examId } });
  }

  deleteDraft(examId: string): void {
    console.log('Deleting draft exam:', examId);
    // Show confirmation dialog and delete draft
    if (confirm('Are you sure you want to delete this draft exam?')) {
      alert('Draft deleted successfully');
      // Here you would typically call a service to delete the draft
    }
  }
}