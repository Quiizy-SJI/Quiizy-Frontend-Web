import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { ApiClientService } from '../core/http/api-client.service';
import type { TeachingUnitDto } from '../domain/dtos/dean/dean-shared.dto';
import type {
  CourseDto,
  QuizDto,
  QuestionDto,
  CreateTeacherQuizDto,
  UpdateTeacherQuizDto,
  AddQuestionToQuizDto,
  UpdateQuestionDto,
  QuizResultsResponseDto,
  TeachingUnitPastQuestionsDto,
} from '../domain/dtos/teacher/teacher-quiz.dto';
import type {
  CreateSentimentAnalysisDto,
  SentimentAnalysisResponseDto,
} from '../domain/dtos/teacher/teacher-sentiment.dto';

/**
 * Service for teacher quiz-related API calls.
 * Follows the same pattern as DeanApiService.
 */
@Injectable({
  providedIn: 'root',
})
export class TeacherApiService {
  private readonly basePath = '/teacher/quizzes';

  constructor(private readonly api: ApiClientService) {}

  // ============================================
  // Course Endpoints
  // ============================================

  /**
   * Get all courses assigned to the current teacher.
   */
  getMyCourses(): Observable<CourseDto[]> {
    return this.api.get<CourseDto[]>(`${this.basePath}/courses`);
  }

  /**
   * Get all teaching units for the teacher's courses.
   */
  getMyTeachingUnits(): Observable<TeachingUnitDto[]> {
    return this.api.get<TeachingUnitDto[]>(`${this.basePath}/teaching-units`);
  }

  // ============================================
  // Quiz CRUD Endpoints
  // ============================================

  /**
   * Get all quizzes for teacher's courses.
   */
  getMyQuizzes(): Observable<QuizDto[]> {
    return this.api.get<QuizDto[]>(this.basePath);
  }

  /**
   * Create a new quiz for a course.
   * Note: At most 1 open-ended question is allowed per quiz.
   * All students in the course's class are automatically invited.
   */
  createQuiz(dto: CreateTeacherQuizDto): Observable<QuizDto> {
    return this.api.post<QuizDto>(this.basePath, dto);
  }

  /**
   * Get a specific quiz by ID.
   */
  getQuiz(quizId: string): Observable<QuizDto> {
    return this.api.get<QuizDto>(`${this.basePath}/${quizId}`);
  }

  /**
   * Update a quiz.
   */
  updateQuiz(quizId: string, dto: UpdateTeacherQuizDto): Observable<QuizDto> {
    return this.api.patch<QuizDto>(`${this.basePath}/${quizId}`, dto);
  }

  /**
   * Delete a quiz.
   */
  deleteQuiz(quizId: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`${this.basePath}/${quizId}`);
  }

  // ============================================
  // Quiz Results Endpoints
  // ============================================

  /**
   * Get all student results for a quiz.
   * Returns StudentQuiz status and all StudentAnswers for each student.
   */
  getQuizResults(quizId: string): Observable<QuizResultsResponseDto> {
    return this.api.get<QuizResultsResponseDto>(`${this.basePath}/${quizId}/results`);
  }

  // ============================================
  // Question CRUD Endpoints
  // ============================================

  /**
   * Add a question to an existing quiz.
   * Note: Will fail if adding an open-ended question when one already exists.
   */
  addQuestion(quizId: string, dto: AddQuestionToQuizDto): Observable<QuestionDto> {
    return this.api.post<QuestionDto>(`${this.basePath}/${quizId}/questions`, dto);
  }

  /**
   * Update a question in a quiz.
   */
  updateQuestion(
    quizId: string,
    questionId: string,
    dto: UpdateQuestionDto,
  ): Observable<QuestionDto> {
    return this.api.patch<QuestionDto>(
      `${this.basePath}/${quizId}/questions/${questionId}`,
      dto,
    );
  }

  /**
   * Delete a question from a quiz.
   */
  deleteQuestion(quizId: string, questionId: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(
      `${this.basePath}/${quizId}/questions/${questionId}`,
    );
  }

  // ============================================
  // Past Questions / Question Bank Endpoints
  // ============================================

  /**
   * Get all past questions from quizzes in a teaching unit.
   * Returns questions from all past quizzes across teacher's courses
   * in the specified teaching unit.
   */
  getTeachingUnitPastQuestions(
    teachingUnitId: string,
  ): Observable<TeachingUnitPastQuestionsDto> {
    return this.api.get<TeachingUnitPastQuestionsDto>(
      `${this.basePath}/teaching-units/${teachingUnitId}/past-questions`,
    );
  }

  // ============================================
  // Sentiment Analysis Endpoints
  // ============================================

  /**
   * Run sentiment analysis on an open-ended question's responses.
   * The quiz must be finished (past date + duration).
   * POST /teacher/sentiment-analyses
   */
  analyzeSentiment(dto: CreateSentimentAnalysisDto): Observable<SentimentAnalysisResponseDto> {
    return this.api.post<SentimentAnalysisResponseDto>('/teacher/sentiment-analyses', dto);
  }
}
