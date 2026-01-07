import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of, map, catchError, shareReplay } from 'rxjs';

import { ApiClientService } from '../core/http/api-client.service';
import { DeanApiService } from './dean-api.service';
import { TeacherApiService } from './teacher-api.service';

import type { DeanDashboardStatsDto } from '../domain/dtos/dean/stats.dto';
import type { DeanAiAnalyticsDto } from '../domain/dtos/dean/ai-analytics.dto';
import type {
  TimeRange,
  TrendDirection,
  PerformanceLevel,
  KpiCard,
  KpiMetric,
  StatisticsFilterDto,
  DeanDashboardInsightsDto,
  TeacherDashboardInsightsDto,
  StudentDemographicsDto,
  TeacherDemographicsDto,
  ScoreDistributionDto,
  ScoreDistributionBucket,
  PerformanceTrendsDto,
  PerformanceTrendPoint,
  QuizAnalyticsDto,
  QuizTypeBreakdown,
  ParticipationAnalyticsDto,
  ComparativeAnalysisDto,
  EntityPerformance,
  StatisticsAlert,
  Recommendation,
  QuestionDifficultyDto,
  DemographicBreakdown,
} from '../domain/dtos/statistics/statistics.dto';
import type { QuizDto, CourseDto } from '../domain/dtos/teacher/teacher-quiz.dto';
import { getQuizQuestionCount } from '../domain/dtos/teacher/teacher-quiz.dto';

/**
 * Comprehensive Statistics Service
 *
 * Provides meaningful insights and analytics for:
 * - Dean: Institution-wide overview
 * - Speciality Heads: Department-level insights
 * - Teachers: Course and student performance
 *
 * Features:
 * - KPI computation with trends
 * - Score distribution analysis
 * - Comparative analytics
 * - Performance alerts and recommendations
 * - Chart-ready data transformations
 */
@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private readonly api = inject(ApiClientService);
  private readonly deanApi = inject(DeanApiService);
  private readonly teacherApi = inject(TeacherApiService);

  // Cache for expensive computations
  private deanStatsCache$?: Observable<DeanDashboardStatsDto>;
  private deanAnalyticsCache$?: Observable<DeanAiAnalyticsDto>;

  // ============================================
  // Dean Dashboard Methods
  // ============================================

  /**
   * Get comprehensive dean dashboard insights
   * Combines multiple data sources into actionable insights
   */
  getDeanDashboardInsights(filter?: StatisticsFilterDto): Observable<DeanDashboardInsightsDto> {
    return forkJoin({
      stats: this.getDeanStats(filter?.academicYearId),
      analytics: this.getDeanAnalytics(filter?.academicYearId),
    }).pipe(
      map(({ stats, analytics }) => this.buildDeanDashboard(stats, analytics, filter)),
      catchError(error => {
        console.error('Error loading dean dashboard:', error);
        return of(this.getEmptyDeanDashboard());
      }),
    );
  }

  /**
   * Get dean stats with caching
   */
  getDeanStats(academicYearId?: string): Observable<DeanDashboardStatsDto> {
    if (!academicYearId && this.deanStatsCache$) {
      return this.deanStatsCache$;
    }

    const stats$ = this.deanApi.getStats(academicYearId).pipe(
      shareReplay(1),
    );

    if (!academicYearId) {
      this.deanStatsCache$ = stats$;
    }

    return stats$;
  }

  /**
   * Get dean AI analytics with caching
   */
  getDeanAnalytics(academicYearId?: string): Observable<DeanAiAnalyticsDto> {
    if (!academicYearId && this.deanAnalyticsCache$) {
      return this.deanAnalyticsCache$;
    }

    const analytics$ = this.deanApi.getAiAnalytics(academicYearId).pipe(
      shareReplay(1),
    );

    if (!academicYearId) {
      this.deanAnalyticsCache$ = analytics$;
    }

    return analytics$;
  }

  /**
   * Clear cache (call when data changes)
   */
  clearCache(): void {
    this.deanStatsCache$ = undefined;
    this.deanAnalyticsCache$ = undefined;
  }

  // ============================================
  // Teacher Dashboard Methods
  // ============================================

  /**
   * Get comprehensive teacher dashboard insights
   */
  getTeacherDashboardInsights(filter?: StatisticsFilterDto): Observable<TeacherDashboardInsightsDto> {
    return forkJoin({
      courses: this.teacherApi.getMyCourses(),
      quizzes: this.teacherApi.getMyQuizzes(),
    }).pipe(
      map(({ courses, quizzes }) => this.buildTeacherDashboard(courses, quizzes, filter)),
      catchError(error => {
        console.error('Error loading teacher dashboard:', error);
        return of(this.getEmptyTeacherDashboard());
      }),
    );
  }

  // ============================================
  // KPI Computation Methods
  // ============================================

  /**
   * Build KPI cards from stats
   */
  buildDeanKpis(stats: DeanDashboardStatsDto): KpiCard[] {
    const totalParticipation =
      stats.participation.invited +
      stats.participation.inProgress +
      stats.participation.completed +
      stats.participation.missed;

    const completionRate = totalParticipation > 0
      ? (stats.participation.completed / totalParticipation) * 100
      : 0;

    // participationRate as percent of total enrolled students.
    // Clamp to 100% to avoid values >100% when invitations count students multiple times across quizzes.
    const participationRate = stats.totals.students > 0
      ? Math.min(100, (totalParticipation / stats.totals.students) * 100)
      : 0;

    return [
      {
        title: 'Total Students',
        metric: {
          value: stats.totals.students,
          label: 'Enrolled Students',
          unit: 'students',
        },
        icon: 'school',
        color: 'primary',
        description: 'Active student enrollments',
      },
      {
        title: 'Total Teachers',
        metric: {
          value: stats.totals.teachers,
          label: 'Teaching Staff',
          unit: 'teachers',
        },
        icon: 'person',
        color: 'info',
        description: 'Registered teachers',
      },
      {
        title: 'Quizzes Created',
        metric: {
          value: stats.totals.quizzes,
          label: 'Total Quizzes',
          unit: 'quizzes',
        },
        icon: 'assignment',
        color: 'success',
        description: 'Assessments available',
      },
      {
        title: 'Average Score',
        metric: {
          value: stats.scores.averagePercent ?? 0,
          label: 'Overall Performance',
          unit: '%',
          trend: this.computeTrend(stats.scores.averagePercent ?? 0, 70),
        },
        icon: 'trending_up',
        color: this.getScoreColor(stats.scores.averagePercent ?? 0),
        description: 'Institution average',
      },
      {
        title: 'Completion Rate',
        metric: {
          value: completionRate,
          label: 'Quiz Completion',
          unit: '%',
          trend: this.computeTrend(completionRate, 80),
        },
        icon: 'check_circle',
        color: this.getCompletionColor(completionRate),
        description: 'Quizzes fully completed',
      },
      {
        title: 'Participation Rate',
        metric: {
          value: participationRate,
          label: 'Student Participation',
          unit: '%',
          trend: this.computeTrend(participationRate, 75),
        },
        icon: 'groups',
        color: this.getParticipationColor(participationRate),
        description: 'Students taking quizzes',
      },
      {
        title: 'Questions Bank',
        metric: {
          value: stats.totals.questions,
          label: 'Total Questions',
          unit: 'questions',
        },
        icon: 'quiz',
        color: 'primary',
        description: 'Questions in repository',
      },
      {
        title: 'Classes',
        metric: {
          value: stats.totals.classes,
          label: 'Active Classes',
          unit: 'classes',
        },
        icon: 'class',
        color: 'info',
        description: 'Registered classes',
      },
    ];
  }

  /**
   * Build teacher-specific KPIs
   */
  buildTeacherKpis(courses: CourseDto[], quizzes: QuizDto[]): KpiCard[] {
    const totalStudents = this.countUniqueStudents(quizzes);
    // Questions are accessed through CourseQuiz → CourseQuizQuestion
    const totalQuestions = quizzes.reduce((sum, q) => sum + getQuizQuestionCount(q), 0);
    const avgScore = this.computeAverageScore(quizzes);
    const completionRate = this.computeCompletionRate(quizzes);

    return [
      {
        title: 'My Courses',
        metric: {
          value: courses.length,
          label: 'Assigned Courses',
          unit: 'courses',
        },
        icon: 'menu_book',
        color: 'primary',
        description: 'Courses you teach',
      },
      {
        title: 'My Students',
        metric: {
          value: totalStudents,
          label: 'Total Students',
          unit: 'students',
        },
        icon: 'groups',
        color: 'info',
        description: 'Students in your courses',
      },
      {
        title: 'Quizzes Created',
        metric: {
          value: quizzes.length,
          label: 'Total Quizzes',
          unit: 'quizzes',
        },
        icon: 'assignment',
        color: 'success',
        description: 'Assessments created',
      },
      {
        title: 'Questions Created',
        metric: {
          value: totalQuestions,
          label: 'Total Questions',
          unit: 'questions',
        },
        icon: 'quiz',
        color: 'primary',
        description: 'In your quizzes',
      },
      {
        title: 'Average Score',
        metric: {
          value: avgScore,
          label: 'Student Performance',
          unit: '%',
          trend: this.computeTrend(avgScore, 70),
        },
        icon: 'trending_up',
        color: this.getScoreColor(avgScore),
        description: 'Your students average',
      },
      {
        title: 'Completion Rate',
        metric: {
          value: completionRate,
          label: 'Quiz Completion',
          unit: '%',
          trend: this.computeTrend(completionRate, 80),
        },
        icon: 'check_circle',
        color: this.getCompletionColor(completionRate),
        description: 'Quizzes fully completed',
      },
    ];
  }

  // ============================================
  // Score Distribution Methods
  // ============================================

  /**
   * Compute score distribution from quiz results
   */
  computeScoreDistribution(quizzes: QuizDto[]): ScoreDistributionDto {
    const scores: number[] = [];

    for (const quiz of quizzes) {
      if (!quiz.studentQuizes) continue;
      for (const sq of quiz.studentQuizes) {
        if (sq.rawScore !== null && sq.rawScore !== undefined && sq.totalMarks) {
          scores.push((sq.rawScore / sq.totalMarks) * 100);
        }
      }
    }

    if (scores.length === 0) {
      return this.getEmptyScoreDistribution();
    }

    scores.sort((a, b) => a - b);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const median = scores[Math.floor(scores.length / 2)];
    const stdDev = this.computeStdDev(scores, avg);

    const buckets: ScoreDistributionBucket[] = [
      { range: '90-100', label: 'excellent', count: 0, percentage: 0 },
      { range: '80-89', label: 'good', count: 0, percentage: 0 },
      { range: '70-79', label: 'average', count: 0, percentage: 0 },
      { range: '60-69', label: 'below', count: 0, percentage: 0 },
      { range: '0-59', label: 'failing', count: 0, percentage: 0 },
    ];

    for (const score of scores) {
      if (score >= 90) buckets[0].count++;
      else if (score >= 80) buckets[1].count++;
      else if (score >= 70) buckets[2].count++;
      else if (score >= 60) buckets[3].count++;
      else buckets[4].count++;
    }

    for (const bucket of buckets) {
      bucket.percentage = (bucket.count / scores.length) * 100;
    }

    return {
      buckets,
      totalAssessed: scores.length,
      averageScore: avg,
      medianScore: median,
      standardDeviation: stdDev,
      highestScore: scores[scores.length - 1],
      lowestScore: scores[0],
    };
  }

  /**
   * Build score distribution from dean stats
   */
  buildScoreDistributionFromStats(stats: DeanDashboardStatsDto): ScoreDistributionDto {
    // Backend provides aggregated scores, not individual - estimate distribution
    const avgPercent = stats.scores.averagePercent ?? 0;
    const total = stats.scores.completedAttemptsWithScore;

    if (total === 0) {
      return this.getEmptyScoreDistribution();
    }

    // Estimate distribution based on normal curve around average
    const buckets = this.estimateDistributionBuckets(avgPercent, total);

    return {
      buckets,
      totalAssessed: total,
      averageScore: avgPercent,
      medianScore: avgPercent, // Approximation
      standardDeviation: 15, // Standard assumption
      highestScore: Math.min(100, avgPercent + 30),
      lowestScore: Math.max(0, avgPercent - 40),
    };
  }

  // ============================================
  // Performance Trends Methods
  // ============================================

  /**
   * Compute performance trends from quizzes
   */
  computePerformanceTrends(quizzes: QuizDto[], timeRange: TimeRange = 'month'): PerformanceTrendsDto {
    // Group quizzes by time period
    const grouped = this.groupQuizzesByPeriod(quizzes, timeRange);

    const dataPoints: PerformanceTrendPoint[] = Object.entries(grouped).map(([period, periodQuizzes]) => {
      const scores: number[] = [];
      let totalParticipants = 0;
      let totalCompleted = 0;

      for (const quiz of periodQuizzes) {
        if (!quiz.studentQuizes) continue;
        totalParticipants += quiz.studentQuizes.length;

        for (const sq of quiz.studentQuizes) {
          if (sq.status === 'SUBMITTED') totalCompleted++;
          if (sq.rawScore !== null && sq.rawScore !== undefined && sq.totalMarks) {
            scores.push((sq.rawScore / sq.totalMarks) * 100);
          }
        }
      }

      return {
        period,
        averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
        participationRate: totalParticipants,
        completionRate: totalParticipants > 0 ? (totalCompleted / totalParticipants) * 100 : 0,
        studentCount: totalParticipants,
      };
    });

    // Sort by period
    dataPoints.sort((a, b) => a.period.localeCompare(b.period));

    // Compute overall trend
    let overallTrend: TrendDirection = 'stable';
    let percentageChange = 0;

    if (dataPoints.length >= 2) {
      const first = dataPoints[0].averageScore;
      const last = dataPoints[dataPoints.length - 1].averageScore;
      percentageChange = first > 0 ? ((last - first) / first) * 100 : 0;
      overallTrend = percentageChange > 2 ? 'up' : percentageChange < -2 ? 'down' : 'stable';
    }

    return {
      timeRange,
      dataPoints,
      overallTrend,
      percentageChange,
    };
  }

  // ============================================
  // Quiz Analytics Methods
  // ============================================

  /**
   * Compute quiz analytics from quiz data
   */
  computeQuizAnalytics(quizzes: QuizDto[]): QuizAnalyticsDto {
    const byType: Record<string, QuizTypeBreakdown> = {};
    let totalDuration = 0;
    let durationCount = 0;

    for (const quiz of quizzes) {
      const type = quiz.type || 'OTHER';

      if (!byType[type]) {
        byType[type] = {
          type,
          count: 0,
          percentage: 0,
          averageScore: 0,
          completionRate: 0,
        };
      }

      byType[type].count++;

      if (quiz.durationMinutes) {
        totalDuration += quiz.durationMinutes;
        durationCount++;
      }

      // Compute type-specific metrics
      if (quiz.studentQuizes) {
        const typeScores: number[] = [];
        let completed = 0;

        for (const sq of quiz.studentQuizes) {
          if (sq.status === 'SUBMITTED') completed++;
          if (sq.rawScore !== null && sq.rawScore !== undefined && sq.totalMarks) {
            typeScores.push((sq.rawScore / sq.totalMarks) * 100);
          }
        }

        if (typeScores.length > 0) {
          const avgScore = typeScores.reduce((a, b) => a + b, 0) / typeScores.length;
          // Running average
          byType[type].averageScore = (byType[type].averageScore * (byType[type].count - 1) + avgScore) / byType[type].count;
        }

        if (quiz.studentQuizes.length > 0) {
          const rate = (completed / quiz.studentQuizes.length) * 100;
          byType[type].completionRate = (byType[type].completionRate * (byType[type].count - 1) + rate) / byType[type].count;
        }
      }
    }

    // Calculate percentages
    for (const type of Object.values(byType)) {
      type.percentage = (type.count / quizzes.length) * 100;
    }

    // Sort quizzes by difficulty
    const quizzesWithMetrics = quizzes.map(quiz => {
      const avgScore = this.computeQuizAverageScore(quiz);
      const completionRate = this.computeQuizCompletionRate(quiz);
      return {
        quizId: quiz.id,
        quizType: quiz.type,
        averageScore: avgScore,
        completionRate,
        failureRate: 100 - avgScore,
        attemptCount: quiz.studentQuizes?.length || 0,
      };
    });

    const hardestQuizzes = [...quizzesWithMetrics]
      .filter(q => q.attemptCount > 0)
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 5);

    const easiestQuizzes = [...quizzesWithMetrics]
      .filter(q => q.attemptCount > 0)
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);

    return {
      totalQuizzes: quizzes.length,
      activeQuizzes: quizzes.length, // TODO: Add status filtering
      completedQuizzes: quizzes.filter(q =>
        q.studentQuizes?.some(sq => sq.status === 'SUBMITTED')
      ).length,
      byType: Object.values(byType),
      hardestQuizzes,
      easiestQuizzes,
      averageCompletionRate: this.computeCompletionRate(quizzes),
      averageDuration: durationCount > 0 ? totalDuration / durationCount : 0,
    };
  }

  // ============================================
  // Participation Analytics Methods
  // ============================================

  /**
   * Build participation analytics from dean stats
   */
  buildParticipationAnalytics(stats: DeanDashboardStatsDto): ParticipationAnalyticsDto {
    const total =
      stats.participation.invited +
      stats.participation.inProgress +
      stats.participation.completed +
      stats.participation.missed;

    const byStatus = [
      { status: 'Invited', count: stats.participation.invited, percentage: 0 },
      { status: 'In Progress', count: stats.participation.inProgress, percentage: 0 },
      { status: 'Completed', count: stats.participation.completed, percentage: 0 },
      { status: 'Missed', count: stats.participation.missed, percentage: 0 },
    ];

    for (const item of byStatus) {
      item.percentage = total > 0 ? (item.count / total) * 100 : 0;
    }

    return {
      totalInvitations: total,
      totalParticipants: stats.participation.inProgress + stats.participation.completed,
      participationRate: total > 0 ? ((stats.participation.inProgress + stats.participation.completed) / total) * 100 : 0,
      completionRate: total > 0 ? (stats.participation.completed / total) * 100 : 0,
      byStatus,
      averageTimeToStart: 0, // Would need detailed timing data
      averageCompletionTime: 0, // Would need detailed timing data
    };
  }

  // ============================================
  // Comparative Analysis Methods
  // ============================================

  /**
   * Build comparative analysis (placeholder - needs additional API data)
   */
  buildComparativeAnalysis(): ComparativeAnalysisDto {
    // This would require additional backend endpoints to get per-speciality/level/class data
    // For now, return structure with empty arrays
    return {
      bySpeciality: [],
      byLevel: [],
      byClass: [],
      byTeachingUnit: [],
      topPerformers: [],
      needsAttention: [],
    };
  }

  // ============================================
  // Alerts & Recommendations Methods
  // ============================================

  /**
   * Generate alerts based on statistics
   */
  generateAlerts(stats: DeanDashboardStatsDto): StatisticsAlert[] {
    const alerts: StatisticsAlert[] = [];
    const now = new Date().toISOString();

    // Low completion rate alert
    const totalParticipation =
      stats.participation.invited +
      stats.participation.inProgress +
      stats.participation.completed +
      stats.participation.missed;

    const completionRate = totalParticipation > 0
      ? (stats.participation.completed / totalParticipation) * 100
      : 0;

    if (completionRate < 60) {
      alerts.push({
        id: 'low-completion',
        severity: 'warning',
        category: 'participation',
        title: 'Low Completion Rate',
        message: `Quiz completion rate is ${completionRate.toFixed(1)}%. Consider reviewing quiz difficulty or providing more time.`,
        createdAt: now,
      });
    }

    // Low average score alert
    if ((stats.scores.averagePercent ?? 0) < 60) {
      alerts.push({
        id: 'low-score',
        severity: 'warning',
        category: 'performance',
        title: 'Below Average Performance',
        message: `Average score is ${stats.scores.averagePercent?.toFixed(1)}%. Students may need additional support.`,
        createdAt: now,
      });
    }

    // High missed rate alert
    const missedRate = totalParticipation > 0
      ? (stats.participation.missed / totalParticipation) * 100
      : 0;

    if (missedRate > 20) {
      alerts.push({
        id: 'high-missed',
        severity: 'critical',
        category: 'participation',
        title: 'High Missed Quiz Rate',
        message: `${missedRate.toFixed(1)}% of quiz invitations were missed. Consider sending reminders or adjusting schedules.`,
        createdAt: now,
      });
    }

    return alerts;
  }

  /**
   * Generate recommendations based on statistics
   */
  generateRecommendations(stats: DeanDashboardStatsDto): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Always recommend regular assessment
    if (stats.totals.quizzes < stats.totals.classes * 2) {
      recommendations.push({
        id: 'more-quizzes',
        title: 'Increase Assessment Frequency',
        description: 'Consider creating more quizzes to improve continuous assessment and student engagement.',
        impact: 'high',
        effort: 'medium',
        category: 'engagement',
        actionUrl: '/teacher/create-exam',
      });
    }

    // Question bank growth
    if (stats.totals.questions < 100) {
      recommendations.push({
        id: 'grow-question-bank',
        title: 'Expand Question Bank',
        description: 'Build a larger question repository to enable more varied assessments and reduce question repetition.',
        impact: 'medium',
        effort: 'high',
        category: 'content',
        actionUrl: '/teacher/question-bank',
      });
    }

    // Participation improvement
    // Use students-based participation for recommendations; clamp to 100% for safety.
    const participationRate = stats.totals.students > 0
      ? Math.min(100, ((stats.participation.completed + stats.participation.inProgress) / stats.totals.students) * 100)
      : 0;

    if (participationRate < 70) {
      recommendations.push({
        id: 'improve-participation',
        title: 'Boost Student Participation',
        description: 'Participation rate is below 70%. Consider using reminder notifications and making quizzes more accessible.',
        impact: 'high',
        effort: 'low',
        category: 'engagement',
      });
    }

    return recommendations;
  }

  /**
   * Generate teacher-specific alerts
   */
  generateTeacherAlerts(quizzes: QuizDto[]): StatisticsAlert[] {
    const alerts: StatisticsAlert[] = [];
    const now = new Date().toISOString();

    // Check for quizzes with low completion
    for (const quiz of quizzes) {
      if (!quiz.studentQuizes || quiz.studentQuizes.length === 0) continue;

      const completed = quiz.studentQuizes.filter(sq => sq.status === 'SUBMITTED').length;
      const rate = (completed / quiz.studentQuizes.length) * 100;

      if (rate < 50 && quiz.studentQuizes.length >= 5) {
        alerts.push({
          id: `low-completion-${quiz.id}`,
          severity: 'warning',
          category: 'participation',
          title: 'Low Quiz Completion',
          message: `Only ${rate.toFixed(0)}% of students completed quiz "${quiz.type}".`,
          entityType: 'quiz',
          entityId: quiz.id,
          createdAt: now,
        });
      }
    }

    // No recent quizzes alert
    if (quizzes.length === 0) {
      alerts.push({
        id: 'no-quizzes',
        severity: 'info',
        category: 'engagement',
        title: 'No Quizzes Created',
        message: 'You haven\'t created any quizzes yet. Start assessing your students!',
        actionUrl: '/teacher/create-exam',
        actionLabel: 'Create Quiz',
        createdAt: now,
      });
    }

    return alerts;
  }

  // ============================================
  // Helper Methods
  // ============================================

  private buildDeanDashboard(
    stats: DeanDashboardStatsDto,
    analytics: DeanAiAnalyticsDto,
    filter?: StatisticsFilterDto,
  ): DeanDashboardInsightsDto {
    return {
      generatedAt: new Date().toISOString(),
      timeRange: filter?.timeRange || 'all',
      kpis: this.buildDeanKpis(stats),
      studentDemographics: this.buildStudentDemographics(stats),
      teacherDemographics: this.buildTeacherDemographics(stats),
      academicPerformance: this.buildScoreDistributionFromStats(stats),
      performanceTrends: this.getEmptyPerformanceTrends(),
      quizAnalytics: this.buildQuizAnalyticsFromStats(stats),
      participation: this.buildParticipationAnalytics(stats),
      comparativeAnalysis: this.buildComparativeAnalysis(),
      alerts: this.generateAlerts(stats),
      recommendations: this.generateRecommendations(stats),
    };
  }

  private buildTeacherDashboard(
    courses: CourseDto[],
    quizzes: QuizDto[],
    filter?: StatisticsFilterDto,
  ): TeacherDashboardInsightsDto {
    return {
      generatedAt: new Date().toISOString(),
      teacherId: '', // Would come from auth context
      timeRange: filter?.timeRange || 'all',
      kpis: this.buildTeacherKpis(courses, quizzes),
      coursePerformance: this.buildCoursePerformance(courses, quizzes),
      studentPerformance: this.buildStudentPerformance(quizzes),
      scoreDistribution: this.computeScoreDistribution(quizzes),
      performanceTrends: this.computePerformanceTrends(quizzes, filter?.timeRange || 'month'),
      quizAnalytics: this.computeQuizAnalytics(quizzes),
      questionDifficulty: this.computeQuestionDifficulty(quizzes),
      alerts: this.generateTeacherAlerts(quizzes),
      recommendations: [],
    };
  }

  private buildStudentDemographics(stats: DeanDashboardStatsDto): StudentDemographicsDto {
    return {
      totalStudents: stats.totals.students,
      activeStudents: stats.totals.students, // Assume all active
      inactiveStudents: 0,
      bySpeciality: [],
      byLevel: [],
      byClass: [],
      newEnrollmentsThisMonth: 0,
    };
  }

  private buildTeacherDemographics(stats: DeanDashboardStatsDto): TeacherDemographicsDto {
    return {
      totalTeachers: stats.totals.teachers,
      bySpeciality: [],
      teachersWithCourses: stats.totals.teachers,
      teachersWithoutCourses: 0,
      averageCoursesPerTeacher: 0,
    };
  }

  private buildQuizAnalyticsFromStats(stats: DeanDashboardStatsDto): QuizAnalyticsDto {
    return {
      totalQuizzes: stats.totals.quizzes,
      activeQuizzes: stats.totals.quizzes,
      completedQuizzes: 0,
      byType: [],
      hardestQuizzes: [],
      easiestQuizzes: [],
      averageCompletionRate: 0,
      averageDuration: 0,
    };
  }

  private buildCoursePerformance(courses: CourseDto[], quizzes: QuizDto[]): EntityPerformance[] {
    // Group quizzes by course
    return courses.map(course => {
      const courseQuizzes = quizzes.filter(q =>
        q.courseQuizes?.some(cq => cq.course?.id === course.id)
      );

      return {
        id: course.id,
        name: course.teachingUnit?.name || 'Unknown Course',
        studentCount: 0, // Would need enrollment data
        quizCount: courseQuizzes.length,
        averageScore: this.computeAverageScore(courseQuizzes),
        completionRate: this.computeCompletionRate(courseQuizzes),
        participationRate: 0,
        trend: 'stable' as TrendDirection,
      };
    });
  }

  private buildStudentPerformance(quizzes: QuizDto[]): {
    topPerformers: Array<{ studentId: string; name: string; averageScore: number }>;
    needsHelp: Array<{ studentId: string; name: string; averageScore: number }>;
  } {
    const studentScores = new Map<string, { name: string; scores: number[] }>();

    for (const quiz of quizzes) {
      if (!quiz.studentQuizes) continue;
      for (const sq of quiz.studentQuizes) {
        if (!sq.student || sq.rawScore === null || sq.rawScore === undefined || !sq.totalMarks) continue;

        const studentId = sq.student.id;
        const name = sq.student.user?.name || sq.student.matricule || 'Unknown';
        const score = (sq.rawScore / sq.totalMarks) * 100;

        if (!studentScores.has(studentId)) {
          studentScores.set(studentId, { name, scores: [] });
        }
        studentScores.get(studentId)!.scores.push(score);
      }
    }

    const studentAverages = Array.from(studentScores.entries()).map(([studentId, data]) => ({
      studentId,
      name: data.name,
      averageScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
    }));

    studentAverages.sort((a, b) => b.averageScore - a.averageScore);

    return {
      topPerformers: studentAverages.slice(0, 10),
      needsHelp: studentAverages.filter(s => s.averageScore < 60).slice(0, 10),
    };
  }

  private computeQuestionDifficulty(quizzes: QuizDto[]): QuestionDifficultyDto[] {
    // Would need StudentAnswer data for accurate difficulty
    // For now, return empty array
    return [];
  }

  private computeAverageScore(quizzes: QuizDto[]): number {
    let total = 0;
    let count = 0;

    for (const quiz of quizzes) {
      if (!quiz.studentQuizes) continue;
      for (const sq of quiz.studentQuizes) {
        if (sq.rawScore !== null && sq.rawScore !== undefined && sq.totalMarks) {
          total += (sq.rawScore / sq.totalMarks) * 100;
          count++;
        }
      }
    }

    return count > 0 ? total / count : 0;
  }

  private computeCompletionRate(quizzes: QuizDto[]): number {
    let totalParticipants = 0;
    let totalCompleted = 0;

    for (const quiz of quizzes) {
      if (!quiz.studentQuizes) continue;
      totalParticipants += quiz.studentQuizes.length;
      totalCompleted += quiz.studentQuizes.filter(sq => sq.status === 'SUBMITTED').length;
    }

    return totalParticipants > 0 ? (totalCompleted / totalParticipants) * 100 : 0;
  }

  private countUniqueStudents(quizzes: QuizDto[]): number {
    const studentIds = new Set<string>();
    for (const quiz of quizzes) {
      if (!quiz.studentQuizes) continue;
      for (const sq of quiz.studentQuizes) {
        if (sq.student?.id) studentIds.add(sq.student.id);
      }
    }
    return studentIds.size;
  }

  private computeQuizAverageScore(quiz: QuizDto): number {
    if (!quiz.studentQuizes) return 0;
    let total = 0;
    let count = 0;
    for (const sq of quiz.studentQuizes) {
      if (sq.rawScore !== null && sq.rawScore !== undefined && sq.totalMarks) {
        total += (sq.rawScore / sq.totalMarks) * 100;
        count++;
      }
    }
    return count > 0 ? total / count : 0;
  }

  private computeQuizCompletionRate(quiz: QuizDto): number {
    if (!quiz.studentQuizes || quiz.studentQuizes.length === 0) return 0;
    const completed = quiz.studentQuizes.filter(sq => sq.status === 'SUBMITTED').length;
    return (completed / quiz.studentQuizes.length) * 100;
  }

  private computeTrend(current: number, baseline: number): TrendDirection {
    const diff = current - baseline;
    if (diff > 5) return 'up';
    if (diff < -5) return 'down';
    return 'stable';
  }

  private getScoreColor(score: number): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  }

  private getCompletionColor(rate: number): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'danger';
  }

  private getParticipationColor(rate: number): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
    if (rate >= 75) return 'success';
    if (rate >= 50) return 'warning';
    return 'danger';
  }

  private computeStdDev(values: number[], mean: number): number {
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }

  private estimateDistributionBuckets(avgPercent: number, total: number): ScoreDistributionBucket[] {
    // Estimate normal distribution around average
    // This is a simplified model
    const stdDev = 15;

    const buckets: ScoreDistributionBucket[] = [
      { range: '90-100', label: 'excellent', count: 0, percentage: 0 },
      { range: '80-89', label: 'good', count: 0, percentage: 0 },
      { range: '70-79', label: 'average', count: 0, percentage: 0 },
      { range: '60-69', label: 'below', count: 0, percentage: 0 },
      { range: '0-59', label: 'failing', count: 0, percentage: 0 },
    ];

    // Simplified estimation based on normal distribution
    const ranges = [95, 84.5, 74.5, 64.5, 30];
    for (let i = 0; i < buckets.length; i++) {
      const z = (ranges[i] - avgPercent) / stdDev;
      const prob = this.normalCDF(z);
      const nextProb = i === buckets.length - 1 ? 0 : this.normalCDF((ranges[i + 1] - avgPercent) / stdDev);
      buckets[i].percentage = Math.max(0, (prob - nextProb) * 100);
      buckets[i].count = Math.round(total * buckets[i].percentage / 100);
    }

    return buckets;
  }

  private normalCDF(z: number): number {
    // Approximation of standard normal CDF
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);

    const t = 1.0 / (1.0 + p * z);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

    return 0.5 * (1.0 + sign * y);
  }

  private groupQuizzesByPeriod(quizzes: QuizDto[], timeRange: TimeRange): Record<string, QuizDto[]> {
    const grouped: Record<string, QuizDto[]> = {};

    for (const quiz of quizzes) {
      if (!quiz.date) continue;

      const date = new Date(quiz.date);
      let period: string;

      switch (timeRange) {
        case 'week':
          period = `Week ${this.getWeekNumber(date)}`;
          break;
        case 'month':
          period = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          break;
        case 'semester':
          period = `${date.getMonth() < 6 ? 'S1' : 'S2'} ${date.getFullYear()}`;
          break;
        case 'year':
        default:
          period = date.getFullYear().toString();
      }

      if (!grouped[period]) grouped[period] = [];
      grouped[period].push(quiz);
    }

    return grouped;
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  // ============================================
  // Empty State Helpers
  // ============================================

  private getEmptyDeanDashboard(): DeanDashboardInsightsDto {
    return {
      generatedAt: new Date().toISOString(),
      timeRange: 'all',
      kpis: [],
      studentDemographics: {
        totalStudents: 0,
        activeStudents: 0,
        inactiveStudents: 0,
        bySpeciality: [],
        byLevel: [],
        byClass: [],
        newEnrollmentsThisMonth: 0,
      },
      teacherDemographics: {
        totalTeachers: 0,
        bySpeciality: [],
        teachersWithCourses: 0,
        teachersWithoutCourses: 0,
        averageCoursesPerTeacher: 0,
      },
      academicPerformance: this.getEmptyScoreDistribution(),
      performanceTrends: this.getEmptyPerformanceTrends(),
      quizAnalytics: {
        totalQuizzes: 0,
        activeQuizzes: 0,
        completedQuizzes: 0,
        byType: [],
        hardestQuizzes: [],
        easiestQuizzes: [],
        averageCompletionRate: 0,
        averageDuration: 0,
      },
      participation: {
        totalInvitations: 0,
        totalParticipants: 0,
        participationRate: 0,
        completionRate: 0,
        byStatus: [],
        averageTimeToStart: 0,
        averageCompletionTime: 0,
      },
      comparativeAnalysis: {
        bySpeciality: [],
        byLevel: [],
        byClass: [],
        byTeachingUnit: [],
        topPerformers: [],
        needsAttention: [],
      },
      alerts: [],
      recommendations: [],
    };
  }

  private getEmptyTeacherDashboard(): TeacherDashboardInsightsDto {
    return {
      generatedAt: new Date().toISOString(),
      teacherId: '',
      timeRange: 'all',
      kpis: [],
      coursePerformance: [],
      studentPerformance: { topPerformers: [], needsHelp: [] },
      scoreDistribution: this.getEmptyScoreDistribution(),
      performanceTrends: this.getEmptyPerformanceTrends(),
      quizAnalytics: {
        totalQuizzes: 0,
        activeQuizzes: 0,
        completedQuizzes: 0,
        byType: [],
        hardestQuizzes: [],
        easiestQuizzes: [],
        averageCompletionRate: 0,
        averageDuration: 0,
      },
      questionDifficulty: [],
      alerts: [],
      recommendations: [],
    };
  }

  private getEmptyScoreDistribution(): ScoreDistributionDto {
    return {
      buckets: [
        { range: '90-100', label: 'excellent', count: 0, percentage: 0 },
        { range: '80-89', label: 'good', count: 0, percentage: 0 },
        { range: '70-79', label: 'average', count: 0, percentage: 0 },
        { range: '60-69', label: 'below', count: 0, percentage: 0 },
        { range: '0-59', label: 'failing', count: 0, percentage: 0 },
      ],
      totalAssessed: 0,
      averageScore: 0,
      medianScore: 0,
      standardDeviation: 0,
      highestScore: 0,
      lowestScore: 0,
    };
  }

  private getEmptyPerformanceTrends(): PerformanceTrendsDto {
    return {
      timeRange: 'month',
      dataPoints: [],
      overallTrend: 'stable',
      percentageChange: 0,
    };
  }
}
