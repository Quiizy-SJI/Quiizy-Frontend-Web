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
}
