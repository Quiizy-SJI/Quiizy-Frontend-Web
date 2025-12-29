import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-create-exam',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, FormsModule],
  template: `
    <div class="create-exam">
      <div class="page-header">
        <h1>Create New Exam</h1>
        <p>Follow the steps below to create a comprehensive exam for your students.</p>
      </div>

      <div class="progress-stepper">
        <div class="step active">
          <div class="step-number">1</div>
          <div class="step-info">
            <span class="step-title">Basic Information</span>
            <span class="step-desc">Exam details and settings</span>
          </div>
        </div>
        <div class="step-connector"></div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-info">
            <span class="step-title">Add Questions</span>
            <span class="step-desc">Select or create questions</span>
          </div>
        </div>
        <div class="step-connector"></div>
        <div class="step">
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

      <!-- Step 1: Basic Information -->
      <div class="step-content">
        <div class="form-section">
          <h2>Basic Information</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="examTitle">Exam Title *</label>
              <input 
                type="text" 
                id="examTitle" 
                placeholder="Enter exam title"
                class="form-input"
                [(ngModel)]="examForm.title"
              >
            </div>

            <div class="form-group">
              <label for="subject">Subject *</label>
              <select id="subject" class="form-select" [(ngModel)]="examForm.subject">
                <option value="">Select subject</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
              </select>
            </div>

            <div class="form-group">
              <label for="examType">Exam Type *</label>
              <select id="examType" class="form-select" [(ngModel)]="examForm.type">
                <option value="">Select exam type</option>
                <option value="midterm">Midterm</option>
                <option value="final">Final Exam</option>
                <option value="quiz">Quiz</option>
                <option value="practice">Practice Test</option>
              </select>
            </div>

            <div class="form-group">
              <label for="difficulty">Difficulty Level</label>
              <select id="difficulty" class="form-select" [(ngModel)]="examForm.difficulty">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                placeholder="Enter exam description (optional)"
                class="form-textarea"
                rows="3"
                [(ngModel)]="examForm.description"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="totalMarks">Total Marks</label>
              <input 
                type="number" 
                id="totalMarks" 
                placeholder="100"
                class="form-input"
                min="1"
                [(ngModel)]="examForm.totalMarks"
              >
            </div>

            <div class="form-group">
              <label for="passingMarks">Passing Marks</label>
              <input 
                type="number" 
                id="passingMarks" 
                placeholder="40"
                class="form-input"
                min="1"
                [(ngModel)]="examForm.passingMarks"
              >
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Scheduling</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="startDate">Start Date *</label>
              <input 
                type="datetime-local" 
                id="startDate" 
                class="form-input"
                [(ngModel)]="examForm.startDate"
              >
            </div>

            <div class="form-group">
              <label for="endDate">End Date *</label>
              <input 
                type="datetime-local" 
                id="endDate" 
                class="form-input"
                [(ngModel)]="examForm.endDate"
              >
            </div>

            <div class="form-group">
              <label for="duration">Duration (minutes) *</label>
              <input 
                type="number" 
                id="duration" 
                placeholder="60"
                class="form-input"
                min="1"
                [(ngModel)]="examForm.duration"
              >
            </div>

            <div class="form-group">
              <label for="attempts">Max Attempts</label>
              <select id="attempts" class="form-select" [(ngModel)]="examForm.maxAttempts">
                <option value="1">1 Attempt</option>
                <option value="2">2 Attempts</option>
                <option value="3">3 Attempts</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Student Assignment</h2>
          <div class="assignment-options">
            <div class="assignment-option">
              <input type="radio" id="allStudents" name="assignment" value="all" [(ngModel)]="examForm.assignmentType">
              <label for="allStudents">
                <div class="option-content">
                  <mat-icon>groups</mat-icon>
                  <div class="option-text">
                    <span class="option-title">All Students</span>
                    <span class="option-desc">Assign to all students in your classes</span>
                  </div>
                </div>
              </label>
            </div>

            <div class="assignment-option">
              <input type="radio" id="specificClasses" name="assignment" value="classes" [(ngModel)]="examForm.assignmentType">
              <label for="specificClasses">
                <div class="option-content">
                  <mat-icon>school</mat-icon>
                  <div class="option-text">
                    <span class="option-title">Specific Classes</span>
                    <span class="option-desc">Choose specific classes or sections</span>
                  </div>
                </div>
              </label>
            </div>

            <div class="assignment-option">
              <input type="radio" id="individualStudents" name="assignment" value="individual" [(ngModel)]="examForm.assignmentType">
              <label for="individualStudents">
                <div class="option-content">
                  <mat-icon>person</mat-icon>
                  <div class="option-text">
                    <span class="option-title">Individual Students</span>
                    <span class="option-desc">Select specific students manually</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn secondary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Cancel
          </button>
          <button class="btn primary" (click)="nextStep()" [disabled]="!isFormValid()">
            Next: Add Questions
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-exam {
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

    .form-section {
      margin-bottom: 2rem;
      
      &:last-of-type {
        margin-bottom: 0;
      }
      
      h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: var(--color-text-primary);
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--color-background-subtle);
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      
      &.full-width {
        grid-column: 1 / -1;
      }
      
      label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
        margin-bottom: 0.5rem;
      }
    }

    .form-input, .form-select, .form-textarea {
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      font-size: 0.875rem;
      transition: border-color 0.2s;
      
      &:focus {
        outline: none;
        border-color: var(--color-primary-500);
      }
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .assignment-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .assignment-option {
      input[type="radio"] {
        display: none;
        
        &:checked + label {
          border-color: var(--color-primary-500);
          background: var(--color-primary-50);
          
          .option-title {
            color: var(--color-primary-600);
          }
        }
      }
      
      label {
        display: block;
        padding: 1rem;
        border: 2px solid var(--color-border);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          border-color: var(--color-primary-300);
        }
      }
      
      .option-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        
        mat-icon {
          color: var(--color-text-secondary);
          font-size: 1.5rem;
          width: 1.5rem;
          height: 1.5rem;
        }
      }
      
      .option-text {
        display: flex;
        flex-direction: column;
        
        .option-title {
          font-size: 1rem;
          font-weight: 500;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }
        
        .option-desc {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }
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
export class TeacherCreateExam {
  examForm = {
    title: '',
    subject: '',
    type: '',
    difficulty: 'medium',
    description: '',
    totalMarks: 100,
    passingMarks: 40,
    startDate: '',
    endDate: '',
    duration: 60,
    maxAttempts: '1',
    assignmentType: 'all'
  };

  constructor(private router: Router) {}

  isFormValid(): boolean {
    return !!(
      this.examForm.title.trim() &&
      this.examForm.subject &&
      this.examForm.type &&
      this.examForm.startDate &&
      this.examForm.endDate &&
      this.examForm.duration > 0
    );
  }

  goBack(): void {
    this.router.navigate(['/teacher/exam-manager']);
  }

  nextStep(): void {
    if (this.isFormValid()) {
      console.log('Exam form data:', this.examForm);
      // Navigate to step 2
      this.router.navigate(['/teacher/create-exam/step2']);
    } else {
      alert('Please fill in all required fields.');
    }
  }
}