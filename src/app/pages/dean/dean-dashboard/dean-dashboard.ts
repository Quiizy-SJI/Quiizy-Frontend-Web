import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, ChangeDetectorRef, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { DeanApiService } from '../../../services/dean-api.service';
import { StatisticsService } from '../../../services/statistics.service';
import { SseService } from '../../../realtime/sse.service';
import { EventType } from '../../../realtime/event-types';
import { ChartHostComponent } from '../../../components/charts/chart-host/chart-host.component';

import type { AcademicYearDto } from '../../../domain/dtos/dean/dean-shared.dto';
import type { DeanDashboardStatsDto } from '../../../domain/dtos/dean/stats.dto';
import type {
  KpiCard,
  StatisticsAlert,
  Recommendation,
  ScoreDistributionDto,
  ParticipationAnalyticsDto,
} from '../../../domain/dtos/statistics/statistics.dto';

@Component({
  selector: 'app-dean-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    CardComponent,
    StatCardComponent,
    SelectComponent,
    ButtonComponent,
    SpinnerComponent,
    AlertComponent,
    BadgeComponent,
    ChartHostComponent,
  ],
  templateUrl: './dean-dashboard.html',
  styleUrl: './dean-dashboard.scss',
})
export class DeanDashboard {
  private readonly api = inject(DeanApiService);
  private readonly statisticsService = inject(StatisticsService);
  private readonly sse = inject(SseService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  // Loading states
  isLoading = signal(false);
  errorMessage = signal('');
  publishLoading = signal(false);

  // Data
  academicYears = signal<AcademicYearDto[]>([]);
  selectedAcademicYearId = signal<string | null>(null);
  stats = signal<DeanDashboardStatsDto | null>(null);

  // Computed insights from StatisticsService
  kpis = computed<KpiCard[]>(() => {
    const s = this.stats();
    return s ? this.statisticsService.buildDeanKpis(s) : [];
  });

  alerts = computed<StatisticsAlert[]>(() => {
    const s = this.stats();
    return s ? this.statisticsService.generateAlerts(s) : [];
  });

  recommendations = computed<Recommendation[]>(() => {
    const s = this.stats();
    return s ? this.statisticsService.generateRecommendations(s) : [];
  });

  scoreDistribution = computed<ScoreDistributionDto>(() => {
    const s = this.stats();
    return s
      ? this.statisticsService.buildScoreDistributionFromStats(s)
      : this.getEmptyScoreDistribution();
  });

  participation = computed<ParticipationAnalyticsDto>(() => {
    const s = this.stats();
    return s
      ? this.statisticsService.buildParticipationAnalytics(s)
      : this.getEmptyParticipation();
  });

  // Academic year dropdown options
  academicYearOptions = computed<Array<DropdownOption<string | null>>>(() => {
    const base: Array<DropdownOption<string | null>> = [{ value: null, label: 'All years' }];
    const years = this.academicYears().map((ay) => ({
      value: ay.id,
      label: this.formatAcademicYearLabel(ay),
    }));
    return [...base, ...years];
  });

  readonly connectionState$ = this.sse.connectionState$;

  // Computed health score
  healthScore = computed(() => {
    const s = this.stats();
    if (!s) return 0;

    const total =
      s.participation.invited +
      s.participation.inProgress +
      s.participation.completed +
      s.participation.missed;

    const completionRate = total > 0 ? (s.participation.completed / total) * 100 : 0;
    const avgScore = s.scores.averagePercent ?? 0;
    const missedRate = total > 0 ? (s.participation.missed / total) * 100 : 0;

    // Weighted health score
    return Math.round(
      avgScore * 0.4 +
      completionRate * 0.4 +
      (100 - missedRate) * 0.2
    );
  });

  healthScoreColor = computed(() => {
    const score = this.healthScore();
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  });

  constructor() {
    void this.loadInitial();

    this.sse
      .on<DeanDashboardStatsDto>(EventType.DEAN_STATS_UPDATED)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((evt) => {
        this.stats.set(evt.data);
      });
  }

  private async loadInitial(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const years = await firstValueFrom(this.api.listAcademicYears());
      this.academicYears.set(years);
      await this.refreshStats();
      this.connectSse();
    } catch (err: unknown) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Failed to load dashboard.');
    } finally {
      this.isLoading.set(false);
      this.cdr.markForCheck();
    }
  }

  async onAcademicYearChange(value: string | null): Promise<void> {
    this.selectedAcademicYearId.set(value);
    await this.refreshStats();
    this.connectSse();
  }

  async refreshStats(): Promise<void> {
    this.errorMessage.set('');

    try {
      const data = await firstValueFrom(
        this.api.getStats(this.selectedAcademicYearId() ?? undefined),
      );
      this.stats.set(data);
      this.statisticsService.clearCache();
    } catch (err: unknown) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Failed to load stats.');
    }
  }

  connectSse(): void {
    const rooms = ['role:DEAN'];
    const yearId = this.selectedAcademicYearId();
    if (yearId) {
      rooms.push(`academic-year:${yearId}`);
    }

    this.sse.connect({
      rooms,
      eventTypes: [EventType.DEAN_STATS_UPDATED],
    });
  }

  onPublish(): void {
    this.errorMessage.set('');
    this.publishLoading.set(true);

    this.api
      .publishStats(this.selectedAcademicYearId() ?? undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {},
        error: (err: unknown) => {
          this.errorMessage.set(err instanceof Error ? err.message : 'Failed to publish stats.');
        },
        complete: () => {
          this.publishLoading.set(false);
        },
      });
  }

  dismissAlert(alertId: string): void {
    // Could track dismissed alerts in localStorage or service
    console.log('Dismissed alert:', alertId);
  }

  private formatAcademicYearLabel(ay: AcademicYearDto): string {
    const startYear = this.safeYear(ay.start);
    const endYear = this.safeYear(ay.end);
    if (startYear && endYear) return `${startYear}–${endYear}`;
    return `${ay.start} → ${ay.end}`;
  }

  private safeYear(dateString: string): string | null {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return null;
    return String(d.getFullYear());
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

  private getEmptyParticipation(): ParticipationAnalyticsDto {
    return {
      totalInvitations: 0,
      totalParticipants: 0,
      participationRate: 0,
      completionRate: 0,
      byStatus: [],
      averageTimeToStart: 0,
      averageCompletionTime: 0,
    };
  }

  // =============================
  // Chart data builders
  // =============================

  get scoreDistributionChartData(): any {
    const dist = this.scoreDistribution();
    return {
      labels: dist.buckets.map(b => b.range),
      datasets: [
        {
          label: 'Students',
          data: dist.buckets.map(b => b.count),
          backgroundColor: ['#10b981', '#22c55e', '#eab308', '#f97316', '#ef4444'],
          borderRadius: 6,
        },
      ],
    };
  }

  get participationChartData(): any {
    const p = this.stats()?.participation;
    return {
      labels: ['Invited', 'In Progress', 'Completed', 'Missed'],
      datasets: [
        {
          data: [
            p?.invited ?? 0,
            p?.inProgress ?? 0,
            p?.completed ?? 0,
            p?.missed ?? 0,
          ],
          backgroundColor: ['#64748b', '#3b82f6', '#10b981', '#ef4444'],
          borderWidth: 0,
        },
      ],
    };
  }

  get participationRateChartData(): any {
    const part = this.participation();
    return {
      labels: ['Participation', 'Completion'],
      datasets: [
        {
          label: 'Rate %',
          data: [part.participationRate, part.completionRate],
          backgroundColor: ['#3572ef', '#10b981'],
          borderRadius: 6,
        },
      ],
    };
  }

  get healthGaugeData(): any {
    const score = this.healthScore();
    return {
      labels: ['Health Score', 'Remaining'],
      datasets: [
        {
          data: [score, 100 - score],
          backgroundColor: [
            score >= 80 ? '#10b981' : score >= 60 ? '#eab308' : '#ef4444',
            '#e2e8f0',
          ],
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
        },
      ],
    };
  }

  get doughnutOptions(): any {
    return {
      cutout: '70%',
      plugins: {
        legend: { position: 'bottom' as const },
        tooltip: { enabled: true },
      },
    };
  }

  get gaugeOptions(): any {
    return {
      cutout: '80%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    };
  }

  get barOptions(): any {
    return {
      indexAxis: 'y' as const,
      scales: {
        x: { beginAtZero: true, ticks: { precision: 0 } },
      },
      plugins: {
        legend: { display: false },
      },
    };
  }

  get verticalBarOptions(): any {
    return {
      scales: {
        y: { beginAtZero: true, max: 100 },
      },
      plugins: {
        legend: { display: false },
      },
    };
  }

  // Helper for KPI trend icons
  getTrendIcon(trend?: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up':
        return 'trending_up';
      case 'down':
        return 'trending_down';
      default:
        return 'trending_flat';
    }
  }

  getTrendColor(trend?: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up':
        return 'success';
      case 'down':
        return 'danger';
      default:
        return 'neutral';
    }
  }

  getAlertIcon(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  }

  getImpactColor(impact: string): 'success' | 'warning' | 'info' {
    switch (impact) {
      case 'high':
        return 'success';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  }
}
