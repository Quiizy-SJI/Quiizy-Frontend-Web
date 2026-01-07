import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { ApiClientService } from '../core/http/api-client.service';
import {
  toString,
  toStringRequired,
  toIntRequired,
  toInt,
  toStringArray,
  removeUndefined,
} from '../core/utils/payload-sanitizer';
import type { TeachingUnitDto } from '../domain/dtos/dean/dean-shared.dto';
import type {
  CourseDto,
  QuizDto,
  QuestionDto,
  CreateTeacherQuizDto,
  UpdateTeacherQuizDto,
  AddQuestionToQuizDto,
  UpdateMarkAllocationDto,
  QuizResultsResponseDto,
  TeachingUnitQuestionsDto,
  SelectQuestionForQuizDto,
  CreateAndAddQuestionDto,
  CreateQuestionBankDto,
  UpdateQuestionBankDto,
  InviteCollaboratorDto,
  AddCourseToQuizDto,
  QuizCollaboratorDto,
  DifficultyLevel,
} from '../domain/dtos/teacher/teacher-quiz.dto';
import type {
  CreateSentimentAnalysisDto,
  SentimentAnalysisResponseDto,
} from '../domain/dtos/teacher/teacher-sentiment.dto';

/**
 * Service for teacher quiz-related API calls.
 *
 * Business Logic:
 * - Questions exist in a reusable question bank (categorized by TeachingUnit)
 * - Any teacher can contribute questions to the bank at any time
 * - When creating a quiz, teachers select questions from the bank
 * - Mark allocation is quiz-specific (set in CourseQuizQuestion)
 * - Same question can be reused in multiple quizzes with different marks
 *
 * Draft/Publish Workflow:
 * - Quizzes are created as DRAFT by default
 * - Teachers can invite other teachers (course teachers) to collaborate
 * - Collaborators can add their CourseQuiz entries and questions
 * - Any collaborator can publish the quiz
 * - On publish, StudentQuiz entries are created for all students in linked courses
 */
@Injectable({
  providedIn: 'root',
})
export class TeacherApiService {
  private readonly basePath = '/teacher/quizzes';

  constructor(private readonly api: ApiClientService) {}

  // ============================================
  // Private Sanitization Helpers
  // ============================================

  /**
   * Sanitize a SelectQuestionForQuizDto before sending to backend.
   * Used when selecting existing questions from the bank.
   */
  private sanitizeSelectQuestion(q: SelectQuestionForQuizDto): SelectQuestionForQuizDto {
    return {
      questionId: toStringRequired(q.questionId),
      markAllocation: toIntRequired(q.markAllocation),
    };
  }

  /**
   * Sanitize a CreateAndAddQuestionDto before sending to backend.
   * Used when creating new questions inline with quiz creation.
   */
  private sanitizeNewQuestion(q: CreateAndAddQuestionDto): CreateAndAddQuestionDto {
    return {
      question: toStringRequired(q.question),
      type: toStringRequired(q.type) as CreateAndAddQuestionDto['type'],
      difficultyLevel: toStringRequired(q.difficultyLevel) as DifficultyLevel,
      teachingUnitId: toStringRequired(q.teachingUnitId),
      markAllocation: toIntRequired(q.markAllocation),
      proposedAnswers: q.proposedAnswers ? toStringArray(q.proposedAnswers) : undefined,
      correctAnswer: toString(q.correctAnswer),
    };
  }

  /**
   * Sanitize an AddQuestionToQuizDto before sending to backend.
   * Used when adding existing bank questions to a quiz.
   */
  private sanitizeAddQuestion(dto: AddQuestionToQuizDto): AddQuestionToQuizDto {
    return {
      questionId: toStringRequired(dto.questionId),
      markAllocation: toIntRequired(dto.markAllocation),
    };
  }

  // ============================================
  // Course Endpoints
  // ============================================

  /**
   * Get all courses assigned to the current teacher.
   * Route: GET /teacher/quizzes/courses
   */
  getMyCourses(): Observable<CourseDto[]> {
    return this.api.get<CourseDto[]>(`${this.basePath}/courses`);
  }

  /**
   * Get all teaching units for the teacher's courses.
   * Route: GET /teacher/quizzes/teaching-units
   */
  getMyTeachingUnits(): Observable<TeachingUnitDto[]> {
    return this.api.get<TeachingUnitDto[]>(`${this.basePath}/teaching-units`);
  }

  // ============================================
  // Quiz CRUD Endpoints
  // ============================================

  /**
   * Get all quizzes for teacher's courses (including collaborations).
   * Route: GET /teacher/quizzes
   */
  getMyQuizzes(): Observable<QuizDto[]> {
    return this.api.get<QuizDto[]>(this.basePath);
  }

  /**
   * Get all draft quizzes where the teacher is a collaborator.
   * Useful for showing "My Drafts" section in the UI.
   * Route: GET /teacher/quizzes/drafts
   */
  getDraftQuizzes(): Observable<QuizDto[]> {
    return this.api.get<QuizDto[]>(`${this.basePath}/drafts`);
  }

  /**
   * Create a new quiz for a course.
   *
   * Business Logic:
   * - Quiz is created as DRAFT by default
   * - Creator is automatically added as CREATOR collaborator
   * - At most 1 open-ended question is allowed per quiz
   * - Students are NOT invited until quiz is published
   * - Set publishImmediately=true to publish right away
   *
   * Route: POST /teacher/quizzes
   */
  createQuiz(dto: CreateTeacherQuizDto): Observable<QuizDto> {
    const payload: Record<string, unknown> = {
      courseId: toStringRequired(dto.courseId),
      type: toStringRequired(dto.type),
      lectures: toIntRequired(dto.lectures),
      date: toStringRequired(dto.date),
      durationMinutes: toIntRequired(dto.durationMinutes),
    };

    // Add selected questions from the bank (if any)
    if (dto.selectedQuestions?.length) {
      payload['selectedQuestions'] = dto.selectedQuestions.map((q) =>
        this.sanitizeSelectQuestion(q)
      );
    }

    // Add new questions to create in the bank (if any)
    if (dto.newQuestions?.length) {
      payload['newQuestions'] = dto.newQuestions.map((q) =>
        this.sanitizeNewQuestion(q)
      );
    }

    // Optionally publish immediately
    if (dto.publishImmediately !== undefined) {
      payload['publishImmediately'] = Boolean(dto.publishImmediately);
    }

    return this.api.post<QuizDto>(this.basePath, payload);
  }

  /**
   * Get a specific quiz by ID.
   * Teacher must be a collaborator OR own one of the linked courses.
   * Route: GET /teacher/quizzes/:quizId
   */
  getQuiz(quizId: string): Observable<QuizDto> {
    return this.api.get<QuizDto>(`${this.basePath}/${quizId}`);
  }

  /**
   * Update a quiz (only works on DRAFT quizzes).
   * Route: PATCH /teacher/quizzes/:quizId
   */
  updateQuiz(quizId: string, dto: UpdateTeacherQuizDto): Observable<QuizDto> {
    const payload: Record<string, unknown> = {};
    if (dto.type !== undefined) payload['type'] = String(dto.type);
    if (dto.lectures !== undefined) payload['lectures'] = toInt(dto.lectures);
    if (dto.date !== undefined) payload['date'] = String(dto.date);
    if (dto.durationMinutes !== undefined) payload['durationMinutes'] = toInt(dto.durationMinutes);
    return this.api.patch<QuizDto>(`${this.basePath}/${quizId}`, payload);
  }

  /**
   * Delete a quiz.
   * Route: DELETE /teacher/quizzes/:quizId
   */
  deleteQuiz(quizId: string): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(`${this.basePath}/${quizId}`);
  }

  // ============================================
  // Quiz Publish Endpoint
  // ============================================

  /**
   * Publish a quiz draft.
   *
   * Business Logic:
   * - Changes quiz status from DRAFT to PUBLISHED
   * - Creates StudentQuiz entries for all students in all linked courses
   * - Cannot be undone - quiz becomes read-only after publish
   * - Any collaborator can publish
   *
   * Route: POST /teacher/quizzes/:quizId/publish
   */
  publishQuiz(quizId: string): Observable<QuizDto> {
    return this.api.post<QuizDto>(`${this.basePath}/${quizId}/publish`, {});
  }

  // ============================================
  // Quiz Results Endpoints
  // ============================================

  /**
   * Get all student results for a quiz.
   * Returns StudentQuiz status and all StudentAnswers for each student.
   * Route: GET /teacher/quizzes/:quizId/results
   */
  getQuizResults(quizId: string): Observable<QuizResultsResponseDto> {
    return this.api.get<QuizResultsResponseDto>(`${this.basePath}/${quizId}/results`);
  }

  // ============================================
  // Quiz Question Management Endpoints
  // ============================================

  /**
   * Add an existing question from the bank to a quiz.
   *
   * Business Logic:
   * - Will fail if adding an open-ended question when one already exists
   * - Mark allocation is quiz-specific (same question can have different marks in different quizzes)
   *
   * Route: POST /teacher/quizzes/:quizId/questions
   */
  addQuestion(quizId: string, dto: AddQuestionToQuizDto): Observable<unknown> {
    const payload = this.sanitizeAddQuestion(dto);
    return this.api.post<unknown>(`${this.basePath}/${quizId}/questions`, payload);
  }

  /**
   * Update mark allocation for a question in a quiz.
   * Note: To update the question content, use the question bank update endpoint.
   * Route: PATCH /teacher/quizzes/:quizId/questions/:courseQuizQuestionId
   */
  updateQuizQuestion(
    quizId: string,
    courseQuizQuestionId: string,
    dto: UpdateMarkAllocationDto,
  ): Observable<unknown> {
    const payload = { markAllocation: toIntRequired(dto.markAllocation) };
    return this.api.patch<unknown>(
      `${this.basePath}/${quizId}/questions/${courseQuizQuestionId}`,
      payload,
    );
  }

  /**
   * Remove a question from a quiz (deletes CourseQuizQuestion link).
   * The question itself remains in the question bank for reuse.
   * Route: DELETE /teacher/quizzes/:quizId/questions/:courseQuizQuestionId
   */
  removeQuizQuestion(
    quizId: string,
    courseQuizQuestionId: string,
  ): Observable<{ deleted: boolean }> {
    return this.api.delete<{ deleted: boolean }>(
      `${this.basePath}/${quizId}/questions/${courseQuizQuestionId}`,
    );
  }

  // ============================================
  // Question Bank Endpoints
  // ============================================

  /**
   * Get all questions in the question bank for a teaching unit.
   * Use this to browse reusable questions when creating a quiz.
   * Route: GET /teacher/quizzes/teaching-units/:teachingUnitId/questions
   */
  getQuestionBank(teachingUnitId: string): Observable<TeachingUnitQuestionsDto> {
    return this.api.get<TeachingUnitQuestionsDto>(
      `${this.basePath}/teaching-units/${teachingUnitId}/questions`,
    );
  }

  /**
   * Create a new question in the question bank (teacher contribution).
   * Route: POST /teacher/quizzes/teaching-units/:teachingUnitId/questions
   */
  createQuestionInBank(dto: CreateQuestionBankDto): Observable<QuestionDto> {
    const payload: Record<string, unknown> = {
      question: toString(dto.question),
      type: toStringRequired(dto.type),
      difficultyLevel: toStringRequired(dto.difficultyLevel),
      teachingUnitId: toStringRequired(dto.teachingUnitId),
    };

    if (dto.proposedAnswers?.length) payload['proposedAnswers'] = toStringArray(dto.proposedAnswers);
    if (dto.correctAnswer !== undefined) payload['correctAnswer'] = toString(dto.correctAnswer);

    return this.api.post<QuestionDto>(
      `${this.basePath}/teaching-units/${payload['teachingUnitId']}/questions`,
      payload,
    );
  }

  /**
   * Update an existing question in the question bank.
   * Route: PATCH /teacher/quizzes/questions/:questionId
   */
  updateQuestionInBank(questionId: string, dto: Partial<UpdateQuestionBankDto>): Observable<QuestionDto> {
    const payload: Record<string, unknown> = {};
    if (dto.question !== undefined) payload['question'] = toString(dto.question);
    if (dto.type !== undefined) payload['type'] = toString(dto.type);
    if (dto.difficultyLevel !== undefined) payload['difficultyLevel'] = toString(dto.difficultyLevel);
    if (dto.proposedAnswers !== undefined) payload['proposedAnswers'] = toStringArray(dto.proposedAnswers as string[]);
    if (dto.correctAnswer !== undefined) payload['correctAnswer'] = toString(dto.correctAnswer);

    return this.api.patch<QuestionDto>(`${this.basePath}/questions/${questionId}`, payload);
  }

  /**
   * @deprecated Use getQuestionBank() instead.
   * This method is kept for backward compatibility.
   * Returns questions from the question bank for a teaching unit.
   */
  getTeachingUnitPastQuestions(teachingUnitId: string): Observable<TeachingUnitQuestionsDto> {
    return this.getQuestionBank(teachingUnitId);
  }

  // ============================================
  // Collaboration Endpoints
  // ============================================

  /**
   * Get all collaborators for a quiz.
   * Route: GET /teacher/quizzes/:quizId/collaborators
   */
  getCollaborators(quizId: string): Observable<QuizCollaboratorDto[]> {
    return this.api.get<QuizCollaboratorDto[]>(`${this.basePath}/${quizId}/collaborators`);
  }

  /**
   * Invite a teacher to collaborate on a quiz draft.
   *
   * Business Logic:
   * - Only works on DRAFT quizzes
   * - The invited teacher can add their own CourseQuiz entries
   * - Invited teacher becomes COLLABORATOR (can edit, add questions, publish)
   * - Teacher must have at least one course to be able to contribute
   *
   * Route: POST /teacher/quizzes/:quizId/collaborators
   */
  inviteCollaborator(quizId: string, dto: InviteCollaboratorDto): Observable<QuizDto> {
    const payload = { teacherId: toStringRequired(dto.teacherId) };
    return this.api.post<QuizDto>(`${this.basePath}/${quizId}/collaborators`, payload);
  }

  /**
   * Remove a collaborator from a quiz.
   *
   * Business Logic:
   * - Only the CREATOR can remove collaborators
   * - Cannot remove the creator themselves
   * - Also removes the collaborator's CourseQuiz entries from the quiz
   *
   * Route: DELETE /teacher/quizzes/:quizId/collaborators/:teacherId
   */
  removeCollaborator(quizId: string, teacherId: string): Observable<QuizDto> {
    return this.api.delete<QuizDto>(`${this.basePath}/${quizId}/collaborators/${teacherId}`);
  }

  // ============================================
  // Quiz Course Management Endpoints
  // ============================================

  /**
   * Add a course (CourseQuiz) to an existing quiz draft.
   *
   * Business Logic:
   * - The teacher must own the course and be a collaborator on the quiz
   * - Creates a new CourseQuiz entry linking the course to the quiz
   * - Questions can then be added to this CourseQuiz
   *
   * Route: POST /teacher/quizzes/:quizId/courses
   */
  addCourseToQuiz(quizId: string, dto: AddCourseToQuizDto): Observable<QuizDto> {
    const payload = { courseId: toStringRequired(dto.courseId) };
    return this.api.post<QuizDto>(`${this.basePath}/${quizId}/courses`, payload);
  }

  /**
   * Remove a course (CourseQuiz) from a quiz draft.
   *
   * Business Logic:
   * - Can only remove own course, or any course if creator
   * - Cannot remove if it's the last course on the quiz
   * - Also removes all questions linked through that CourseQuiz
   *
   * Route: DELETE /teacher/quizzes/:quizId/courses/:courseId
   */
  removeCourseFromQuiz(quizId: string, courseId: string): Observable<QuizDto> {
    return this.api.delete<QuizDto>(`${this.basePath}/${quizId}/courses/${courseId}`);
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
    const payload: Record<string, unknown> = {
      quizId: toStringRequired(dto.quizId),
      questionId: toStringRequired(dto.questionId),
    };
    if (dto.model) {
      payload['model'] = String(dto.model);
    }
    return this.api.post<SentimentAnalysisResponseDto>(
      '/teacher/sentiment-analyses',
      payload,
    );
  }
}
