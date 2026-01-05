import { Component, inject, OnInit, ChangeDetectorRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { TeacherApiService } from '../../../services/teacher-api.service';
import type {
  QuestionType,
  PastQuestionDto,
  CreateQuestionDto,
} from '../../../domain/dtos/teacher/teacher-quiz.dto';
import type { TeachingUnitDto } from '../../../domain/dtos/dean/dean-shared.dto';
import {
  CardComponent,
  ButtonComponent,
  InputComponent,
  SelectComponent,
  TextareaComponent,
  ModalComponent,
  SpinnerComponent,
  BadgeComponent,
  IconButtonComponent,
} from '../../../components/ui';
import type { DropdownOption } from '../../../components/ui';

/** Local question interface for the form */
interface QuestionFormData {
  question: string;
  type: QuestionType;
  proposedAnswers: string[];
  correctAnswer: string;
  markAllocation: number;
}

@Component({
  selector: 'app-teacher-create-exam-step2',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    TextareaComponent,
    ModalComponent,
    SpinnerComponent,
    BadgeComponent,
    IconButtonComponent,
  ],
  template: `
    <div class="create-exam-step2">
      <div class="page-header">
        <h1>Add Questions</h1>
        <p>Build your quiz by adding questions or importing from your question bank.</p>
      </div>

      <!-- Progress Stepper -->
      <ui-card variant="elevated" class="stepper-card">
        <div class="progress-stepper">
          <div class="step completed">
            <div class="step-number">
              <mat-icon>check</mat-icon>
            </div>
            <div class="step-info">
              <span class="step-title">Quiz Details</span>
              <span class="step-desc">Course, type & schedule</span>
            </div>
          </div>
          <div class="step-connector completed"></div>
          <div class="step active">
            <div class="step-number">2</div>
            <div class="step-info">
              <span class="step-title">Add Questions</span>
              <span class="step-desc">Build your quiz</span>
            </div>
          </div>
          <div class="step-connector"></div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-info">
              <span class="step-title">Review & Publish</span>
              <span class="step-desc">Final review</span>
            </div>
          </div>
        </div>
      </ui-card>

      <!-- Questions Section -->
      <ui-card variant="elevated">
        <div class="questions-header">
          <div class="questions-title">
            <h2>Questions ({{ questions().length }})</h2>
            @if (questions().length > 0) {
              <ui-badge color="primary" size="sm">
                Total: {{ totalMarks() }} marks
              </ui-badge>
            }
          </div>
          <div class="questions-actions">
            <ui-button variant="outline" color="primary" (clicked)="openImportModal()">
              <mat-icon slot="icon-left">library_books</mat-icon>
              Import from Bank
            </ui-button>
            <ui-button variant="solid" color="primary" (clicked)="openQuestionModal()">
              <mat-icon slot="icon-left">add</mat-icon>
              Add Question
            </ui-button>
          </div>
        </div>

        <!-- Questions List -->
        @if (questions().length > 0) {
          <div class="questions-list">
            @for (q of questions(); track $index; let i = $index) {
              <div class="question-card">
                <div class="question-header">
                  <div class="question-meta">
                    <span class="question-number">Q{{ i + 1 }}</span>
                    <ui-badge [color]="getTypeColor(q.type)" size="sm">
                      {{ getTypeLabel(q.type) }}
                    </ui-badge>
                    <ui-badge color="neutral" size="sm">
                      {{ q.markAllocation }} {{ q.markAllocation === 1 ? 'mark' : 'marks' }}
                    </ui-badge>
                  </div>
                  <div class="question-actions">
                    <ui-icon-button
                      size="md"
                      variant="outline"
                      color="primary"
                      ariaLabel="Edit question"
                      (clicked)="editQuestion(i)"
                    >
                      <mat-icon>edit</mat-icon>
                    </ui-icon-button>
                    <ui-icon-button
                      size="md"
                      variant="outline"
                      color="secondary"
                      ariaLabel="Duplicate question"
                      (clicked)="duplicateQuestion(i)"
                    >
                      <mat-icon>content_copy</mat-icon>
                    </ui-icon-button>
                    <ui-icon-button
                      size="md"
                      variant="outline"
                      color="danger"
                      ariaLabel="Delete question"
                      (clicked)="deleteQuestion(i)"
                    >
                      <mat-icon>delete</mat-icon>
                    </ui-icon-button>
                  </div>
                </div>

                <p class="question-text">{{ q.question }}</p>

                @if (q.type !== 'OPEN_ENDED' && q.proposedAnswers.length > 0) {
                  <div class="options-preview">
                    @for (option of q.proposedAnswers; track $index; let j = $index) {
                      <div class="option" [class.correct]="option === q.correctAnswer">
                        <span class="option-letter">{{ getOptionLetter(j) }}</span>
                        <span class="option-text">{{ option }}</span>
                        @if (option === q.correctAnswer) {
                          <mat-icon class="correct-icon">check_circle</mat-icon>
                        }
                      </div>
                    }
                  </div>
                }

                @if (q.type === 'TRUE_FALSE') {
                  <div class="tf-answer">
                    <span class="answer-label">Correct Answer:</span>
                    <ui-badge [color]="q.correctAnswer === 'true' ? 'success' : 'danger'" size="sm">
                      {{ q.correctAnswer === 'true' ? 'True' : 'False' }}
                    </ui-badge>
                  </div>
                }
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <mat-icon>quiz</mat-icon>
            <h3>No questions yet</h3>
            <p>Add questions to build your quiz, or import from your question bank.</p>
            <ui-button variant="solid" color="primary" (clicked)="openQuestionModal()">
              <mat-icon slot="icon-left">add</mat-icon>
              Add Your First Question
            </ui-button>
          </div>
        }

        <!-- Open-Ended Warning -->
        @if (hasOpenEnded()) {
          <div class="info-banner">
            <mat-icon>info</mat-icon>
            <span>This quiz includes an open-ended question. Only <strong>one</strong> open-ended question is allowed per quiz for sentiment analysis.</span>
          </div>
        }
      </ui-card>

      <!-- Form Actions -->
      <div class="form-actions">
        <ui-button variant="outline" color="neutral" (clicked)="goBack()">
          <mat-icon slot="icon-left">arrow_back</mat-icon>
          Back
        </ui-button>
        <ui-button
          variant="solid"
          color="primary"
          [disabled]="questions().length === 0"
          (clicked)="nextStep()"
        >
          Next: Review & Publish
          <mat-icon slot="icon-right">arrow_forward</mat-icon>
        </ui-button>
      </div>

      <!-- Question Builder Modal -->
      <ui-modal
        [isOpen]="showQuestionModal()"
        [title]="editingIndex() >= 0 ? 'Edit Question' : 'Add Question'"
        size="lg"
        [showFooter]="true"
        (closed)="closeQuestionModal()"
      >
        <div class="modal-form">
          <ui-select
            label="Question Type"
            [options]="questionTypeOptions"
            [(ngModel)]="currentQuestion.type"
            name="questionType"
            (ngModelChange)="onQuestionTypeChange()"
          />

          @if (currentQuestion.type === 'OPEN_ENDED' && hasOpenEnded() && editingIndex() < 0) {
            <div class="warning-banner">
              <mat-icon>warning</mat-icon>
              <span>Only one open-ended question is allowed per quiz.</span>
            </div>
          }

          <ui-textarea
            label="Question Text"
            placeholder="Enter your question..."
            [required]="true"
            [(ngModel)]="currentQuestion.question"
            name="questionText"
            [rows]="3"
          />

          <!-- MCQ Options -->
          @if (currentQuestion.type === 'SINGLE_CHOICE' || currentQuestion.type === 'MULTIPLE_CHOICE') {
            <div class="options-section">
              <label class="options-label">Answer Options</label>
              <p class="options-hint">Select the correct answer using the radio button.</p>

              @for (option of currentQuestion.proposedAnswers; track $index; let i = $index) {
                <div class="option-row">
                  <input
                    type="radio"
                    [name]="'correct-answer'"
                    [value]="currentQuestion.proposedAnswers[i]"
                    [checked]="currentQuestion.correctAnswer === currentQuestion.proposedAnswers[i]"
                    (change)="setCorrectAnswer(currentQuestion.proposedAnswers[i])"
                  />
                  <input
                    type="text"
                    class="option-input"
                    [placeholder]="'Option ' + getOptionLetter(i)"
                    [value]="currentQuestion.proposedAnswers[i]"
                    (focus)="captureOptionValue(i)"
                    (input)="updateOptionText(i, $event)"
                    [name]="'option-' + i"
                  />
                  @if (currentQuestion.proposedAnswers.length > 2) {
                    <ui-icon-button
                      size="md"
                      variant="outline"
                      color="danger"
                      ariaLabel="Remove option"
                      (clicked)="removeOption(i)"
                    >
                      <mat-icon>close</mat-icon>
                    </ui-icon-button>
                  }
                </div>
              }

              @if (currentQuestion.proposedAnswers.length < 6) {
                <ui-button variant="outline" color="neutral" size="sm" (clicked)="addOption()">
                  <mat-icon slot="icon-left">add</mat-icon>
                  Add Option
                </ui-button>
              }
            </div>
          }

          <!-- True/False Options -->
          @if (currentQuestion.type === 'TRUE_FALSE') {
            <div class="tf-section">
              <label class="tf-label">Correct Answer</label>
              <div class="tf-options">
                <label class="tf-option">
                  <input
                    type="radio"
                    name="tf-answer"
                    value="true"
                    [(ngModel)]="currentQuestion.correctAnswer"
                  />
                  <span>True</span>
                </label>
                <label class="tf-option">
                  <input
                    type="radio"
                    name="tf-answer"
                    value="false"
                    [(ngModel)]="currentQuestion.correctAnswer"
                  />
                  <span>False</span>
                </label>
              </div>
            </div>
          }

          <ui-input
            type="number"
            label="Mark Allocation"
            placeholder="1"
            [required]="true"
            [min]="1"
            [(ngModel)]="currentQuestion.markAllocation"
            name="markAllocation"
            helperText="Points awarded for correct answer"
          />
        </div>

        <div slot="footer" class="modal-footer">
          <ui-button variant="outline" color="neutral" (clicked)="closeQuestionModal()">
            Cancel
          </ui-button>
          <ui-button
            variant="solid"
            color="primary"
            [disabled]="!isQuestionValid()"
            (clicked)="saveQuestion()"
          >
            {{ editingIndex() >= 0 ? 'Update' : 'Add' }} Question
          </ui-button>
        </div>
      </ui-modal>

      <!-- Import Modal -->
      <ui-modal
        [isOpen]="showImportModal()"
        title="Import from Question Bank"
        size="lg"
        [showFooter]="true"
        (closed)="closeImportModal()"
      >
        <div class="import-content">
          <ui-select
            label="Teaching Unit"
            placeholder="Select a teaching unit"
            [options]="teachingUnitOptions()"
            [(ngModel)]="selectedTeachingUnitId"
            name="teachingUnit"
            (ngModelChange)="loadPastQuestions()"
          />

          @if (isLoadingQuestions()) {
            <div class="loading-state">
              <ui-spinner size="md" />
              <span>Loading questions...</span>
            </div>
          } @else if (pastQuestions().length > 0) {
            <div class="import-list">
              @for (q of pastQuestions(); track q.questionId) {
                <label class="import-item" [class.selected]="selectedImportIds().includes(q.questionId)">
                  <input
                    type="checkbox"
                    [checked]="selectedImportIds().includes(q.questionId)"
                    (change)="toggleImportSelection(q.questionId)"
                    [disabled]="q.type === 'OPEN_ENDED' && hasOpenEnded() && !selectedImportIds().includes(q.questionId)"
                  />
                  <div class="import-item-content">
                    <p class="import-question">{{ q.question }}</p>
                    <div class="import-meta">
                      <ui-badge [color]="getTypeColor(q.type)" size="sm">
                        {{ getTypeLabel(q.type) }}
                      </ui-badge>
                      <span class="import-source">{{ q.courseName }} • {{ q.quizType }}</span>
                    </div>
                  </div>
                </label>
              }
            </div>
          } @else if (selectedTeachingUnitId) {
            <div class="empty-import">
              <mat-icon>search_off</mat-icon>
              <p>No past questions found for this teaching unit.</p>
            </div>
          }
        </div>

        <div slot="footer" class="modal-footer">
          <span class="selection-count">{{ selectedImportIds().length }} selected</span>
          <div class="modal-footer-actions">
            <ui-button variant="outline" color="neutral" (clicked)="closeImportModal()">
              Cancel
            </ui-button>
            <ui-button
              variant="solid"
              color="primary"
              [disabled]="selectedImportIds().length === 0"
              (clicked)="importSelectedQuestions()"
            >
              Import {{ selectedImportIds().length }} Question{{ selectedImportIds().length === 1 ? '' : 's' }}
            </ui-button>
          </div>
        </div>
      </ui-modal>
    </div>
  `,
  styles: [`
    .create-exam-step2 {
      max-width: 900px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .page-header {
      margin-bottom: 1.5rem;

      h1 {
        font-size: 1.75rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--color-text-primary);
      }

      p {
        color: var(--color-text-secondary);
        font-size: 0.938rem;
      }
    }

    .stepper-card {
      margin-bottom: 1.5rem;
    }

    .progress-stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem 0;

      @media (max-width: 640px) {
        flex-direction: column;
        gap: 1rem;
      }
    }

    .step {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .step-number {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        background: var(--color-background-muted);
        color: var(--color-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.938rem;

        mat-icon {
          font-size: 1.25rem;
          width: 1.25rem;
          height: 1.25rem;
        }
      }

      &.active .step-number {
        background: var(--color-primary-600);
        color: white;
      }

      &.completed .step-number {
        background: var(--color-success-600);
        color: white;
      }

      .step-info {
        display: flex;
        flex-direction: column;
      }

      .step-title {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
      }

      &.active .step-title {
        color: var(--color-primary-600);
        font-weight: 600;
      }

      .step-desc {
        font-size: 0.75rem;
        color: var(--color-text-tertiary);
      }
    }

    .step-connector {
      flex: 1;
      height: 2px;
      background: var(--color-border-default);
      margin: 0 1.5rem;
      max-width: 80px;

      &.completed {
        background: var(--color-success-600);
      }

      @media (max-width: 640px) {
        display: none;
      }
    }

    .questions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;

      .questions-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0;
        }
      }

      .questions-actions {
        display: flex;
        gap: 0.5rem;
      }
    }

    .questions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .question-card {
      padding: 1.25rem;
      border: 1px solid var(--color-border-default);
      border-radius: 10px;
      background: var(--surface-base);
      transition: border-color 0.2s ease;

      &:hover {
        border-color: var(--color-primary-300);
      }
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .question-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .question-number {
        font-weight: 600;
        color: var(--color-primary-600);
        font-size: 0.938rem;
      }
    }

    .question-actions {
      display: flex;
      gap: 0.5rem;
    }

    .question-text {
      font-size: 1rem;
      color: var(--color-text-primary);
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .options-preview {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 0.875rem;
      border: 1px solid var(--color-border-default);
      border-radius: 6px;
      font-size: 0.875rem;

      &.correct {
        background: var(--color-success-50);
        border-color: var(--color-success-300);
      }

      .option-letter {
        font-weight: 600;
        color: var(--color-text-secondary);
        min-width: 1.5rem;
      }

      .option-text {
        flex: 1;
        color: var(--color-text-primary);
      }

      .correct-icon {
        color: var(--color-success-600);
        font-size: 1.125rem;
        width: 1.125rem;
        height: 1.125rem;
      }
    }

    .tf-answer {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .answer-label {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1.5rem;

      mat-icon {
        font-size: 3.5rem;
        width: 3.5rem;
        height: 3.5rem;
        color: var(--color-text-tertiary);
        margin-bottom: 1rem;
      }

      h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--color-text-secondary);
        margin-bottom: 1.5rem;
      }
    }

    .info-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding: 0.875rem 1rem;
      background: var(--color-info-50);
      border: 1px solid var(--color-info-200);
      border-radius: 8px;
      font-size: 0.875rem;
      color: var(--color-info-700);

      mat-icon {
        color: var(--color-info-500);
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
        flex-shrink: 0;
      }
    }

    .warning-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      background: var(--color-warning-50);
      border: 1px solid var(--color-warning-200);
      border-radius: 8px;
      font-size: 0.875rem;
      color: var(--color-warning-700);
      margin-bottom: 1rem;

      mat-icon {
        color: var(--color-warning-500);
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
        flex-shrink: 0;
      }
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border-subtle);
    }

    /* Modal Form Styles */
    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .options-section {
      .options-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
        margin-bottom: 0.25rem;
      }

      .options-hint {
        font-size: 0.813rem;
        color: var(--color-text-secondary);
        margin-bottom: 0.75rem;
      }
    }

    .option-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;

      input[type="radio"] {
        margin: 0;
        width: 1.125rem;
        height: 1.125rem;
        cursor: pointer;
      }

      .option-input {
        flex: 1;
        padding: 0.625rem 0.875rem;
        border: 1px solid var(--color-border-default);
        border-radius: 6px;
        font-size: 0.875rem;
        transition: border-color 0.2s ease;

        &:focus {
          outline: none;
          border-color: var(--color-primary-500);
        }
      }
    }

    .tf-section {
      .tf-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
        margin-bottom: 0.75rem;
      }

      .tf-options {
        display: flex;
        gap: 1.5rem;
      }

      .tf-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;

        input[type="radio"] {
          margin: 0;
          width: 1.125rem;
          height: 1.125rem;
        }

        span {
          font-size: 0.938rem;
          color: var(--color-text-primary);
        }
      }
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    /* Import Modal Styles */
    .import-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 2rem;
      color: var(--color-text-secondary);
    }

    .import-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid var(--color-border-default);
      border-radius: 8px;
    }

    .import-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      border-bottom: 1px solid var(--color-border-subtle);
      cursor: pointer;
      transition: background 0.15s ease;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: var(--color-background-subtle);
      }

      &.selected {
        background: var(--color-primary-50);
      }

      input[type="checkbox"] {
        margin-top: 0.25rem;
        width: 1.125rem;
        height: 1.125rem;
        cursor: pointer;
      }

      .import-item-content {
        flex: 1;
      }

      .import-question {
        font-size: 0.938rem;
        color: var(--color-text-primary);
        margin-bottom: 0.5rem;
        line-height: 1.4;
      }

      .import-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .import-source {
        font-size: 0.813rem;
        color: var(--color-text-tertiary);
      }
    }

    .empty-import {
      text-align: center;
      padding: 2.5rem 1.5rem;
      color: var(--color-text-secondary);

      mat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        margin-bottom: 0.75rem;
        color: var(--color-text-tertiary);
      }

      p {
        margin: 0;
      }
    }

    .selection-count {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }

    .modal-footer-actions {
      display: flex;
      gap: 0.75rem;
    }

    :host ::ng-deep {
      ui-card {
        margin-bottom: 1.5rem;
      }

      .card__body {
        padding: 1.5rem;
      }
    }
  `],
})
export class TeacherCreateExamStep2 implements OnInit {
  private readonly teacherApi = inject(TeacherApiService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  // Reactive state
  questions = signal<QuestionFormData[]>([]);
  showQuestionModal = signal(false);
  showImportModal = signal(false);
  editingIndex = signal(-1);
  isLoadingQuestions = signal(false);

  // Teaching units for import
  teachingUnits = signal<TeachingUnitDto[]>([]);
  selectedTeachingUnitId = '';
  pastQuestions = signal<PastQuestionDto[]>([]);
  selectedImportIds = signal<string[]>([]);

  // Current question being edited
  currentQuestion: QuestionFormData = this.getEmptyQuestion();

  // Track the previous option value when editing
  private previousOptionValue = '';

  // Question type options matching API
  readonly questionTypeOptions: DropdownOption[] = [
    { value: 'SINGLE_CHOICE', label: 'Multiple Choice (Single Answer)' },
    { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice (Multiple Answers)' },
    { value: 'TRUE_FALSE', label: 'True / False' },
    { value: 'OPEN_ENDED', label: 'Open Ended (Essay)' },
  ];

  // Computed values
  totalMarks = computed(() =>
    this.questions().reduce((sum, q) => sum + q.markAllocation, 0)
  );

  hasOpenEnded = computed(() =>
    this.questions().some(q => q.type === 'OPEN_ENDED')
  );

  teachingUnitOptions = computed<DropdownOption[]>(() =>
    this.teachingUnits().map(tu => ({
      value: tu.id,
      label: tu.name,
    }))
  );

  async ngOnInit(): Promise<void> {
    this.loadSavedQuestions();
    await this.loadTeachingUnits();
  }

  private loadSavedQuestions(): void {
    const saved = sessionStorage.getItem('examFormStep2');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.questions && Array.isArray(data.questions)) {
          this.questions.set(data.questions);
        }
      } catch {
        // Ignore parse errors
      }
    }
  }

  private async loadTeachingUnits(): Promise<void> {
    try {
      const units = await firstValueFrom(this.teacherApi.getMyTeachingUnits());
      this.teachingUnits.set(units);
    } catch (err) {
      console.error('Failed to load teaching units:', err);
    }
  }

  getEmptyQuestion(): QuestionFormData {
    return {
      question: '',
      type: 'SINGLE_CHOICE',
      proposedAnswers: ['', '', '', ''],
      correctAnswer: '',
      markAllocation: 1,
    };
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getTypeLabel(type: QuestionType): string {
    const labels: Record<QuestionType, string> = {
      SINGLE_CHOICE: 'Single Choice',
      MULTIPLE_CHOICE: 'Multi-Select',
      TRUE_FALSE: 'True/False',
      OPEN_ENDED: 'Essay',
    };
    return labels[type] || type;
  }

  getTypeColor(type: QuestionType): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    const colors: Record<QuestionType, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
      SINGLE_CHOICE: 'primary',
      MULTIPLE_CHOICE: 'secondary',
      TRUE_FALSE: 'info',
      OPEN_ENDED: 'warning',
    };
    return colors[type] || 'neutral';
  }

  // Question Modal
  openQuestionModal(): void {
    this.editingIndex.set(-1);
    this.currentQuestion = this.getEmptyQuestion();
    this.showQuestionModal.set(true);
  }

  closeQuestionModal(): void {
    this.showQuestionModal.set(false);
    this.editingIndex.set(-1);
  }

  editQuestion(index: number): void {
    const q = this.questions()[index];
    this.editingIndex.set(index);
    this.currentQuestion = { ...q, proposedAnswers: [...q.proposedAnswers] };
    this.showQuestionModal.set(true);
  }

  duplicateQuestion(index: number): void {
    const q = this.questions()[index];
    const duplicate: QuestionFormData = {
      ...q,
      proposedAnswers: [...q.proposedAnswers],
    };
    this.questions.update(list => [...list.slice(0, index + 1), duplicate, ...list.slice(index + 1)]);
  }

  deleteQuestion(index: number): void {
    if (confirm('Delete this question?')) {
      this.questions.update(list => list.filter((_, i) => i !== index));
    }
  }

  onQuestionTypeChange(): void {
    if (this.currentQuestion.type === 'TRUE_FALSE') {
      this.currentQuestion.proposedAnswers = [];
      this.currentQuestion.correctAnswer = 'true';
    } else if (this.currentQuestion.type === 'OPEN_ENDED') {
      this.currentQuestion.proposedAnswers = [];
      this.currentQuestion.correctAnswer = '';
    } else if (this.currentQuestion.proposedAnswers.length === 0) {
      this.currentQuestion.proposedAnswers = ['', '', '', ''];
      this.currentQuestion.correctAnswer = '';
    }
  }

  setCorrectAnswer(answer: string): void {
    this.currentQuestion.correctAnswer = answer;
  }

  captureOptionValue(index: number): void {
    this.previousOptionValue = this.currentQuestion.proposedAnswers[index];
  }

  updateOptionText(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;

    // Update the correct answer if this option was selected
    if (this.currentQuestion.correctAnswer === this.previousOptionValue) {
      this.currentQuestion.correctAnswer = newValue;
    }

    this.currentQuestion.proposedAnswers[index] = newValue;
    this.previousOptionValue = newValue;
  }

  updateCorrectAnswerIfNeeded(index: number, previousValue: string): void {
    // If the correct answer was this option before edit, update it to the new value
    if (this.currentQuestion.correctAnswer === previousValue) {
      this.currentQuestion.correctAnswer = this.currentQuestion.proposedAnswers[index];
    }
  }

  addOption(): void {
    if (this.currentQuestion.proposedAnswers.length < 6) {
      this.currentQuestion.proposedAnswers.push('');
    }
  }

  removeOption(index: number): void {
    if (this.currentQuestion.proposedAnswers.length > 2) {
      const removed = this.currentQuestion.proposedAnswers[index];
      this.currentQuestion.proposedAnswers.splice(index, 1);
      if (this.currentQuestion.correctAnswer === removed) {
        this.currentQuestion.correctAnswer = '';
      }
    }
  }

  isQuestionValid(): boolean {
    const q = this.currentQuestion;
    if (!q.question.trim()) return false;
    if (q.markAllocation < 1) return false;

    // Check open-ended limit
    if (q.type === 'OPEN_ENDED') {
      const isEditing = this.editingIndex() >= 0;
      const editingOpenEnded = isEditing && this.questions()[this.editingIndex()].type === 'OPEN_ENDED';
      if (this.hasOpenEnded() && !editingOpenEnded) {
        return false;
      }
    }

    if (q.type === 'SINGLE_CHOICE' || q.type === 'MULTIPLE_CHOICE') {
      const validOptions = q.proposedAnswers.filter(opt => opt.trim());
      if (validOptions.length < 2) return false;
      if (!q.correctAnswer || !validOptions.includes(q.correctAnswer)) return false;
    }

    if (q.type === 'TRUE_FALSE') {
      if (q.correctAnswer !== 'true' && q.correctAnswer !== 'false') return false;
    }

    return true;
  }

  saveQuestion(): void {
    if (!this.isQuestionValid()) return;

    // Explicitly convert all types
    const q: QuestionFormData = {
      question: String(this.currentQuestion.question).trim(),
      type: String(this.currentQuestion.type) as QuestionType,
      proposedAnswers: this.currentQuestion.proposedAnswers
        .map(opt => String(opt).trim())
        .filter(opt => opt.length > 0),
      correctAnswer: String(this.currentQuestion.correctAnswer || ''),
      markAllocation: Number(this.currentQuestion.markAllocation) || 1,
    };

    if (this.editingIndex() >= 0) {
      this.questions.update(list =>
        list.map((item, i) => (i === this.editingIndex() ? q : item))
      );
    } else {
      this.questions.update(list => [...list, q]);
    }

    this.closeQuestionModal();
  }

  // Import Modal
  openImportModal(): void {
    this.selectedImportIds.set([]);
    this.showImportModal.set(true);
    if (this.teachingUnits().length > 0 && !this.selectedTeachingUnitId) {
      this.selectedTeachingUnitId = this.teachingUnits()[0].id;
      this.loadPastQuestions();
    }
  }

  closeImportModal(): void {
    this.showImportModal.set(false);
    this.selectedImportIds.set([]);
  }

  async loadPastQuestions(): Promise<void> {
    if (!this.selectedTeachingUnitId) {
      this.pastQuestions.set([]);
      return;
    }

    this.isLoadingQuestions.set(true);
    try {
      const result = await firstValueFrom(
        this.teacherApi.getTeachingUnitPastQuestions(this.selectedTeachingUnitId)
      );
      this.pastQuestions.set(result.questions);
    } catch (err) {
      console.error('Failed to load past questions:', err);
      this.pastQuestions.set([]);
    } finally {
      this.isLoadingQuestions.set(false);
    }
  }

  toggleImportSelection(questionId: string): void {
    this.selectedImportIds.update(ids => {
      if (ids.includes(questionId)) {
        return ids.filter(id => id !== questionId);
      }
      return [...ids, questionId];
    });
  }

  importSelectedQuestions(): void {
    const toImport = this.pastQuestions().filter(q =>
      this.selectedImportIds().includes(q.questionId)
    );

    // Check open-ended constraint
    const importingOpenEnded = toImport.some(q => q.type === 'OPEN_ENDED');
    if (importingOpenEnded && this.hasOpenEnded()) {
      alert('Cannot import an open-ended question - one already exists in this quiz.');
      return;
    }

    const newQuestions: QuestionFormData[] = toImport.map(q => ({
      question: q.question,
      type: q.type,
      proposedAnswers: q.proposedAnswers ?? [],
      correctAnswer: q.correctAnswer ?? '',
      markAllocation: q.markAllocation,
    }));

    this.questions.update(list => [...list, ...newQuestions]);
    this.closeImportModal();
  }

  // Navigation
  goBack(): void {
    this.saveToSession();
    this.router.navigate(['/teacher/create-exam']);
  }

  nextStep(): void {
    if (this.questions().length === 0) return;

    this.saveToSession();
    // Skip step 3 (settings not in API) and go directly to review (step 3 in new flow)
    this.router.navigate(['/teacher/create-exam/step3']);
  }

  private saveToSession(): void {
    sessionStorage.setItem('examFormStep2', JSON.stringify({
      questions: this.questions(),
    }));
  }
}
