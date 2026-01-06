import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
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
  SelectComponent,
  type TableColumn,
  type DropdownOption,
} from '../../../components/ui';
import type { PaginationConfig, SortEvent } from '../../../components/ui/tables/table/table.component';
import type { SpecialityDto, MiniAdminDto } from '../../../domain/dtos/dean/dean-shared.dto';
import { DeanApiService } from '../../../services/dean-api.service';

type ModalMode = 'create' | 'edit' | 'assign';

@Component({
  selector: 'app-dean-specialities',
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
  templateUrl: './dean-specialities.html',
  styleUrl: './dean-specialities.scss',
})
export class DeanSpecialities {
  private readonly deanApi = inject(DeanApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = false;
  errorMessage = '';

  allRows: SpecialityDto[] = [];
  rows: SpecialityDto[] = [];
  miniAdmins: MiniAdminDto[] = [];

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
    { key: 'head', label: 'Head', sortable: true },
    { key: 'updatedAt', label: 'Updated', sortable: true },
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
      this.allRows = await firstValueFrom(this.deanApi.listSpecialities());
      this.miniAdmins = await firstValueFrom(this.deanApi.listMiniAdmins());
      this.pagination.total = this.allRows.length;
      this.pagination.page = 1;
      this.updateDisplayedRows();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load specialities.';
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
        let aVal: any;
        let bVal: any;

        // Handle nested head property
        if (this.sortColumn === 'head') {
          aVal = a.head?.user ? `${a.head.user.name} ${a.head.user.surname}` : '';
          bVal = b.head?.user ? `${b.head.user.name} ${b.head.user.surname}` : '';
        } else {
          aVal = (a as any)[this.sortColumn!] ?? '';
          bVal = (b as any)[this.sortColumn!] ?? '';
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
