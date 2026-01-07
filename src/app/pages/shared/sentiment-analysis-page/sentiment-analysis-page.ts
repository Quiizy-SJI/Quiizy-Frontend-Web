import { Component, OnInit, signal, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { SentimentAnalysisService } from '../../../services/sentiment-analysis.service';
import { TeacherApiService } from '../../../services/teacher-api.service';
import { DeanApiService } from '../../../services/dean-api.service';
import { Router } from '@angular/router';
import type { QuizDto, QuizQuestionViewModel } from '../../../domain/dtos/teacher/teacher-quiz.dto';
import { findOpenEndedQuestion } from '../../../domain/dtos/teacher/teacher-quiz.dto';
import type {
  SentimentAnalysisResponseDto,
  SentimentAnalysisResultDto,
  SentimentEmotionDto,
  SentimentThemeDto,
} from '../../../domain/dtos/teacher/teacher-sentiment.dto';
import {
  CardComponent,
  BadgeComponent,
  ButtonComponent,
  SpinnerComponent,
  AlertComponent,
  SelectComponent,
  type DropdownOption,
} from '../../../components/ui';

interface QuizOption {
  quizId: string;
  label: string;
  date: string;
  type: string;
  courseName: string;
  openEndedQuestion: QuizQuestionViewModel | null;
  isFinished: boolean;
  studentCount: number;
  submittedCount: number;
}

type EnrichedAnalysis = SentimentAnalysisResponseDto & {
  quiz?: any;
  courseName?: string | null;
  questionText?: string | null;
  type?: string | null;
};

/**
 * Shared Sentiment Analysis Page Component
 *
 * This component can be used across multiple role-based layouts (Teacher, Dean, Speciality Head).
 * It provides AI-powered sentiment analysis of student responses to open-ended questions.
 *
 * Usage:
 * ```html
 * <app-sentiment-analysis-page [role]="'teacher'" />
 * <app-sentiment-analysis-page [role]="'dean'" />
 * <app-sentiment-analysis-page [role]="'speciality-head'" />
 * ```
 */
@Component({
  selector: 'app-sentiment-analysis-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    SpinnerComponent,
    AlertComponent,
    SelectComponent,
  ],
  templateUrl: './sentiment-analysis-page.html',
  styleUrls: ['./sentiment-analysis-page.scss'],
})
export class SentimentAnalysisPage implements OnInit {
  private readonly sentimentService = inject(SentimentAnalysisService);
  private readonly teacherApi = inject(TeacherApiService);
  private readonly deanApi = inject(DeanApiService);
  private readonly router = inject(Router);

  /**
   * The role context for this page. Affects available features and data access.
   */
  readonly role = input<'teacher' | 'dean' | 'speciality-head'>('teacher');

  /**
   * Optional title override. Defaults to "Sentiment Analysis".
   */
  readonly pageTitle = input<string>('Sentiment Analysis');

  /**
   * Optional subtitle override.
   */
  readonly pageSubtitle = input<string>(
    'Analyze student emotions and engagement in open-ended question responses using AI.'
  );

  // ============================================
  // State Signals
  // ============================================
  readonly isLoadingQuizzes = signal(true);
  readonly isAnalyzing = signal(false);
  readonly isLoadingExisting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly quizOptions = signal<QuizOption[]>([]);
  readonly selectedQuizId = signal<string | null>(null);
  readonly analysisResult = signal<SentimentAnalysisResponseDto | null>(null);
  readonly existingAnalyses = signal<SentimentAnalysisResponseDto[]>([]);


  readonly allAnalyses = signal<EnrichedAnalysis[]>([]);
  readonly isLoadingAllAnalyses = signal(false);

  // ============================================
  // Computed Properties
  // ============================================
  readonly selectedQuiz = computed(() => {
    const id = this.selectedQuizId();
    if (!id) return null;
    return this.quizOptions().find((q) => q.quizId === id) ?? null;
  });

  readonly quizSelectOptions = computed<DropdownOption[]>(() =>
    this.quizOptions().map((q) => ({
      value: q.quizId,
      label: `${q.label} (${q.date})`,
    }))
  );

  readonly canAnalyze = computed(() => {
    const quiz = this.selectedQuiz();
    return quiz && quiz.openEndedQuestion && quiz.isFinished && !this.isAnalyzing();
  });

  readonly result = computed<SentimentAnalysisResultDto | null>(() => {
    const analysis = this.analysisResult();
    if (!analysis || analysis.status !== 'COMPLETED') return null;
    return analysis.resultJson ?? null;
  });

  readonly sentimentColor = computed(() => {
    const res = this.result();
    if (!res) return 'neutral';
    switch (res.overallSentiment) {
      case 'POSITIVE':
        return 'success';
      case 'NEGATIVE':
        return 'error';
      case 'MIXED':
        return 'warning';
      default:
        return 'neutral';
    }
  });

  readonly sentimentIcon = computed(() => {
    const res = this.result();
    if (!res) return 'sentiment_neutral';
    switch (res.overallSentiment) {
      case 'POSITIVE':
        return 'sentiment_very_satisfied';
      case 'NEGATIVE':
        return 'sentiment_very_dissatisfied';
      case 'MIXED':
        return 'sentiment_dissatisfied';
      default:
        return 'sentiment_neutral';
    }
  });

  readonly confidencePercent = computed(() => {
    const res = this.result();
    return res ? Math.round(res.confidence * 100) : 0;
  });

  readonly sentimentScorePercent = computed(() => {
    const res = this.result();
    if (!res || res.sentimentScore === undefined) return 50;
    // Convert -1 to 1 range to 0-100
    return Math.round(((res.sentimentScore + 1) / 2) * 100);
  });

  readonly topEmotions = computed<SentimentEmotionDto[]>(() => {
    const res = this.result();
    if (!res?.emotions) return [];
    return [...res.emotions].sort((a, b) => b.score - a.score).slice(0, 5);
  });

  readonly themes = computed<SentimentThemeDto[]>(() => {
    const res = this.result();
    return res?.themes ?? [];
  });

  readonly concerns = computed<string[]>(() => {
    const res = this.result();
    return res?.concerns ?? [];
  });

  readonly insights = computed<string[]>(() => {
    const res = this.result();
    return res?.actionableInsights ?? [];
  });

  readonly answersAnalyzed = computed(() => {
    const res = this.result();
    if (!res) return { provided: 0, empty: 0, total: 0 };
    return {
      provided: res.counts.answersProvided,
      empty: res.counts.answersEmpty,
      total: res.counts.answersProvided + res.counts.answersEmpty,
    };
  });

  readonly hasExistingAnalysis = computed(() => this.existingAnalyses().length > 0);

  readonly latestExistingAnalysis = computed(() => {
    const analyses = this.existingAnalyses();
    return analyses.length > 0 ? analyses[0] : null;
  });

  ngOnInit(): void {
    this.loadQuizzes();
    this.loadAllAnalyses();
  }

  // ============================================
  // Data Loading
  // ============================================
  private async loadQuizzes(): Promise<void> {
    this.isLoadingQuizzes.set(true);
    this.errorMessage.set(null);

    try {
      // Determine effective role: prefer explicit input, but allow route-based detection
      const isDeanRole = this.role() === 'dean' || this.router.url.includes('/dean');

      // For dean and speciality-head, use dean API which can list institution-scoped quizzes.
      const quizzes = isDeanRole
        ? await firstValueFrom(this.deanApi.listQuizzes())
        : await firstValueFrom(this.teacherApi.getMyQuizzes());
      const now = new Date();

      // Filter and map quizzes with open-ended questions
      // Questions are accessed through CourseQuiz → CourseQuizQuestion → Question
      const options: QuizOption[] = quizzes
        .map((quiz) => {
          const openEnded = findOpenEndedQuestion(quiz) ?? null;
          const quizEnd = this.getQuizEndTime(quiz);
          const isFinished = quizEnd < now;

          // Get course name from courseQuizes
          const courseName =
            quiz.courseQuizes?.[0]?.course?.teachingUnit?.name ??
            quiz.courseQuizes?.[0]?.course?.classAcademicYear?.class?.name ??
            'Unknown Course';

          return {
            quizId: quiz.id,
            label: `${quiz.type} - ${courseName}`,
            date: this.formatDate(quiz.date),
            type: quiz.type,
            courseName,
            openEndedQuestion: openEnded,
            isFinished,
            studentCount: quiz.studentQuizes?.length ?? 0,
            submittedCount:
              quiz.studentQuizes?.filter((sq) => sq.status === 'SUBMITTED').length ?? 0,
          };
        })
        .filter((q) => q.openEndedQuestion !== null);

      this.quizOptions.set(options);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      this.errorMessage.set('Failed to load quizzes. Please try again.');
    } finally {
      this.isLoadingQuizzes.set(false);
    }
  }

  private async loadExistingAnalyses(quizId: string, questionId: string): Promise<void> {
    this.isLoadingExisting.set(true);

    try {
      const analyses = await firstValueFrom(
        this.sentimentService.getByQuiz(quizId, questionId)
      );
      this.existingAnalyses.set(analyses);

      // If there's an existing completed analysis, show it
      const completed = analyses.find((a) => a.status === 'COMPLETED');
      if (completed) {
        this.analysisResult.set(completed);
      }
    } catch (error) {
      console.error('Error loading existing analyses:', error);
      // Don't show error - just means no existing analyses
      this.existingAnalyses.set([]);
    } finally {
      this.isLoadingExisting.set(false);
    }
  }

  private async loadAllAnalyses(): Promise<void> {
    this.isLoadingAllAnalyses.set(true);
    try {
      const analyses = await firstValueFrom(this.sentimentService.getAll());
      // Enrich analyses with quiz metadata when possible
      const quizIds = Array.from(new Set(analyses.map((a) => a.quizId).filter(Boolean)));

      const isDeanRole = this.role() === 'dean' || this.router.url.includes('/dean');

      const quizMap: Record<string, any> = {};

      if (quizIds.length > 0) {
        if (isDeanRole) {
          try {
            const quizzes = await firstValueFrom(this.deanApi.listQuizzes());
            for (const q of quizzes) {
              if (q?.id) quizMap[q.id] = q;
            }
          } catch (err) {
            console.warn('Failed to load quizzes list for dean metadata enrichment', err);
          }
        } else {
          // For teachers, fetch each quiz individually (teacher-scoped)
          await Promise.all(
            quizIds.map(async (id) => {
              try {
                const q = await firstValueFrom(this.teacherApi.getQuiz(id));
                if (q?.id) quizMap[q.id] = q;
              } catch (err) {
                // ignore individual failures
              }
            })
          );
        }
      }

      // Attach found quiz metadata to the analyses objects (non-mutating copy)
      const enriched = analyses.map((a) => {
        const anyA = a as any;
        const quizFromMap = quizMap[a.quizId as string];
        const courseNameFromQuiz =
          quizFromMap?.courseQuizes?.[0]?.course?.teachingUnit?.name ??
          quizFromMap?.courseQuizes?.[0]?.course?.classAcademicYear?.class?.name ?? null;

        const questionText = anyA.questionText ?? anyA.resultJson?.question ?? anyA.resultJson?.summary ?? null;
        const quizType = quizFromMap?.type ?? anyA.type ?? null;

        return ({
          ...(anyA),
          quiz: anyA.quiz ?? quizFromMap ?? null,
          courseName: anyA.courseName ?? courseNameFromQuiz,
          questionText,
          type: quizType,
        } as EnrichedAnalysis);
      });

      this.allAnalyses.set(enriched);
    } catch (error) {
      console.error('Error loading all analyses:', error);
      this.allAnalyses.set([]);
    } finally {
      this.isLoadingAllAnalyses.set(false);
    }

  }

  // ============================================
  // Actions
  // ============================================
  onQuizSelected(quizId: string): void {
    this.selectedQuizId.set(quizId);
    this.analysisResult.set(null);
    this.existingAnalyses.set([]);
    this.errorMessage.set(null);

    // Load existing analyses for this quiz/question
    // Use questionId from the flattened view model
    const quiz = this.quizOptions().find((q) => q.quizId === quizId);
    if (quiz?.openEndedQuestion) {
      this.loadExistingAnalyses(quizId, quiz.openEndedQuestion.questionId);
    }
  }

  async runAnalysis(): Promise<void> {
    const quiz = this.selectedQuiz();
    if (!quiz?.openEndedQuestion) return;

    this.isAnalyzing.set(true);
    this.errorMessage.set(null);

    try {
      const result = await firstValueFrom(
        this.sentimentService.analyze({
          quizId: quiz.quizId,
          questionId: quiz.openEndedQuestion.questionId,
        })
      );

      this.analysisResult.set(result);

      // Add to existing analyses list
      this.existingAnalyses.update((list) => [result, ...list]);

      if (result.status === 'FAILED') {
        this.errorMessage.set(result.error ?? 'Analysis failed. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Error running sentiment analysis:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to run sentiment analysis. Please try again.';
      this.errorMessage.set(message);
    } finally {
      this.isAnalyzing.set(false);
    }
  }

  viewExistingAnalysis(analysis: SentimentAnalysisResponseDto): void {
    this.analysisResult.set(analysis);
  }

  // ============================================
  // Helpers
  // ============================================
  private getQuizEndTime(quiz: QuizDto): Date {
    const start = new Date(quiz.date);
    return new Date(start.getTime() + quiz.durationMinutes * 60_000);
  }

  private formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  formatDateTime(dateStr: string | null | undefined): string {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  getEmotionBarWidth(score: number): string {
    return `${Math.round(score * 100)}%`;
  }

  getEmotionColor(index: number): string {
    const colors = [
      'var(--color-primary-500)',
      'var(--color-success-500)',
      'var(--color-warning-500)',
      'var(--color-error-500)',
      'var(--color-info-500)',
    ];
    return colors[index % colors.length];
  }
}
