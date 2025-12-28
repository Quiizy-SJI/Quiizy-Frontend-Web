export interface DeanAiAnalyticsDto {
  generatedAt: string;
  insights: {
    hardestQuestions: Array<{
      questionId: string;
      avgMark: number;
      attempts: number;
    }>;
  };
}
