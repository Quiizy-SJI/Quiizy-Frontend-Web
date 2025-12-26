import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import {
  AlertComponent,
  ButtonComponent,
  CardComponent,
  SelectComponent,
  SpinnerComponent,
  TableComponent,
  type DropdownOption,
  type TableColumn,
} from '../../../components/ui';
import type { AcademicYearDto } from '../../../domain/dtos/dean/dean-shared.dto';
import type { DeanAiAnalyticsDto } from '../../../domain/dtos/dean/ai-analytics.dto';
import { DeanApiService } from '../../../services/dean-api.service';

type HardestQuestionRow = {
  questionId: string;
  attempts: number;
  avgMark: number;
};

@Component({
  selector: 'app-dean-ai-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    TableComponent,
    ButtonComponent,
    SelectComponent,
    AlertComponent,
    SpinnerComponent,
  ],
  templateUrl: './dean-ai-analytics.html',
  styleUrl: './dean-ai-analytics.scss',
})
export class DeanAiAnalytics {
  private readonly deanApi = inject(DeanApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = false;
  errorMessage = '';

  academicYears: AcademicYearDto[] = [];
  selectedAcademicYearId: string | null = null;

  analytics: DeanAiAnalyticsDto | null = null;

  readonly columns: TableColumn[] = [
    { key: 'questionId', label: 'Question ID' },
    { key: 'attempts', label: 'Attempts' },
    { key: 'avgMark', label: 'Avg Mark' },
  ];

  async ngOnInit(): Promise<void> {
    await this.loadAcademicYears();
    await this.loadAnalytics();
  }

  academicYearOptions(): DropdownOption<string>[] {
    const opts: DropdownOption<string>[] = [{ value: '', label: 'All academic years' }];
    for (const ay of this.academicYears) {
      opts.push({ value: ay.id, label: `${ay.start}–${ay.end}` });
    }
    return opts;
  }

  async loadAcademicYears(): Promise<void> {
    this.errorMessage = '';

    try {
      this.academicYears = await firstValueFrom(this.deanApi.listAcademicYears());
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load academic years.';
    }
  }

  async loadAnalytics(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      const academicYearId = this.selectedAcademicYearId || undefined;
      this.analytics = await firstValueFrom(this.deanApi.getAiAnalytics(academicYearId));
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load AI analytics.';
      this.analytics = null;
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  async onFilterChanged(): Promise<void> {
    await this.loadAnalytics();
  }

  rows(): HardestQuestionRow[] {
    return this.analytics?.insights?.hardestQuestions ?? [];
  }

  formatAvg(row: HardestQuestionRow): string {
    if (row.avgMark === null || row.avgMark === undefined) return '';
    return Number(row.avgMark).toFixed(2);
  }
}
