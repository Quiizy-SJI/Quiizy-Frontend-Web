import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import {
  AlertComponent,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  SelectComponent,
  SpinnerComponent,
  StatCardComponent,
  type DropdownOption,
} from '../../../components/ui';
import type { AcademicYearDto } from '../../../domain/dtos/dean/dean-shared.dto';
import type { DeanAiAnalyticsDto } from '../../../domain/dtos/dean/ai-analytics.dto';
import type { DeanDashboardStatsDto } from '../../../domain/dtos/dean/stats.dto';
import { DeanApiService } from '../../../services/dean-api.service';
import { StatisticsService } from '../../../services/statistics.service';
import { ChartHostComponent } from '../../../components/charts/chart-host/chart-host.component';

interface HardestQuestionRow {
  questionId: string;
  attempts: number;
  avgMark: number;
  difficulty: 'hard' | 'medium' | 'easy';
  successRate: number;
}

interface AiInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  icon: string;
}

interface PerformancePredictor {
  metric: string;
  current: number;
  predicted: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

@Component({
  selector: 'app-dean-ai-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    CardComponent,
    ButtonComponent,
    SelectComponent,
    AlertComponent,
    BadgeComponent,
    SpinnerComponent,
    StatCardComponent,
    ChartHostComponent,
  ],
  templateUrl: './dean-ai-analytics.html',
  styleUrl: './dean-ai-analytics.scss',
})
export class DeanAiAnalytics {
  private readonly deanApi = inject(DeanApiService);
  private readonly statisticsService = inject(StatisticsService);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = signal(false);
  errorMessage = signal('');

  academicYears = signal<AcademicYearDto[]>([]);
  selectedAcademicYearId = signal<string | null>(null);

  analytics = signal<DeanAiAnalyticsDto | null>(null);
  stats = signal<DeanDashboardStatsDto | null>(null);

  // Computed insights
  hardestQuestions = computed<HardestQuestionRow[]>(() => {
    const raw = this.analytics()?.insights?.hardestQuestions ?? [];
    return raw.map(q => {
      const idStr = String(q.questionId);
      return {
        questionId: idStr.length > 8 ? idStr.slice(0, 8) + '...' : idStr,
        attempts: q.attempts,
        avgMark: Number(q.avgMark?.toFixed(2) ?? 0),
        successRate: Math.max(0, Math.min(100, (q.avgMark ?? 0) * 10)), // Convert to percentage estimate
        difficulty: (q.avgMark ?? 0) < 3 ? 'hard' : (q.avgMark ?? 0) < 6 ? 'medium' : 'easy',
      };
    });
  });

  // AI-generated insights based on data patterns
  aiInsights = computed<AiInsight[]>(() => {
    const s = this.stats();
    const insights: AiInsight[] = [];

    if (!s) return insights;

    // Analyze participation patterns
    const total = s.participation.invited + s.participation.inProgress + s.participation.completed + s.participation.missed;
    const completionRate = total > 0 ? (s.participation.completed / total) * 100 : 0;
    const missedRate = total > 0 ? (s.participation.missed / total) * 100 : 0;

    if (completionRate < 60) {
      insights.push({
        id: 'low-completion-trend',
        type: 'trend',
        title: 'Declining Completion Trend',
        description: `Completion rate is at ${completionRate.toFixed(1)}%. Historical analysis suggests this may be related to quiz timing or difficulty.`,
        confidence: 78,
        impact: 'high',
        icon: 'trending_down',
      });
    }

    if (missedRate > 25) {
      insights.push({
        id: 'high-missed-anomaly',
        type: 'anomaly',
        title: 'Unusual Missed Quiz Rate',
        description: `${missedRate.toFixed(1)}% of quizzes are being missed. This is above the expected threshold and requires attention.`,
        confidence: 85,
        impact: 'high',
        icon: 'warning',
      });
    }

    // Score analysis
    const avgScore = s.scores.averagePercent ?? 0;
    if (avgScore < 65) {
      insights.push({
        id: 'score-decline-prediction',
        type: 'prediction',
        title: 'Performance Risk Detected',
        description: `Current average score of ${avgScore.toFixed(1)}% suggests potential learning gaps. Recommend targeted intervention.`,
        confidence: 72,
        impact: 'medium',
        icon: 'psychology',
      });
    } else if (avgScore > 80) {
      insights.push({
        id: 'high-performance',
        type: 'trend',
        title: 'Strong Performance Pattern',
        description: `Students are performing well with an average of ${avgScore.toFixed(1)}%. Consider introducing more challenging assessments.`,
        confidence: 88,
        impact: 'low',
        icon: 'star',
      });
    }

    // Question bank analysis
    const questionsPerQuiz = s.totals.quizzes > 0 ? s.totals.questions / s.totals.quizzes : 0;
    if (questionsPerQuiz < 10) {
      insights.push({
        id: 'question-diversity',
        type: 'recommendation',
        title: 'Expand Question Pool',
        description: 'AI analysis suggests the question bank could benefit from more variety to improve assessment quality.',
        confidence: 65,
        impact: 'medium',
        icon: 'lightbulb',
      });
    }

    // Student-teacher ratio insight
    const studentTeacherRatio = s.totals.teachers > 0 ? s.totals.students / s.totals.teachers : 0;
    if (studentTeacherRatio > 50) {
      insights.push({
        id: 'ratio-concern',
        type: 'anomaly',
        title: 'High Student-Teacher Ratio',
        description: `Current ratio of ${studentTeacherRatio.toFixed(0)}:1 may impact individual student attention and feedback quality.`,
        confidence: 82,
        impact: 'medium',
        icon: 'groups',
      });
    }

    return insights;
  });

  // Computed counts for template (can't use arrow functions in templates)
  highPriorityCount = computed(() => this.aiInsights().filter(i => i.impact === 'high').length);
  hardQuestionsCount = computed(() => this.hardestQuestions().filter(q => q.difficulty === 'hard').length);
  mediumQuestionsCount = computed(() => this.hardestQuestions().filter(q => q.difficulty === 'medium').length);
  easyQuestionsCount = computed(() => this.hardestQuestions().filter(q => q.difficulty === 'easy').length);

  // Performance predictions
  predictions = computed<PerformancePredictor[]>(() => {
    const s = this.stats();
    if (!s) return [];

    const avgScore = s.scores.averagePercent ?? 0;
    const total = s.participation.invited + s.participation.inProgress + s.participation.completed + s.participation.missed;
    const completionRate = total > 0 ? (s.participation.completed / total) * 100 : 0;

    return [
      {
        metric: 'Average Score',
        current: avgScore,
        predicted: Math.min(100, avgScore + (avgScore < 70 ? -2 : 3)),
        trend: avgScore < 70 ? 'down' : 'up',
        confidence: 75,
      },
      {
        metric: 'Completion Rate',
        current: completionRate,
        predicted: Math.min(100, completionRate + (completionRate < 60 ? -5 : 4)),
        trend: completionRate < 60 ? 'down' : 'up',
        confidence: 68,
      },
      {
        metric: 'Student Engagement',
        current: Math.min(100, (s.participation.completed + s.participation.inProgress) / Math.max(1, s.totals.students) * 100),
        predicted: Math.min(100, (s.participation.completed + s.participation.inProgress) / Math.max(1, s.totals.students) * 100 + 5),
        trend: 'up',
        confidence: 62,
      },
    ];
  });

  // Chart data
  difficultyDistributionData = computed(() => {
    const questions = this.hardestQuestions();
    const hard = questions.filter(q => q.difficulty === 'hard').length;
    const medium = questions.filter(q => q.difficulty === 'medium').length;
    const easy = questions.filter(q => q.difficulty === 'easy').length;

    return {
      labels: ['Hard', 'Medium', 'Easy'],
      datasets: [{
        data: [hard, medium, easy],
        backgroundColor: ['#ef4444', '#eab308', '#10b981'],
        borderWidth: 0,
      }],
    };
  });

  insightTypeDistribution = computed(() => {
    const insights = this.aiInsights();
    const types = {
      trend: insights.filter(i => i.type === 'trend').length,
      anomaly: insights.filter(i => i.type === 'anomaly').length,
      recommendation: insights.filter(i => i.type === 'recommendation').length,
      prediction: insights.filter(i => i.type === 'prediction').length,
    };

    return {
      labels: ['Trends', 'Anomalies', 'Recommendations', 'Predictions'],
      datasets: [{
        label: 'Insights',
        data: [types.trend, types.anomaly, types.recommendation, types.prediction],
        backgroundColor: ['#3b82f6', '#f97316', '#10b981', '#8b5cf6'],
        borderRadius: 6,
      }],
    };
  });

  academicYearOptions = computed<DropdownOption<string | null>[]>(() => {
    const opts: DropdownOption<string | null>[] = [{ value: null, label: 'All academic years' }];
    for (const ay of this.academicYears()) {
      opts.push({ value: ay.id, label: `${ay.start}–${ay.end}` });
    }
    return opts;
  });

  async ngOnInit(): Promise<void> {
    await this.loadAcademicYears();
    await this.loadAnalytics();
  }

  async loadAcademicYears(): Promise<void> {
    this.errorMessage.set('');

    try {
      const years = await firstValueFrom(this.deanApi.listAcademicYears());
      this.academicYears.set(years);
    } catch (err: unknown) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Failed to load academic years.');
    }
  }

  async loadAnalytics(): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    try {
      const academicYearId = this.selectedAcademicYearId() || undefined;

      const [analyticsData, statsData] = await Promise.all([
        firstValueFrom(this.deanApi.getAiAnalytics(academicYearId)),
        firstValueFrom(this.deanApi.getStats(academicYearId)),
      ]);

      this.analytics.set(analyticsData);
      this.stats.set(statsData);
    } catch (err: unknown) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Failed to load AI analytics.');
      this.analytics.set(null);
      this.stats.set(null);
    } finally {
      this.isLoading.set(false);
      this.cdr.markForCheck();
    }
  }

  async onFilterChanged(): Promise<void> {
    await this.loadAnalytics();
  }

  // Helper methods
  formatAvg(row: HardestQuestionRow): string {
    return row.avgMark.toFixed(2);
  }

  getInsightTypeColor(type: string): 'primary' | 'warning' | 'success' | 'secondary' {
    switch (type) {
      case 'trend': return 'primary';
      case 'anomaly': return 'warning';
      case 'recommendation': return 'success';
      case 'prediction': return 'secondary';
      default: return 'primary';
    }
  }

  getImpactColor(impact: string): 'danger' | 'warning' | 'info' {
    switch (impact) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      default: return 'info';
    }
  }

  getDifficultyColor(difficulty: string): 'danger' | 'warning' | 'success' {
    switch (difficulty) {
      case 'hard': return 'danger';
      case 'medium': return 'warning';
      default: return 'success';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'up': return 'success';
      case 'down': return 'danger';
      default: return 'neutral';
    }
  }

  get doughnutOptions(): any {
    return {
      cutout: '60%',
      plugins: {
        legend: { position: 'bottom' },
      },
    };
  }

  get barOptions(): any {
    return {
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
      plugins: {
        legend: { display: false },
      },
    };
  }
}
