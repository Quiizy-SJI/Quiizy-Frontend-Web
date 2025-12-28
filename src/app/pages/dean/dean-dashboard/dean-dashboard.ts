import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

import {
  AlertComponent,
  ButtonComponent,
  CardComponent,
  SelectComponent,
  SpinnerComponent,
  StatCardComponent,
  type DropdownOption,
} from '../../../components/ui';
import { DeanApiService } from '../../../services/dean-api.service';
import { SseService } from '../../../realtime/sse.service';
import { EventType } from '../../../realtime/event-types';
import { ChartHostComponent } from '../../../components/charts/chart-host/chart-host.component';

import type { AcademicYearDto } from '../../../domain/dtos/dean/dean-shared.dto';
import type { DeanDashboardStatsDto } from '../../../domain/dtos/dean/stats.dto';

@Component({
  selector: 'app-dean-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    StatCardComponent,
    SelectComponent,
    ButtonComponent,
    SpinnerComponent,
    AlertComponent,
    ChartHostComponent,
  ],
  templateUrl: './dean-dashboard.html',
  styleUrl: './dean-dashboard.scss',
})
export class DeanDashboard {
  private readonly api = inject(DeanApiService);
  private readonly sse = inject(SseService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = false;
  errorMessage = '';

  publishLoading = false;

  academicYears: AcademicYearDto[] = [];
  selectedAcademicYearId: string | null = null;

  stats: DeanDashboardStatsDto | null = null;

  get academicYearOptions(): Array<DropdownOption<string | null>> {
    const base: Array<DropdownOption<string | null>> = [
      { value: null, label: 'All years' },
    ];

    const years = this.academicYears.map((ay) => ({
      value: ay.id,
      label: this.formatAcademicYearLabel(ay),
    }));

    return [...base, ...years];
  }

  readonly connectionState$ = this.sse.connectionState$;

  constructor() {
    void this.loadInitial();

    this.sse
      .on<DeanDashboardStatsDto>(EventType.DEAN_STATS_UPDATED)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((evt) => {
        this.stats = evt.data;
      });
  }

  private async loadInitial(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.academicYears = await firstValueFrom(this.api.listAcademicYears());
      await this.refreshStats();
      this.connectSse();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  async onAcademicYearChange(value: string | null): Promise<void> {
    this.selectedAcademicYearId = value;
    await this.refreshStats();
    this.connectSse();
  }

  async refreshStats(): Promise<void> {
    this.errorMessage = '';

    try {
      this.stats = await firstValueFrom(
        this.api.getStats(this.selectedAcademicYearId ?? undefined),
      );
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load stats.';
    }
  }

  connectSse(): void {
    const rooms = ['role:DEAN'];
    if (this.selectedAcademicYearId) {
      rooms.push(`academic-year:${this.selectedAcademicYearId}`);
    }

    this.sse.connect({
      rooms,
      eventTypes: [EventType.DEAN_STATS_UPDATED],
    });
  }

  onPublish(): void {
    this.errorMessage = '';
    this.publishLoading = true;

    this.api
      .publishStats(this.selectedAcademicYearId ?? undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {},
        error: (err: unknown) => {
          this.errorMessage = err instanceof Error ? err.message : 'Failed to publish stats.';
        },
        complete: () => {
          this.publishLoading = false;
        },
      });
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

  // =============================
  // Chart data builders
  // =============================
  get participationChartData(): any {
    const p = this.stats?.participation;
    const invited = p?.invited ?? 0;
    const inProgress = p?.inProgress ?? 0;
    const completed = p?.completed ?? 0;
    const missed = p?.missed ?? 0;
    return {
      labels: ['Invited', 'In progress', 'Completed', 'Missed'],
      datasets: [
        {
          data: [invited, inProgress, completed, missed],
          backgroundColor: ['#64748b', '#3b82f6', '#10b981', '#ef4444'],
          borderWidth: 0,
        },
      ],
    };
  }

  get totalsChartData(): any {
    const t = this.stats?.totals;
    const labels = ['Academic Years', 'Classes', 'Students', 'Teachers', 'Units', 'Quizzes', 'Questions'];
    const data = [
      t?.academicYears ?? 0,
      t?.classes ?? 0,
      t?.students ?? 0,
      t?.teachers ?? 0,
      t?.teachingUnits ?? 0,
      t?.quizzes ?? 0,
      t?.questions ?? 0,
    ];
    return {
      labels,
      datasets: [
        {
          label: 'Totals',
          data,
          backgroundColor: '#3572ef',
          borderRadius: 6,
        },
      ],
    };
  }

  get scoresChartData(): any {
    const s = this.stats?.scores;
    const avgPct = (s?.averagePercent ?? 0) as number;
    const avgRaw = (s?.averageRawScore ?? 0) as number;
    const avgTotal = (s?.averageTotalMarks ?? 0) as number;
    return {
      labels: ['Avg %', 'Avg Raw', 'Avg Total'],
      datasets: [
        {
          label: 'Scores',
          data: [avgPct, avgRaw, avgTotal],
          backgroundColor: ['#3572ef', '#8b5cf6', '#06b6d4'],
          borderRadius: 6,
        },
      ],
    };
  }

  get doughnutOptions(): any {
    return {
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true },
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
