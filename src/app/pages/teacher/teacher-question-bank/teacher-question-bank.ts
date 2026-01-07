import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../../components/ui/tables/table/table.component';
import { ModalComponent } from '../../../components/ui/modals/modal/modal.component';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { TeacherApiService } from '../../../services/teacher-api.service';
import { AuthStoreService } from '../../../core/auth/auth-store.service';
import type {
  QuestionDto,
  QuestionType,
  TeachingUnitQuestionsDto,
  QuestionBankItemDto,
  CreateQuestionBankDto,
  DifficultyLevel,
} from '../../../domain/dtos/teacher/teacher-quiz.dto';
import type { TeachingUnitDto } from '../../../domain/dtos/dean/dean-shared.dto';

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
  used?: number;
  lastEdit: string;
  folderId: string;
  authorId?: string | null;
  canEdit?: boolean;
}

// Extended question item that includes its teaching unit id (added at fetch time)
interface ExtendedQuestionBankItemDto extends QuestionBankItemDto {
  teachingUnitId: string;
}

@Component({
  selector: 'app-teacher-question-bank',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, TableComponent, ModalComponent],
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

          <!-- Questions Table (uses shared ui-table) -->
          <ui-table
            [columns]="tableColumns"
            [data]="tableData"
            [pagination]="{ page: currentPage, pageSize: itemsPerPage, total: totalQuestions }"
            [sortColumn]="sortColumn"
            [sortDirection]="sortDirection"
            [searchable]="true"
            [showPagination]="true"
            (pageChange)="onTablePageChange($event)"
            (pageSizeChange)="onTablePageSizeChange($event)"
            (searchChange)="onTableSearch($event)"
            (sortChange)="onSortChange($event)"
          >
            <ng-template #cell let-row let-index="index" let-column="column">
              <ng-container [ngSwitch]="column.key">
                <div *ngSwitchCase="'text'">
                  <div class="question-content">
                    <h4>{{ row.text }}</h4>
                    <div class="question-meta">
                      <span class="question-type">{{ getQuestionTypeText(row) }}</span>
                    </div>
                  </div>
                </div>
                <div *ngSwitchCase="'subject'">
                  <span class="subject-badge" [class]="getSubjectClass(row.subject)">{{ row.subject }}</span>
                </div>
                <div *ngSwitchCase="'difficulty'">
                  <span class="difficulty-badge" [class]="row.difficulty.toLowerCase()">{{ row.difficulty }}</span>
                </div>
                <div *ngSwitchCase="'used'">{{ row.usedCount }} exams</div>
                <div *ngSwitchCase="'lastEdit'">{{ row.lastEdit }}</div>
                <div *ngSwitchCase="'actions'">
                  <button class="action-btn edit" (click)="editQuestion(row)" *ngIf="row.type !== 'Essay' && row.canEdit">
                    <mat-icon>edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button class="action-btn view" (click)="viewQuestion(row)" *ngIf="row.type === 'Essay' || !row.canEdit">
                    <mat-icon>visibility</mat-icon>
                    <span>View</span>
                  </button>
                </div>
                <div *ngSwitchDefault>{{ row[column.key] }}</div>
              </ng-container>
            </ng-template>
          </ui-table>
        </div>
      </div>

      <!-- New MCQ Modal -->
      <div class="modal-overlay" *ngIf="showNewMCQModal" (click)="closeNewMCQModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 *ngIf="!editingQuestionId">Create New MCQ Question</h3>
            <h3 *ngIf="editingQuestionId">Edit MCQ Question</h3>
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
              <label>Teaching Unit *</label>
              <select [(ngModel)]="newQuestion.teachingUnitId" class="form-select">
                <option value="">Select teaching unit</option>
                <option *ngFor="let tu of teachingUnits" [value]="tu.id">{{tu.name}}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Difficulty *</label>
              <select [(ngModel)]="newQuestion.difficulty" class="form-select">
                <option value="LEVEL_1">Level 1 (LEVEL_1)</option>
                <option value="LEVEL_2">Level 2 (LEVEL_2)</option>
                <option value="LEVEL_3">Level 3 (LEVEL_3)</option>
                <option value="LEVEL_4">Level 4 (LEVEL_4)</option>
                <option value="LEVEL_5">Level 5 (LEVEL_5)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Answer Type *</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" [(ngModel)]="newQuestion.answerType" value="single">
                  <span>Single answer</span>
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
              <span *ngIf="!editingQuestionId">Create Question</span>
              <span *ngIf="editingQuestionId">Save Changes</span>
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

    <ui-modal [isOpen]="showViewModal" [title]="'Question Details'" (closed)="closeViewModal()" [showFooter]="true">
      <div *ngIf="viewQuestionDto; else noData">
        <h4 style="margin-bottom:0.5rem">{{ viewQuestionDto.question }}</h4>
        <div style="font-size:0.9rem;color:var(--color-text-secondary);margin-bottom:1rem">
          <span>{{ getTeachingUnitDisplayName(viewQuestionDto?.teachingUnitId) }} • {{ mapDifficultyLevel(viewQuestionDto.difficultyLevel) }} • {{ viewQuestionDto.usageCount }} uses</span>
        </div>

        <div *ngIf="viewQuestionDto.proposedAnswers?.length">
          <h5>Options</h5>
          <ul>
            <li *ngFor="let opt of viewQuestionDto.proposedAnswers; let i = index" [style.fontWeight]="(opt == viewQuestionDto.correctAnswer) ? '600' : '400'">
                  <span>{{ i + 1 }}.</span>
                  <span style="margin-left:0.5rem">{{ opt }}</span>
                  <span *ngIf="opt == viewQuestionDto.correctAnswer" style="color:var(--color-success-600); margin-left:0.5rem">(Correct)</span>
                </li>
          </ul>
        </div>

        <div *ngIf="!viewQuestionDto.proposedAnswers || viewQuestionDto.proposedAnswers.length === 0">
          <p>No options provided for this question.</p>
        </div>
      </div>
      <ng-template #noData>
        <p>Question details not available.</p>
      </ng-template>

      <div slot="footer">
        <button class="btn secondary" (click)="closeViewModal()">Close</button>
      </div>
    </ui-modal>
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
export class TeacherQuestionBank implements OnInit {
  private readonly teacherApi = inject(TeacherApiService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly authStore = inject(AuthStoreService);

  // Loading states
  isLoading = false;
  errorMessage = '';

  // Teaching units from API (folders)
  teachingUnits: TeachingUnitDto[] = [];

  // Cached counts per teaching unit
  teachingUnitCounts: Record<string, number> = {};

  // Questions from selected teaching unit (from question bank API)
  allQuestions: ExtendedQuestionBankItemDto[] = [];

  // Legacy folder structure (dynamically built from teaching units)
  folders: QuestionFolder[] = [
    { id: 'all', name: 'All Questions', count: 0, isActive: true }
  ];

  // Questions mapped to legacy format for UI compatibility
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  // Data passed directly to `ui-table` (ensures column keys match row props)
  tableData: any[] = [];

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

  // Table columns for ui-table
  tableColumns = [
    { key: 'text', label: 'Question', sortable: true, width: '40%' },
    { key: 'subject', label: 'Subject', sortable: false, width: '15%' },
    { key: 'difficulty', label: 'Difficulty', sortable: false, width: '10%' },
    { key: 'used', label: 'Used', sortable: false, width: '10%' },
    { key: 'lastEdit', label: 'Last edit', sortable: false, width: '15%' },
    { key: 'actions', label: 'Actions', sortable: false, width: '10%' },
  ];

  // Sort state for ui-table
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  // Modal states
  showNewMCQModal = false;
  showImportModal = false;
  showViewModal = false;
  viewQuestionDto: ExtendedQuestionBankItemDto | null = null;
  selectedFile: File | null = null;
  // Edit state
  editingQuestionId: string | null = null;

  // New question form
  newQuestion: any = {
    text: '',
    teachingUnitId: '',
    difficulty: 'LEVEL_3',
    answerType: 'single',
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  };

  constructor() {}

  async ngOnInit(): Promise<void> {
    await this.loadTeachingUnits();
    this.applyFilters();
  }

  async loadTeachingUnits(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.teachingUnits = await firstValueFrom(this.teacherApi.getMyTeachingUnits());
      this.buildFolders();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load teaching units.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  buildFolders(): void {
    this.folders = [
      { id: 'all', name: 'All Questions', count: 0, isActive: true },
      ...this.teachingUnits.map(tu => ({
        id: tu.id,
        name: tu.name,
        count: this.teachingUnitCounts[tu.id] ?? 0,
      })),
    ];
  }

  async loadQuestionsForTeachingUnit(teachingUnitId: string): Promise<void> {
    if (!teachingUnitId || teachingUnitId === 'all') {
      // Load questions for ALL teaching units (parallel) and merge
      this.isLoading = true;
      try {
        const tus = this.teachingUnits || [];
        const promises = tus.map(tu =>
          firstValueFrom(this.teacherApi.getQuestionBank(tu.id)).then(res => ({ res, tu }))
        );
        const results = await Promise.all(promises);
        // flatten and attach teachingUnitId
        const merged: ExtendedQuestionBankItemDto[] = [];
        results.forEach(({ res, tu }) => {
          const qs = (res.questions || []).map(q => ({ ...q, teachingUnitId: tu.id } as ExtendedQuestionBankItemDto));
          merged.push(...qs);
          // cache counts per TU
          this.teachingUnitCounts[tu.id] = qs.length;
          const folder = this.folders.find(f => f.id === tu.id);
          if (folder) folder.count = qs.length;
        });
        this.allQuestions = merged;
        // update All folder count
        const total = Object.values(this.teachingUnitCounts).reduce((s, v) => s + v, 0);
        const all = this.folders.find(f => f.id === 'all');
        if (all) all.count = total;
        this.mapQuestionsToLegacy();
      } catch (err: unknown) {
        console.error('Failed to load questions for all teaching units:', err);
      } finally {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
      return;
    }

    this.isLoading = true;
    try {
      const result = await firstValueFrom(
        this.teacherApi.getQuestionBank(teachingUnitId)
      );
      // attach teachingUnitId to each item so mapping knows its origin
      this.allQuestions = (result.questions || []).map(q => ({ ...q, teachingUnitId } as ExtendedQuestionBankItemDto));
      // update cached count for this teaching unit and folders
      this.teachingUnitCounts[teachingUnitId] = result.questions.length;
      const folder = this.folders.find(f => f.id === teachingUnitId);
      if (folder) folder.count = result.questions.length;
      // update All count
      const total = Object.values(this.teachingUnitCounts).reduce((s, v) => s + v, 0);
      const all = this.folders.find(f => f.id === 'all');
      if (all) all.count = total;
      this.mapQuestionsToLegacy();
    } catch (err: unknown) {
      console.error('Failed to load past questions:', err);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  mapQuestionsToLegacy(): void {
    // Map QuestionBankItemDto to the legacy Question interface for UI compatibility
    // Question bank items have difficultyLevel and usage tracking
    this.questions = this.allQuestions.map((q, idx) => {
      const tu = this.teachingUnits.find(t => t.id === (q as any).teachingUnitId);
      const subjectName = tu?.name ?? this.getActiveTeachingUnitName();
      return {
        id: q.questionId,
        text: q.question,
        type: this.mapQuestionType(q.type),
        subject: subjectName,
        difficulty: this.mapDifficultyLevel(q.difficultyLevel),
        options: q.proposedAnswers ?? [],
        correctAnswer: q.proposedAnswers?.indexOf(q.correctAnswer ?? '') ?? 0,
        usedCount: q.usageCount ?? 1,
        // also expose `used` to match the ui-table column key ('used')
        used: q.usageCount ?? 1,
        lastEdit: q.createdAt ? new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A',
        folderId: (q as any).teachingUnitId ?? this.activeFolder,
        authorId: q.createdById ?? null,
        canEdit: !!(this.authStore.getSession()?.user?.entityId && q.createdById && this.authStore.getSession()!.user.entityId === q.createdById),
      } as Question;
    });
    this.applyFilters();
  }

  /**
   * Map backend difficulty level to UI difficulty.
   */
  mapDifficultyLevel(level: string | undefined): 'Easy' | 'Medium' | 'Hard' {
    switch (level) {
      case 'LEVEL_1':
      case 'LEVEL_2':
        return 'Easy';
      case 'LEVEL_3':
        return 'Medium';
      case 'LEVEL_4':
      case 'LEVEL_5':
        return 'Hard';
      default:
        return 'Medium';
    }
  }

  mapQuestionType(type: QuestionType): 'MCQ' | 'Essay' | 'Multi-answer' {
    switch (type) {
      case 'SINGLE_CHOICE':
      case 'TRUE_FALSE':
        return 'MCQ';
      case 'MULTIPLE_CHOICE':
        return 'Multi-answer';
      case 'OPEN_ENDED':
        return 'Essay';
      default:
        return 'MCQ';
    }
  }

  getActiveTeachingUnitName(): string {
    if (this.activeFolder === 'all') return 'All subjects';
    const tu = this.teachingUnits.find(t => t.id === this.activeFolder);
    return tu?.name ?? 'Unknown';
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
    this.loadQuestionsForTeachingUnit(folder.id);
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
    // Keep `tableData` in sync with filtered results; ui-table expects column keys like 'used'
    this.tableData = filtered.map(q => ({ ...q }));
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

  getTeachingUnitDisplayName(teachingUnitId?: string | null): string {
    if (!teachingUnitId) return this.getActiveTeachingUnitName();
    const tu = this.teachingUnits.find(t => t.id === teachingUnitId);
    return tu?.name ?? this.getActiveTeachingUnitName();
  }

  // CRUD Operations
  createNewMCQ(): void {
    this.newQuestion = {
      text: '',
      teachingUnitId: '',
      difficulty: 'LEVEL_3',
      answerType: 'single',
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    };
    this.showNewMCQModal = true;
    this.editingQuestionId = null;
  }

  closeNewMCQModal(): void {
    this.showNewMCQModal = false;
  }

  isNewQuestionValid(): boolean {
    if (!this.newQuestion.text.trim() || !this.newQuestion.teachingUnitId) return false;

    const validOptions = this.newQuestion.options.filter((opt: any) => opt.text.trim());
    const hasCorrectAnswer = this.newQuestion.options.some((opt: any) => opt.isCorrect);

    return validOptions.length >= 2 && hasCorrectAnswer;
  }

  async saveNewQuestion(): Promise<void> {
    if (!this.isNewQuestionValid()) return;

    const payload: CreateQuestionBankDto = {
      question: String(this.newQuestion.text).trim(),
      type: 'SINGLE_CHOICE',
      difficultyLevel: this.newQuestion.difficulty as DifficultyLevel,
      teachingUnitId: String(this.newQuestion.teachingUnitId),
      proposedAnswers: this.newQuestion.options.map((o: any) => String(o.text).trim()),
      correctAnswer: (() => {
        const opt = this.newQuestion.options.find((o: any) => o.isCorrect);
        return opt ? String(opt.text).trim() : undefined;
      })(),
    };

    try {
      if (this.editingQuestionId) {
        // Update existing question
        await firstValueFrom(this.teacherApi.updateQuestionInBank(this.editingQuestionId, {
          question: payload.question,
          difficultyLevel: payload.difficultyLevel,
          proposedAnswers: payload.proposedAnswers,
          correctAnswer: payload.correctAnswer,
        }));
        alert('Question updated successfully!');
        this.closeNewMCQModal();
        // Refresh current folder/all
        await this.loadQuestionsForTeachingUnit(this.activeFolder === 'all' ? 'all' : payload.teachingUnitId);
      } else {
        const created = await firstValueFrom(this.teacherApi.createQuestionInBank(payload));
        alert('Question created successfully!');
        this.closeNewMCQModal();
        if (this.activeFolder === payload.teachingUnitId || this.activeFolder === 'all') {
          await this.loadQuestionsForTeachingUnit(payload.teachingUnitId);
        }
      }
    } catch (err: unknown) {
      console.error('Failed to save question in bank:', err);
      alert('Failed to save question.');
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
    // Prefill modal with existing question data
    const original = this.allQuestions.find(q => q.questionId === question.id);
    const options = (original?.proposedAnswers ?? question.options ?? []).map((opt: any) => ({ text: opt, isCorrect: String(opt) === String(original?.correctAnswer ?? '') }));
    // Ensure at least 2 options for UI
    while (options.length < 2) options.push({ text: '', isCorrect: false });

    this.newQuestion = {
      text: question.text,
      teachingUnitId: original?.teachingUnitId ?? question.folderId,
      difficulty: original?.difficultyLevel ?? 'LEVEL_3',
      answerType: question.type === 'Multi-answer' ? 'multiple' : 'single',
      options,
    };
    this.editingQuestionId = question.id;
    this.showNewMCQModal = true;
  }

  viewQuestion(question: Question): void {
    // Find original DTO (to get full text, proposedAnswers, correctAnswer, createdByName)
    const original = this.allQuestions.find(q => q.questionId === question.id) ?? null;
    if (!original) {
      // fallback to show simple view
      this.viewQuestionDto = {
        questionId: question.id,
        question: question.text,
        type: question.type === 'Essay' ? 'OPEN_ENDED' : 'SINGLE_CHOICE',
        difficultyLevel: question.difficulty === 'Easy' ? 'LEVEL_2' : question.difficulty === 'Hard' ? 'LEVEL_4' : 'LEVEL_3',
        proposedAnswers: question.options ?? [],
        correctAnswer: question.options && question.correctAnswer !== undefined ? question.options[question.correctAnswer as number] : undefined,
        createdById: question.authorId ?? null,
        createdByName: null,
        createdAt: new Date().toISOString(),
        usageCount: question.usedCount ?? 0,
        teachingUnitId: question.folderId,
      } as ExtendedQuestionBankItemDto;
    } else {
      this.viewQuestionDto = original;
    }

    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.viewQuestionDto = null;
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

  // ui-table handlers
  onTablePageChange(page: number): void {
    this.currentPage = page;
  }

  onTablePageSizeChange(size: number): void {
    this.itemsPerPage = size;
    this.currentPage = 1;
  }

  onTableSearch(term: string): void {
    this.searchTerm = term || '';
    this.applyFilters();
  }

  onSortChange(event: { column: string; direction: 'asc' | 'desc' | null }): void {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    // Re-apply filters (resets to current filtered set) then apply sort
    this.applyFilters();
    if (this.sortColumn && this.sortDirection) {
      const dir = this.sortDirection === 'asc' ? 1 : -1;
      this.filteredQuestions.sort((a: any, b: any) => {
        const key = this.sortColumn as string;
        const va = a[key];
        const vb = b[key];
        if (va == null && vb == null) return 0;
        if (va == null) return -1 * dir;
        if (vb == null) return 1 * dir;
        // numeric compare for usedCount
        if (key === 'used') {
          return (Number(va) - Number(vb)) * dir;
        }
        // string compare
        return String(va).localeCompare(String(vb)) * dir;
      });
      // update tableData so ui-table receives the sorted rows
      this.tableData = this.filteredQuestions.map(q => ({ ...q }));
    }
    else {
      // no sort: ensure tableData matches filteredQuestions
      this.tableData = this.filteredQuestions.map(q => ({ ...q }));
    }
  }

  getCellDefault(row: any, column: any): any {
    return row[column.key];
  }
}
