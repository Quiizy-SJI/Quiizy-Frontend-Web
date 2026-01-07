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

interface ActivityItem {
  message: string;
  timeAgo: string;
  tone: Tone;
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

  rows: HeadTeacherRow[] = [];
  filteredRows: HeadTeacherRow[] = [];

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

  readonly activity: ActivityItem[] = [
    { message: 'Assigned teachers to courses', timeAgo: 'Today', tone: 'info' },
    { message: 'Created new teacher profile', timeAgo: 'Yesterday', tone: 'success' },
  ];

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

      this.rows = this.mapRowsFromCourses(courses);
      this.applyFilters();

      if (!this.selectedRow && this.filteredRows.length > 0) {
        this.selectRow(this.filteredRows[0]);
      }
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load teachers.';
    } finally {
      this.loading = false;
    }
  }

  private mapRowsFromCourses(courses: CourseDto[]): HeadTeacherRow[] {
    const byId = new Map<string, {
      teacher: TeacherDto;
      courseIds: Set<string>;
      classIds: Set<string>;
      levels: Set<string>;
      academicYears: Set<string>;
    }>();

    for (const c of courses) {
      const t = c.teacher;
      if (!t?.id) continue;

      const rec = byId.get(t.id) ?? {
        teacher: t,
        courseIds: new Set<string>(),
        classIds: new Set<string>(),
        levels: new Set<string>(),
        academicYears: new Set<string>(),
      };

      if (c.id) rec.courseIds.add(c.id);

      const cay = c.classAcademicYear;
      const classId = cay?.class?.id;
      if (classId) rec.classIds.add(classId);

      const level = String(cay?.class?.level ?? c.level ?? '');
      if (level) rec.levels.add(level);

      const ay = cay?.academicYear;
      if (ay?.start && ay?.end) {
        rec.academicYears.add(`${ay.start.split('-')[0]}–${ay.end.split('-')[0]}`);
      }

      byId.set(t.id, rec);
    }

    return Array.from(byId.values())
      .map(({ teacher, courseIds, classIds, levels, academicYears }) => {
        const name = teacher.user?.name ?? '';
        const surname = teacher.user?.surname ?? '';
        const email = teacher.user?.email ?? '';
        return {
          id: teacher.id,
          name,
          surname,
          email,
          assignedCourses: courseIds.size,
          assignedClasses: classIds.size,
          levels: Array.from(levels).sort().join(', '),
          academicYears: Array.from(academicYears).sort().join(', '),
        };
      })
      .sort((a, b) => `${a.name} ${a.surname}`.trim().localeCompare(`${b.name} ${b.surname}`.trim()));
  }

  applyFilters(): void {
    const year = this.selectedAcademicYearId?.trim();
    const level = this.selectedLevel?.trim();

    const yearLabel = year
      ? (() => {
          const ay = this.academicYears.find(a => a.id === year);
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
    this.createOpen = true;
  }

  openEdit(row?: HeadTeacherRow): void {
    const r = row ?? this.selectedRow;
    if (!r) return;

    this.infoMessage = '';
    this.draftName = r.name;
    this.draftSurname = r.surname;
    this.draftEmail = r.email;
    this.editOpen = true;
  }

  openDelete(row?: HeadTeacherRow): void {
    const r = row ?? this.selectedRow;
    if (!r) return;

    this.infoMessage = '';
    this.selectedRow = r;
    this.deleteOpen = true;
  }

  confirmCreate(): void {
    if (!this.draftName.trim() || !this.draftSurname.trim() || !this.draftEmail.trim()) return;

    const newRow: HeadTeacherRow = {
      id: `TEMP-${Date.now()}`,
      name: this.draftName.trim(),
      surname: this.draftSurname.trim(),
      email: this.draftEmail.trim(),
      assignedCourses: 0,
      assignedClasses: 0,
      levels: '',
      academicYears: '',
    };

    this.rows = [newRow, ...this.rows];
    this.applyFilters();
    this.selectRow(newRow);

    this.activity.unshift({ message: `Created teacher ${newRow.name} ${newRow.surname}`, timeAgo: 'Just now', tone: 'success' });
    this.createOpen = false;

    this.infoMessage = 'Create is UI-only (API not wired yet).';
  }

  confirmEdit(): void {
    if (!this.selectedRow) return;
    if (!this.draftName.trim() || !this.draftSurname.trim() || !this.draftEmail.trim()) return;

    const id = this.selectedRow.id;

    this.rows = this.rows.map(r =>
      r.id === id
        ? {
            ...r,
            name: this.draftName.trim(),
            surname: this.draftSurname.trim(),
            email: this.draftEmail.trim(),
          }
        : r,
    );

    this.applyFilters();
    const updated = this.rows.find(r => r.id === id) ?? null;
    if (updated) this.selectedRow = updated;

    this.activity.unshift({ message: `Updated teacher ${this.draftName.trim()} ${this.draftSurname.trim()}`, timeAgo: 'Just now', tone: 'info' });
    this.editOpen = false;

    this.infoMessage = 'Edit is UI-only (API not wired yet).';
  }

  confirmDelete(): void {
    if (!this.selectedRow) return;

    const name = `${this.selectedRow.name} ${this.selectedRow.surname}`;
    const id = this.selectedRow.id;

    this.rows = this.rows.filter(r => r.id !== id);
    this.applyFilters();
    this.selectedRow = this.filteredRows[0] ?? null;

    this.activity.unshift({ message: `Deleted teacher ${name}`, timeAgo: 'Just now', tone: 'danger' });
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

    this.activity.unshift({ message: `Archived ${count} teacher(s)`, timeAgo: 'Just now', tone: 'warning' });
    this.infoMessage = 'Archive is UI-only (API not wired yet).';
  }

  importExcel(): void {
    this.infoMessage = 'Import Excel is not wired yet.';
  }

  exportExcel(): void {
    this.infoMessage = 'Export Excel is not wired yet.';
  }
}
