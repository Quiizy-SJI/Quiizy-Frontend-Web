import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-create-exam-step2',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, FormsModule],
  template: `
    <div class="create-exam-step2">
      <div class="page-header">
        <h1>Create New Exam - Step 2</h1>
        <p>Build your exam questions using our question builder or import from your question bank.</p>
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
        <div class="step active">
          <div class="step-number">2</div>
          <div class="step-info">
            <span class="step-title">Build Questions</span>
            <span class="step-desc">Add and configure questions</span>
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

      <div class="step-content">
        <div class="questions-section">
          <div class="section-header">
            <h2>Questions ({{questions.length}})</h2>
            <div class="question-actions">
              <button class="btn secondary" (click)="importFromBank()">
                <mat-icon>library_books</mat-icon>
                Import from Question Bank
              </button>
              <button class="btn primary" (click)="addNewQuestion()">
                <mat-icon>add</mat-icon>
                Add New Question
              </button>
            </div>
          </div>

          <div class="questions-list" *ngIf="questions.length > 0">
            <div class="question-item" *ngFor="let question of questions; let i = index">
              <div class="question-header">
                <div class="question-info">
                  <span class="question-number">Q{{i + 1}}</span>
                  <span class="question-type">{{question.type}}</span>
                  <span class="difficulty-badge" [class]="question.difficulty">{{question.difficulty}}</span>
                </div>
                <div class="question-actions">
                  <button class="action-btn" (click)="editQuestion(i)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button class="action-btn" (click)="duplicateQuestion(i)">
                    <mat-icon>content_copy</mat-icon>
                  </button>
                  <button class="action-btn" (click)="deleteQuestion(i)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
              <div class="question-content">
                <p class="question-text">{{question.text}}</p>
                <div class="question-options" *ngIf="question.type === 'MCQ'">
                  <div class="option" *ngFor="let option of question.options; let j = index" [class.correct]="option.isCorrect">
                    <span class="option-label">{{getOptionLabel(j)}}</span>
                    <span class="option-text">{{option.text}}</span>
                    <mat-icon *ngIf="option.isCorrect" class="correct-icon">check_circle</mat-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="questions.length === 0">
            <mat-icon>quiz</mat-icon>
            <h3>No questions added yet</h3>
            <p>Start building your exam by adding questions or importing from your question bank.</p>
            <button class="btn primary" (click)="addNewQuestion()">
              <mat-icon>add</mat-icon>
              Add Your First Question
            </button>
            <!-- Debug indicator -->
            <div *ngIf="showQuestionBuilder" style="color: red; margin-top: 1rem;">
              DEBUG: Question builder should be visible (showQuestionBuilder = {{showQuestionBuilder}})
            </div>
          </div>
        </div>

        <!-- Question Builder Modal -->
        <div class="modal-overlay" *ngIf="showQuestionBuilder" (click)="closeQuestionBuilder()">
          <div class="modal-content large" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>{{editingIndex >= 0 ? 'Edit Question' : 'Add New Question'}}</h3>
              <button class="close-btn" (click)="closeQuestionBuilder()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            
            <div class="modal-body">
              <div class="form-group">
                <label>Question Type</label>
                <select [(ngModel)]="currentQuestion.type" class="form-select">
                  <option value="MCQ">Multiple Choice</option>
                  <option value="TF">True/False</option>
                  <option value="SA">Short Answer</option>
                  <option value="Essay">Essay</option>
                </select>
              </div>

              <div class="form-group">
                <label>Question Text *</label>
                <textarea 
                  [(ngModel)]="currentQuestion.text" 
                  placeholder="Enter your question here..."
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group" *ngIf="currentQuestion.type === 'MCQ'">
                <label>Answer Options</label>
                <div class="options-list">
                  <div class="option-input" *ngFor="let option of currentQuestion.options; let i = index">
                    <input type="radio" [name]="'correct-option'" [checked]="option.isCorrect" (change)="setCorrectOption(i)">
                    <input type="text" [(ngModel)]="option.text" [placeholder]="'Option ' + getOptionLabel(i)" class="form-input">
                    <button class="remove-option" (click)="removeOption(i)" *ngIf="currentQuestion.options.length > 2">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                </div>
                <button class="btn secondary small" (click)="addOption()" *ngIf="currentQuestion.options.length < 6">
                  <mat-icon>add</mat-icon>
                  Add Option
                </button>
              </div>

              <div class="form-group" *ngIf="currentQuestion.type === 'TF'">
                <label>Correct Answer</label>
                <div class="tf-options">
                  <label class="radio-option">
                    <input type="radio" [(ngModel)]="currentQuestion.correctAnswer" value="true">
                    <span>True</span>
                  </label>
                  <label class="radio-option">
                    <input type="radio" [(ngModel)]="currentQuestion.correctAnswer" value="false">
                    <span>False</span>
                  </label>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Difficulty Level</label>
                  <select [(ngModel)]="currentQuestion.difficulty" class="form-select">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Points</label>
                  <input type="number" [(ngModel)]="currentQuestion.points" min="1" class="form-input" placeholder="1">
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn secondary" (click)="closeQuestionBuilder()">Cancel</button>
              <button class="btn primary" (click)="saveQuestion()" [disabled]="!isQuestionValid()">
                {{editingIndex >= 0 ? 'Update Question' : 'Add Question'}}
              </button>
            </div>
          </div>
        </div>

        <!-- Import from Question Bank Modal -->
        <div class="modal-overlay" *ngIf="showImportModal" (click)="closeImportModal()">
          <div class="modal-content large" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Import from Question Bank</h3>
              <button class="close-btn" (click)="closeImportModal()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            
            <div class="modal-body">
              <div class="import-filters">
                <select class="filter-select">
                  <option>All Subjects</option>
                  <option>AI Systems</option>
                  <option>Networks</option>
                  <option>Web Dev</option>
                </select>
                <select class="filter-select">
                  <option>All Difficulties</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
                <input type="text" placeholder="Search questions..." class="search-input">
              </div>
              
              <div class="questions-import-list">
                <div class="import-question-item" *ngFor="let question of availableQuestions">
                  <div class="question-checkbox">
                    <input 
                      type="checkbox" 
                      [checked]="selectedQuestions.includes(question.id)"
                      (change)="toggleQuestionSelection(question.id)"
                    >
                  </div>
                  <div class="question-preview">
                    <h4>{{question.text}}</h4>
                    <div class="question-meta">
                      <span class="subject-tag">{{question.subject}}</span>
                      <span class="difficulty-tag" [class]="question.difficulty.toLowerCase()">{{question.difficulty}}</span>
                      <span class="type-tag">{{question.type}}</span>
                    </div>
                    <div class="question-options" *ngIf="question.options">
                      <div class="option-preview" *ngFor="let option of question.options.slice(0, 2)">
                        {{option}}
                      </div>
                      <div class="more-options" *ngIf="question.options.length > 2">
                        +{{question.options.length - 2}} more options
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <div class="selection-info">
                {{selectedQuestions.length}} questions selected
              </div>
              <div class="modal-actions">
                <button class="btn secondary" (click)="closeImportModal()">Cancel</button>
                <button class="btn primary" (click)="importSelectedQuestions()" [disabled]="selectedQuestions.length === 0">
                  Import {{selectedQuestions.length}} Questions
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn secondary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Back: Basic Info
          </button>
          <button class="btn primary" (click)="nextStep()" [disabled]="questions.length === 0">
            Next: Exam Settings
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-exam-step2 {
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

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      
      h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }
      
      .question-actions {
        display: flex;
        gap: 0.5rem;
      }
    }

    .questions-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .question-item {
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 1.5rem;
      background: var(--color-background-subtle);
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .question-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      
      .question-number {
        font-weight: 600;
        color: var(--color-primary-600);
      }
      
      .question-type {
        padding: 0.25rem 0.5rem;
        background: var(--color-primary-100);
        color: var(--color-primary-700);
        border-radius: 4px;
        font-size: 0.75rem;
      }
      
      .difficulty-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
        
        &.easy {
          background: var(--color-success-100);
          color: var(--color-success-700);
        }
        
        &.medium {
          background: var(--color-warning-100);
          color: var(--color-warning-700);
        }
        
        &.hard {
          background: var(--color-error-100);
          color: var(--color-error-700);
        }
      }
    }

    .question-actions {
      display: flex;
      gap: 0.25rem;
    }

    .action-btn {
      padding: 0.5rem;
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
      
      &:hover {
        background: var(--color-background-muted);
      }
      
      mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
        color: var(--color-text-secondary);
      }
    }

    .question-content {
      .question-text {
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 1rem;
        color: var(--color-text-primary);
      }
    }

    .question-options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      background: white;
      
      &.correct {
        background: var(--color-success-50);
        border-color: var(--color-success-200);
      }
      
      .option-label {
        font-weight: 600;
        min-width: 1.5rem;
      }
      
      .option-text {
        flex: 1;
      }
      
      .correct-icon {
        color: var(--color-success-600);
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--color-text-secondary);
      
      mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
        color: var(--color-text-tertiary);
      }
      
      h3 {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
        color: var(--color-text-primary);
      }
      
      p {
        margin-bottom: 2rem;
      }
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      
      &.large {
        max-width: 800px;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--color-border);
      
      h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }
      
      .close-btn {
        padding: 0.5rem;
        background: transparent;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        
        &:hover {
          background: var(--color-background-subtle);
        }
      }
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-top: 1px solid var(--color-border);
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
    }

    .selection-info {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }

    .import-filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      
      .filter-select, .search-input {
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: 6px;
        font-size: 0.875rem;
      }
      
      .search-input {
        flex: 1;
      }
    }

    .questions-import-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid var(--color-border);
      border-radius: 8px;
    }

    .import-question-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid var(--color-border);
      
      &:last-child {
        border-bottom: none;
      }
      
      &:hover {
        background: var(--color-background-subtle);
      }
    }

    .question-checkbox {
      display: flex;
      align-items: flex-start;
      padding-top: 0.25rem;
    }

    .question-preview {
      flex: 1;
      
      h4 {
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: var(--color-text-primary);
      }
      
      .question-meta {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        flex-wrap: wrap;
      }
      
      .subject-tag, .difficulty-tag, .type-tag {
        padding: 0.125rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
      }
      
      .subject-tag {
        background: var(--color-primary-100);
        color: var(--color-primary-700);
      }
      
      .difficulty-tag {
        &.easy {
          background: var(--color-success-100);
          color: var(--color-success-700);
        }
        &.medium {
          background: var(--color-warning-100);
          color: var(--color-warning-700);
        }
        &.hard {
          background: var(--color-error-100);
          color: var(--color-error-700);
        }
      }
      
      .type-tag {
        background: var(--color-background-muted);
        color: var(--color-text-secondary);
      }
    }

    .question-options {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      
      .option-preview {
        margin-bottom: 0.25rem;
      }
      
      .more-options {
        font-style: italic;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;
      
      label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
        margin-bottom: 0.5rem;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
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

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .option-input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      input[type="radio"] {
        margin: 0;
      }
      
      input[type="text"] {
        flex: 1;
      }
      
      .remove-option {
        padding: 0.25rem;
        background: transparent;
        border: none;
        color: var(--color-error-600);
        cursor: pointer;
        border-radius: 4px;
        
        &:hover {
          background: var(--color-error-50);
        }
        
        mat-icon {
          font-size: 1rem;
          width: 1rem;
          height: 1rem;
        }
      }
    }

    .tf-options {
      display: flex;
      gap: 1rem;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      
      input[type="radio"] {
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
        
        &:hover:not(:disabled) {
          background: var(--color-primary-700);
        }
        
        &:disabled {
          background: var(--color-background-muted);
          color: var(--color-text-secondary);
          cursor: not-allowed;
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
      
      &.small {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }
      
      mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  `]
})
export class TeacherCreateExamStep2 {
  questions: any[] = [];
  showQuestionBuilder = false;
  editingIndex = -1;
  currentQuestion: any = this.getEmptyQuestion();

  constructor(private router: Router) {}

  getEmptyQuestion() {
    return {
      type: 'MCQ',
      text: '',
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      correctAnswer: 'true',
      difficulty: 'medium',
      points: 1
    };
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index) + ')';
  }

  addNewQuestion(): void {
    console.log('Add New Question button clicked!'); // Debug log
    this.editingIndex = -1;
    this.currentQuestion = this.getEmptyQuestion();
    this.showQuestionBuilder = true;
    console.log('Question builder should be visible:', this.showQuestionBuilder); // Debug log
  }

  editQuestion(index: number): void {
    this.editingIndex = index;
    this.currentQuestion = { ...this.questions[index] };
    this.showQuestionBuilder = true;
  }

  duplicateQuestion(index: number): void {
    const duplicated = { ...this.questions[index] };
    this.questions.splice(index + 1, 0, duplicated);
  }

  deleteQuestion(index: number): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.questions.splice(index, 1);
    }
  }

  closeQuestionBuilder(): void {
    console.log('Closing question builder'); // Debug log
    this.showQuestionBuilder = false;
    this.editingIndex = -1;
    this.currentQuestion = this.getEmptyQuestion();
  }

  saveQuestion(): void {
    console.log('Saving question:', this.currentQuestion); // Debug log
    if (this.editingIndex >= 0) {
      this.questions[this.editingIndex] = { ...this.currentQuestion };
      alert('Question updated successfully!');
    } else {
      this.questions.push({ ...this.currentQuestion });
      alert('Question added successfully!');
    }
    console.log('Total questions now:', this.questions.length); // Debug log
    this.closeQuestionBuilder();
  }

  isQuestionValid(): boolean {
    if (!this.currentQuestion.text.trim()) return false;
    
    if (this.currentQuestion.type === 'MCQ') {
      const validOptions = this.currentQuestion.options.filter((opt: any) => opt.text.trim());
      const hasCorrectAnswer = this.currentQuestion.options.some((opt: any) => opt.isCorrect);
      return validOptions.length >= 2 && hasCorrectAnswer;
    }
    
    return true;
  }

  setCorrectOption(index: number): void {
    this.currentQuestion.options.forEach((opt: any, i: number) => {
      opt.isCorrect = i === index;
    });
  }

  addOption(): void {
    if (this.currentQuestion.options.length < 6) {
      this.currentQuestion.options.push({ text: '', isCorrect: false });
    }
  }

  removeOption(index: number): void {
    if (this.currentQuestion.options.length > 2) {
      this.currentQuestion.options.splice(index, 1);
    }
  }

  importFromBank(): void {
    // Open a modal to select questions from the question bank
    this.showImportModal = true;
  }

  showImportModal = false;
  availableQuestions: any[] = [
    {
      id: '1',
      text: 'What is the primary purpose of a neural network?',
      type: 'MCQ',
      subject: 'AI Systems',
      difficulty: 'Easy',
      options: ['Pattern recognition', 'Data storage', 'File compression', 'Network routing'],
      correctAnswer: 0
    },
    {
      id: '2',
      text: 'Which layer handles IP addressing in OSI?',
      type: 'MCQ',
      subject: 'Networks',
      difficulty: 'Medium',
      options: ['Physical', 'Data Link', 'Network', 'Transport'],
      correctAnswer: 2
    },
    {
      id: '3',
      text: 'Select all valid HTTP methods:',
      type: 'Multi-answer',
      subject: 'Web Dev',
      difficulty: 'Hard',
      options: ['GET', 'POST', 'DELETE', 'FETCH', 'PUT', 'PATCH'],
      correctAnswer: [0, 1, 2, 4, 5]
    }
  ];
  selectedQuestions: string[] = [];

  closeImportModal(): void {
    this.showImportModal = false;
    this.selectedQuestions = [];
  }

  toggleQuestionSelection(questionId: string): void {
    const index = this.selectedQuestions.indexOf(questionId);
    if (index > -1) {
      this.selectedQuestions.splice(index, 1);
    } else {
      this.selectedQuestions.push(questionId);
    }
  }

  importSelectedQuestions(): void {
    const questionsToImport = this.availableQuestions.filter(q => 
      this.selectedQuestions.includes(q.id)
    );
    
    questionsToImport.forEach(q => {
      this.questions.push({
        ...q,
        points: 1
      });
    });
    
    alert(`Imported ${questionsToImport.length} questions successfully!`);
    this.closeImportModal();
  }

  goBack(): void {
    this.router.navigate(['/teacher/create-exam']);
  }

  nextStep(): void {
    if (this.questions.length > 0) {
      this.router.navigate(['/teacher/create-exam/step3']);
    }
  }
}