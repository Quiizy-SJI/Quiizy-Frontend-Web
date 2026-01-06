/**
 * Real-time event types - mirrored from backend.
 * Keep in sync with quizzy-backend-api/src/dtos/events/event-types.enum.ts
 */
export enum EventType {
  // Connection events
  CONNECTED = 'connected',
  HEARTBEAT = 'heartbeat',

  // Quiz lifecycle events
  QUIZ_CREATED = 'quiz:created',
  QUIZ_UPDATED = 'quiz:updated',
  QUIZ_DELETED = 'quiz:deleted',
  QUIZ_STARTED = 'quiz:started',
  QUIZ_ENDED = 'quiz:ended',

  // Quiz participation events
  QUIZ_PARTICIPANT_JOINED = 'quiz:participant:joined',
  QUIZ_PARTICIPANT_LEFT = 'quiz:participant:left',
  QUIZ_PARTICIPANT_READY = 'quiz:participant:ready',

  // Question events
  QUESTION_CREATED = 'question:created',
  QUESTION_UPDATED = 'question:updated',
  QUESTION_DELETED = 'question:deleted',
  QUESTION_REVEALED = 'question:revealed',

  // Answer events
  ANSWER_SUBMITTED = 'answer:submitted',
  ANSWER_GRADED = 'answer:graded',

  // Score/Result events
  SCORE_UPDATED = 'score:updated',
  LEADERBOARD_UPDATED = 'leaderboard:updated',
  RESULTS_PUBLISHED = 'results:published',

  // Student events
  STUDENT_UPDATED = 'student:updated',

  // Notification events
  NOTIFICATION = 'notification',
  ANNOUNCEMENT = 'announcement',
}

/**
 * Base event payload structure for all real-time events.
 */
export interface BaseEventPayload<T = unknown> {
  type: EventType | string;
  timestamp: string;
  eventId: string;
  correlationId?: string;
  data: T;
}

// ============ Quiz Event Payloads ============

export interface QuizEventData {
  quizId: string;
  title: string;
  type?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  questionCount?: number;
  courseId?: string;
  courseName?: string;
}

export interface QuizParticipantEventData {
  quizId: string;
  participantId: string;
  participantName: string;
  participantCount: number;
  joinedAt?: string;
}

export interface QuizStartedEventData {
  quizId: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalQuestions: number;
}

// ============ Question Event Payloads ============

export interface QuestionEventData {
  questionId: string;
  quizId: string;
  questionNumber?: number;
  questionText?: string;
  questionType?: string;
  points?: number;
  timeLimit?: number;
  options?: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuestionRevealedEventData extends QuestionEventData {
  correctOptionId?: string;
  explanation?: string;
}

// ============ Answer Event Payloads ============

export interface AnswerGradedEventData {
  quizId: string;
  questionId: string;
  studentId: string;
  isCorrect: boolean;
  pointsAwarded: number;
  totalScore: number;
}

// ============ Score/Result Event Payloads ============

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  score: number;
  correctAnswers: number;
  completionTime?: number;
}

export interface LeaderboardUpdateEventData {
  quizId: string;
  entries: LeaderboardEntry[];
  updatedAt: string;
}

// ============ Notification Payloads ============

export interface NotificationEventData {
  notificationId: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  actionUrl?: string;
  expiresAt?: string;
}
