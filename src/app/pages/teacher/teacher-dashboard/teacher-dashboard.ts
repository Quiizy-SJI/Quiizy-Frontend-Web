import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

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
        <div class="stat-card">
          <div class="stat-icon">
            <mat-icon>assignment</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Active Exams</h3>
            <p class="stat-number">12</p>
            <span class="stat-change positive">+2 this week</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <mat-icon>groups</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Total Students</h3>
            <p class="stat-number">248</p>
            <span class="stat-change positive">+15 this month</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <mat-icon>quiz</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Questions Created</h3>
            <p class="stat-number">156</p>
            <span class="stat-change neutral">No change</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <mat-icon>analytics</mat-icon>
          </div>
          <div class="stat-content">
            <h3>Average Score</h3>
            <p class="stat-number">78%</p>
            <span class="stat-change positive">+3% this week</span>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="recent-activity">
          <h2>Recent Activity</h2>
          <div class="activity-list">
            <div class="activity-item">
              <mat-icon>assignment_turned_in</mat-icon>
              <div class="activity-details">
                <p><strong>Mathematics Midterm</strong> completed by 45 students</p>
                <span class="activity-time">2 hours ago</span>
              </div>
            </div>
            <div class="activity-item">
              <mat-icon>add_circle</mat-icon>
              <div class="activity-details">
                <p>Created new question set for <strong>Physics Quiz</strong></p>
                <span class="activity-time">1 day ago</span>
              </div>
            </div>
            <div class="activity-item">
              <mat-icon>sentiment_satisfied</mat-icon>
              <div class="activity-details">
                <p>Sentiment analysis completed for <strong>Chemistry Exam</strong></p>
                <span class="activity-time">2 days ago</span>
              </div>
            </div>
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
              Add Questions
            </button>
            <button class="action-btn secondary" (click)="navigateToStatistics()">
              <mat-icon>analytics</mat-icon>
              View Statistics
            </button>
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

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 8px;
      background: var(--color-background-subtle);
      
      mat-icon {
        color: var(--color-primary-600);
        margin-top: 0.125rem;
      }
      
      .activity-details {
        flex: 1;
        
        p {
          margin-bottom: 0.25rem;
          color: var(--color-text-primary);
        }
        
        .activity-time {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
        }
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
    }
  `]
})
export class TeacherDashboard {
  constructor(private router: Router) {}

  navigateToCreateExam(): void {
    this.router.navigate(['/teacher/create-exam']);
  }

  navigateToQuestionBank(): void {
    this.router.navigate(['/teacher/question-bank']);
  }

  navigateToStatistics(): void {
    this.router.navigate(['/teacher/statistics']);
  }
}