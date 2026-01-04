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

  rows: MiniAdminDto[] = [];
  specialities: SpecialityDto[] = [];

  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'surname', label: 'Surname' },
    { key: 'email', label: 'Email' },
    { key: 'login', label: 'Login' },
    { key: 'speciality', label: 'Speciality' },
    { key: 'updatedAt', label: 'Updated' },
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
      this.rows = await firstValueFrom(this.deanApi.listMiniAdmins());
      this.specialities = await firstValueFrom(this.deanApi.listSpecialities());
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load mini admins.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
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
          specialityId: this.form.specialityId || null,
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

    const name = `${row.user?.name ?? ''} ${row.user?.surname ?? ''}`.trim() || 'this mini admin';
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
    return this.modalMode === 'create' ? 'Create Mini Admin' : 'Edit Mini Admin';
  }

  specialityOptions(): DropdownOption<string>[] {
    const opts: DropdownOption<string>[] = [{ value: '', label: '-- No Speciality --' }];
    for (const s of this.specialities) {
      opts.push({ value: s.id, label: s.name });
    }
    return opts;
  }
}
