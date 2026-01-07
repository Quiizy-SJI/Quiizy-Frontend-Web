import { Injectable, computed, signal } from '@angular/core';
import { Observable, catchError, finalize, of, tap, map } from 'rxjs';

import { ApiClientService } from '../core/http/api-client.service';
import { toStringRequired } from '../core/utils/payload-sanitizer';
import type {
  CreateSentimentAnalysisDto,
  SentimentAnalysisResponseDto,
} from '../domain/dtos/teacher/teacher-sentiment.dto';

/**
 * Query parameters for fetching sentiment analyses
 */
export interface SentimentAnalysisQueryParams {
  quizId: string;
  questionId?: string;
}

/**
 * State for a single sentiment analysis operation
 */
export interface SentimentAnalysisState {
  loading: boolean;
  error: string | null;
  data: SentimentAnalysisResponseDto | null;
}

/**
 * Service for AI sentiment analysis operations.
 * Provides both Observable-based methods and signal-based state management.
 *
 * Backend Endpoints:
 * - GET /teacher/sentiment-analyses?quizId=xxx&questionId=yyy
 * - GET /teacher/sentiment-analyses/:id
 * - POST /teacher/sentiment-analyses
 */
@Injectable({
  providedIn: 'root',
})
export class SentimentAnalysisService {
  private readonly basePath = '/teacher/sentiment-analyses';

  // Signal-based state for current analysis
  private readonly analysisState = signal<SentimentAnalysisState>({
    loading: false,
    error: null,
    data: null,
  });

  // Signal-based state for analysis list
  private readonly analysesListState = signal<{
    loading: boolean;
    error: string | null;
    data: SentimentAnalysisResponseDto[];
  }>({
    loading: false,
    error: null,
    data: [],
  });

  // Public readonly signals
  readonly analysis = computed(() => this.analysisState().data);
  readonly analysisLoading = computed(() => this.analysisState().loading);
  readonly analysisError = computed(() => this.analysisState().error);

  readonly analysesList = computed(() => this.analysesListState().data);
  readonly analysesListLoading = computed(() => this.analysesListState().loading);
  readonly analysesListError = computed(() => this.analysesListState().error);

  // Computed signal for checking if analysis is available
  readonly hasAnalysis = computed(() => this.analysisState().data !== null);
  readonly isAnalysisCompleted = computed(
    () => this.analysisState().data?.status === 'COMPLETED',
  );

  constructor(private readonly api: ApiClientService) {}

  // ============================================
  // Observable-based Methods (Default)
  // ============================================

  /**
   * Get a sentiment analysis by ID.
   * GET /teacher/sentiment-analyses/:id
   */
  getById(id: string): Observable<SentimentAnalysisResponseDto> {
    return this.api.get<SentimentAnalysisResponseDto>(`${this.basePath}/${id}`);
  }

  /**
   * Get sentiment analyses for a quiz, optionally filtered by question.
   * GET /teacher/sentiment-analyses?quizId=xxx&questionId=yyy
   *
   * @param quizId - Required quiz ID
   * @param questionId - Optional question ID filter
   * @returns Array of sentiment analyses (most recent first)
   */
  getByQuiz(
    quizId: string,
    questionId?: string,
  ): Observable<SentimentAnalysisResponseDto[]> {
    const params: Record<string, string> = { quizId };
    if (questionId) {
      params['questionId'] = questionId;
    }
    return this.api.get<SentimentAnalysisResponseDto[]>(this.basePath, { params });
  }

  /**
   * Get the most recent sentiment analysis for a specific quiz and question.
   * Returns null if no analysis exists.
   */
  getByQuizAndQuestion(
    quizId: string,
    questionId: string,
  ): Observable<SentimentAnalysisResponseDto | null> {
    return this.getByQuiz(quizId, questionId).pipe(
      map((analyses) => (analyses.length > 0 ? analyses[0] : null)),
    );
  }

  /**
   * Run sentiment analysis on an open-ended question's responses.
   * The quiz must be finished (past date + duration).
   * POST /teacher/sentiment-analyses
   */
  analyze(dto: CreateSentimentAnalysisDto): Observable<SentimentAnalysisResponseDto> {
    const payload: Record<string, unknown> = {
      quizId: toStringRequired(dto.quizId),
      questionId: toStringRequired(dto.questionId),
    };
    if (dto.model) {
      payload['model'] = String(dto.model);
    }
    return this.api.post<SentimentAnalysisResponseDto>(this.basePath, payload);
  }

  /**
   * Get all sentiment analyses (site/instructor scope) — maps to /all endpoint
   */
  getAll(): Observable<SentimentAnalysisResponseDto[]> {
    return this.api.get<SentimentAnalysisResponseDto[]>(`${this.basePath}/all/analysis`);
  }

  // ============================================
  // Signal-based Methods
  // ============================================

  /**
   * Load a sentiment analysis by ID and update state signal.
   */
  loadAnalysis(id: string): void {
    this.analysisState.set({ loading: true, error: null, data: null });

    this.getById(id)
      .pipe(
        tap((data) => {
          this.analysisState.set({ loading: false, error: null, data });
        }),
        catchError((error) => {
          const message = error?.error?.message || 'Failed to load sentiment analysis';
          this.analysisState.set({ loading: false, error: message, data: null });
          return of(null);
        }),
      )
      .subscribe();
  }

  /**
   * Load sentiment analyses for a quiz and update list state signal.
   */
  loadAnalysesList(quizId: string, questionId?: string): void {
    this.analysesListState.set({ loading: true, error: null, data: [] });

    this.getByQuiz(quizId, questionId)
      .pipe(
        tap((data) => {
          this.analysesListState.set({ loading: false, error: null, data });
        }),
        catchError((error) => {
          const message = error?.error?.message || 'Failed to load sentiment analyses';
          this.analysesListState.set({ loading: false, error: message, data: [] });
          return of([]);
        }),
      )
      .subscribe();
  }

  /**
   * Run sentiment analysis and update state signal.
   * Returns an Observable for additional handling if needed.
   */
  runAnalysis(dto: CreateSentimentAnalysisDto): Observable<SentimentAnalysisResponseDto> {
    this.analysisState.set({ loading: true, error: null, data: null });

    return this.analyze(dto).pipe(
      tap((data) => {
        this.analysisState.set({ loading: false, error: null, data });
      }),
      catchError((error) => {
        const message =
          error?.error?.message || 'Failed to run sentiment analysis';
        this.analysisState.set({
          loading: false,
          error: message,
          data: null,
        });
        throw error;
      }),
    );
  }

  /**
   * Check if analysis exists for a quiz/question and load it.
   * If not found, the state will have null data (not an error).
   */
  loadExistingAnalysis(quizId: string, questionId: string): void {
    this.analysisState.set({ loading: true, error: null, data: null });

    this.getByQuizAndQuestion(quizId, questionId)
      .pipe(
        tap((data) => {
          this.analysisState.set({ loading: false, error: null, data });
        }),
        catchError((error) => {
          // 404 means no analysis exists - not an error state
          if (error?.status === 404) {
            this.analysisState.set({ loading: false, error: null, data: null });
            return of(null);
          }
          const message = error?.error?.message || 'Failed to check for existing analysis';
          this.analysisState.set({ loading: false, error: message, data: null });
          return of(null);
        }),
      )
      .subscribe();
  }

  /**
   * Clear the current analysis state.
   */
  clearAnalysis(): void {
    this.analysisState.set({ loading: false, error: null, data: null });
  }

  /**
   * Clear the analyses list state.
   */
  clearAnalysesList(): void {
    this.analysesListState.set({ loading: false, error: null, data: [] });
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Get a human-readable label for the sentiment status.
   */
  getSentimentLabel(sentiment: string): string {
    const labels: Record<string, string> = {
      POSITIVE: 'Positive',
      NEUTRAL: 'Neutral',
      NEGATIVE: 'Negative',
      MIXED: 'Mixed',
    };
    return labels[sentiment] || sentiment;
  }

  /**
   * Get CSS class for sentiment badge styling.
   */
  getSentimentClass(sentiment: string): string {
    const classes: Record<string, string> = {
      POSITIVE: 'sentiment-positive',
      NEUTRAL: 'sentiment-neutral',
      NEGATIVE: 'sentiment-negative',
      MIXED: 'sentiment-mixed',
    };
    return classes[sentiment] || '';
  }

  /**
   * Format confidence score as percentage.
   */
  formatConfidence(confidence: number): string {
    return `${Math.round(confidence * 100)}%`;
  }

  /**
   * Format sentiment score (-1 to 1) as a human-readable value.
   */
  formatSentimentScore(score: number | undefined): string {
    if (score === undefined) return 'N/A';
    const percentage = Math.round((score + 1) * 50); // Convert -1..1 to 0..100
    return `${percentage}%`;
  }
}
