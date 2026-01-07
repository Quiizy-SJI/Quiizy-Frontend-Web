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

type Tone = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'secondary' | 'accent';

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

interface ActivityItem {
  message: string;
  timeAgo: string;
  tone: Tone;
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

  rows: HeadCourseRow[] = [];
  filteredRows: HeadCourseRow[] = [];

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
  draftTeachingUnitName = '';
  draftCredits = 0;
  draftLevel = '';
  draftClassAcademicYearId = '';
  draftTeacherId = '';

  readonly activity: ActivityItem[] = [
    { message: 'Updated course-teacher assignment', timeAgo: 'Today', tone: 'info' },
    { message: 'Created new course entry', timeAgo: 'Yesterday', tone: 'success' },
  ];

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
      opts.push({ value: ay.id, label: `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` });
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
    const teachers = this.uniqueTeachers();
    const opts: DropdownOption<string>[] = [{ value: '', label: 'Select teacher' }];
    for (const t of teachers) {
      const name = `${t.user?.name ?? ''} ${t.user?.surname ?? ''}`.trim() || '—';
      opts.push({ value: t.id, label: name });
    }
    return opts;
  }

  private uniqueTeachers(): TeacherDto[] {
    const byId = new Map<string, TeacherDto>();
    for (const c of this.courses) {
      const t = c.teacher;
      if (t?.id) byId.set(t.id, t);
    }
    return Array.from(byId.values()).sort((a, b) => {
      const an = `${a.user?.name ?? ''} ${a.user?.surname ?? ''}`.trim();
      const bn = `${b.user?.name ?? ''} ${b.user?.surname ?? ''}`.trim();
      return an.localeCompare(bn);
    });
  }

  activityDotClass(tone: Tone): string {
    return `dot dot--${tone}`;
  }

  async ngOnInit(): Promise<void> {
    await this.loadAll();
  }

  async loadAll(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const [ays, cays, courses] = await Promise.all([
        firstValueFrom(this.headApi.listAcademicYears()),
        firstValueFrom(this.headApi.listClasses()),
        firstValueFrom(this.headApi.listCourses()),
      ]);

      this.academicYears = ays;
      this.classAcademicYears = cays;
      this.courses = courses;

      this.rows = this.mapRows(courses);
      this.applyFilters();

      if (!this.selectedRow && this.filteredRows.length > 0) {
        this.selectRow(this.filteredRows[0]);
      }
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
        academicYearId: ay?.id ?? '',
        academicYearLabel,
        teachingUnitId: c.teachingUnit?.id,
        teacherId: c.teacher?.id,
      });
    }

    return rows.sort((a, b) => a.teachingUnitName.localeCompare(b.teachingUnitName));
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
    this.draftTeachingUnitName = '';
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
    this.draftTeachingUnitName = r.teachingUnitName;
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

  confirmCreate(): void {
    if (!this.draftTeachingUnitName.trim()) return;
    if (!this.draftClassAcademicYearId) return;

    const cay = this.classAcademicYears.find(c => c.id === this.draftClassAcademicYearId);
    const className = cay?.class?.name ?? '—';
    const level = this.draftLevel?.trim() || String(cay?.class?.level ?? '');
    const ay = cay?.academicYear;
    const academicYearId = ay?.id ?? '';
    const academicYearLabel = ay ? `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` : '';

    const teacher = this.uniqueTeachers().find(t => t.id === this.draftTeacherId);
    const teacherName = teacher ? `${teacher.user?.name ?? ''} ${teacher.user?.surname ?? ''}`.trim() || '—' : '—';

    const newRow: HeadCourseRow = {
      id: `TEMP-${Date.now()}`,
      teachingUnitName: this.draftTeachingUnitName.trim(),
      teacherName,
      className,
      level,
      credits: Number(this.draftCredits) || 0,
      classAcademicYearId: this.draftClassAcademicYearId,
      academicYearId,
      academicYearLabel,
      teacherId: this.draftTeacherId || undefined,
    };

    this.rows = [newRow, ...this.rows];
    this.applyFilters();
    this.selectRow(newRow);

    this.activity.unshift({ message: `Created course "${newRow.teachingUnitName}"`, timeAgo: 'Just now', tone: 'success' });
    this.createOpen = false;

    this.infoMessage = 'Create is UI-only (API not wired yet).';
  }

  confirmEdit(): void {
    if (!this.selectedRow) return;
    if (!this.draftTeachingUnitName.trim()) return;
    if (!this.draftClassAcademicYearId) return;

    const cay = this.classAcademicYears.find(c => c.id === this.draftClassAcademicYearId);
    const className = cay?.class?.name ?? '—';
    const level = this.draftLevel?.trim() || String(cay?.class?.level ?? '');
    const ay = cay?.academicYear;
    const academicYearId = ay?.id ?? '';
    const academicYearLabel = ay ? `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` : '';

    const teacher = this.uniqueTeachers().find(t => t.id === this.draftTeacherId);
    const teacherName = teacher ? `${teacher.user?.name ?? ''} ${teacher.user?.surname ?? ''}`.trim() || '—' : '—';

    const id = this.selectedRow.id;

    this.rows = this.rows.map(r =>
      r.id === id
        ? {
            ...r,
            teachingUnitName: this.draftTeachingUnitName.trim(),
            credits: Number(this.draftCredits) || 0,
            level,
            classAcademicYearId: this.draftClassAcademicYearId,
            className,
            academicYearId,
            academicYearLabel,
            teacherId: this.draftTeacherId || undefined,
            teacherName,
          }
        : r,
    );

    this.applyFilters();
    const updated = this.rows.find(r => r.id === id) ?? null;
    if (updated) this.selectedRow = updated;

    this.activity.unshift({ message: `Updated course "${this.draftTeachingUnitName.trim()}"`, timeAgo: 'Just now', tone: 'info' });
    this.editOpen = false;

    this.infoMessage = 'Edit is UI-only (API not wired yet).';
  }

  confirmDelete(): void {
    if (!this.selectedRow) return;

    const name = this.selectedRow.teachingUnitName;
    const id = this.selectedRow.id;

    this.rows = this.rows.filter(r => r.id !== id);
    this.applyFilters();
    this.selectedRow = this.filteredRows[0] ?? null;

    this.activity.unshift({ message: `Deleted course "${name}"`, timeAgo: 'Just now', tone: 'danger' });
    this.deleteOpen = false;

    this.infoMessage = 'Delete is UI-only (API not wired yet).';
  }

  archiveSelected(): void {
    if (this.selectedRows.length === 0) return;

    const count = this.selectedRows.length;
    const ids = new Set(this.selectedRows.map(r => r.id));

    this.rows = this.rows.filter(r => !ids.has(r.id));
    this.applyFilters();
    this.selectedRows = [];

    this.activity.unshift({ message: `Archived ${count} course(s)`, timeAgo: 'Just now', tone: 'warning' });
    this.infoMessage = 'Archive is UI-only (API not wired yet).';
  }

  importExcel(): void {
    this.infoMessage = 'Import Excel is not wired yet.';
  }

  exportExcel(): void {
    this.infoMessage = 'Export Excel is not wired yet.';
  }
}
