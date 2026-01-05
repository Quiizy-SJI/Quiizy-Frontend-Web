import type { BaseEntityDto, TeachingUnitDto, UserDto } from '../dean/dean-shared.dto';

// ============================================
// Enums (matching backend)
// ============================================

export type QuizType = 'CA' | 'FINAL' | 'MOCK' | 'MEDIAN';

export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN_ENDED';

export type QuizParticipationStatus = 'INVITED' | 'STARTED' | 'SUBMITTED' | 'EXPIRED';

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
}

// ============================================
// Quiz DTOs
// ============================================

export interface QuizDto extends BaseEntityDto {
  type: QuizType;
  author: string;
  lectures: number;
  date: string;
  durationMinutes: number;
  questions?: QuestionDto[];
  studentQuizes?: StudentQuizDto[];
  courseQuizes?: CourseQuizDto[];
}

export interface QuestionDto extends BaseEntityDto {
  question: string;
  type: QuestionType;
  proposedAnswers?: string[] | null;
  correctAnswer?: string | null;
  markAllocation: number;
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

export interface CreateQuestionDto {
  question: string;
  type: QuestionType;
  proposedAnswers?: string[];
  correctAnswer?: string;
  markAllocation: number;
}

export interface CreateTeacherQuizDto {
  courseId: string;
  type: QuizType;
  lectures: number;
  date: string; // ISO date string
  durationMinutes: number;
  questions: CreateQuestionDto[];
}

export interface UpdateTeacherQuizDto {
  type?: QuizType;
  lectures?: number;
  date?: string;
  durationMinutes?: number;
}

export interface AddQuestionToQuizDto {
  question: string;
  type: QuestionType;
  proposedAnswers?: string[];
  correctAnswer?: string;
  markAllocation: number;
}

export interface UpdateQuestionDto {
  question?: string;
  type?: QuestionType;
  proposedAnswers?: string[];
  correctAnswer?: string;
  markAllocation?: number;
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
