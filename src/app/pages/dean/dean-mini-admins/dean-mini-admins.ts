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
import type { MiniAdminDto, SpecialityDto } from '../../../domain/dtos/dean/dean-shared.dto';
import type { UpdateMiniAdminDto } from '../../../domain/dtos/dean/mini-admin.dto';
import { DeanApiService } from '../../../services/dean-api.service';

type ModalMode = 'create' | 'edit';

type MiniAdminForm = {
  name: string;
  surname: string;
  email: string;
  login: string;
  password: string;
  specialityId: string;
};

@Component({
  selector: 'app-dean-mini-admins',
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
  templateUrl: './dean-mini-admins.html',
  styleUrl: './dean-mini-admins.scss',
})
export class DeanMiniAdmins {
  private readonly deanApi = inject(DeanApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = false;
  errorMessage = '';

  allRows: MiniAdminDto[] = [];
  rows: MiniAdminDto[] = [];
  specialities: SpecialityDto[] = [];

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
    { key: 'surname', label: 'Surname', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'login', label: 'Login', sortable: true },
    { key: 'speciality', label: 'Speciality', sortable: true },
    { key: 'updatedAt', label: 'Updated', sortable: true },
    { key: 'actions', label: 'Actions', width: '240px' },
  ];

  // modal/form state
  isModalOpen = false;
  modalMode: ModalMode = 'create';
  editingId: string | null = null;

  form: MiniAdminForm = {
    name: '',
    surname: '',
    email: '',
    login: '',
    password: '',
    specialityId: '',
  };

  saveLoading = false;

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      this.allRows = await firstValueFrom(this.deanApi.listMiniAdmins());
      this.specialities = await firstValueFrom(this.deanApi.listSpecialities());
      this.pagination.total = this.allRows.length;
      this.pagination.page = 1;
      this.updateDisplayedRows();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load Speciality Head.';
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

        // Handle nested user properties
        switch (this.sortColumn) {
          case 'name':
            aVal = a.user?.name ?? '';
            bVal = b.user?.name ?? '';
            break;
          case 'surname':
            aVal = a.user?.surname ?? '';
            bVal = b.user?.surname ?? '';
            break;
          case 'email':
            aVal = a.user?.email ?? '';
            bVal = b.user?.email ?? '';
            break;
          case 'login':
            aVal = a.user?.login ?? '';
            bVal = b.user?.login ?? '';
            break;
          case 'speciality':
            aVal = a.speciality?.name ?? '';
            bVal = b.speciality?.name ?? '';
            break;
          default:
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
    this.form = { name: '', surname: '', email: '', login: '', password: '', specialityId: '' };
    this.isModalOpen = true;
  }

  openEdit(row: MiniAdminDto): void {
    this.modalMode = 'edit';
    this.editingId = row.id;
    this.form = {
      name: row.user?.name ?? '',
      surname: row.user?.surname ?? '',
      email: row.user?.email ?? '',
      login: row.user?.login ?? '',
      password: '',
      specialityId: row.speciality?.id ?? '',
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
    if (!this.form.surname.trim()) {
      this.errorMessage = 'Surname is required.';
      return false;
    }
    if (!this.form.email.trim()) {
      this.errorMessage = 'Email is required.';
      return false;
    }
    if (!this.form.login.trim()) {
      this.errorMessage = 'Login is required.';
      return false;
    }
    if (this.modalMode === 'create' && !this.form.password) {
      this.errorMessage = 'Password is required.';
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
        await firstValueFrom(
          this.deanApi.createMiniAdmin({
            name: this.form.name.trim(),
            surname: this.form.surname.trim(),
            email: this.form.email.trim(),
            login: this.form.login.trim(),
            password: this.form.password,
            specialityId: this.form.specialityId || undefined,
          }),
        );
      } else if (this.editingId) {
        const dto: UpdateMiniAdminDto = {
          name: this.form.name.trim(),
          surname: this.form.surname.trim(),
          email: this.form.email.trim(),
          login: this.form.login.trim(),
          specialityId: String(this.form.specialityId) || null,
        };
        if (this.form.password) dto.password = this.form.password;

        await firstValueFrom(this.deanApi.updateMiniAdmin(this.editingId, dto));
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

  async delete(row: MiniAdminDto): Promise<void> {
    this.errorMessage = '';

    const name = `${row.user?.name ?? ''} ${row.user?.surname ?? ''}`.trim() || 'this Speciality Head';
    const ok = confirm(`Delete ${name}?`);
    if (!ok) return;

    try {
      await firstValueFrom(this.deanApi.deleteMiniAdmin(row.id));
      await this.load();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Delete failed.';
    }
  }

  modalTitle(): string {
    return this.modalMode === 'create' ? 'Create Speciality Head' : 'Edit Speciality Head';
  }

  specialityOptions(): DropdownOption<string>[] {
    const opts: DropdownOption<string>[] = [{ value: '', label: '-- No Speciality --' }];
    for (const s of this.specialities) {
      opts.push({ value: s.id, label: s.name });
    }
    return opts;
  }
}
