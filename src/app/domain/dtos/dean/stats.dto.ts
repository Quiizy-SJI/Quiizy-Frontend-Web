export interface DeanDashboardStatsScopeDto {
  academicYearId?: string;
}

export interface DeanDashboardStatsDto {
  scope: DeanDashboardStatsScopeDto;
  generatedAt: string;
  connections: { sse: number; ws: number };

  totals: {
    academicYears: number;
    classes: number;
    teachingUnits: number;
    teachers: number;
    students: number;
    quizzes: number;
    questions: number;
  };

  participation: {
    invited: number;
    inProgress: number;
    completed: number;
    missed: number;
  };

  scores: {
    averageRawScore?: number;
    averageTotalMarks?: number;
    averagePercent?: number;
    completedAttemptsWithScore: number;
  };
}
