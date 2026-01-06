import { Component, inject, ChangeDetectorRef, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { TeacherApiService } from '../../../services/teacher-api.service';
import type { CourseDto, QuizType } from '../../../domain/dtos/teacher/teacher-quiz.dto';
import {
  CardComponent,
  ButtonComponent,
  InputComponent,
  SelectComponent,
  SpinnerComponent,
  AlertComponent,
} from '../../../components/ui';
import type { DropdownOption } from '../../../components/ui';

@Component({
  selector: 'app-teacher-create-exam',
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
    SpinnerComponent,
    AlertComponent,
  ],
  template: `
    <div class="create-exam">
      <div class="page-header">
        <h1>Create New Quiz</h1>
        <p>Set up your quiz details. Students will be automatically invited based on the selected course.</p>
      </div>

      <!-- Progress Stepper -->
      <ui-card variant="elevated" class="stepper-card">
        <div class="progress-stepper">
          <div class="step active">
            <div class="step-number">1</div>
            <div class="step-info">
              <span class="step-title">Quiz Details</span>
              <span class="step-desc">Course, type & schedule</span>
            </div>
          </div>
          <div class="step-connector"></div>
          <div class="step">
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

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-state">
          <ui-spinner size="lg" />
          <p>Loading courses...</p>
        </div>
      }

      <!-- Error State -->
      @if (errorMessage()) {
        <ui-alert variant="filled" color="danger">
          <mat-icon slot="icon">error</mat-icon>
          {{ errorMessage() }}
          <ui-button slot="action" variant="outline" color="danger" size="sm" (clicked)="loadCourses()">
            Retry
          </ui-button>
        </ui-alert>
      }

      <!-- Main Form -->
      @if (!isLoading() && !errorMessage()) {
        <ui-card variant="elevated" title="Quiz Details">
          <form class="quiz-form" (ngSubmit)="nextStep()">
            <!-- Course Selection -->
            <div class="form-section">
              <h3>Select Course</h3>
              <p class="section-hint">Choose the course for this quiz. All students enrolled in this course will be automatically invited.</p>

              <ui-select
                label="Course"
                placeholder="Select a course"
                [options]="courseOptions()"
                [required]="true"
                [(ngModel)]="quizForm.courseId"
                name="courseId"
              />

              @if (selectedCourseInfo()) {
                <div class="course-preview">
                  <mat-icon>info</mat-icon>
                  <span>{{ selectedCourseInfo() }}</span>
                </div>
              }
            </div>

            <!-- Quiz Type & Lectures -->
            <div class="form-section">
              <h3>Quiz Configuration</h3>

              <div class="form-row">
                <ui-select
                  label="Quiz Type"
                  placeholder="Select quiz type"
                  [options]="quizTypeOptions"
                  [required]="true"
                  [(ngModel)]="quizForm.type"
                  name="type"
                />

                <ui-input
                  type="number"
                  label="Number of Lectures Covered"
                  placeholder="e.g., 3"
                  [required]="true"
                  [min]="1"
                  [(ngModel)]="quizForm.lectures"
                  name="lectures"
                  helperText="How many lectures does this quiz cover?"
                />
              </div>
            </div>

            <!-- Scheduling -->
            <div class="form-section">
              <h3>Schedule</h3>
              <p class="section-hint">Set when the quiz will be available and how long students have to complete it.</p>

              <div class="form-row">
                <ui-input
                  type="datetime-local"
                  label="Quiz Date & Time"
                  [required]="true"
                  [(ngModel)]="quizForm.date"
                  name="date"
                  helperText="When the quiz becomes available"
                />

                <ui-input
                  type="number"
                  label="Duration (minutes)"
                  placeholder="60"
                  [required]="true"
                  [min]="1"
                  [(ngModel)]="quizForm.durationMinutes"
                  name="durationMinutes"
                  helperText="Time limit for completion"
                />
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <ui-button variant="outline" color="neutral" (clicked)="goBack()">
                <mat-icon slot="icon-left">arrow_back</mat-icon>
                Cancel
              </ui-button>

              <ui-button
                variant="solid"
                color="primary"
                [disabled]="!isFormValid()"
                (clicked)="nextStep()"
              >
                Next: Add Questions
                <mat-icon slot="icon-right">arrow_forward</mat-icon>
              </ui-button>
            </div>
          </form>
        </ui-card>
      }

    </div>
  `,
  styles: [`
    .create-exam {
      max-width: 800px;
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
        transition: all 0.2s ease;
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

    .quiz-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-section {
      h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--color-text-primary);
      }

      .section-hint {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        margin-bottom: 1rem;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }

    .course-preview {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.75rem;
      padding: 0.75rem 1rem;
      background: var(--color-primary-50);
      border: 1px solid var(--color-primary-200);
      border-radius: 8px;
      font-size: 0.875rem;
      color: var(--color-primary-700);

      mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border-subtle);

      @media (max-width: 480px) {
        flex-direction: column;
        gap: 1rem;

        ui-button {
          width: 100%;
        }
      }
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
export class TeacherCreateExam implements OnInit {
  private readonly teacherApi = inject(TeacherApiService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  // Reactive state using signals
  isLoading = signal(false);
  errorMessage = signal('');
  courses = signal<CourseDto[]>([]);

  // Quiz form - matches CreateTeacherQuizDto (excluding questions)
  quizForm = {
    courseId: '',
    type: '' as QuizType | '',
    lectures: 1,
    date: '',
    durationMinutes: 60,
  };

  // Quiz type options matching backend QuizType enum
  readonly quizTypeOptions: DropdownOption[] = [
    { value: 'CA', label: 'Continuous Assessment (CA)' },
    { value: 'MEDIAN', label: 'Midterm Exam' },
    { value: 'FINAL', label: 'Final Exam' },
    { value: 'MOCK', label: 'Mock Test / Practice' },
  ];

  // Computed: Course dropdown options
  courseOptions = computed<DropdownOption[]>(() =>
    this.courses().map(course => ({
      value: course.id,
      label: this.getCourseLabel(course),
    }))
  );

  // Computed: Selected course info preview
  selectedCourseInfo = computed(() => {
    if (!this.quizForm.courseId) return '';
    const course = this.courses().find(c => c.id === this.quizForm.courseId);
    if (!course) return '';

    const className = course.classAcademicYear?.class?.name ?? '';
    const level = course.classAcademicYear?.class?.level ?? course.level ?? '';
    const credits = course.credits;

    const parts: string[] = [];
    if (className) parts.push(`Class: ${className}`);
    if (level) parts.push(`Level: ${level}`);
    if (credits) parts.push(`${credits} credits`);

    return parts.join(' • ');
  });

  async ngOnInit(): Promise<void> {
    // Load any saved data from previous session
    this.loadSavedData();
    await this.loadCourses();
  }

  private loadSavedData(): void {
    const saved = sessionStorage.getItem('examFormStep1');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.quizForm = { ...this.quizForm, ...data };
      } catch {
        // Ignore parse errors
      }
    }
  }

  async loadCourses(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const courses = await firstValueFrom(this.teacherApi.getMyCourses());
      this.courses.set(courses);
    } catch (err: unknown) {
      this.errorMessage.set(
        err instanceof Error ? err.message : 'Failed to load courses. Please try again.'
      );
    } finally {
      this.isLoading.set(false);
      this.cdr.markForCheck();
    }
  }

  getCourseLabel(course: CourseDto): string {
    const tuName = course.teachingUnit?.name ?? 'Unknown Subject';
    const className = course.classAcademicYear?.class?.name ?? '';
    return className ? `${tuName} — ${className}` : tuName;
  }

  isFormValid(): boolean {
    return !!(
      this.quizForm.courseId &&
      this.quizForm.type &&
      this.quizForm.date &&
      this.quizForm.durationMinutes > 0 &&
      this.quizForm.lectures > 0
    );
  }

  goBack(): void {
    this.router.navigate(['/teacher/exam-manager']);
  }

  nextStep(): void {
    if (!this.isFormValid()) {
      return;
    }

    // Store form data for next steps with explicit type conversions
    const formData = {
      courseId: String(this.quizForm.courseId),
      type: String(this.quizForm.type) as QuizType,
      lectures: Number(this.quizForm.lectures),
      date: String(this.quizForm.date),
      durationMinutes: Number(this.quizForm.durationMinutes),
      // Preserve teaching unit id from selected course so later steps can default correctly
      teachingUnitId: (() => {
        const selected = this.courses().find(c => c.id === String(this.quizForm.courseId));
        return selected?.teachingUnit?.id ?? '';
      })(),
      // Also save the teaching unit name for reliable summary display
      teachingUnitName: (() => {
        const selected = this.courses().find(c => c.id === String(this.quizForm.courseId));
        return selected?.teachingUnit?.name ?? '';
      })(),
    };
    sessionStorage.setItem('examFormStep1', JSON.stringify(formData));
    this.router.navigate(['/teacher/create-exam/step2']);
  }
}
