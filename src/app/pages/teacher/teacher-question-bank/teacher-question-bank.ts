import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface QuestionFolder {
  id: string;
  name: string;
  count: number;
  isActive?: boolean;
}

interface Question {
  id: string;
  text: string;
  type: 'MCQ' | 'Essay' | 'Multi-answer';
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  options?: string[];
  correctAnswer?: number | number[];
  usedCount: number;
  lastEdit: string;
  folderId: string;
}

@Component({
  selector: 'app-teacher-question-bank',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  template: `
    <div class="question-bank">
      <div class="page-header">
        <div class="header-content">
          <h1>Question Bank</h1>
          <p>All MCQ items. Each exam auto-includes one sentiment essay prompt.</p>
        </div>
        <div class="header-actions">
          <button class="btn secondary" (click)="importExcel()">
            <mat-icon>upload_file</mat-icon>
            Import Excel
          </button>
          <button class="btn primary" (click)="createNewMCQ()">
            <mat-icon>add</mat-icon>
            + New MCQ
          </button>
        </div>
      </div>

      <div class="bank-content">
        <!-- Left Sidebar - Folders -->
        <div class="folders-sidebar">
          <h3>Folders</h3>
          <div class="folders-list">
            <div 
              class="folder-item" 
              *ngFor="let folder of folders" 
              [class.active]="folder.isActive"
              (click)="selectFolder(folder)"
            >
              <span class="folder-name">{{folder.name}}</span>
              <span class="folder-count">({{folder.count}})</span>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="questions-content">
          <!-- Filter Bar -->
          <div class="filter-bar">
            <div class="filter-group">
              <select class="filter-select" [(ngModel)]="selectedSubject" (change)="applyFilters()">
                <option value="">Subject</option>
                <option value="AI Systems">AI Systems</option>
                <option value="Networks">Networks</option>
                <option value="Web Dev">Web Dev</option>
                <option value="All subjects">All subjects</option>
              </select>
              
              <select class="filter-select" [(ngModel)]="selectedDifficulty" (change)="applyFilters()">
                <option value="">Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              
              <select class="filter-select" [(ngModel)]="selectedType" (change)="applyFilters()">
                <option value="">Type</option>
                <option value="MCQ">MCQ only</option>
                <option value="Essay">Essay</option>
                <option value="Multi-answer">Multi-answer</option>
              </select>
              
              <input 
                type="text" 
                placeholder="Search..." 
                class="search-input"
                [(ngModel)]="searchTerm"
                (input)="applyFilters()"
              >
            </div>
          </div>

          <!-- Questions Table -->
          <div class="questions-table">
            <div class="table-header">
              <div class="col-question">Question</div>
              <div class="col-subject">Subject</div>
              <div class="col-difficulty">Difficulty</div>
              <div class="col-used">Used</div>
              <div class="col-last-edit">Last edit</div>
              <div class="col-actions">Actions</div>
            </div>

            <div class="table-body">
              <div class="question-row" *ngFor="let question of filteredQuestions">
                <div class="col-question">
                  <div class="question-content">
                    <h4>{{question.text}}</h4>
                    <div class="question-meta">
                      <span class="question-type">{{getQuestionTypeText(question)}}</span>
                    </div>
                  </div>
                </div>
                <div class="col-subject">
                  <span class="subject-badge" [class]="getSubjectClass(question.subject)">
                    {{question.subject}}
                  </span>
                </div>
                <div class="col-difficulty">
                  <span class="difficulty-badge" [class]="question.difficulty.toLowerCase()">
                    {{question.difficulty}}
                  </span>
                </div>
                <div class="col-used">{{question.usedCount}} exams</div>
                <div class="col-last-edit">{{question.lastEdit}}</div>
                <div class="col-actions">
                  <button class="action-btn edit" (click)="editQuestion(question)" *ngIf="question.type !== 'Essay'">
                    Edit
                  </button>
                  <button class="action-btn view" (click)="viewQuestion(question)" *ngIf="question.type === 'Essay'">
                    View only
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination">
            <span class="pagination-info">Showing {{paginationStart}}-{{paginationEnd}} of {{totalQuestions}}</span>
            <div class="pagination-controls">
              <button class="page-btn" [disabled]="currentPage === 1" (click)="previousPage()">
                Prev
              </button>
              <button class="page-btn" [disabled]="currentPage === totalPages" (click)="nextPage()">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- New MCQ Modal -->
      <div class="modal-overlay" *ngIf="showNewMCQModal" (click)="closeNewMCQModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Create New MCQ Question</h3>
            <button class="close-btn" (click)="closeNewMCQModal()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="form-group">
              <label>Question Text *</label>
              <textarea 
                [(ngModel)]="newQuestion.text" 
                placeholder="Enter your question here..."
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Subject *</label>
              <select [(ngModel)]="newQuestion.subject" class="form-select">
                <option value="">Select subject</option>
                <option value="AI Systems">AI Systems</option>
                <option value="Networks">Networks</option>
                <option value="Web Dev">Web Dev</option>
                <option value="Ethics">Ethics</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Security">Security</option>
              </select>
            </div>

            <div class="form-group">
              <label>Difficulty *</label>
              <select [(ngModel)]="newQuestion.difficulty" class="form-select">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div class="form-group">
              <label>Answer Type *</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" [(ngModel)]="newQuestion.answerType" value="single">
                  <span>Single answer</span>
                </label>
                <label class="radio-option">
                  <input type="radio" [(ngModel)]="newQuestion.answerType" value="multiple">
                  <span>Multiple answers</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label>Answer Options *</label>
              <div class="options-list">
                <div class="option-input" *ngFor="let option of newQuestion.options; let i = index">
                  <input 
                    type="checkbox" 
                    *ngIf="newQuestion.answerType === 'multiple'"
                    [checked]="isOptionCorrect(i)"
                    (change)="toggleCorrectOption(i, $event)"
                  >
                  <input 
                    type="radio" 
                    *ngIf="newQuestion.answerType === 'single'"
                    [name]="'correct-answer'"
                    [checked]="isOptionCorrect(i)"
                    (change)="setCorrectOption(i)"
                  >
                  <input 
                    type="text" 
                    [(ngModel)]="option.text" 
                    [placeholder]="'Option ' + (i + 1)"
                    class="form-input"
                  >
                  <button class="remove-option" (click)="removeOption(i)" *ngIf="newQuestion.options.length > 2">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </div>
              <button class="btn secondary small" (click)="addOption()" *ngIf="newQuestion.options.length < 6">
                <mat-icon>add</mat-icon>
                Add Option
              </button>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn secondary" (click)="closeNewMCQModal()">Cancel</button>
            <button class="btn primary" (click)="saveNewQuestion()" [disabled]="!isNewQuestionValid()">
              Create Question
            </button>
          </div>
        </div>
      </div>

      <!-- Import Excel Modal -->
      <div class="modal-overlay" *ngIf="showImportModal" (click)="closeImportModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Import Questions from Excel</h3>
            <button class="close-btn" (click)="closeImportModal()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="upload-area" (click)="triggerFileInput()">
              <input 
                type="file" 
                #fileInput 
                accept=".xlsx,.xls,.csv" 
                (change)="handleFileSelect($event)"
                style="display: none"
              >
              <mat-icon>cloud_upload</mat-icon>
              <h4>Click to upload Excel file</h4>
              <p>Supported formats: .xlsx, .xls, .csv</p>
              <p class="file-info" *ngIf="selectedFile">Selected: {{selectedFile.name}}</p>
            </div>
            
            <div class="import-instructions">
              <h4>Excel Format Requirements:</h4>
              <ul>
                <li>Column A: Question Text</li>
                <li>Column B: Option 1</li>
                <li>Column C: Option 2</li>
                <li>Column D: Option 3</li>
                <li>Column E: Option 4</li>
                <li>Column F: Correct Answer (1, 2, 3, or 4)</li>
                <li>Column G: Subject</li>
                <li>Column H: Difficulty (Easy/Medium/Hard)</li>
              </ul>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn secondary" (click)="closeImportModal()">Cancel</button>
            <button class="btn primary" (click)="processImport()" [disabled]="!selectedFile">
              Import Questions
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .question-bank {
      max-width: 1400px;
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

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .bank-content {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 2rem;
      
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .folders-sidebar {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      height: fit-content;
      
      h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--color-text-primary);
      }
    }

    .folders-list {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .folder-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: var(--color-background-subtle);
      }
      
      &.active {
        background: var(--color-primary-100);
        color: var(--color-primary-700);
        font-weight: 500;
      }
      
      .folder-name {
        flex: 1;
      }
      
      .folder-count {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
    }

    .questions-content {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .filter-bar {
      margin-bottom: 1.5rem;
    }

    .filter-group {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-select, .search-input {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      font-size: 0.875rem;
      min-width: 120px;
    }

    .search-input {
      flex: 1;
      min-width: 200px;
    }

    .questions-table {
      border: 1px solid var(--color-border);
      border-radius: 8px;
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
      background: var(--color-background-subtle);
      padding: 1rem;
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      border-bottom: 1px solid var(--color-border);
    }

    .question-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
      padding: 1rem;
      border-bottom: 1px solid var(--color-border);
      align-items: center;
      
      &:last-child {
        border-bottom: none;
      }
      
      &:hover {
        background: var(--color-background-subtle);
      }
    }

    .col-question {
      .question-content h4 {
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 0.25rem;
        color: var(--color-text-primary);
        line-height: 1.4;
      }
      
      .question-meta {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
      }
    }

    .subject-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      
      &.ai-systems {
        background: var(--color-primary-100);
        color: var(--color-primary-700);
      }
      
      &.networks {
        background: var(--color-success-100);
        color: var(--color-success-700);
      }
      
      &.web-dev {
        background: var(--color-warning-100);
        color: var(--color-warning-700);
      }
      
      &.all-subjects {
        background: var(--color-background-muted);
        color: var(--color-text-secondary);
      }
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

    .action-btn {
      padding: 0.375rem 0.75rem;
      border: 1px solid var(--color-border);
      background: white;
      border-radius: 4px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      
      &.edit {
        color: var(--color-primary-600);
        border-color: var(--color-primary-200);
        
        &:hover {
          background: var(--color-primary-50);
        }
      }
      
      &.view {
        color: var(--color-text-secondary);
        
        &:hover {
          background: var(--color-background-subtle);
        }
      }
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border);
    }

    .pagination-info {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }

    .pagination-controls {
      display: flex;
      gap: 0.5rem;
    }

    .page-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--color-border);
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
      
      &:hover:not(:disabled) {
        background: var(--color-background-subtle);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
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
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.5rem;
      border-top: 1px solid var(--color-border);
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

    .radio-group {
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

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .option-input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      input[type="radio"], input[type="checkbox"] {
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

    .upload-area {
      border: 2px dashed var(--color-border);
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 1.5rem;
      
      &:hover {
        border-color: var(--color-primary-500);
        background: var(--color-primary-50);
      }
      
      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: var(--color-text-secondary);
        margin-bottom: 1rem;
      }
      
      h4 {
        font-size: 1.125rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: var(--color-text-primary);
      }
      
      p {
        color: var(--color-text-secondary);
        margin-bottom: 0.25rem;
      }
      
      .file-info {
        color: var(--color-primary-600);
        font-weight: 500;
      }
    }

    .import-instructions {
      h4 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: var(--color-text-primary);
      }
      
      ul {
        margin: 0;
        padding-left: 1.25rem;
        
        li {
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }
      }
    }
  `]
})
export class TeacherQuestionBank {
  // Data properties
  folders: QuestionFolder[] = [
    { id: 'all', name: 'All Questions', count: 180, isActive: true },
    { id: 'ai-systems', name: 'AI Systems', count: 42 },
    { id: 'networks', name: 'Networks', count: 38 },
    { id: 'web-dev', name: 'Web Dev', count: 26 },
    { id: 'ethics', name: 'Ethics', count: 18 },
    { id: 'operating-systems', name: 'Operating Systems', count: 32 },
    { id: 'security', name: 'Security', count: 24 },
    { id: 'sentiment-prompts', name: 'Sentiment Prompts', count: 6 }
  ];

  questions: Question[] = [
    {
      id: '1',
      text: 'What is the primary purpose of a neural network?',
      type: 'MCQ',
      subject: 'AI Systems',
      difficulty: 'Easy',
      options: ['Pattern recognition', 'Data storage', 'File compression', 'Network routing'],
      correctAnswer: 0,
      usedCount: 3,
      lastEdit: 'Nov 20',
      folderId: 'ai-systems'
    },
    {
      id: '2',
      text: 'Which layer handles IP addressing in OSI?',
      type: 'MCQ',
      subject: 'Networks',
      difficulty: 'Medium',
      options: ['Physical', 'Data Link', 'Network', 'Transport'],
      correctAnswer: 2,
      usedCount: 5,
      lastEdit: 'Nov 18',
      folderId: 'networks'
    },
    {
      id: '3',
      text: 'Select all valid HTTP methods:',
      type: 'Multi-answer',
      subject: 'Web Dev',
      difficulty: 'Hard',
      options: ['GET', 'POST', 'DELETE', 'FETCH', 'PUT', 'PATCH'],
      correctAnswer: [0, 1, 2, 4, 5],
      usedCount: 2,
      lastEdit: 'Nov 15',
      folderId: 'web-dev'
    },
    {
      id: '4',
      text: '[Sentiment] Describe your stress level...',
      type: 'Essay',
      subject: 'All subjects',
      difficulty: 'Easy',
      usedCount: 0,
      lastEdit: 'System',
      folderId: 'sentiment-prompts'
    }
  ];

  filteredQuestions: Question[] = [];
  
  // Filter properties
  selectedSubject = '';
  selectedDifficulty = '';
  selectedType = '';
  searchTerm = '';
  activeFolder = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 20;
  totalQuestions = 180;

  // Modal states
  showNewMCQModal = false;
  showImportModal = false;
  selectedFile: File | null = null;

  // New question form
  newQuestion: any = {
    text: '',
    subject: '',
    difficulty: 'Medium',
    answerType: 'single',
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  };

  constructor(private router: Router) {
    this.applyFilters();
  }

  get paginationStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalQuestions);
  }

  get totalPages(): number {
    return Math.ceil(this.totalQuestions / this.itemsPerPage);
  }

  selectFolder(folder: QuestionFolder): void {
    this.folders.forEach(f => f.isActive = false);
    folder.isActive = true;
    this.activeFolder = folder.id;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.questions];

    // Filter by folder
    if (this.activeFolder !== 'all') {
      filtered = filtered.filter(q => q.folderId === this.activeFolder);
    }

    // Filter by subject
    if (this.selectedSubject) {
      filtered = filtered.filter(q => q.subject === this.selectedSubject);
    }

    // Filter by difficulty
    if (this.selectedDifficulty) {
      filtered = filtered.filter(q => q.difficulty === this.selectedDifficulty);
    }

    // Filter by type
    if (this.selectedType) {
      if (this.selectedType === 'MCQ') {
        filtered = filtered.filter(q => q.type === 'MCQ' || q.type === 'Multi-answer');
      } else {
        filtered = filtered.filter(q => q.type === this.selectedType);
      }
    }

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(q => 
        q.text.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredQuestions = filtered;
    this.totalQuestions = filtered.length;
  }

  getQuestionTypeText(question: Question): string {
    if (question.type === 'MCQ') {
      return `${question.options?.length || 4} options • Single answer`;
    } else if (question.type === 'Multi-answer') {
      return `${question.options?.length || 6} options • Multi answer`;
    } else if (question.type === 'Essay') {
      return 'Essay prompt • No marks';
    }
    return question.type;
  }

  getSubjectClass(subject: string): string {
    return subject.toLowerCase().replace(/\s+/g, '-');
  }

  // CRUD Operations
  createNewMCQ(): void {
    this.newQuestion = {
      text: '',
      subject: '',
      difficulty: 'Medium',
      answerType: 'single',
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    };
    this.showNewMCQModal = true;
  }

  closeNewMCQModal(): void {
    this.showNewMCQModal = false;
  }

  isNewQuestionValid(): boolean {
    if (!this.newQuestion.text.trim() || !this.newQuestion.subject) return false;
    
    const validOptions = this.newQuestion.options.filter((opt: any) => opt.text.trim());
    const hasCorrectAnswer = this.newQuestion.options.some((opt: any) => opt.isCorrect);
    
    return validOptions.length >= 2 && hasCorrectAnswer;
  }

  saveNewQuestion(): void {
    if (this.isNewQuestionValid()) {
      console.log('Creating new question:', this.newQuestion);
      alert('Question created successfully!');
      this.closeNewMCQModal();
      // Here you would typically save to backend and refresh the list
    }
  }

  isOptionCorrect(index: number): boolean {
    return this.newQuestion.options[index]?.isCorrect || false;
  }

  setCorrectOption(index: number): void {
    if (this.newQuestion.answerType === 'single') {
      this.newQuestion.options.forEach((opt: any, i: number) => {
        opt.isCorrect = i === index;
      });
    }
  }

  toggleCorrectOption(index: number, event: any): void {
    if (this.newQuestion.answerType === 'multiple') {
      this.newQuestion.options[index].isCorrect = event.target.checked;
    }
  }

  addOption(): void {
    if (this.newQuestion.options.length < 6) {
      this.newQuestion.options.push({ text: '', isCorrect: false });
    }
  }

  removeOption(index: number): void {
    if (this.newQuestion.options.length > 2) {
      this.newQuestion.options.splice(index, 1);
    }
  }

  editQuestion(question: Question): void {
    console.log('Editing question:', question.id);
    alert(`Edit question functionality would open editor for: ${question.text.substring(0, 50)}...`);
  }

  viewQuestion(question: Question): void {
    console.log('Viewing question:', question.id);
    alert(`View-only mode for: ${question.text.substring(0, 50)}...`);
  }

  // Import functionality
  importExcel(): void {
    this.selectedFile = null;
    this.showImportModal = true;
  }

  closeImportModal(): void {
    this.showImportModal = false;
    this.selectedFile = null;
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  handleFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  processImport(): void {
    if (this.selectedFile) {
      console.log('Processing import for file:', this.selectedFile.name);
      alert(`Import functionality would process: ${this.selectedFile.name}`);
      this.closeImportModal();
    }
  }

  // Pagination
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}