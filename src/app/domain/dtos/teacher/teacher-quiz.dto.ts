import type { BaseEntityDto, TeachingUnitDto, UserDto } from '../dean/dean-shared.dto';

// ============================================
// Enums (matching backend)
// ============================================

export type QuizType = 'CA' | 'FINAL' | 'MOCK' | 'MEDIAN';

export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN_ENDED';

export type QuizParticipationStatus = 'INVITED' | 'STARTED' | 'SUBMITTED' | 'EXPIRED';

/**
 * Status of a Quiz in the draft/publish workflow.
 * - DRAFT: Quiz is being created/edited. Not visible to students.
 * - PUBLISHED: Quiz is visible to students. StudentQuiz entries created.
 */
export type QuizStatus = 'DRAFT' | 'PUBLISHED';

/**
 * Role of a teacher collaborator on a quiz.
 * - CREATOR: The teacher who originally created the quiz (has full control).
 * - COLLABORATOR: An invited teacher who can edit the quiz.
 */
export type CollaboratorRole = 'CREATOR' | 'COLLABORATOR';

/**
 * Difficulty level indicating which class levels a question is appropriate for.
 * E.g., LEVEL_3 means suitable for 3rd year students.
 */
export type DifficultyLevel = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';

// ============================================
// Course DTOs
// ============================================

export interface TeacherDto extends BaseEntityDto {
  user: UserDto;
}

export interface ClassDto {
  id: string;
  name: string;
  level?: string;
  speciality?: {
    id: string;
    name: string;
  }
}

export interface AcademicYearDto {
  id: string;
  start: string;
  end: string;
}

export interface ClassAcademicYearDto extends BaseEntityDto {
  class?: ClassDto;
  academicYear?: AcademicYearDto;
}

export interface CourseDto extends BaseEntityDto {
  level: string;
  credits: number;
  classAcademicYear?: ClassAcademicYearDto;
  teachingUnit?: TeachingUnitDto;
  teacher?: TeacherDto;
  courseQuizes?: CourseQuizDto[];
}

export interface CourseQuizDto extends BaseEntityDto {
  quiz?: QuizDto;
  course?: CourseDto;
  /** Questions linked to this course-quiz with mark allocations */
  courseQuizQuestions?: CourseQuizQuestionDto[];
}

/**
 * Link between a question and a course-quiz, with quiz-specific mark allocation.
 * Questions are reusable; mark allocation is quiz-specific.
 */
export interface CourseQuizQuestionDto extends BaseEntityDto {
  courseQuiz?: CourseQuizDto;
  question?: QuestionDto;
  /** The marks assigned to this question for this specific quiz */
  markAllocation: number;
}

// ============================================
// Quiz DTOs
// ============================================

/**
 * Quiz entity representing an exam/test.
 *
 * Business Logic:
 * - A Quiz can span multiple courses (multi-course exam)
 * - Quiz starts as DRAFT - teachers can collaborate and edit
 * - When PUBLISHED - StudentQuizzes are created for all students in linked courses
 * - Questions are NOT directly linked to Quiz, but through CourseQuiz → CourseQuizQuestion
 */
export interface QuizDto extends BaseEntityDto {
  type: QuizType;
  /** Current workflow status: DRAFT or PUBLISHED */
  status: QuizStatus;
  author: string;
  lectures: number;
  date: string;
  durationMinutes: number;
  /** When the quiz was published (null if still draft) */
  publishedAt?: string | null;
  /** The teacher who published the quiz */
  publishedBy?: TeacherDto | null;
  /** Student participation records */
  studentQuizes?: StudentQuizDto[];
  /** CourseQuiz entries linking courses to this quiz */
  courseQuizes?: CourseQuizDto[];
  /** Teachers who can collaborate on this quiz (while in DRAFT status) */
  collaborators?: QuizCollaboratorDto[];
}

/**
 * Question entity from the reusable question bank.
 *
 * Business Logic:
 * - Questions exist independently in a question bank
 * - Linked to a TeachingUnit for categorization
 * - Mark allocation is NOT on question - it's set per quiz in CourseQuizQuestion
 */
export interface QuestionDto extends BaseEntityDto {
  question: string;
  type: QuestionType;
  difficultyLevel: DifficultyLevel;
  proposedAnswers?: string[] | null;
  correctAnswer?: string | null;
  /** The teaching unit this question belongs to */
  teachingUnit?: TeachingUnitDto | null;
  /** The teacher who created this question */
  createdBy?: TeacherDto | null;
}

/**
 * Quiz collaborator - tracks teachers who can edit a quiz draft.
 */
export interface QuizCollaboratorDto extends BaseEntityDto {
  quiz?: QuizDto;
  teacher?: TeacherDto;
  /** CREATOR or COLLABORATOR */
  role: CollaboratorRole;
  invitedAt: string;
  /** The teacher who sent the invitation (null for CREATOR) */
  invitedBy?: TeacherDto | null;
}

export interface StudentQuizDto extends BaseEntityDto {
  student?: StudentDto;
  quiz?: QuizDto;
  status: QuizParticipationStatus;
  invitedAt?: string | null;
  startedAt?: string | null;
  submittedAt?: string | null;
  rawScore?: number | null;
  totalMarks?: number | null;
}

export interface StudentDto extends BaseEntityDto {
  matricule: string;
  isActive: boolean;
  user: UserDto;
}

// ============================================
// Create/Update DTOs (Requests)
// ============================================

/**
 * DTO for creating a question in the question bank.
 * Questions exist independently and can be reused across quizzes.
 * Mark allocation is NOT here - it's set when adding to a quiz.
 */
export interface CreateQuestionBankDto {
  question: string;
  type: QuestionType;
  difficultyLevel: DifficultyLevel;
  teachingUnitId: string;
  /** Required for SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE (not OPEN_ENDED) */
  proposedAnswers?: string[];
  /** Required for all types except OPEN_ENDED */
  correctAnswer?: string;
}

/**
 * DTO for updating a question in the question bank.
 */
export interface UpdateQuestionBankDto {
  question?: string;
  type?: QuestionType;
  difficultyLevel?: DifficultyLevel;
  proposedAnswers?: string[];
  correctAnswer?: string;
}

/**
 * DTO for selecting an existing question from the bank to add to a quiz.
 * Mark allocation is quiz-specific, not question-specific.
 */
export interface SelectQuestionForQuizDto {
  questionId: string;
  /** Marks for this question in this specific quiz */
  markAllocation: number;
}

/**
 * DTO for creating a new question AND adding it to a quiz in one step.
 * Convenience method that creates in bank and links to quiz.
 */
export interface CreateAndAddQuestionDto {
  question: string;
  type: QuestionType;
  difficultyLevel: DifficultyLevel;
  teachingUnitId: string;
  proposedAnswers?: string[];
  correctAnswer?: string;
  /** Marks for this question in this specific quiz */
  markAllocation: number;
}

/**
 * DTO for creating a quiz for a course.
 *
 * Business Logic:
 * - Quiz is created as DRAFT by default
 * - Creator is automatically added as CREATOR collaborator
 * - Questions can be selected from the bank OR created inline
 * - Students are NOT invited until quiz is published
 */
export interface CreateTeacherQuizDto {
  courseId: string;
  type: QuizType;
  lectures: number;
  date: string; // ISO date string
  durationMinutes: number;
  /** Questions selected from the existing question bank */
  selectedQuestions?: SelectQuestionForQuizDto[];
  /** New questions to create in the bank AND add to this quiz */
  newQuestions?: CreateAndAddQuestionDto[];
  /** If true, publishes the quiz immediately after creation */
  publishImmediately?: boolean;
}

export interface UpdateTeacherQuizDto {
  type?: QuizType;
  lectures?: number;
  date?: string;
  durationMinutes?: number;
}

/**
 * DTO for adding an existing question from the bank to a quiz.
 * Mark allocation is quiz-specific.
 */
export interface AddQuestionToQuizDto {
  questionId: string;
  markAllocation: number;
}

/**
 * DTO for updating mark allocation of a question in a quiz.
 * Note: To update the question content, use question bank update endpoint.
 */
export interface UpdateMarkAllocationDto {
  markAllocation: number;
}

/**
 * DTO for inviting a teacher to collaborate on a quiz draft.
 */
export interface InviteCollaboratorDto {
  teacherId: string;
}

/**
 * DTO for adding a course to a quiz draft.
 * The teacher must own the course and be a collaborator on the quiz.
 */
export interface AddCourseToQuizDto {
  courseId: string;
}

// ============================================
// Response DTOs
// ============================================

export interface StudentAnswerDto {
  questionId: string;
  questionText: string;
  questionType: QuestionType;
  answer: string;
  correctAnswer?: string | null;
  markObtained?: number | null;
  markAllocation: number;
}

export interface StudentQuizResultDto {
  studentId: string;
  studentName: string;
  studentMatricule: string;
  status: string;
  startedAt?: string | null;
  submittedAt?: string | null;
  rawScore?: number | null;
  totalMarks?: number | null;
  answers: StudentAnswerDto[];
}

export interface QuizResultsResponseDto {
  quizId: string;
  quizType: QuizType;
  quizDate: string;
  totalQuestions: number;
  totalMarks: number;
  studentResults: StudentQuizResultDto[];
}

export interface PastQuestionDto {
  questionId: string;
  question: string;
  type: QuestionType;
  proposedAnswers?: string[] | null;
  correctAnswer?: string | null;
  markAllocation: number;
  quizId: string;
  quizType: QuizType;
  quizDate: string;
  courseName: string;
}

export interface TeachingUnitPastQuestionsDto {
  teachingUnitId: string;
  teachingUnitName: string;
  questions: PastQuestionDto[];
}

// ============================================
// Question Bank Response DTOs
// ============================================

/**
 * Response DTO for questions in the question bank for a teaching unit.
 * Use this instead of TeachingUnitPastQuestionsDto (deprecated).
 */
export interface TeachingUnitQuestionsDto {
  teachingUnitId: string;
  teachingUnitName: string;
  questions: QuestionBankItemDto[];
}

/**
 * A question in the question bank with metadata.
 */
export interface QuestionBankItemDto {
  questionId: string;
  question: string;
  type: QuestionType;
  difficultyLevel: DifficultyLevel;
  proposedAnswers?: string[] | null;
  correctAnswer?: string | null;
  createdById?: string | null;
  createdByName?: string | null;
  createdAt: string;
  /** Number of quizzes this question has been used in */
  usageCount?: number;
}

// ============================================
// Flattened View Models (for UI convenience)
// ============================================

/**
 * Flattened question view model for UI display.
 * Combines QuestionDto with its quiz-specific markAllocation.
 *
 * Business Logic:
 * - Questions are reusable across quizzes
 * - Each quiz can assign different marks to the same question
 * - This ViewModel flattens the nested structure for easy display
 */
export interface QuizQuestionViewModel {
  /** CourseQuizQuestion ID (for updates/deletes) */
  courseQuizQuestionId: string;
  /** Original question ID in the bank */
  questionId: string;
  question: string;
  type: QuestionType;
  difficultyLevel: DifficultyLevel;
  proposedAnswers?: string[] | null;
  correctAnswer?: string | null;
  /** Quiz-specific mark allocation */
  markAllocation: number;
  /** Teaching unit name for display */
  teachingUnitName?: string;
}

// ============================================
// Utility Functions
// ============================================

/**
 * Extract all questions from a quiz with their mark allocations.
 *
 * Business Logic:
 * - Questions are nested: Quiz → CourseQuiz → CourseQuizQuestion → Question
 * - This utility flattens the structure for UI components
 * - Each question may appear multiple times if linked through different CourseQuiz entries
 *
 * @param quiz The quiz DTO with courseQuizes relation loaded
 * @returns Array of flattened question view models
 */
export function getQuizQuestions(quiz: QuizDto | null | undefined): QuizQuestionViewModel[] {
  if (!quiz?.courseQuizes) return [];

  const questions: QuizQuestionViewModel[] = [];

  for (const courseQuiz of quiz.courseQuizes) {
    for (const cqq of courseQuiz.courseQuizQuestions ?? []) {
      if (cqq.question) {
        questions.push({
          courseQuizQuestionId: cqq.id,
          questionId: cqq.question.id,
          question: cqq.question.question,
          type: cqq.question.type,
          difficultyLevel: cqq.question.difficultyLevel,
          proposedAnswers: cqq.question.proposedAnswers,
          correctAnswer: cqq.question.correctAnswer,
          markAllocation: cqq.markAllocation,
          teachingUnitName: cqq.question.teachingUnit?.name,
        });
      }
    }
  }

  return questions;
}

/**
 * Get the total question count for a quiz.
 * Counts unique questions across all CourseQuiz entries.
 *
 * @param quiz The quiz DTO with courseQuizes relation loaded
 * @returns Number of questions
 */
export function getQuizQuestionCount(quiz: QuizDto | null | undefined): number {
  return getQuizQuestions(quiz).length;
}

/**
 * Find an open-ended question in a quiz (at most 1 allowed per quiz).
 *
 * @param quiz The quiz DTO with courseQuizes relation loaded
 * @returns The open-ended question or undefined
 */
export function findOpenEndedQuestion(quiz: QuizDto | null | undefined): QuizQuestionViewModel | undefined {
  return getQuizQuestions(quiz).find((q) => q.type === 'OPEN_ENDED');
}

/**
 * Calculate total marks for a quiz.
 *
 * @param quiz The quiz DTO with courseQuizes relation loaded
 * @returns Sum of all mark allocations
 */
export function calculateQuizTotalMarks(quiz: QuizDto | null | undefined): number {
  return getQuizQuestions(quiz).reduce((sum, q) => sum + q.markAllocation, 0);
}

/**
 * Check if a quiz is in draft status.
 */
export function isQuizDraft(quiz: QuizDto | null | undefined): boolean {
  return quiz?.status === 'DRAFT';
}

/**
 * Check if a quiz is published.
 */
export function isQuizPublished(quiz: QuizDto | null | undefined): boolean {
  return quiz?.status === 'PUBLISHED';
}

// ============================================
// Legacy Type Aliases (for backward compatibility)
// ============================================

/**
 * @deprecated Use CreateAndAddQuestionDto instead.
 * Alias for backward compatibility with existing code.
 */
export type CreateQuestionDto = CreateAndAddQuestionDto;

/**
 * @deprecated Use UpdateQuestionBankDto instead.
 * Alias for backward compatibility with existing code.
 */
export type UpdateQuestionDto = UpdateQuestionBankDto;

