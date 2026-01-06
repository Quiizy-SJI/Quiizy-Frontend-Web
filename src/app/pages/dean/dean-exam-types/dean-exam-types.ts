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
  SpinnerComponent,
  TableComponent,
  ToggleComponent,
  type TableColumn,
} from '../../../components/ui';
import type { PaginationConfig, SortEvent } from '../../../components/ui/tables/table/table.component';
import type { ExamTypeDto } from '../../../domain/dtos/dean/dean-shared.dto';
import { DeanApiService } from '../../../services/dean-api.service';

type ModalMode = 'create' | 'edit';

type ExamTypeForm = {
  name: string;
  description: string;
  active: boolean;
};

@Component({
  selector: 'app-dean-exam-types',
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
    ToggleComponent,
    AlertComponent,
    SpinnerComponent,
  ],
  templateUrl: './dean-exam-types.html',
  styleUrl: './dean-exam-types.scss',
})
export class DeanExamTypes {
  private readonly deanApi = inject(DeanApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = false;
  errorMessage = '';

  allRows: ExamTypeDto[] = [];
  rows: ExamTypeDto[] = [];

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
    { key: 'description', label: 'Description' },
    { key: 'active', label: 'Active', sortable: true },
    { key: 'updatedAt', label: 'Updated', sortable: true },
    { key: 'actions', label: 'Actions', width: '220px' },
  ];

  // modal/form state
  isModalOpen = false;
  modalMode: ModalMode = 'create';
  editingId: string | null = null;

  form: ExamTypeForm = {
    name: '',
    description: '',
    active: true,
  };

  saveLoading = false;

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      this.allRows = await firstValueFrom(this.deanApi.listExamTypes());
      this.pagination.total = this.allRows.length;
      this.pagination.page = 1;
      this.updateDisplayedRows();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load exam types.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  private updateDisplayedRows(): void {
    let data = [...this.allRows];

    // Sort data
    if (this.sortColumn && this.sortDirection) {
      data = data.sort((a, b) => {
        const aVal = (a as any)[this.sortColumn!] ?? '';
        const bVal = (b as any)[this.sortColumn!] ?? '';

        // Handle boolean 'active' field
        if (this.sortColumn === 'active') {
          const comparison = (aVal ? 1 : 0) - (bVal ? 1 : 0);
          return this.sortDirection === 'asc' ? comparison : -comparison;
        }

        const comparison = String(aVal).localeCompare(String(bVal));
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    // Paginate
    const start = (this.pagination.page - 1) * this.pagination.pageSize;
    const end = start + this.pagination.pageSize;
    this.rows = data.slice(start, end);
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

  openCreate(): void {
    this.modalMode = 'create';
    this.editingId = null;
    this.form = { name: '', description: '', active: true };
    this.isModalOpen = true;
  }

  openEdit(row: ExamTypeDto): void {
    this.modalMode = 'edit';
    this.editingId = row.id;
    this.form = {
      name: row.name ?? '',
      description: row.description ?? '',
      active: !!row.active,
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
    return true;
  }

  async save(): Promise<void> {
    this.errorMessage = '';
    if (!this.validateForm()) return;

    this.saveLoading = true;

    try {
      const dto = {
        name: this.form.name.trim(),
        description: this.form.description.trim() ? this.form.description.trim() : undefined,
        active: this.form.active,
      };

      if (this.modalMode === 'create') {
        await firstValueFrom(this.deanApi.createExamType(dto));
      } else if (this.editingId) {
        await firstValueFrom(this.deanApi.updateExamType(this.editingId, dto));
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

  async delete(row: ExamTypeDto): Promise<void> {
    this.errorMessage = '';

    const ok = confirm(`Delete exam type ${row.name}?`);
    if (!ok) return;

    try {
      await firstValueFrom(this.deanApi.deleteExamType(row.id));
      await this.load();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Delete failed.';
    }
  }

  modalTitle(): string {
    return this.modalMode === 'create' ? 'Create Exam Type' : 'Edit Exam Type';
  }
}
