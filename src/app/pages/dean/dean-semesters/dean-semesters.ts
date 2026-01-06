import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';

import {
  AlertComponent,
  ButtonComponent,
  CardComponent,
  InputComponent,
  ModalComponent,
  SelectComponent,
  SpinnerComponent,
  TableComponent,
  type DropdownOption,
  type TableColumn,
} from '../../../components/ui';
import type { PaginationConfig, SortEvent } from '../../../components/ui/tables/table/table.component';
import type {
  AcademicYearDto,
  ClassAcademicYearDto,
  SemesterDto,
  SemesterStatus,
} from '../../../domain/dtos/dean/dean-shared.dto';
import type { CreateSemesterDto, UpdateSemesterDto } from '../../../domain/dtos/dean/semester.dto';
import { DeanApiService } from '../../../services/dean-api.service';

type ModalMode = 'create' | 'edit';

type SemesterForm = {
  name: string;
  shortCode: string;
  classAcademicYearId: string;
  startDate: Date | string;
  endDate: Date | string ;
  status: SemesterStatus;
};

@Component({
  selector: 'app-dean-semesters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    CardComponent,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    InputComponent,
    SelectComponent,
    AlertComponent,
    SpinnerComponent,
  ],
  templateUrl: './dean-semesters.html',
  styleUrl: './dean-semesters.scss',
})
export class DeanSemesters {
  private readonly deanApi = inject(DeanApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = false;
  errorMessage = '';

  academicYears: AcademicYearDto[] = [];
  allSemesters: SemesterDto[] = [];
  semesters: SemesterDto[] = [];

  selectedAcademicYearId: string | null = null;

  // Pagination state
  pagination: PaginationConfig = {
    page: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [5, 10, 25, 50],
  };

  // Sort state
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'shortCode', label: 'Code', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'class', label: 'Class' },
    { key: 'academicYear', label: 'Academic Year' },
    { key: 'dates', label: 'Dates' },
    { key: 'updatedAt', label: 'Updated', sortable: true },
    { key: 'actions', label: 'Actions', width: '240px' },
  ];

  // modal/form state
  isModalOpen = false;
  modalMode: ModalMode = 'create';
  editingId: string | null = null;

  form: SemesterForm = {
    name: '',
    shortCode: '',
    classAcademicYearId: '',
    startDate: '',
    endDate: '',
    status: 'SCHEDULED',
  };

  saveLoading = false;

  readonly statusOptions: DropdownOption<SemesterStatus>[] = [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ACTION_NEEDED', label: 'Action needed' },
    { value: 'ARCHIVED', label: 'Archived' },
  ];

  private toDateInputValue(value?: string | null): string {
    if (!value) return '';
    // Backend serializes DATE columns as ISO strings; normalize to YYYY-MM-DD for the UI.
    return value.length >= 10 ? value.slice(0, 10) : value;
  }

  /**
   * Convert Date | string to ISO date string (YYYY-MM-DD) for backend.
   * Returns undefined if input is empty/falsy.
   */
  private toIsoDateString(value: Date | string | null | undefined): string | undefined {
    if (!value) return undefined;
    if (value instanceof Date) {
      // Convert Date to ISO string (YYYY-MM-DD)
      return value.toISOString().slice(0, 10);
    }
    // If it's already a string, ensure it's in YYYY-MM-DD format
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    // If string has time component (e.g. from datetime), extract just the date
    return trimmed.length >= 10 ? trimmed.slice(0, 10) : trimmed;
  }

  async ngOnInit(): Promise<void> {
    await this.loadAcademicYears();
    await this.loadSemesters();
  }

  academicYearOptions(): DropdownOption<string>[] {
    const opts: DropdownOption<string>[] = [{ value: '', label: 'All academic years' }];
    for (const ay of this.academicYears) {
      opts.push({ value: ay.id, label: `${ay.start}–${ay.end}` });
    }
    return opts;
  }

  classAcademicYearOptions(): DropdownOption<string>[] {
    const items: ClassAcademicYearDto[] = [];
    for (const ay of this.academicYears) {
      if (this.selectedAcademicYearId && ay.id !== this.selectedAcademicYearId) continue;
      for (const cay of ay.classAcademicYears ?? []) items.push(cay);
    }

    return items
      .filter((cay) => !!cay.class?.name)
      .map((cay) => ({
        value: cay.id,
        label: `${cay.class?.name ?? 'Class'} (${cay.academicYear?.start ?? ''}–${cay.academicYear?.end ?? ''})`.trim(),
      }));
  }

  async loadAcademicYears(): Promise<void> {
    this.errorMessage = '';

    try {
      this.academicYears = await firstValueFrom(this.deanApi.listAcademicYears());
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load academic years.';
    }
  }

  async loadSemesters(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      const academicYearId = this.selectedAcademicYearId || undefined;
      this.allSemesters = await firstValueFrom(this.deanApi.listSemesters(academicYearId));
      this.pagination.total = this.allSemesters.length;
      this.pagination.page = 1;
      this.updateDisplayedRows();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load semesters.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  private updateDisplayedRows(): void {
    let data = [...this.allSemesters];

    // Sort data
    if (this.sortColumn && this.sortDirection) {
      data = data.sort((a, b) => {
        const aVal = (a as any)[this.sortColumn!] ?? '';
        const bVal = (b as any)[this.sortColumn!] ?? '';
        const comparison = String(aVal).localeCompare(String(bVal));
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    // Paginate
    const start = (this.pagination.page - 1) * this.pagination.pageSize;
    const end = start + this.pagination.pageSize;
    this.semesters = data.slice(start, end);
  }

  onSortChange(event: SortEvent): void {
    this.sortColumn = event.column || null;
    this.sortDirection = event.direction;
    this.updateDisplayedRows();
    this.cdr.markForCheck();
  }

  onPageChange(page: number): void {
    this.pagination.page = page;
    this.updateDisplayedRows();
    this.cdr.markForCheck();
  }

  onPageSizeChange(pageSize: number): void {
    this.pagination.pageSize = pageSize;
    this.pagination.page = 1;
    this.updateDisplayedRows();
    this.cdr.markForCheck();
  }

  async onFilterChanged(): Promise<void> {
    await this.loadSemesters();
  }

  openCreate(): void {
    this.modalMode = 'create';
    this.editingId = null;

    const classOptions = this.classAcademicYearOptions();

    this.form = {
      name: '',
      shortCode: '',
      classAcademicYearId: classOptions[0]?.value ?? '',
      startDate: '',
      endDate: '',
      status: 'SCHEDULED',
    };

    this.isModalOpen = true;
  }

  openEdit(row: SemesterDto): void {
    this.modalMode = 'edit';
    this.editingId = row.id;

    this.form = {
      name: row.name ?? '',
      shortCode: row.shortCode ?? '',
      classAcademicYearId: row.classAcademicYear?.id ?? '',
      startDate: this.toDateInputValue(row.startDate),
      endDate: this.toDateInputValue(row.endDate),
      status: row.status ?? 'SCHEDULED',
    };

    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.saveLoading = false;
  }

  private validateForm(): boolean {
    if (!this.form.name.trim()) {
      this.errorMessage = 'Name is required.';
      return false;
    }
    if (!this.form.shortCode.trim()) {
      this.errorMessage = 'Short code is required.';
      return false;
    }
    if (!this.form.classAcademicYearId) {
      this.errorMessage = 'Class academic year is required.';
      return false;
    }
    return true;
  }

  async save(): Promise<void> {
    this.errorMessage = '';
    if (!this.validateForm()) return;

    this.saveLoading = true;

    try {
      if (this.modalMode === 'create') {
        const dto: CreateSemesterDto = {
          name: this.form.name.trim(),
          shortCode: this.form.shortCode.trim(),
          classAcademicYearId: this.form.classAcademicYearId,
          status: this.form.status,
          startDate: this.toIsoDateString(this.form.startDate),
          endDate: this.toIsoDateString(this.form.endDate),
        };
        await firstValueFrom(this.deanApi.createSemester(dto));
      } else if (this.editingId) {
        const dto: UpdateSemesterDto = {
          name: this.form.name.trim(),
          shortCode: this.form.shortCode.trim(),
          status: this.form.status,
          startDate: this.toIsoDateString(this.form.startDate),
          endDate: this.toIsoDateString(this.form.endDate),
        };
        await firstValueFrom(this.deanApi.updateSemester(this.editingId, dto));
      }

      this.closeModal();
      await this.loadSemesters();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Save failed.';
    } finally {
      this.saveLoading = false;
      this.cdr.markForCheck();
    }
  }

  async delete(row: SemesterDto): Promise<void> {
    this.errorMessage = '';

    const ok = confirm(`Delete semester ${row.name}?`);
    if (!ok) return;

    try {
      await firstValueFrom(this.deanApi.deleteSemester(row.id));
      await this.loadSemesters();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Delete failed.';
    }
  }

  formatAcademicYear(row: SemesterDto): string {
    const ay = row.classAcademicYear?.academicYear;
    if (!ay) return '';
    return `${ay.start}–${ay.end}`;
  }

  formatDates(row: SemesterDto): string {
    const start = this.toDateInputValue(row.startDate);
    const end = this.toDateInputValue(row.endDate);
    if (!start && !end) return '';
    if (start && end) return `${start} → ${end}`;
    return start || end;
  }

  modalTitle(): string {
    return this.modalMode === 'create' ? 'Create Semester' : 'Edit Semester';
  }
}
