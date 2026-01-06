export interface SentimentAlert {
  student: string;
  department: string;
  exam: string;
  mood: string;
  moodPercentage: number;
  flagged: string;
  severity: 'critical' | 'warning';
}

export interface Keyword {
  text: string;
  count: number;
}