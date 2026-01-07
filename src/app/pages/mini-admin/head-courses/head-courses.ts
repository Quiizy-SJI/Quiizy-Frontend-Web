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
  teachingUnits: TeachingUnitDto[] = [];
  teachers: TeacherDto[] = [];

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
  draftTeachingUnitId = '';
  draftCredits = 0;
  draftLevel = '';
  draftClassAcademicYearId = '';
  draftTeacherId = '';

  readonly activity: ActivityItem[] = [];

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

    return parsed[0]?.id ?? '';
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

  private async loadForAcademicYear(academicYearId: string): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const [cays, courses] = await Promise.all([
        firstValueFrom(this.headApi.listClasses(academicYearId)),
        firstValueFrom(this.headApi.listCourses(academicYearId)),
      ]);

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

      this.activity.unshift({ message: 'Created course', timeAgo: 'Just now', tone: 'success' });
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
      this.activity.unshift({ message: 'Updated course', timeAgo: 'Just now', tone: 'info' });
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

      this.activity.unshift({ message: 'Deleted course', timeAgo: 'Just now', tone: 'danger' });
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

      this.activity.unshift({ message: `Archived ${count} course(s)`, timeAgo: 'Just now', tone: 'warning' });
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to archive courses.';
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
}
