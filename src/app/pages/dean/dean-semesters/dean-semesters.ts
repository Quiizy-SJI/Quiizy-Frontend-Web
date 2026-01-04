import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import type { AcademicYearDto, ClassAcademicYearDto, SemesterDto } from '../../../domain/dtos/dean/dean-shared.dto';
import type { CreateSemesterDto, UpdateSemesterDto } from '../../../domain/dtos/dean/semester.dto';
import { DeanApiService } from '../../../services/dean-api.service';

type ModalMode = 'create' | 'edit';

type SemesterForm = {
  name: string;
  shortCode: string;
  classAcademicYearId: string;
  startDate: string;
  endDate: string;
  status: string;
};

@Component({
  selector: 'app-dean-semesters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  semesters: SemesterDto[] = [];

  selectedAcademicYearId: string | null = null;

  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'shortCode', label: 'Code' },
    { key: 'status', label: 'Status' },
    { key: 'class', label: 'Class' },
    { key: 'academicYear', label: 'Academic Year' },
    { key: 'dates', label: 'Dates' },
    { key: 'updatedAt', label: 'Updated' },
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

  readonly statusOptions: DropdownOption<string>[] = [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'ONGOING', label: 'Ongoing' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

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
      this.semesters = await firstValueFrom(this.deanApi.listSemesters(academicYearId));
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load semesters.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
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
      startDate: row.startDate ?? '',
      endDate: row.endDate ?? '',
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
          startDate: this.form.startDate ? this.form.startDate : undefined,
          endDate: this.form.endDate ? this.form.endDate : undefined,
        };
        await firstValueFrom(this.deanApi.createSemester(dto));
      } else if (this.editingId) {
        const dto: UpdateSemesterDto = {
          name: this.form.name.trim(),
          shortCode: this.form.shortCode.trim(),
          status: this.form.status,
          startDate: this.form.startDate ? this.form.startDate : undefined,
          endDate: this.form.endDate ? this.form.endDate : undefined,
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
    const start = row.startDate ? row.startDate : '';
    const end = row.endDate ? row.endDate : '';
    if (!start && !end) return '';
    if (start && end) return `${start} → ${end}`;
    return start || end;
  }

  modalTitle(): string {
    return this.modalMode === 'create' ? 'Create Semester' : 'Edit Semester';
  }
}
