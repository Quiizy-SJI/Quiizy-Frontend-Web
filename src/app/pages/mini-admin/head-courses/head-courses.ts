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
import type { TeachingUnitDto } from '../../../domain/dtos/dean/dean-shared.dto';
import { toString } from '../../../core/utils/payload-sanitizer';
import { downloadXlsx, getCell, getCellNumber, readExcelFile } from '../../../core/utils/excel-utils';
import { pushHeadActivity } from '../../../core/utils/head-activity-store';

interface HeadCourseRow {
  id: string;
  teachingUnitName: string;
  teacherName: string;
  className: string;
  level: string;
  credits: number;
  classAcademicYearId: string;
  academicYearId: string;
  academicYearLabel: string;
  teachingUnitId?: string;
  teacherId?: string;
}

@Component({
  selector: 'app-head-courses',
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
  templateUrl: './head-courses.html',
  styleUrl: './head-courses.scss',
})
export class HeadCourses {
  private readonly headApi = inject(HeadService);

  // data
  academicYears: AcademicYearDto[] = [];
  classAcademicYears: ClassAcademicYearDto[] = [];
  courses: CourseDto[] = [];
  teachingUnits: TeachingUnitDto[] = [];
  teachers: TeacherDto[] = [];

  rows: HeadCourseRow[] = [];
  filteredRows: HeadCourseRow[] = [];
  pagedRows: HeadCourseRow[] = [];

  pagination = { page: 1, pageSize: 5, total: 0, pageSizes: [5, 10, 25, 50] };

  selectedAcademicYearId = '';
  selectedLevel = '';

  selectedRows: HeadCourseRow[] = [];
  selectedRow: HeadCourseRow | null = null;

  // UI state
  loading = false;
  errorMessage = '';
  infoMessage = '';

  // modals
  createOpen = false;
  editOpen = false;
  deleteOpen = false;

  // form drafts
  draftTeachingUnitId = '';
  draftCredits = 0;
  draftLevel = '';
  draftClassAcademicYearId = '';
  draftTeacherId = '';

  readonly columns: TableColumn<HeadCourseRow>[] = [
    { key: 'teachingUnitName', label: 'Teaching Unit', sortable: true },
    { key: 'teacherName', label: 'Teacher', sortable: true },
    { key: 'className', label: 'Class', sortable: true, width: '140px' },
    { key: 'level', label: 'Level', sortable: true, width: '90px', align: 'center' },
    { key: 'credits', label: 'Credits', sortable: true, width: '90px', align: 'center' },
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
      new Set(
        this.classAcademicYears
          .map(cay => String(cay.class?.level ?? ''))
          .filter(Boolean),
      ),
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

  teacherOptions(): DropdownOption<string>[] {
    const teachers = this.teachers;
    const opts: DropdownOption<string>[] = [{ value: '', label: 'Select teacher' }];
    for (const t of teachers) {
      const name = `${t.user?.name ?? ''} ${t.user?.surname ?? ''}`.trim() || '—';
      opts.push({ value: t.id, label: name });
    }
    return opts;
  }

  teachingUnitOptions(): DropdownOption<string>[] {
    const opts: DropdownOption<string>[] = [{ value: '', label: 'Select teaching unit' }];
    for (const tu of this.teachingUnits) {
      if (!tu?.id || !tu?.name) continue;
      opts.push({ value: tu.id, label: tu.name });
    }
    return opts;
  }

  private normalizeTeachers(teachers: TeacherDto[]): TeacherDto[] {
    return [...teachers].sort((a, b) => {
      const an = `${a.user?.name ?? ''} ${a.user?.surname ?? ''}`.trim();
      const bn = `${b.user?.name ?? ''} ${b.user?.surname ?? ''}`.trim();
      return an.localeCompare(bn);
    });
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

  async loadAll(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const [ays, teachingUnits, teachers] = await Promise.all([
        firstValueFrom(this.headApi.listAcademicYears()),
        firstValueFrom(this.headApi.listTeachingUnits()),
        firstValueFrom(this.headApi.listTeachers()),
      ]);

      this.academicYears = ays;
      this.teachingUnits = teachingUnits;
      this.teachers = this.normalizeTeachers(teachers);

      const latestId = this.pickLatestAcademicYearId(ays);
      this.selectedAcademicYearId = latestId;

      if (latestId) {
        await this.loadForAcademicYear(latestId);
      } else {
        this.classAcademicYears = [];
        this.courses = [];
        this.rows = [];
        this.applyFilters();
        this.selectedRow = null;
        this.selectedRows = [];
      }
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load courses.';
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
      const year = toString(academicYearId);
      let cays: ClassAcademicYearDto[] = [];
      let courses: CourseDto[] = [];

      try {
        [cays, courses] = await Promise.all([
          firstValueFrom(this.headApi.listClasses(year)),
          firstValueFrom(this.headApi.listCourses(year)),
        ]);
      } catch {
        // Fallback: some backends ignore or reject the filter param; load all then filter client-side.
        [cays, courses] = await Promise.all([
          firstValueFrom(this.headApi.listClasses(undefined)),
          firstValueFrom(this.headApi.listCourses(undefined)),
        ]);
      }

      this.classAcademicYears = cays;
      this.courses = courses;
      this.rows = this.mapRows(courses);
      this.applyFilters();

      this.selectedRows = [];
      this.selectedRow = this.filteredRows[0] ?? null;
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load courses.';
    } finally {
      this.loading = false;
    }
  }

  private mapRows(courses: CourseDto[]): HeadCourseRow[] {
    const rows: HeadCourseRow[] = [];

    for (const c of courses) {
      if (!c?.id) continue;

      const cay = c.classAcademicYear;
      const classDto = cay?.class;
      const ay = cay?.academicYear;

      const teachingUnitName = c.teachingUnit?.name ?? '—';
      const teacherName = c.teacher
        ? `${c.teacher.user?.name ?? ''} ${c.teacher.user?.surname ?? ''}`.trim() || '—'
        : '—';

      const className = classDto?.name ?? '—';
      const level = String(classDto?.level ?? c.level ?? '');
      const credits = Number(c.credits) || 0;

      const academicYearLabel = ay ? `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` : '';

      rows.push({
        id: c.id,
        teachingUnitName,
        teacherName,
        className,
        level,
        credits,
        classAcademicYearId: cay?.id ?? '',
        academicYearId: String((ay as any)?.id ?? ''),
        academicYearLabel,
        teachingUnitId: c.teachingUnit?.id,
        teacherId: c.teacher?.id,
      });
    }

    return rows.sort((a, b) => a.teachingUnitName.localeCompare(b.teachingUnitName));
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

  onSelectionChange(rows: HeadCourseRow[]): void {
    this.selectedRows = rows;
  }

  onRowClick(row: HeadCourseRow): void {
    this.selectRow(row);
  }

  selectRow(row: HeadCourseRow): void {
    this.selectedRow = row;
  }

  openCreate(): void {
    this.infoMessage = '';
    this.draftTeachingUnitId = '';
    this.draftCredits = 0;
    this.draftLevel = '';
    this.draftClassAcademicYearId = '';
    this.draftTeacherId = '';
    this.createOpen = true;
  }

  openEdit(row?: HeadCourseRow): void {
    const r = row ?? this.selectedRow;
    if (!r) return;

    this.infoMessage = '';
    this.draftTeachingUnitId = r.teachingUnitId ?? '';
    this.draftCredits = r.credits;
    this.draftLevel = r.level;
    this.draftClassAcademicYearId = r.classAcademicYearId;
    this.draftTeacherId = r.teacherId ?? '';
    this.editOpen = true;
  }

  openDelete(row?: HeadCourseRow): void {
    const r = row ?? this.selectedRow;
    if (!r) return;

    this.infoMessage = '';
    this.selectedRow = r;
    this.deleteOpen = true;
  }

  async confirmCreate(): Promise<void> {
    if (!this.draftTeachingUnitId) return;
    if (!this.draftClassAcademicYearId) return;

    const cay = this.classAcademicYears.find(c => c.id === this.draftClassAcademicYearId);
    const level = this.draftLevel?.trim() || String(cay?.class?.level ?? '');
    if (!level.trim()) return;

    this.loading = true;
    this.errorMessage = '';

    try {
      const created = await firstValueFrom(
        this.headApi.createCourse({
          level: level.trim(),
          credits: Number(this.draftCredits) || 0,
          classAcademicYearId: this.draftClassAcademicYearId,
          teachingUnitId: this.draftTeachingUnitId,
          ...(this.draftTeacherId ? { teacherId: this.draftTeacherId } : {}),
        }),
      );

      this.createOpen = false;

      if (this.selectedAcademicYearId) {
        await this.loadForAcademicYear(this.selectedAcademicYearId);
      }

      const createdRow = this.rows.find(r => r.id === created.id) ?? null;
      if (createdRow) this.selectedRow = createdRow;

      pushHeadActivity('Created course', 'success');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to create course.';
    } finally {
      this.loading = false;
    }
  }

  async confirmEdit(): Promise<void> {
    if (!this.selectedRow) return;
    if (!this.draftTeachingUnitId) return;
    if (!this.draftClassAcademicYearId) return;

    const cay = this.classAcademicYears.find(c => c.id === this.draftClassAcademicYearId);
    const level = this.draftLevel?.trim() || String(cay?.class?.level ?? '');
    if (!level.trim()) return;

    this.loading = true;
    this.errorMessage = '';

    try {
      const id = this.selectedRow.id;
      await firstValueFrom(
        this.headApi.updateCourse(id, {
          level: level.trim(),
          credits: Number(this.draftCredits) || 0,
          classAcademicYearId: this.draftClassAcademicYearId,
          teachingUnitId: this.draftTeachingUnitId,
          teacherId: this.draftTeacherId ? this.draftTeacherId : null,
        }),
      );

      this.editOpen = false;

      if (this.selectedAcademicYearId) {
        await this.loadForAcademicYear(this.selectedAcademicYearId);
      }

      this.selectedRow = this.rows.find(r => r.id === id) ?? this.selectedRow;
      pushHeadActivity('Updated course', 'info');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to update course.';
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
      await firstValueFrom(this.headApi.deleteCourse(id));
      this.deleteOpen = false;

      if (this.selectedAcademicYearId) {
        await this.loadForAcademicYear(this.selectedAcademicYearId);
      }

      pushHeadActivity('Deleted course', 'danger');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to delete course.';
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
      await Promise.all(ids.map(id => firstValueFrom(this.headApi.deleteCourse(id))));
      this.selectedRows = [];

      if (this.selectedAcademicYearId) {
        await this.loadForAcademicYear(this.selectedAcademicYearId);
      }

      pushHeadActivity(`Archived ${count} course(s)`, 'warning');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to archive courses.';
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

  private resolveTeachingUnitId(row: Record<string, unknown>): string {
    const direct = getCell(row, 'teachingunitid', 'teaching unit id', 'teachingUnitId');
    if (direct) return direct;

    const name = getCell(row, 'teachingunit', 'teaching unit', 'teachingunitname', 'teaching unit name');
    if (!name) return '';
    const match = this.teachingUnits.find(tu => String(tu?.name ?? '').trim().toLowerCase() === name.toLowerCase());
    return match?.id ?? '';
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

  private resolveTeacherId(row: Record<string, unknown>): string {
    const direct = getCell(row, 'teacherid', 'teacher id', 'teacherId');
    if (direct) return direct;

    const email = getCell(row, 'teacheremail', 'teacher email');
    if (!email) return '';
    const match = this.teachers.find(t => String(t.user?.email ?? '').trim().toLowerCase() === email.toLowerCase());
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
        const teachingUnitId = this.resolveTeachingUnitId(r);
        const classAcademicYearId = this.resolveClassAcademicYearId(r);
        const teacherId = this.resolveTeacherId(r);
        const credits = getCellNumber(r, 'credits');
        const level = getCell(r, 'level');

        if (!teachingUnitId || !classAcademicYearId) {
          failed++;
          continue;
        }

        try {
          await firstValueFrom(
            this.headApi.createCourse({
              level: level || this.draftLevel || 'L1',
              credits: credits || 0,
              classAcademicYearId,
              teachingUnitId,
              ...(teacherId ? { teacherId } : {}),
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

      this.infoMessage = `Imported ${ok} course(s). ${failed ? `Failed: ${failed}.` : ''}`.trim();
      pushHeadActivity(`Imported ${ok} course(s)`, failed ? 'warning' : 'success');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to import courses.';
    } finally {
      this.loading = false;
    }
  }

  exportExcel(): void {
    const year = toString(this.selectedAcademicYearId) || 'all';
    const rows = (this.filteredRows.length ? this.filteredRows : this.rows).map(r => ({
      TeachingUnit: r.teachingUnitName,
      Teacher: r.teacherName,
      Class: r.className,
      Level: r.level,
      Credits: r.credits,
      AcademicYear: r.academicYearLabel,
      TeachingUnitId: r.teachingUnitId ?? '',
      TeacherId: r.teacherId ?? '',
      ClassAcademicYearId: r.classAcademicYearId,
      CourseId: r.id,
    }));
    downloadXlsx(`courses-${year}.xlsx`, rows, 'Courses');
    pushHeadActivity('Exported courses (Excel)', 'info');
  }
}
