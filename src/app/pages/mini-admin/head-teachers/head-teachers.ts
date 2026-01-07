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
import type { AcademicYearDto, ClassAcademicYearDto, CourseDto, TeacherDto } from '../../../domain/dtos/teacher';
import { toString } from '../../../core/utils/payload-sanitizer';
import { downloadXlsx, getCell, readExcelFile } from '../../../core/utils/excel-utils';
import { pushHeadActivity } from '../../../core/utils/head-activity-store';

interface HeadTeacherRow {
  id: string;
  name: string;
  surname: string;
  email: string;
  assignedCourses: number;
  assignedClasses: number;
  levels: string; // comma separated
  academicYears: string; // comma separated
}

@Component({
  selector: 'app-head-teachers',
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
  templateUrl: './head-teachers.html',
  styleUrl: './head-teachers.scss',
})
export class HeadTeachers {
  private readonly headApi = inject(HeadService);

  // data
  academicYears: AcademicYearDto[] = [];
  classAcademicYears: ClassAcademicYearDto[] = [];
  courses: CourseDto[] = [];
  teachers: TeacherDto[] = [];

  rows: HeadTeacherRow[] = [];
  filteredRows: HeadTeacherRow[] = [];
  pagedRows: HeadTeacherRow[] = [];

  pagination = { page: 1, pageSize: 5, total: 0, pageSizes: [5, 10, 25, 50] };

  selectedAcademicYearId = '';
  selectedLevel = '';

  selectedRows: HeadTeacherRow[] = [];
  selectedRow: HeadTeacherRow | null = null;

  // UI state
  loading = false;
  errorMessage = '';
  infoMessage = '';

  // modals
  createOpen = false;
  editOpen = false;
  deleteOpen = false;

  // form drafts
  draftName = '';
  draftSurname = '';
  draftEmail = '';
  draftLogin = '';
  draftPassword = '';

  readonly columns: TableColumn<HeadTeacherRow>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'surname', label: 'Surname', sortable: true },
    { key: 'assignedCourses', label: 'Courses', sortable: true, width: '90px', align: 'center' },
    { key: 'assignedClasses', label: 'Classes', sortable: true, width: '90px', align: 'center' },
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
      const [ays, teachers] = await Promise.all([
        firstValueFrom(this.headApi.listAcademicYears()),
        firstValueFrom(this.headApi.listTeachers()),
      ]);

      this.academicYears = ays;
      this.teachers = teachers;

      const latestId = this.pickLatestAcademicYearId(ays);
      this.selectedAcademicYearId = latestId;

      await this.loadForAcademicYear(latestId);
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load teachers.';
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
      const [cays, courses, teachers] = await Promise.all([
        firstValueFrom(this.headApi.listClasses(ay)),
        firstValueFrom(this.headApi.listCourses(ay)),
        firstValueFrom(this.headApi.listTeachers()),
      ]);

      this.classAcademicYears = cays;
      this.courses = courses;
      this.teachers = teachers;

      this.rows = this.mapRowsFromTeachersAndCourses(teachers, courses);
      this.applyFilters();

      this.selectedRows = [];
      this.selectedRow = this.filteredRows[0] ?? null;
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load teachers.';
    } finally {
      this.loading = false;
    }
  }

  private mapRowsFromTeachersAndCourses(teachers: TeacherDto[], courses: CourseDto[]): HeadTeacherRow[] {
    const courseIdsByTeacher = new Map<string, Set<string>>();
    const classIdsByTeacher = new Map<string, Set<string>>();
    const levelsByTeacher = new Map<string, Set<string>>();
    const academicYearsByTeacher = new Map<string, Set<string>>();

    for (const c of courses ?? []) {
      const teacherId = c.teacher?.id;
      if (!teacherId) continue;

      const courseIds = courseIdsByTeacher.get(teacherId) ?? new Set<string>();
      if (c.id) courseIds.add(c.id);
      courseIdsByTeacher.set(teacherId, courseIds);

      const classIds = classIdsByTeacher.get(teacherId) ?? new Set<string>();
      const classId = c.classAcademicYear?.class?.id;
      if (classId) classIds.add(classId);
      classIdsByTeacher.set(teacherId, classIds);

      const levels = levelsByTeacher.get(teacherId) ?? new Set<string>();
      const lvl = String(c.classAcademicYear?.class?.level ?? c.level ?? '').trim();
      if (lvl) levels.add(lvl);
      levelsByTeacher.set(teacherId, levels);

      const years = academicYearsByTeacher.get(teacherId) ?? new Set<string>();
      const ay = c.classAcademicYear?.academicYear;
      if (ay?.start && ay?.end) years.add(`${ay.start.split('-')[0]}–${ay.end.split('-')[0]}`);
      academicYearsByTeacher.set(teacherId, years);
    }

    return (teachers ?? [])
      .filter(t => !!t?.id)
      .map(t => {
        const teacherId = t.id;
        const name = t.user?.name ?? '';
        const surname = t.user?.surname ?? '';
        const email = t.user?.email ?? '';

        return {
          id: teacherId,
          name,
          surname,
          email,
          assignedCourses: courseIdsByTeacher.get(teacherId)?.size ?? 0,
          assignedClasses: classIdsByTeacher.get(teacherId)?.size ?? 0,
          levels: Array.from(levelsByTeacher.get(teacherId) ?? []).sort().join(', '),
          academicYears: Array.from(academicYearsByTeacher.get(teacherId) ?? []).sort().join(', '),
        };
      })
      .sort((a, b) => `${a.name} ${a.surname}`.trim().localeCompare(`${b.name} ${b.surname}`.trim()));
  }

  applyFilters(): void {
    const year = toString(this.selectedAcademicYearId);
    const level = toString(this.selectedLevel);

    const yearLabel = year
      ? (() => {
          const ay = this.academicYears.find(a => String((a as any).id ?? '') === year);
          return ay ? `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` : '';
        })()
      : '';

    // Filtering teachers is derived from courses; do it by checking whether teacher has courses matching filters.
    this.filteredRows = this.rows.filter(r => {
      if (yearLabel && !r.academicYears.includes(yearLabel)) return false;
      if (level && !r.levels.split(',').map(s => s.trim()).includes(level)) return false;
      return true;
    });

    if (this.selectedRow && !this.filteredRows.some(r => r.id === this.selectedRow?.id)) {
      this.selectedRow = this.filteredRows[0] ?? null;
    }

    this.pagination.page = 1;
    this.updatePaging();
  }

  onSelectionChange(rows: HeadTeacherRow[]): void {
    this.selectedRows = rows;
  }

  onRowClick(row: HeadTeacherRow): void {
    this.selectRow(row);
  }

  selectRow(row: HeadTeacherRow): void {
    this.selectedRow = row;
  }

  openCreate(): void {
    this.infoMessage = '';
    this.draftName = '';
    this.draftSurname = '';
    this.draftEmail = '';
    this.draftLogin = '';
    this.draftPassword = '';
    this.createOpen = true;
  }

  openEdit(row?: HeadTeacherRow): void {
    const r = row ?? this.selectedRow;
    if (!r) return;

    this.infoMessage = '';
    this.draftName = r.name;
    this.draftSurname = r.surname;
    this.draftEmail = r.email;
    const t = this.teachers.find(tt => tt.id === r.id);
    this.draftLogin = t?.user?.login ?? '';
    this.draftPassword = '';
    this.editOpen = true;
  }

  openDelete(row?: HeadTeacherRow): void {
    const r = row ?? this.selectedRow;
    if (!r) return;

    this.infoMessage = '';
    this.selectedRow = r;
    this.deleteOpen = true;
  }

  async confirmCreate(): Promise<void> {
    if (!this.draftName.trim() || !this.draftSurname.trim() || !this.draftEmail.trim()) return;
    if (!this.draftLogin.trim()) return;
    if (!this.draftPassword.trim()) return;

    this.loading = true;
    this.errorMessage = '';

    try {
      const created = await firstValueFrom(
        this.headApi.createTeacher({
          name: this.draftName.trim(),
          surname: this.draftSurname.trim(),
          email: this.draftEmail.trim(),
          login: this.draftLogin.trim(),
          password: this.draftPassword,
        }),
      );

      this.createOpen = false;
      await this.loadForAcademicYear(this.selectedAcademicYearId);

      const createdRow = this.rows.find(r => r.id === created?.id) ?? null;
      if (createdRow) this.selectedRow = createdRow;

      pushHeadActivity('Created teacher', 'success');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to create teacher.';
    } finally {
      this.loading = false;
    }
  }

  async confirmEdit(): Promise<void> {
    if (!this.selectedRow) return;
    if (!this.draftName.trim() || !this.draftSurname.trim() || !this.draftEmail.trim()) return;
    if (!this.draftLogin.trim()) return;

    const id = this.selectedRow.id;
    this.loading = true;
    this.errorMessage = '';

    try {
      await firstValueFrom(
        this.headApi.updateTeacher(id, {
          name: this.draftName.trim(),
          surname: this.draftSurname.trim(),
          email: this.draftEmail.trim(),
          login: this.draftLogin.trim(),
          ...(this.draftPassword.trim() ? { password: this.draftPassword } : {}),
        }),
      );

      this.editOpen = false;
      await this.loadForAcademicYear(this.selectedAcademicYearId);
      this.selectedRow = this.rows.find(r => r.id === id) ?? this.selectedRow;

      pushHeadActivity('Updated teacher', 'info');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to update teacher.';
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
      await firstValueFrom(this.headApi.deleteTeacher(id));
      this.deleteOpen = false;
      await this.loadForAcademicYear(this.selectedAcademicYearId);
      pushHeadActivity('Deleted teacher', 'danger');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to delete teacher.';
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
      await Promise.all(ids.map(id => firstValueFrom(this.headApi.deleteTeacher(id))));
      this.selectedRows = [];
      await this.loadForAcademicYear(this.selectedAcademicYearId);
      pushHeadActivity(`Archived ${count} teacher(s)`, 'warning');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to archive teachers.';
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
        const name = getCell(r, 'name', 'firstname', 'first name');
        const surname = getCell(r, 'surname', 'lastname', 'last name');
        const email = getCell(r, 'email');
        const login = getCell(r, 'login', 'username');
        const password = getCell(r, 'password');

        if (!name || !surname || !email || !login || !password) {
          failed++;
          continue;
        }

        try {
          await firstValueFrom(
            this.headApi.createTeacher({
              name,
              surname,
              email,
              login,
              password,
            }),
          );
          ok++;
        } catch {
          failed++;
        }
      }

      await this.loadForAcademicYear(this.selectedAcademicYearId);
      this.infoMessage = `Imported ${ok} teacher(s). ${failed ? `Failed: ${failed}.` : ''}`.trim();
      pushHeadActivity(`Imported ${ok} teacher(s)`, failed ? 'warning' : 'success');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to import teachers.';
    } finally {
      this.loading = false;
    }
  }

  exportExcel(): void {
    const year = toString(this.selectedAcademicYearId) || 'all';
    const rows = (this.filteredRows.length ? this.filteredRows : this.rows).map(r => ({
      Name: r.name,
      Surname: r.surname,
      Email: r.email,
      AssignedCourses: r.assignedCourses,
      AssignedClasses: r.assignedClasses,
      Levels: r.levels,
      AcademicYears: r.academicYears,
      TeacherId: r.id,
    }));
    downloadXlsx(`teachers-${year}.xlsx`, rows, 'Teachers');
    pushHeadActivity('Exported teachers (Excel)', 'info');
  }
}
