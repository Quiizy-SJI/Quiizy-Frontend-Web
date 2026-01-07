import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import {
  AlertComponent,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  DropdownOption,
  InputComponent,
  ModalComponent,
  SelectComponent,
  TableComponent,
  TableColumn,
} from '../../../components/ui';

import { HeadService } from '../../../services/head.service';
import type { AcademicYearDto, ClassAcademicYearDto } from '../../../domain/dtos/teacher';
import { toString } from '../../../core/utils/payload-sanitizer';
import { downloadXlsx, getCell, readExcelFile } from '../../../core/utils/excel-utils';
import { pushHeadActivity } from '../../../core/utils/head-activity-store';

interface HeadStudentRow {
  id: string;
  matricule: string;
  name: string;
  surname: string;
  login: string;
  classAcademicYearId: string;
  className: string;
  level: string;
  academicYearId: string;
  academicYearLabel: string;
  email: string;
}

@Component({
  selector: 'app-head-students',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    TableComponent,
    ButtonComponent,
    SelectComponent,
    ModalComponent,
    InputComponent,
    AlertComponent,
    BadgeComponent,
  ],
  templateUrl: './head-students.html',
  styleUrl: './head-students.scss',
})
export class HeadStudents {
  private readonly headApi = inject(HeadService);

  // data
  academicYears: AcademicYearDto[] = [];
  classAcademicYears: ClassAcademicYearDto[] = [];
  students: any[] = [];

  rows: HeadStudentRow[] = [];
  filteredRows: HeadStudentRow[] = [];
  pagedRows: HeadStudentRow[] = [];

  pagination = { page: 1, pageSize: 5, total: 0, pageSizes: [5, 10, 25, 50] };

  selectedAcademicYearId = '';
  selectedLevel = '';

  selectedRows: HeadStudentRow[] = [];
  selectedRow: HeadStudentRow | null = null;

  // UI state
  loading = false;
  errorMessage = '';
  infoMessage = '';

  // modals
  createOpen = false;
  editOpen = false;
  deleteOpen = false;

  // form drafts
  draftMatricule = '';
  draftName = '';
  draftSurname = '';
  draftEmail = '';
  draftLogin = '';
  draftPassword = '';
  draftClassAcademicYearId = '';

  readonly columns: TableColumn<HeadStudentRow>[] = [
    { key: 'matricule', label: 'Matricule', sortable: true, width: '120px' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'surname', label: 'Surname', sortable: true },
    { key: 'className', label: 'Class', sortable: true, width: '140px' },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false, width: '180px', align: 'right' },
  ];

  academicYearOptions(): DropdownOption<string>[] {
    const opts: DropdownOption<string>[] = [{ value: '', label: 'Select academic year' }];
    for (const ay of this.academicYears) {
      opts.push({ value: String((ay as any).id ?? ''), label: `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` });
    }
    return opts;
  }

  levelOptions(): DropdownOption<string>[] {
    const levels = Array.from(
      new Set(this.classAcademicYears.map(cay => String(cay.class?.level ?? '')).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));

    return [{ value: '', label: 'Select level' }, ...levels.map(l => ({ value: l, label: l }))];
  }

  classOptions(): DropdownOption<string>[] {
    const opts: DropdownOption<string>[] = [{ value: '', label: 'Select class' }];
    for (const cay of this.classAcademicYears) {
      const classDto = cay.class;
      const ay = cay.academicYear;
      if (!cay.id || !classDto?.name || !ay?.start || !ay?.end) continue;
      opts.push({
        value: cay.id,
        label: `${classDto.name} (${ay.start.split('-')[0]}–${ay.end.split('-')[0]})`,
      });
    }
    return opts;
  }

  async ngOnInit(): Promise<void> {
    await this.loadAll();
  }

  onPageChange(page: number): void {
    this.pagination.page = page;
    this.updatePaging();
  }

  onPageSizeChange(pageSize: number): void {
    this.pagination.pageSize = pageSize;
    this.pagination.page = 1;
    this.updatePaging();
  }

  private updatePaging(): void {
    this.pagination.total = this.filteredRows.length;
    const totalPages = Math.max(1, Math.ceil(this.pagination.total / this.pagination.pageSize));
    if (this.pagination.page > totalPages) this.pagination.page = totalPages;
    if (this.pagination.page < 1) this.pagination.page = 1;

    const start = (this.pagination.page - 1) * this.pagination.pageSize;
    this.pagedRows = this.filteredRows.slice(start, start + this.pagination.pageSize);
  }

  private pickLatestAcademicYearId(ays: AcademicYearDto[]): string {
    const parsed = ays
      .map(ay => {
        const endTs = Date.parse(ay.end);
        return { id: ay.id, endTs: Number.isFinite(endTs) ? endTs : Number.NEGATIVE_INFINITY };
      })
      .sort((a, b) => b.endTs - a.endTs);

    return String((parsed[0] as any)?.id ?? '');
  }

  async loadAll(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const ays = await firstValueFrom(this.headApi.listAcademicYears());
      this.academicYears = ays;

      const latestId = this.pickLatestAcademicYearId(ays);
      this.selectedAcademicYearId = latestId;

      if (latestId) {
        await this.loadForAcademicYear(latestId);
      } else {
        this.classAcademicYears = [];
        this.students = [];
        this.rows = [];
        this.applyFilters();
        this.selectedRow = null;
        this.selectedRows = [];
      }
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load student metadata.';
    } finally {
      this.loading = false;
    }
  }

  async onAcademicYearChanged(): Promise<void> {
    await this.loadForAcademicYear(this.selectedAcademicYearId);
  }

  private async loadForAcademicYear(academicYearId: unknown): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const ay = toString(academicYearId);

      const [cays, students] = await Promise.all([
        firstValueFrom(this.headApi.listClasses(ay)),
        firstValueFrom(this.headApi.listStudents(ay)),
      ]);

      this.classAcademicYears = cays;
      this.students = students;
      this.rows = this.mapRows(students);
      this.applyFilters();

      this.selectedRows = [];
      this.selectedRow = this.filteredRows[0] ?? null;
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load students.';
    } finally {
      this.loading = false;
    }
  }

  private mapRows(students: any[]): HeadStudentRow[] {
    const rows: HeadStudentRow[] = [];

    for (const s of students ?? []) {
      if (!s?.id) continue;

      const user = s.user ?? {};
      const classYears: any[] = Array.isArray(s.classAcademicYears) ? s.classAcademicYears : [];

      const selectedYearId = toString(this.selectedAcademicYearId);
      const bestCay =
        (selectedYearId
          ? classYears.find(cy => toString(cy?.academicYear?.id) === selectedYearId)
          : null) ??
        classYears[0] ??
        null;

      const ay = bestCay?.academicYear;
      const classDto = bestCay?.class;

      const academicYearLabel = ay?.start && ay?.end ? `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` : '';

      rows.push({
        id: String(s.id),
        matricule: String(s.matricule ?? ''),
        name: String(user.name ?? ''),
        surname: String(user.surname ?? ''),
        login: String(user.login ?? ''),
        email: String(user.email ?? ''),
        classAcademicYearId: String(bestCay?.id ?? ''),
        className: String(classDto?.name ?? '—'),
        level: String(classDto?.level ?? ''),
        academicYearId: String(ay?.id ?? ''),
        academicYearLabel,
      });
    }

    return rows.sort((a, b) => a.matricule.localeCompare(b.matricule));
  }

  applyFilters(): void {
    const year = toString(this.selectedAcademicYearId);
    const level = toString(this.selectedLevel);

    this.filteredRows = this.rows.filter(r => {
      if (year && r.academicYearId !== year) return false;
      if (level && r.level !== level) return false;
      return true;
    });

    if (this.selectedRow && !this.filteredRows.some(r => r.id === this.selectedRow?.id)) {
      this.selectedRow = this.filteredRows[0] ?? null;
    }

    this.pagination.page = 1;
    this.updatePaging();
  }

  onSelectionChange(rows: HeadStudentRow[]): void {
    this.selectedRows = rows;
  }

  onRowClick(row: HeadStudentRow): void {
    this.selectRow(row);
  }

  selectRow(row: HeadStudentRow): void {
    this.selectedRow = row;
  }

  // Toolbar actions (UI-only)
  openCreate(): void {
    this.infoMessage = '';
    this.draftMatricule = '';
    this.draftName = '';
    this.draftSurname = '';
    this.draftEmail = '';
    this.draftLogin = '';
    this.draftPassword = '';
    this.draftClassAcademicYearId = '';
    this.createOpen = true;
  }

  openEdit(row?: HeadStudentRow): void {
    const r = row ?? this.selectedRow;
    if (!r) return;

    this.infoMessage = '';
    this.draftMatricule = r.matricule;
    this.draftName = r.name;
    this.draftSurname = r.surname;
    this.draftEmail = r.email;
    this.draftLogin = r.login;
    this.draftPassword = '';
    this.draftClassAcademicYearId = r.classAcademicYearId;
    this.editOpen = true;
  }

  openDelete(row?: HeadStudentRow): void {
    const r = row ?? this.selectedRow;
    if (!r) return;

    this.infoMessage = '';
    this.selectedRow = r;
    this.deleteOpen = true;
  }

  async confirmCreate(): Promise<void> {
    if (!this.draftMatricule.trim()) return;
    if (!this.draftName.trim() || !this.draftSurname.trim()) return;
    if (!this.draftEmail.trim()) return;
    if (!this.draftLogin.trim()) return;
    if (!this.draftPassword.trim()) return;
    if (!this.draftClassAcademicYearId) return;

    this.loading = true;
    this.errorMessage = '';

    try {
      const created = await firstValueFrom(
        this.headApi.createStudent({
          matricule: this.draftMatricule.trim(),
          name: this.draftName.trim(),
          surname: this.draftSurname.trim(),
          email: this.draftEmail.trim(),
          login: this.draftLogin.trim(),
          password: this.draftPassword,
          classAcademicYearIds: [this.draftClassAcademicYearId],
        }),
      );

      this.createOpen = false;

      if (this.selectedAcademicYearId) {
        await this.loadForAcademicYear(this.selectedAcademicYearId);
      }

      const createdRow = this.rows.find(r => r.id === created?.id) ?? null;
      if (createdRow) this.selectedRow = createdRow;

      pushHeadActivity('Added student', 'success');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to create student.';
    } finally {
      this.loading = false;
    }
  }

  async confirmEdit(): Promise<void> {
    if (!this.selectedRow) return;
    if (!this.draftMatricule.trim()) return;
    if (!this.draftName.trim() || !this.draftSurname.trim()) return;
    if (!this.draftEmail.trim()) return;
    if (!this.draftLogin.trim()) return;
    if (!this.draftClassAcademicYearId) return;

    const id = this.selectedRow.id;
    this.loading = true;
    this.errorMessage = '';

    try {
      await firstValueFrom(
        this.headApi.updateStudent(id, {
          matricule: this.draftMatricule.trim(),
          name: this.draftName.trim(),
          surname: this.draftSurname.trim(),
          email: this.draftEmail.trim(),
          login: this.draftLogin.trim(),
          ...(this.draftPassword.trim() ? { password: this.draftPassword } : {}),
          classAcademicYearIds: [this.draftClassAcademicYearId],
        }),
      );

      this.editOpen = false;

      if (this.selectedAcademicYearId) {
        await this.loadForAcademicYear(this.selectedAcademicYearId);
      }

      this.selectedRow = this.rows.find(r => r.id === id) ?? this.selectedRow;
      pushHeadActivity('Edited student', 'info');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to update student.';
    } finally {
      this.loading = false;
    }
  }

  async confirmDelete(): Promise<void> {
    if (!this.selectedRow) return;

    const id = this.selectedRow.id;
    this.loading = true;
    this.errorMessage = '';

    try {
      await firstValueFrom(this.headApi.deleteStudent(id));
      this.deleteOpen = false;

      if (this.selectedAcademicYearId) {
        await this.loadForAcademicYear(this.selectedAcademicYearId);
      }

      pushHeadActivity('Deleted student', 'danger');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to delete student.';
    } finally {
      this.loading = false;
    }
  }

  async archiveSelected(): Promise<void> {
    if (this.selectedRows.length === 0) return;

    const count = this.selectedRows.length;
    const ids = [...new Set(this.selectedRows.map(r => r.id))];

    this.loading = true;
    this.errorMessage = '';

    try {
      await Promise.all(ids.map(id => firstValueFrom(this.headApi.deleteStudent(id))));
      this.selectedRows = [];

      if (this.selectedAcademicYearId) {
        await this.loadForAcademicYear(this.selectedAcademicYearId);
      }

      pushHeadActivity(`Archived ${count} student(s)`, 'warning');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to archive students.';
    } finally {
      this.loading = false;
    }
  }

  private pickExcelFile(): Promise<File | null> {
    return new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx,.xls';
      input.onchange = () => resolve(input.files?.[0] ?? null);
      input.click();
    });
  }

  private resolveClassAcademicYearId(row: Record<string, unknown>): string {
    const direct = getCell(row, 'classacademicyearid', 'class academic year id', 'classAcademicYearId');
    if (direct) return direct;

    const className = getCell(row, 'class', 'classname', 'class name');
    const ayId = getCell(row, 'academicyearid', 'academic year id', 'academicYearId');

    if (!className) return '';

    const match = this.classAcademicYears.find(cay => {
      const n = String(cay.class?.name ?? '').trim();
      if (n.toLowerCase() !== className.toLowerCase()) return false;
      if (ayId) return String((cay.academicYear as any)?.id ?? '') === ayId;
      return true;
    });

    return match?.id ?? '';
  }

  async importExcel(): Promise<void> {
    this.infoMessage = '';
    this.errorMessage = '';

    const file = await this.pickExcelFile();
    if (!file) return;

    this.loading = true;
    try {
      const excelRows = await readExcelFile(file);
      let ok = 0;
      let failed = 0;

      for (const r of excelRows) {
        const matricule = getCell(r, 'matricule');
        const name = getCell(r, 'name', 'firstname', 'first name');
        const surname = getCell(r, 'surname', 'lastname', 'last name');
        const email = getCell(r, 'email');
        const login = getCell(r, 'login', 'username');
        const password = getCell(r, 'password');
        const classAcademicYearId = this.resolveClassAcademicYearId(r);

        if (!matricule || !name || !surname || !email || !login || !password || !classAcademicYearId) {
          failed++;
          continue;
        }

        try {
          await firstValueFrom(
            this.headApi.createStudent({
              matricule,
              name,
              surname,
              email,
              login,
              password,
              classAcademicYearIds: [classAcademicYearId],
            }),
          );
          ok++;
        } catch {
          failed++;
        }
      }

      if (this.selectedAcademicYearId) {
        await this.loadForAcademicYear(this.selectedAcademicYearId);
      }

      this.infoMessage = `Imported ${ok} student(s). ${failed ? `Failed: ${failed}.` : ''}`.trim();
      pushHeadActivity(`Imported ${ok} student(s)`, failed ? 'warning' : 'success');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to import students.';
    } finally {
      this.loading = false;
    }
  }

  exportExcel(): void {
    const year = toString(this.selectedAcademicYearId) || 'all';
    const rows = (this.filteredRows.length ? this.filteredRows : this.rows).map(r => ({
      Matricule: r.matricule,
      Name: r.name,
      Surname: r.surname,
      Email: r.email,
      Login: r.login,
      Class: r.className,
      Level: r.level,
      AcademicYear: r.academicYearLabel,
      ClassAcademicYearId: r.classAcademicYearId,
      StudentId: r.id,
    }));
    downloadXlsx(`students-${year}.xlsx`, rows, 'Students');
    pushHeadActivity('Exported students (Excel)', 'info');
  }

  exportStudents(): void {
    const year = toString(this.selectedAcademicYearId) || 'all';
    const rows = (this.filteredRows.length ? this.filteredRows : this.rows).map(r => ({
      Matricule: r.matricule,
      Name: r.name,
      Surname: r.surname,
      Email: r.email,
      Login: r.login,
      Class: r.className,
      Level: r.level,
      AcademicYear: r.academicYearLabel,
    }));
    downloadXlsx(`students-${year}.xlsx`, rows, 'Students');
    pushHeadActivity('Exported students (Excel)', 'info');
  }
}
