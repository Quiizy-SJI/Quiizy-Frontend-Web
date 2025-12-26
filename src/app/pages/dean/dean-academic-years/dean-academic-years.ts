import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import {
  AlertComponent,
  ButtonComponent,
  CardComponent,
  CheckboxComponent,
  InputComponent,
  ModalComponent,
  SpinnerComponent,
  TableComponent,
  type TableColumn,
} from '../../../components/ui';
import type { AcademicYearDto } from '../../../domain/dtos/dean/dean-shared.dto';
import { DeanApiService } from '../../../services/dean-api.service';

type ModalMode = 'create' | 'edit';

@Component({
  selector: 'app-dean-academic-years',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    InputComponent,
    CheckboxComponent,
    AlertComponent,
    SpinnerComponent,
  ],
  templateUrl: './dean-academic-years.html',
  styleUrl: './dean-academic-years.scss',
})
export class DeanAcademicYears {
  private readonly deanApi = inject(DeanApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = false;
  errorMessage = '';

  rows: AcademicYearDto[] = [];

  readonly columns: TableColumn[] = [
    { key: 'start', label: 'Start', sortable: true },
    { key: 'end', label: 'End', sortable: true },
    { key: 'classesCount', label: 'Classes' },
    { key: 'updatedAt', label: 'Updated' },
    { key: 'actions', label: 'Actions', width: '220px' },
  ];

  // modal/form state
  isModalOpen = false;
  modalMode: ModalMode = 'create';
  editingId: string | null = null;

  formStart = '';
  formEnd = '';
  formCloneClasses = true;

  saveLoading = false;

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      this.rows = await firstValueFrom(this.deanApi.listAcademicYears());
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load academic years.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  openCreate(): void {
    this.modalMode = 'create';
    this.editingId = null;
    this.formStart = '';
    this.formEnd = '';
    this.formCloneClasses = true;
    this.isModalOpen = true;
  }

  openEdit(row: AcademicYearDto): void {
    this.modalMode = 'edit';
    this.editingId = row.id;
    this.formStart = row.start;
    this.formEnd = row.end;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.saveLoading = false;
  }

  async save(): Promise<void> {
    this.errorMessage = '';

    if (!this.formStart.trim() || !this.formEnd.trim()) {
      this.errorMessage = 'Start and end are required.';
      return;
    }

    this.saveLoading = true;

    try {
      if (this.modalMode === 'create') {
        await firstValueFrom(
          this.deanApi.createAcademicYear({
            start: this.formStart.trim(),
            end: this.formEnd.trim(),
            cloneClassesFromLatest: this.formCloneClasses,
          }),
        );
      } else if (this.editingId) {
        await firstValueFrom(
          this.deanApi.updateAcademicYear(this.editingId, {
            start: this.formStart.trim(),
            end: this.formEnd.trim(),
          }),
        );
      }

      this.closeModal();
      await this.load();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Save failed.';
    } finally {
      this.saveLoading = false;
      this.cdr.markForCheck();
    }
  }

  async delete(row: AcademicYearDto): Promise<void> {
    this.errorMessage = '';

    const ok = confirm(`Delete academic year ${row.start}–${row.end}?`);
    if (!ok) return;

    try {
      await firstValueFrom(this.deanApi.deleteAcademicYear(row.id));
      await this.load();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Delete failed.';
    }
  }

  classesCount(row: AcademicYearDto): number {
    return row.classAcademicYears?.length ?? 0;
  }

  modalTitle(): string {
    return this.modalMode === 'create' ? 'Create Academic Year' : 'Edit Academic Year';
  }
}
