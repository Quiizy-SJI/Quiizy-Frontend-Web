// ============================================
// Sentiment Analysis DTOs
// Aligned with backend sentiment-analysis.entity.ts
// and sentiment-analysis-result-v1.type.ts
// ============================================

/**
 * Overall sentiment label from AI analysis
 */
export type SentimentOverallLabel = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'MIXED';

/**
 * Status of sentiment analysis
 */
export type SentimentAnalysisStatus = 'COMPLETED' | 'FAILED';

/**
 * Emotion detected in student responses
 */
export interface SentimentEmotionDto {
  label: string;
  score: number; // 0.0 - 1.0
}

/**
 * Theme identified in student responses
 */
export interface SentimentThemeDto {
  theme: string;
  frequency: number;
  examples?: string[];
}

/**
 * Counts of answers analyzed
 */
export interface SentimentCountsDto {
  answersProvided: number;
  answersEmpty: number;
}

/**
 * The AI-generated sentiment analysis result
 */
export interface SentimentAnalysisResultDto {
  overallSentiment: SentimentOverallLabel;
  sentimentScore?: number; // -1.0 to 1.0
  summary: string;
  emotions?: SentimentEmotionDto[];
  themes?: SentimentThemeDto[];
  concerns?: string[];
  actionableInsights?: string[];
  confidence: number; // 0.0 - 1.0
  counts: SentimentCountsDto;
}

/**
 * Request DTO for creating a sentiment analysis
 */
export interface CreateSentimentAnalysisDto {
  quizId: string;
  questionId: string;
  model?: string;
}

/**
 * Response from POST /teacher/sentiment-analyses
 */
export interface SentimentAnalysisResponseDto {
  id: string;
  quizId: string;
  questionId: string;
  promptVersion: string;
  model: string;
  status: SentimentAnalysisStatus;
  answersCount: number;
  emptyAnswersCount: number;
  requestedByEntityId?: string | null;
  analyzedAt?: string | null;
  resultJson?: SentimentAnalysisResultDto | null;
  resultText?: string | null;
  error?: string | null;
  createdAt: string;
  updatedAt: string;
  // Optional runtime-enriched fields used by the UI
  quiz?: any;
  courseName?: string | null;
  questionText?: string | null;
  type?: string | null;
}

/**
 * Quiz with open-ended question for sentiment analysis
 */
export interface QuizWithOpenEndedDto {
  quizId: string;
  quizType: string;
  quizDate: string;
  courseName: string;
  className: string;
  openEndedQuestion: {
    questionId: string;
    questionText: string;
    markAllocation: number;
  };
  totalStudents: number;
  submittedCount: number;
}
