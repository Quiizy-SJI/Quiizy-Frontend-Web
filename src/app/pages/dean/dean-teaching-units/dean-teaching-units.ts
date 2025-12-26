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
  type TableColumn,
} from '../../../components/ui';
import type { TeachingUnitDto } from '../../../domain/dtos/dean/dean-shared.dto';
import { DeanApiService } from '../../../services/dean-api.service';

type ModalMode = 'create' | 'edit';

@Component({
  selector: 'app-dean-teaching-units',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    InputComponent,
    AlertComponent,
    SpinnerComponent,
  ],
  templateUrl: './dean-teaching-units.html',
  styleUrl: './dean-teaching-units.scss',
})
export class DeanTeachingUnits {
  private readonly deanApi = inject(DeanApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = false;
  errorMessage = '';

  rows: TeachingUnitDto[] = [];

  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'updatedAt', label: 'Updated' },
    { key: 'actions', label: 'Actions', width: '220px' },
  ];

  // modal/form state
  isModalOpen = false;
  modalMode: ModalMode = 'create';
  editingId: string | null = null;

  formName = '';
  saveLoading = false;

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      this.rows = await firstValueFrom(this.deanApi.listTeachingUnits());
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load teaching units.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  openCreate(): void {
    this.modalMode = 'create';
    this.editingId = null;
    this.formName = '';
    this.isModalOpen = true;
  }

  openEdit(row: TeachingUnitDto): void {
    this.modalMode = 'edit';
    this.editingId = row.id;
    this.formName = row.name ?? '';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.saveLoading = false;
  }

  async save(): Promise<void> {
    this.errorMessage = '';

    if (!this.formName.trim()) {
      this.errorMessage = 'Name is required.';
      return;
    }

    this.saveLoading = true;

    try {
      if (this.modalMode === 'create') {
        await firstValueFrom(this.deanApi.createTeachingUnit({ name: this.formName.trim() }));
      } else if (this.editingId) {
        await firstValueFrom(this.deanApi.updateTeachingUnit(this.editingId, { name: this.formName.trim() }));
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

  async delete(row: TeachingUnitDto): Promise<void> {
    this.errorMessage = '';

    const ok = confirm(`Delete teaching unit ${row.name}?`);
    if (!ok) return;

    try {
      await firstValueFrom(this.deanApi.deleteTeachingUnit(row.id));
      await this.load();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Delete failed.';
    }
  }

  modalTitle(): string {
    return this.modalMode === 'create' ? 'Create Teaching Unit' : 'Edit Teaching Unit';
  }
}
