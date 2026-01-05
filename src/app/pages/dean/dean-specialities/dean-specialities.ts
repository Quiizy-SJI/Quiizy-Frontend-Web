import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import {
  AlertComponent,
  ButtonComponent,
  CardComponent,
  InputComponent,
  ModalComponent,
  SpinnerComponent,
  TableComponent,
  SelectComponent,
  type TableColumn,
  type DropdownOption,
} from '../../../components/ui';
import type { SpecialityDto, MiniAdminDto } from '../../../domain/dtos/dean/dean-shared.dto';
import { DeanApiService } from '../../../services/dean-api.service';

type ModalMode = 'create' | 'edit' | 'assign';

@Component({
  selector: 'app-dean-specialities',
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
  templateUrl: './dean-specialities.html',
  styleUrl: './dean-specialities.scss',
})
export class DeanSpecialities {
  private readonly deanApi = inject(DeanApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = false;
  errorMessage = '';

  rows: SpecialityDto[] = [];
  miniAdmins: MiniAdminDto[] = [];

  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'head', label: 'Head' },
    { key: 'updatedAt', label: 'Updated' },
    { key: 'actions', label: 'Actions', width: '280px' },
  ];

  // modal/form state
  isModalOpen = false;
  modalMode: ModalMode = 'create';
  editingId: string | null = null;

  formName = '';
  saveLoading = false;

  // assign head state
  selectedHeadId: string | null = null;
  assignLoading = false;

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      this.rows = await firstValueFrom(this.deanApi.listSpecialities());
      this.miniAdmins = await firstValueFrom(this.deanApi.listMiniAdmins());
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load specialities.';
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

  openEdit(row: SpecialityDto): void {
    this.modalMode = 'edit';
    this.editingId = row.id;
    this.formName = row.name ?? '';
    this.isModalOpen = true;
  }

  openAssign(row: SpecialityDto): void {
    this.modalMode = 'assign';
    this.editingId = row.id;
    this.selectedHeadId = row.head?.id ?? null;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.saveLoading = false;
    this.assignLoading = false;
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
        await firstValueFrom(this.deanApi.createSpeciality({ name: this.formName.trim() }));
      } else if (this.modalMode === 'edit' && this.editingId) {
        await firstValueFrom(this.deanApi.updateSpeciality(this.editingId, { name: this.formName.trim() }));
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

  async assign(): Promise<void> {
    this.errorMessage = '';
    if (!this.editingId) return;

    this.assignLoading = true;
    try {
      const headId = this.selectedHeadId && this.selectedHeadId !== '' ? this.selectedHeadId : null;
      await firstValueFrom(this.deanApi.assignSpecialityHead(this.editingId, String(headId)));
      this.closeModal();
      await this.load();
    } catch (err: unknown) {
      if (err instanceof HttpErrorResponse) {
        const msg =
          typeof (err.error as { message?: unknown } | null)?.message === 'string'
            ? (err.error as { message: string }).message
            : err.message;
        this.errorMessage = msg || 'Assign failed.';
      } else if (err instanceof Error) {
        this.errorMessage = err.message;
      } else {
        this.errorMessage = 'Assign failed.';
      }
    } finally {
      this.assignLoading = false;
      this.cdr.markForCheck();
    }
  }

  async delete(row: SpecialityDto): Promise<void> {
    this.errorMessage = '';

    const ok = confirm(`Delete speciality ${row.name}?`);
    if (!ok) return;

    try {
      await firstValueFrom(this.deanApi.deleteSpeciality(row.id));
      await this.load();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Delete failed.';
    }
  }

  modalTitle(): string {
    if (this.modalMode === 'create') return 'Create Speciality';
    if (this.modalMode === 'edit') return 'Edit Speciality';
    return 'Assign Speciality Head';
  }

  miniAdminOptions(): DropdownOption<string | null>[] {
    const opts: DropdownOption<string | null>[] = [{ value: null, label: '-- Unassign --' }];
    for (const m of this.miniAdmins) {
      opts.push({ value: m.id, label: `${m.user.name} ${m.user.surname} (${m.user.email})` });
    }
    return opts;
  }
}
