/**
 * Comprehensive Statistics DTOs
 * Provides meaningful insights for Dean, Speciality Heads, and Teachers
 */

// ============================================
// Base Types & Enums
// ============================================

export type TimeRange = 'week' | 'month' | 'semester' | 'year' | 'all';
export type TrendDirection = 'up' | 'down' | 'stable';
export type PerformanceLevel = 'excellent' | 'good' | 'average' | 'below' | 'failing';

// ============================================
// Core KPI Types
// ============================================

export interface KpiMetric {
  value: number;
  label: string;
  change?: number; // Percentage change from previous period
  trend?: TrendDirection;
  unit?: string; // e.g., '%', 'students', 'quizzes'
}

export interface KpiCard {
  title: string;
  metric: KpiMetric;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  description?: string;
}

// ============================================
// Demographics DTOs
// ============================================

export interface DemographicBreakdown {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

export interface StudentDemographicsDto {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  bySpeciality: DemographicBreakdown[];
  byLevel: DemographicBreakdown[];
  byClass: DemographicBreakdown[];
  newEnrollmentsThisMonth: number;
}

export interface TeacherDemographicsDto {
  totalTeachers: number;
  bySpeciality: DemographicBreakdown[];
  teachersWithCourses: number;
  teachersWithoutCourses: number;
  averageCoursesPerTeacher: number;
}

// ============================================
// Academic Performance DTOs
// ============================================

export interface ScoreDistributionBucket {
  range: string; // e.g., '90-100', '80-89'
  label: PerformanceLevel;
  count: number;
  percentage: number;
}

export interface ScoreDistributionDto {
  buckets: ScoreDistributionBucket[];
  totalAssessed: number;
  averageScore: number;
  medianScore: number;
  standardDeviation: number;
  highestScore: number;
  lowestScore: number;
}

export interface PerformanceTrendPoint {
  period: string; // e.g., 'Jan 2026', 'Week 1'
  averageScore: number;
  participationRate: number;
  completionRate: number;
  studentCount: number;
}

export interface PerformanceTrendsDto {
  timeRange: TimeRange;
  dataPoints: PerformanceTrendPoint[];
  overallTrend: TrendDirection;
  percentageChange: number;
}

// ============================================
// Quiz Analytics DTOs
// ============================================

export interface QuizTypeBreakdown {
  type: string; // CA, FINAL, MOCK, MEDIAN
  count: number;
  percentage: number;
  averageScore: number;
  completionRate: number;
}

export interface QuizDifficultyMetric {
  quizId: string;
  quizType: string;
  courseName?: string;
  averageScore: number;
  completionRate: number;
  failureRate: number;
  attemptCount: number;
}

export interface QuizAnalyticsDto {
  totalQuizzes: number;
  activeQuizzes: number;
  completedQuizzes: number;
  byType: QuizTypeBreakdown[];
  hardestQuizzes: QuizDifficultyMetric[];
  easiestQuizzes: QuizDifficultyMetric[];
  averageCompletionRate: number;
  averageDuration: number;
}

export interface QuestionDifficultyDto {
  questionId: string;
  questionText: string;
  type: string;
  averageScore: number;
  attemptCount: number;
  correctRate: number;
  courseName?: string;
}

// ============================================
// Participation Analytics DTOs
// ============================================

export interface ParticipationStatusBreakdown {
  status: string; // INVITED, STARTED, SUBMITTED, EXPIRED
  count: number;
  percentage: number;
}

export interface ParticipationAnalyticsDto {
  totalInvitations: number;
  totalParticipants: number;
  participationRate: number;
  completionRate: number;
  byStatus: ParticipationStatusBreakdown[];
  averageTimeToStart: number; // minutes
  averageCompletionTime: number; // minutes
}

// ============================================
// Comparative Analysis DTOs
// ============================================

export interface EntityPerformance {
  id: string;
  name: string;
  studentCount: number;
  quizCount: number;
  averageScore: number;
  completionRate: number;
  participationRate: number;
  trend: TrendDirection;
}

export interface ComparativeAnalysisDto {
  bySpeciality: EntityPerformance[];
  byLevel: EntityPerformance[];
  byClass: EntityPerformance[];
  byTeachingUnit: EntityPerformance[];
  topPerformers: EntityPerformance[];
  needsAttention: EntityPerformance[];
}

// ============================================
// Sentiment Analytics DTOs (AI-powered)
// ============================================

export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

export interface SentimentTrendPoint {
  period: string;
  sentiment: SentimentBreakdown;
  sampleSize: number;
}

export interface SentimentAnalyticsDto {
  overall: SentimentBreakdown;
  byQuizType: Array<{
    type: string;
    sentiment: SentimentBreakdown;
    sampleSize: number;
  }>;
  trends: SentimentTrendPoint[];
  insights: string[];
}

// ============================================
// Alerts & Recommendations DTOs
// ============================================

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertCategory = 'performance' | 'participation' | 'engagement' | 'deadline';

export interface StatisticsAlert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  entityType?: string; // 'class', 'student', 'quiz'
  entityId?: string;
  entityName?: string;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: string;
  actionUrl?: string;
}

// ============================================
// Dashboard Composite DTOs
// ============================================

export interface DeanDashboardInsightsDto {
  generatedAt: string;
  timeRange: TimeRange;
  kpis: KpiCard[];
  studentDemographics: StudentDemographicsDto;
  teacherDemographics: TeacherDemographicsDto;
  academicPerformance: ScoreDistributionDto;
  performanceTrends: PerformanceTrendsDto;
  quizAnalytics: QuizAnalyticsDto;
  participation: ParticipationAnalyticsDto;
  comparativeAnalysis: ComparativeAnalysisDto;
  alerts: StatisticsAlert[];
  recommendations: Recommendation[];
}

export interface SpecialityHeadDashboardDto {
  generatedAt: string;
  specialityId: string;
  specialityName: string;
  timeRange: TimeRange;
  kpis: KpiCard[];
  studentDemographics: StudentDemographicsDto;
  classPerformance: EntityPerformance[];
  teacherPerformance: EntityPerformance[];
  scoreDistribution: ScoreDistributionDto;
  performanceTrends: PerformanceTrendsDto;
  quizAnalytics: QuizAnalyticsDto;
  alerts: StatisticsAlert[];
  recommendations: Recommendation[];
}

export interface TeacherDashboardInsightsDto {
  generatedAt: string;
  teacherId: string;
  timeRange: TimeRange;
  kpis: KpiCard[];
  coursePerformance: EntityPerformance[];
  studentPerformance: {
    topPerformers: Array<{ studentId: string; name: string; averageScore: number }>;
    needsHelp: Array<{ studentId: string; name: string; averageScore: number }>;
  };
  scoreDistribution: ScoreDistributionDto;
  performanceTrends: PerformanceTrendsDto;
  quizAnalytics: QuizAnalyticsDto;
  questionDifficulty: QuestionDifficultyDto[];
  alerts: StatisticsAlert[];
  recommendations: Recommendation[];
}

// ============================================
// Request/Filter DTOs
// ============================================

export interface StatisticsFilterDto {
  timeRange?: TimeRange;
  academicYearId?: string;
  semesterId?: string;
  specialityId?: string;
  classId?: string;
  teacherId?: string;
  teachingUnitId?: string;
  quizType?: string;
}

// ============================================
// Chart Data DTOs (for visualization)
// ============================================

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface LineChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    color?: string;
  }>;
}

export interface PieChartData {
  labels: string[];
  data: number[];
  colors: string[];
}

export interface BarChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    color?: string;
  }>;
}
