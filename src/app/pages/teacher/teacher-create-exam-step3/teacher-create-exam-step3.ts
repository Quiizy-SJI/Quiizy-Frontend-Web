import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-create-exam-step3',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, FormsModule],
  template: `
    <div class="create-exam-step3">
      <div class="page-header">
        <h1>Create New Exam - Step 3</h1>
        <p>Configure exam settings, privacy options, and student visibility preferences.</p>
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
        <div class="step active">
          <div class="step-number">3</div>
          <div class="step-info">
            <span class="step-title">Exam Settings</span>
            <span class="step-desc">Configure timing and rules</span>
          </div>
        </div>
        <div class="step-connector"></div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-info">
            <span class="step-title">Review & Publish</span>
            <span class="step-desc">Final review and publish</span>
          </div>
        </div>
      </div>

      <div class="step-content">
        <div class="settings-sections">
          <!-- Privacy & Anonymity Section -->
          <div class="settings-section">
            <h2>Privacy & Anonymity</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Anonymous Sentiment Review</h3>
                <p>Student identities will be hidden during sentiment analysis review. Teachers will see anonymous data only (e.g., "Student #001").</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="settings.anonymousSentiment">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">{{settings.anonymousSentiment ? 'ON' : 'OFF'}}</span>
              </div>
            </div>
          </div>

          <!-- Question Randomization Section -->
          <div class="settings-section">
            <h2>Question Randomization</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Randomize Objective Question Order</h3>
                <p>MCQ questions will appear in random order for each student. Essay questions maintain their original sequence.</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="settings.randomizeQuestions">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">{{settings.randomizeQuestions ? 'ON' : 'OFF'}}</span>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Randomize Answer Options</h3>
                <p>Answer choices for each MCQ will appear in random order.</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="settings.randomizeOptions">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">{{settings.randomizeOptions ? 'ON' : 'OFF'}}</span>
              </div>
            </div>
          </div>

          <!-- Student Visibility Section -->
          <div class="settings-section">
            <h2>Student Visibility</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Allow Students to View AI Sentiment Summary</h3>
                <p>After submission, students can see their sentiment analysis (Positive/Neutral/Negative) and detected emotions.</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="settings.showSentimentToStudents">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">{{settings.showSentimentToStudents ? 'ON' : 'OFF'}}</span>
              </div>
            </div>
          </div>

          <!-- Advanced Settings Section -->
          <div class="settings-section">
            <h2>Advanced Settings</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Proctoring Mode</h3>
                <p>Enable browser lockdown and monitoring during the exam.</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="settings.proctoringMode">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">{{settings.proctoringMode ? 'ON' : 'OFF'}}</span>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Show Results Immediately</h3>
                <p>Students can see their scores and correct answers immediately after submission.</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="settings.immediateResults">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">{{settings.immediateResults ? 'ON' : 'OFF'}}</span>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Allow Review Before Submit</h3>
                <p>Students can review and change their answers before final submission.</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="settings.allowReview">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">{{settings.allowReview ? 'ON' : 'OFF'}}</span>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Prevent Copy/Paste</h3>
                <p>Disable copy and paste functionality during the exam.</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="settings.preventCopyPaste">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">{{settings.preventCopyPaste ? 'ON' : 'OFF'}}</span>
              </div>
            </div>
          </div>

          <!-- Time Settings Section -->
          <div class="settings-section">
            <h2>Time Settings</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Auto-Submit on Time Limit</h3>
                <p>Automatically submit the exam when time runs out.</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="settings.autoSubmit">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">{{settings.autoSubmit ? 'ON' : 'OFF'}}</span>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3>Show Timer to Students</h3>
                <p>Display remaining time during the exam.</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="settings.showTimer">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">{{settings.showTimer ? 'ON' : 'OFF'}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-note">
          <mat-icon>info</mat-icon>
          <p><strong>Recommended settings are pre-selected.</strong> You can modify them anytime before publishing.</p>
        </div>

        <div class="form-actions">
          <button class="btn secondary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Back: Questions
          </button>
          <button class="btn primary" (click)="nextStep()">
            Next: Review & Publish
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-exam-step3 {
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

    .settings-sections {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .settings-section {
      h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: var(--color-text-primary);
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--color-background-subtle);
      }
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.5rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      margin-bottom: 1rem;
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
      }
    }

    .setting-info {
      flex: 1;
      margin-right: 2rem;
      
      @media (max-width: 768px) {
        margin-right: 0;
      }
      
      h3 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--color-text-primary);
      }
      
      p {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        line-height: 1.5;
      }
    }

    .setting-control {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
      
      input {
        opacity: 0;
        width: 0;
        height: 0;
        
        &:checked + .toggle-slider {
          background-color: var(--color-primary-600);
          
          &:before {
            transform: translateX(26px);
          }
        }
      }
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--color-background-muted);
      transition: 0.3s;
      border-radius: 24px;
      
      &:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
    }

    .toggle-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      min-width: 2rem;
    }

    .settings-note {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--color-primary-50);
      border: 1px solid var(--color-primary-200);
      border-radius: 8px;
      margin: 2rem 0;
      
      mat-icon {
        color: var(--color-primary-600);
        margin-top: 0.125rem;
      }
      
      p {
        font-size: 0.875rem;
        color: var(--color-primary-700);
        margin: 0;
      }
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--color-border);
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
      }
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
export class TeacherCreateExamStep3 {
  settings = {
    anonymousSentiment: true,
    randomizeQuestions: true,
    randomizeOptions: false,
    showSentimentToStudents: true,
    proctoringMode: false,
    immediateResults: false,
    allowReview: true,
    preventCopyPaste: true,
    autoSubmit: true,
    showTimer: true
  };

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/teacher/create-exam/step2']);
  }

  nextStep(): void {
    console.log('Exam settings:', this.settings);
    this.router.navigate(['/teacher/create-exam/step4']);
  }
}