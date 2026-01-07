import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { TeacherApiService } from '../../../services/teacher-api.service';
import type {
  CreateTeacherQuizDto,
  CreateAndAddQuestionDto,
  QuizType,
  QuestionType,
  CourseDto,
  DifficultyLevel,
} from '../../../domain/dtos/teacher/teacher-quiz.dto';
import {
  CardComponent,
  ButtonComponent,
  BadgeComponent,
  SpinnerComponent,
  AlertComponent,
} from '../../../components/ui';

/** Local interface matching Step 2's question format */
interface QuestionFormData {
  question: string;
  type: QuestionType;
  proposedAnswers: string[];
  correctAnswer: string;
  markAllocation: number;
}

/** Step 1 form data */
interface Step1Data {
  courseId: string;
  type: QuizType;
  lectures: number;
  date: string;
  durationMinutes: number;
  /** Teaching unit ID from the selected course (for question bank categorization) */
  teachingUnitId?: string;
  /** Teaching unit name saved from step 1 for reliable display */
  teachingUnitName?: string;
}

/** Step 2 form data */
interface Step2Data {
  questions: QuestionFormData[];
}

@Component({
  selector: 'app-teacher-create-exam-step3',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    CardComponent,
    ButtonComponent,
    BadgeComponent,
    SpinnerComponent,
    AlertComponent,
  ],
  template: `
    <div class="review-publish">
      <div class="page-header">
        <h1>Review & Publish</h1>
        <p>Review your quiz details before publishing. Students will be automatically invited.</p>
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
          <div class="step completed">
            <div class="step-number">
              <mat-icon>check</mat-icon>
            </div>
            <div class="step-info">
              <span class="step-title">Add Questions</span>
              <span class="step-desc">Build your quiz</span>
            </div>
          </div>
          <div class="step-connector completed"></div>
          <div class="step active">
            <div class="step-number">3</div>
            <div class="step-info">
              <span class="step-title">Review & Publish</span>
              <span class="step-desc">Final review</span>
            </div>
          </div>
        </div>
      </ui-card>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="loading-state">
        <ui-spinner size="lg"></ui-spinner>
        <p>Loading quiz details...</p>
      </div>

      <!-- Error State -->
      <ui-alert *ngIf="errorMessage()" variant="filled" color="danger">
        {{ errorMessage() }}
      </ui-alert>

      <ng-container *ngIf="!isLoading() && !errorMessage()">
        <!-- Quiz Summary -->
        <ui-card variant="elevated" title="Quiz Summary">
          <div class="summary-grid">
            <div class="summary-section">
              <h3>Course & Type</h3>
              <div class="summary-item">
                <span class="label">Course</span>
                <span class="value">{{ courseName() }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Quiz Type</span>
                <ui-badge [color]="getTypeColor(step1Data()?.type)" size="sm">
                  {{ getTypeLabel(step1Data()?.type) }}
                </ui-badge>
              </div>
              <div class="summary-item">
                <span class="label">Lectures Covered</span>
                <span class="value">{{ step1Data()?.lectures }}</span>
              </div>
            </div>

            <div class="summary-section">
              <h3>Schedule</h3>
              <div class="summary-item">
                <span class="label">Date & Time</span>
                <span class="value">{{ formatDate(step1Data()?.date) }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Duration</span>
                <span class="value">{{ step1Data()?.durationMinutes }} minutes</span>
              </div>
            </div>

            <div class="summary-section">
              <h3>Questions</h3>
              <div class="summary-item">
                <span class="label">Total Questions</span>
                <span class="value">{{ questions().length }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Total Marks</span>
                <span class="value">{{ totalMarks() }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Question Types</span>
                <div class="type-breakdown">
                  @if (questionBreakdown().singleChoice > 0) {
                    <ui-badge color="primary" size="sm">
                      {{ questionBreakdown().singleChoice }} Single Choice
                    </ui-badge>
                  }
                  @if (questionBreakdown().multipleChoice > 0) {
                    <ui-badge color="secondary" size="sm">
                      {{ questionBreakdown().multipleChoice }} Multi-Select
                    </ui-badge>
                  }
                  @if (questionBreakdown().trueFalse > 0) {
                    <ui-badge color="info" size="sm">
                      {{ questionBreakdown().trueFalse }} True/False
                    </ui-badge>
                  }
                  @if (questionBreakdown().openEnded > 0) {
                    <ui-badge color="warning" size="sm">
                      {{ questionBreakdown().openEnded }} Essay
                    </ui-badge>
                  }
                </div>
              </div>
            </div>
          </div>
        </ui-card>

        <!-- Questions Preview -->
        <ui-card variant="elevated" title="Questions Preview">
          <div class="questions-preview">
            <div *ngFor="let q of questions(); let i = index" class="question-preview-item">
              <div class="question-preview-item-inner">
                <div class="question-preview-header">
                  <span class="question-number">Q{{ i + 1 }}</span>
                  <ui-badge [color]="getQuestionTypeColor(q.type)" size="sm">
                    {{ getQuestionTypeLabel(q.type) }}
                  </ui-badge>
                  <span class="question-marks">{{ q.markAllocation }} {{ q.markAllocation === 1 ? 'mark' : 'marks' }}</span>
                </div>
                <p class="question-text">{{ q.question }}</p>

                <div *ngIf="q.type !== 'OPEN_ENDED' && q.proposedAnswers?.length > 0" class="answer-preview">
                  <div *ngFor="let option of q.proposedAnswers; let j = index" class="answer-option" [class.correct]="option === q.correctAnswer">
                    <span class="option-letter">{{ getOptionLetter(j) }}</span>
                    <span class="option-text">{{ option }}</span>
                    <mat-icon *ngIf="option === q.correctAnswer" class="correct-icon">check_circle</mat-icon>
                  </div>
                </div>

                <div *ngIf="q.type === 'TRUE_FALSE'" class="tf-answer">
                  <span class="answer-label">Answer:</span>
                  <ui-badge [color]="q.correctAnswer === 'true' ? 'success' : 'danger'" size="sm">
                    {{ q.correctAnswer === 'true' ? 'True' : 'False' }}
                  </ui-badge>
                </div>

                <div *ngIf="q.type === 'OPEN_ENDED'" class="open-ended-note">
                  <mat-icon>edit_note</mat-icon>
                  <span>Open-ended response (for sentiment analysis)</span>
                </div>
              </div>
            </div>
          </div>
        </ui-card>

        <!-- Publishing Notice -->
        <ui-card variant="elevated">
          <div class="publish-notice">
            <div class="notice-icon">
              <mat-icon>info</mat-icon>
            </div>
            <div class="notice-content">
              <h3>Ready to Publish</h3>
              <p>When you publish this quiz:</p>
              <ul>
                <li>All students enrolled in the selected course will be automatically invited</li>
                <li>The quiz will become available at the scheduled date and time</li>
                <li>You can still edit questions before the quiz starts</li>
              </ul>
            </div>
          </div>
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
            [loading]="isPublishing()"
            [disabled]="isPublishing()"
            (clicked)="publishQuiz()"
          >
            <mat-icon slot="icon-left">publish</mat-icon>
            {{ isPublishing() ? 'Publishing...' : 'Publish Quiz' }}
          </ui-button>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .review-publish {
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

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      color: var(--color-text-secondary);

      p {
        margin-top: 1rem;
      }
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .summary-section {
      h3 {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--color-border-subtle);
      }
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 0.875rem;

      .label {
        font-size: 0.813rem;
        color: var(--color-text-tertiary);
      }

      .value {
        font-size: 1rem;
        color: var(--color-text-primary);
        font-weight: 500;
      }
    }

    .type-breakdown {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }

    .questions-preview {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .question-preview-item {
      padding: 1rem;
      border: 1px solid var(--color-border-default);
      border-radius: 8px;
      background: var(--surface-base);
    }

    .question-preview-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;

      .question-number {
        font-weight: 600;
        color: var(--color-primary-600);
      }

      .question-marks {
        margin-left: auto;
        font-size: 0.813rem;
        color: var(--color-text-secondary);
      }
    }

    .question-text {
      font-size: 0.938rem;
      color: var(--color-text-primary);
      line-height: 1.5;
      margin-bottom: 0.75rem;
    }

    .answer-preview {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .answer-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--color-border-subtle);
      border-radius: 6px;
      font-size: 0.875rem;

      &.correct {
        background: var(--color-success-50);
        border-color: var(--color-success-300);
      }

      .option-letter {
        font-weight: 600;
        color: var(--color-text-secondary);
        min-width: 1.25rem;
      }

      .option-text {
        flex: 1;
        color: var(--color-text-primary);
      }

      .correct-icon {
        color: var(--color-success-600);
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    }

    .tf-answer, .open-ended-note {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;

      .answer-label {
        color: var(--color-text-secondary);
      }
    }

    .open-ended-note {
      color: var(--color-text-secondary);
      font-style: italic;

      mat-icon {
        font-size: 1.125rem;
        width: 1.125rem;
        height: 1.125rem;
      }
    }

    .publish-notice {
      display: flex;
      gap: 1rem;
      padding: 0.5rem;

      .notice-icon {
        flex-shrink: 0;

        mat-icon {
          font-size: 1.5rem;
          width: 1.5rem;
          height: 1.5rem;
          color: var(--color-info-500);
        }
      }

      .notice-content {
        h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 0.5rem;
        }

        p {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          margin-bottom: 0.5rem;
        }

        ul {
          margin: 0;
          padding-left: 1.25rem;

          li {
            font-size: 0.875rem;
            color: var(--color-text-secondary);
            margin-bottom: 0.375rem;
            line-height: 1.4;
          }
        }
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
export class TeacherCreateExamStep3 implements OnInit {
  private readonly router = inject(Router);
  private readonly teacherApi = inject(TeacherApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  // State
  isLoading = signal(false);
  isPublishing = signal(false);
  errorMessage = signal('');

  step1Data = signal<Step1Data | null>(null);
  step2Data = signal<Step2Data | null>(null);
  courses = signal<CourseDto[]>([]);

  // Computed
  questions = computed(() => this.step2Data()?.questions ?? []);

  totalMarks = computed(() =>
    this.questions().reduce((sum, q) => sum + q.markAllocation, 0)
  );

  courseName = computed(() => {
    const courseId = this.step1Data()?.courseId;
    if (!courseId) return 'Not selected';
    const course = this.courses().find(c => c.id === courseId);
    // Prefer the course's teaching unit name when available, otherwise fall back
    // to the teachingUnitName we persisted from step 2. If neither exist, show a sensible default.
    const tuName = course?.teachingUnit?.name ?? this.step1Data()?.teachingUnitName ?? 'Unknown Course';
    const className = course?.classAcademicYear?.class?.name ?? '';
    return className ? `${tuName} — ${className}` : tuName;
  });

  questionBreakdown = computed(() => {
    const qs = this.questions();
    return {
      singleChoice: qs.filter(q => q.type === 'SINGLE_CHOICE').length,
      multipleChoice: qs.filter(q => q.type === 'MULTIPLE_CHOICE').length,
      trueFalse: qs.filter(q => q.type === 'TRUE_FALSE').length,
      openEnded: qs.filter(q => q.type === 'OPEN_ENDED').length,
    };
  });

  async ngOnInit(): Promise<void> {
    this.loadFormData();
    await this.loadCourses();
  }

  private loadFormData(): void {
    // Load Step 1 data
    const step1Raw = sessionStorage.getItem('examFormStep1');
    if (step1Raw) {
      try {
        this.step1Data.set(JSON.parse(step1Raw));
      } catch {
        this.errorMessage.set('Failed to load quiz details. Please go back and try again.');
      }
    }

    // Load Step 2 data
    const step2Raw = sessionStorage.getItem('examFormStep2');
    if (step2Raw) {
      try {
        this.step2Data.set(JSON.parse(step2Raw));
      } catch {
        this.errorMessage.set('Failed to load questions. Please go back and try again.');
      }
    }

    // Validate we have required data
    if (!this.step1Data() || !this.step2Data()) {
      this.errorMessage.set('Missing quiz data. Please start from the beginning.');
    }
  }

  private async loadCourses(): Promise<void> {
    try {
      const courses = await firstValueFrom(this.teacherApi.getMyCourses());
      this.courses.set(courses);
    } catch {
      // Non-critical, we can still show the review without course name
    }
  }

  getTypeLabel(type: QuizType | undefined): string {
    if (!type) return 'Unknown';
    const labels: Record<QuizType, string> = {
      CA: 'Continuous Assessment',
      MEDIAN: 'Midterm',
      FINAL: 'Final Exam',
      MOCK: 'Mock Test',
    };
    return labels[type] || type;
  }

  getTypeColor(type: QuizType | undefined): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (!type) return 'neutral';
    const colors: Record<QuizType, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
      CA: 'info',
      MEDIAN: 'warning',
      FINAL: 'danger',
      MOCK: 'secondary',
    };
    return colors[type] || 'neutral';
  }

  getQuestionTypeLabel(type: QuestionType): string {
    const labels: Record<QuestionType, string> = {
      SINGLE_CHOICE: 'Single Choice',
      MULTIPLE_CHOICE: 'Multi-Select',
      TRUE_FALSE: 'True/False',
      OPEN_ENDED: 'Essay',
    };
    return labels[type] || type;
  }

  getQuestionTypeColor(type: QuestionType): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    const colors: Record<QuestionType, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
      SINGLE_CHOICE: 'primary',
      MULTIPLE_CHOICE: 'secondary',
      TRUE_FALSE: 'info',
      OPEN_ENDED: 'warning',
    };
    return colors[type] || 'neutral';
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return 'Not set';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  }

  goBack(): void {
    this.router.navigate(['/teacher/create-exam/step2']);
  }

  async publishQuiz(): Promise<void> {
    const s1 = this.step1Data();
    const s2 = this.step2Data();

    if (!s1 || !s2 || s2.questions.length === 0) {
      alert('Missing quiz data. Please go back and complete all steps.');
      return;
    }

    this.isPublishing.set(true);

    try {
      // Get teaching unit ID from the selected course
      let course = this.courses().find(c => c.id === s1.courseId);
      let teachingUnitId = course?.teachingUnit?.id ?? s1.teachingUnitId ?? '';

      // If missing, try refreshing courses from the API and re-derive teachingUnitId.
      if (!teachingUnitId) {
        try {
          const fresh = await firstValueFrom(this.teacherApi.getMyCourses());
          this.courses.set(fresh);
          course = fresh.find(c => c.id === s1.courseId) ?? course;
          teachingUnitId = course?.teachingUnit?.id ?? s1.teachingUnitId ?? '';
        } catch (err) {
          console.warn('Failed to refresh courses while publishing quiz:', err);
        }
      }

      if (!teachingUnitId) {
        alert('Course must have a teaching unit for question categorization.');
        this.isPublishing.set(false);
        return;
      }

      // Build payload using newQuestions (creates questions in bank and adds to quiz)
      // All questions go to the same teaching unit as the course
      const dto: CreateTeacherQuizDto = {
        courseId: String(s1.courseId),
        type: String(s1.type) as QuizType,
        lectures: Number(s1.lectures),
        date: String(s1.date),
        durationMinutes: Number(s1.durationMinutes),
        newQuestions: s2.questions.map((q): CreateAndAddQuestionDto => {
          const isOpenEnded = q.type === 'OPEN_ENDED';
          return {
            question: String(q.question).trim(),
            type: String(q.type) as QuestionType,
            // Default to LEVEL_3 (medium difficulty) for now
            difficultyLevel: 'LEVEL_3' as DifficultyLevel,
            teachingUnitId: teachingUnitId,
            // Only include proposedAnswers and correctAnswer for non-OPEN_ENDED questions
            ...(isOpenEnded ? {} : {
              proposedAnswers: q.proposedAnswers
                .map(a => String(a).trim())
                .filter(a => a.length > 0),
              correctAnswer: String(q.correctAnswer).trim(),
            }),
            markAllocation: Number(q.markAllocation),
          };
        }),
      };
      // Debug: Log the payload
      console.log('Publishing quiz with payload:', JSON.stringify(dto, null, 2));

      // Create the quiz (DRAFT)
      const created = await firstValueFrom(this.teacherApi.createQuiz(dto));

      // If creation succeeded, publish immediately by calling the publish endpoint
      try {
        await firstValueFrom(this.teacherApi.publishQuiz(created.id));
      } catch (pubErr) {
        console.error('Quiz created but failed to publish:', pubErr);
        throw pubErr;
      }

      // Clear wizard data
      sessionStorage.removeItem('examFormStep1');
      sessionStorage.removeItem('examFormStep2');

      alert('Quiz published successfully! Students have been invited.');
      this.router.navigate(['/teacher/exam-manager']);
    } catch (err: unknown) {
      // Improved error logging to surface backend validation or service messages
      const anyErr = err as any;
      console.error('Failed to publish quiz:', anyErr);

      // If it's an HTTP error from Angular HttpClient, try to show server body and status
      const status = anyErr?.status ?? null;
      const serverBody = anyErr?.error ?? anyErr?.message ?? anyErr;

      if (status) console.error('HTTP status:', status);
      if (serverBody) console.error('Server response body:', serverBody);

      // Prefer server-provided message when available
      const message = (serverBody && (serverBody.message || serverBody.error || JSON.stringify(serverBody)))
        || (anyErr instanceof Error ? anyErr.message : 'Failed to publish quiz. Please try again.');

      alert(message);
    } finally {
      this.isPublishing.set(false);
    }
  }
}
