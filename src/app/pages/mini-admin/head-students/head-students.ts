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

type Tone = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'secondary' | 'accent';

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
  carryovers: number;
  email: string;
}

interface ActivityItem {
  message: string;
  timeAgo: string;
  tone: Tone;
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
  draftCarryovers = 0;
  draftClassAcademicYearId = '';

  readonly activity: ActivityItem[] = [];

  readonly columns: TableColumn<HeadStudentRow>[] = [
    { key: 'matricule', label: 'Matricule', sortable: true, width: '120px' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'surname', label: 'Surname', sortable: true },
    { key: 'className', label: 'Class', sortable: true, width: '140px' },
    { key: 'carryovers', label: 'Carry overs', sortable: true, width: '120px', align: 'center' },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false, width: '180px', align: 'right' },
  ];

  academicYearOptions(): DropdownOption<string>[] {
    const opts: DropdownOption<string>[] = [{ value: '', label: 'Select academic year' }];
    for (const ay of this.academicYears) {
      opts.push({ value: ay.id, label: `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` });
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

  activityDotClass(tone: Tone): string {
    return `dot dot--${tone}`;
  }

  async ngOnInit(): Promise<void> {
    await this.loadAll();
  }

  private pickLatestAcademicYearId(ays: AcademicYearDto[]): string {
    const parsed = ays
      .map(ay => {
        const endTs = Date.parse(ay.end);
        return { id: ay.id, endTs: Number.isFinite(endTs) ? endTs : Number.NEGATIVE_INFINITY };
      })
      .sort((a, b) => b.endTs - a.endTs);

    return parsed[0]?.id ?? '';
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

  private async loadForAcademicYear(academicYearId: string): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const ay = academicYearId?.trim() || undefined;

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
      const carriedOverCourses: any[] = Array.isArray(s.carriedOverCourses) ? s.carriedOverCourses : [];

      const selectedYearId = this.selectedAcademicYearId?.trim();
      const bestCay =
        (selectedYearId
          ? classYears.find(cy => cy?.academicYear?.id === selectedYearId)
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
        carryovers: carriedOverCourses.length,
      });
    }

    return rows.sort((a, b) => a.matricule.localeCompare(b.matricule));
  }

  applyFilters(): void {
    const year = this.selectedAcademicYearId?.trim();
    const level = this.selectedLevel?.trim();

    this.filteredRows = this.rows.filter(r => {
      if (year && r.academicYearId !== year) return false;
      if (level && r.level !== level) return false;
      return true;
    });

    if (this.selectedRow && !this.filteredRows.some(r => r.id === this.selectedRow?.id)) {
      this.selectedRow = this.filteredRows[0] ?? null;
    }
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
    this.draftCarryovers = 0;
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
    this.draftCarryovers = r.carryovers;
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

      this.activity.unshift({ message: 'Added student', timeAgo: 'Just now', tone: 'success' });
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
      this.activity.unshift({ message: 'Edited student', timeAgo: 'Just now', tone: 'info' });
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

      this.activity.unshift({ message: 'Deleted student', timeAgo: 'Just now', tone: 'danger' });
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

      this.activity.unshift({ message: `Archived ${count} student(s)`, timeAgo: 'Just now', tone: 'warning' });
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to archive students.';
    } finally {
      this.loading = false;
    }
  }

  importExcel(): void {
    this.infoMessage = 'Import Excel is not wired yet.';
  }

  exportExcel(): void {
    this.infoMessage = 'Export Excel is not wired yet.';
  }

  exportStudents(): void {
    this.infoMessage = 'Export students is not wired yet.';
  }
}
