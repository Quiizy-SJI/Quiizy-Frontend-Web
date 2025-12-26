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
  SpinnerComponent,
  TableComponent,
  ToggleComponent,
  type TableColumn,
} from '../../../components/ui';
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

  rows: ExamTypeDto[] = [];

  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'active', label: 'Active' },
    { key: 'updatedAt', label: 'Updated' },
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
      this.rows = await firstValueFrom(this.deanApi.listExamTypes());
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load exam types.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
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
