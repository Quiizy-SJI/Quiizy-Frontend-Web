import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-teacher-create-exam-step4',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  template: `
    <div class="create-exam-step4">
      <div class="page-header">
        <h1>Create New Exam - Step 4</h1>
        <p>Review your exam details and publish when ready.</p>
      </div>

      <div class="progress-stepper">
        <div class="step completed">
          <div class="step-number">1</div>
          <div class="step-info">
            <span class="step-title">Basic Information</span>
            <span class="step-desc">Exam details and settings</span>
          </div>
        </div>
        <div class="step-connector completed"></div>
        <div class="step completed">
          <div class="step-number">2</div>
          <div class="step-info">
            <span class="step-title">Build Questions</span>
            <span class="step-desc">Add and configure questions</span>
          </div>
        </div>
        <div class="step-connector completed"></div>
        <div class="step completed">
          <div class="step-number">3</div>
          <div class="step-info">
            <span class="step-title">Exam Settings</span>
            <span class="step-desc">Configure timing and rules</span>
          </div>
        </div>
        <div class="step-connector completed"></div>
        <div class="step active">
          <div class="step-number">4</div>
          <div class="step-info">
            <span class="step-title">Review & Publish</span>
            <span class="step-desc">Final review and publish</span>
          </div>
        </div>
      </div>

      <div class="step-content">
        <div class="review-sections">
          <!-- Exam Summary -->
          <div class="review-section">
            <h2>Exam Summary</h2>
            <div class="summary-grid">
              <div class="summary-column">
                <h3>Basic Information</h3>
                <div class="info-item">
                  <span class="label">Title:</span>
                  <span class="value">Mid-Term Exam - Data Structures & Algorithms</span>
                </div>
                <div class="info-item">
                  <span class="label">Subject:</span>
                  <span class="value">Computer Science</span>
                </div>
                <div class="info-item">
                  <span class="label">Type:</span>
                  <span class="value">Midterm (MCQ)</span>
                </div>
                <div class="info-item">
                  <span class="label">Date:</span>
                  <span class="value">January 15, 2025 at 09:00 AM</span>
                </div>
                <div class="info-item">
                  <span class="label">Duration:</span>
                  <span class="value">90 minutes</span>
                </div>
              </div>

              <div class="summary-column">
                <h3>Questions</h3>
                <div class="info-item">
                  <span class="label">Total Questions:</span>
                  <span class="value">5</span>
                </div>
                <div class="info-item">
                  <span class="label">Question Types:</span>
                  <span class="value">
                    <div class="question-breakdown">
                      <span>3 Single answer</span>
                      <span>2 Multiple answers</span>
                      <span>1 Sentiment Essay (Optional)</span>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Exam Settings Summary -->
          <div class="review-section">
            <h2>Exam Settings</h2>
            <div class="settings-grid">
              <div class="settings-column">
                <h3>Privacy & Anonymity</h3>
                <div class="setting-status">
                  <mat-icon class="status-icon enabled">check_circle</mat-icon>
                  <span>Anonymous sentiment review enabled</span>
                </div>
                <div class="setting-status">
                  <mat-icon class="status-icon enabled">check_circle</mat-icon>
                  <span>Randomized question order</span>
                </div>
                <div class="setting-status">
                  <mat-icon class="status-icon disabled">cancel</mat-icon>
                  <span>Randomized answer options (disabled)</span>
                </div>
                <div class="setting-status">
                  <mat-icon class="status-icon enabled">check_circle</mat-icon>
                  <span>Students can view AI sentiment summary</span>
                </div>
              </div>

              <div class="settings-column">
                <h3>Instructions</h3>
                <p>Answer all questions carefully. The essay prompt is not being judged, only the multiple-choice questions will be scored.</p>
              </div>
            </div>
          </div>

          <!-- Preview Section -->
          <div class="review-section">
            <div class="preview-header">
              <h2>Preview</h2>
              <button class="preview-btn" (click)="previewAsStudent()">
                <mat-icon>visibility</mat-icon>
                Preview Exam as Student
              </button>
            </div>
          </div>

          <!-- Publishing Options -->
          <div class="review-section">
            <div class="publishing-section">
              <div class="publishing-warning">
                <mat-icon>warning</mat-icon>
                <div class="warning-content">
                  <h3>Publishing this exam will:</h3>
                  <ul>
                    <li>Make it visible to enrolled students - Live Exam Information (title, date, duration)</li>
                    <li>Allow editing questions until exam starts</li>
                  </ul>
                </div>
              </div>

              <div class="publish-status">
                <mat-icon class="ready-icon">check_circle</mat-icon>
                <span class="ready-text">Ready to Publish</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn secondary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Back
          </button>
          <div class="publish-actions">
            <button class="btn secondary" (click)="saveAsDraft()">
              Save as Draft
            </button>
            <button class="btn primary" (click)="publishExam()">
              <mat-icon>publish</mat-icon>
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-exam-step4 {
      max-width: 1000px;
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

    .progress-stepper {
      display: flex;
      align-items: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
      }
    }

    .step {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      
      &.completed .step-number {
        background: var(--color-success-600);
        color: white;
      }
      
      &.active {
        .step-number {
          background: var(--color-primary-600);
          color: white;
        }
        
        .step-title {
          color: var(--color-primary-600);
          font-weight: 600;
        }
      }
      
      .step-number {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background: var(--color-background-muted);
        color: var(--color-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 1rem;
      }
      
      .step-info {
        display: flex;
        flex-direction: column;
        
        .step-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-primary);
        }
        
        .step-desc {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
        }
      }
    }

    .step-connector {
      flex: 1;
      height: 2px;
      background: var(--color-background-muted);
      margin: 0 1rem;
      
      &.completed {
        background: var(--color-success-600);
      }
      
      @media (max-width: 768px) {
        display: none;
      }
    }

    .step-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .review-sections {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .review-section {
      h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: var(--color-text-primary);
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--color-background-subtle);
      }
    }

    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .summary-column {
      h3 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--color-text-primary);
      }
    }

    .info-item {
      display: flex;
      margin-bottom: 0.75rem;
      
      .label {
        font-weight: 500;
        color: var(--color-text-secondary);
        min-width: 120px;
      }
      
      .value {
        color: var(--color-text-primary);
        flex: 1;
      }
    }

    .question-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      
      span {
        font-size: 0.875rem;
      }
    }

    .settings-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .settings-column {
      h3 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--color-text-primary);
      }
      
      p {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        line-height: 1.5;
      }
    }

    .setting-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      
      .status-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
        
        &.enabled {
          color: var(--color-success-600);
        }
        
        &.disabled {
          color: var(--color-text-tertiary);
        }
      }
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h2 {
        margin-bottom: 0;
        border-bottom: none;
        padding-bottom: 0;
      }
    }

    .preview-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--color-primary-100);
      color: var(--color-primary-700);
      border: 1px solid var(--color-primary-200);
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: var(--color-primary-200);
      }
      
      mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    .publishing-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .publishing-warning {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--color-warning-50);
      border: 1px solid var(--color-warning-200);
      border-radius: 8px;
      
      mat-icon {
        color: var(--color-warning-600);
        margin-top: 0.125rem;
        flex-shrink: 0;
      }
      
      .warning-content {
        h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--color-warning-800);
        }
        
        ul {
          margin: 0;
          padding-left: 1.25rem;
          color: var(--color-warning-700);
          
          li {
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
            line-height: 1.4;
          }
        }
      }
    }

    .publish-status {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--color-success-50);
      border: 1px solid var(--color-success-200);
      border-radius: 8px;
      
      .ready-icon {
        color: var(--color-success-600);
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }
      
      .ready-text {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-success-800);
      }
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--color-border);
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
      }
    }

    .publish-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      
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
        border: 1px solid var(--color-border);
        
        &:hover {
          background: var(--color-background-muted);
        }
      }
      
      mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  `]
})
export class TeacherCreateExamStep4 {
  constructor(private router: Router) {}

  previewAsStudent(): void {
    console.log('Opening exam preview as student');
    alert('Exam preview functionality would open in a new window/tab');
  }

  goBack(): void {
    this.router.navigate(['/teacher/create-exam/step3']);
  }

  saveAsDraft(): void {
    console.log('Saving exam as draft');
    alert('Exam saved as draft successfully!');
    this.router.navigate(['/teacher/exam-manager']);
  }

  publishExam(): void {
    console.log('Publishing exam');
    if (confirm('Are you sure you want to publish this exam? Students will be able to see it immediately.')) {
      alert('Exam published successfully!');
      this.router.navigate(['/teacher/exam-manager']);
    }
  }
}