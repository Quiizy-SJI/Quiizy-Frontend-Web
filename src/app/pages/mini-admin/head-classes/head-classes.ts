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
import type { AcademicYearDto, ClassAcademicYearDto, CourseDto } from '../../../domain/dtos/teacher';
import type { MiniAdminDto } from '../../../domain/dtos/dean/dean-shared.dto';

type Tone = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'secondary' | 'accent';

type LevelLabel = string;

interface HeadClassRow {
  id: string; // classAcademicYearId (stable selection)
  classId: string;
  className: string;
  level: LevelLabel;
  academicYearId: string;
  academicYearLabel: string;
  students: number; // backend not available here -> 0
  teachers: number;
  subjects: number;
}

interface ActivityItem {
  message: string;
  timeAgo: string;
  tone: Tone;
}

@Component({
  selector: 'app-head-classes',
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
  templateUrl: './head-classes.html',
  styleUrl: './head-classes.scss',
})
export class HeadClasses {
  private readonly headApi = inject(HeadService);

  // data
  academicYears: AcademicYearDto[] = [];
  courses: CourseDto[] = [];
  classAcademicYears: ClassAcademicYearDto[] = [];

  rows: HeadClassRow[] = [];
  filteredRows: HeadClassRow[] = [];

  selectedAcademicYearId = '';
  selectedRows: HeadClassRow[] = [];
  selectedRow: HeadClassRow | null = null;

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
  draftLevel = '';
  draftAcademicYearId = '';

  readonly activity: ActivityItem[] = [
    { message: 'Mini-admin Sarah created Exam "DB Systems CC"', timeAgo: '5 min ago', tone: 'info' },
    { message: '40 students submitted Operating Systems Final', timeAgo: '25 min ago', tone: 'success' },
    { message: 'Grading backlog exceeds SLA in ISI 4', timeAgo: '1 hr ago', tone: 'warning' },
    { message: 'System maintenance scheduled Nov 12 02:00 UTC', timeAgo: 'Today', tone: 'danger' },
  ];

  readonly columns: TableColumn<HeadClassRow>[] = [
    { key: 'className', label: 'Class', sortable: true },
    { key: 'level', label: 'Level', sortable: true, width: '90px', align: 'center' },
    { key: 'students', label: 'Students', sortable: true, width: '110px', align: 'center' },
    { key: 'teachers', label: 'Teachers', sortable: true, width: '110px', align: 'center' },
    { key: 'actions', label: 'Actions', sortable: false, width: '180px', align: 'right' },
  ];

  academicYearOptions(): DropdownOption<string>[] {
    const opts: DropdownOption<string>[] = [{ value: '', label: 'Select academic year' }];
    for (const ay of this.academicYears) {
      opts.push({ value: ay.id, label: `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` });
    }
    return opts;
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
      const [ays, courses, cays] = await Promise.all([
        firstValueFrom(this.headApi.listAcademicYears()),
        firstValueFrom(this.headApi.listCourses()),
        firstValueFrom(this.headApi.listClasses()),
      ]);

      this.academicYears = ays;
      this.courses = courses;
      this.classAcademicYears = cays;

      this.rows = this.mapRows(cays);
      this.applyFilters();

      if (!this.selectedRow && this.filteredRows.length > 0) {
        this.selectRow(this.filteredRows[0]);
      }
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load classes.';
    } finally {
      this.loading = false;
    }
  }

  private getUser(): MiniAdminDto {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  private mapRows(cays: ClassAcademicYearDto[]): HeadClassRow[] {
    const userSpecialityName = this.getUser()?.speciality?.name;

    const byId = new Map<string, HeadClassRow>();

    for (const cay of cays) {
      const classDto = cay.class;
      const ay = cay.academicYear;

      if (!cay.id || !classDto?.id || !classDto.name || !ay?.id) continue;

      // Optional: filter to the head’s speciality if available on the class DTO
      const classAny = classDto as any;
      const specialityName: string | undefined = classAny?.speciality?.name;
      if (userSpecialityName && specialityName && specialityName !== userSpecialityName) continue;

      const teacherCount = this.countTeachersForClassAcademicYear(cay.id);
      const subjectCount = this.countSubjectsForClassAcademicYear(cay.id);

      byId.set(cay.id, {
        id: cay.id,
        classId: classDto.id,
        className: classDto.name,
        level: String(classDto.level ?? ''),
        academicYearId: ay.id,
        academicYearLabel: `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}`,
        students: 0,
        teachers: teacherCount,
        subjects: subjectCount,
      });
    }

    return Array.from(byId.values()).sort((a, b) => a.className.localeCompare(b.className));
  }

  private countTeachersForClassAcademicYear(classAcademicYearId: string): number {
    const ids = new Set<string>();
    for (const c of this.courses) {
      if (c.classAcademicYear?.id !== classAcademicYearId) continue;
      const teacherId = c.teacher?.id;
      if (teacherId) ids.add(teacherId);
    }
    return ids.size;
  }

  private countSubjectsForClassAcademicYear(classAcademicYearId: string): number {
    const ids = new Set<string>();
    for (const c of this.courses) {
      if (c.classAcademicYear?.id !== classAcademicYearId) continue;
      const unitId = c.teachingUnit?.id;
      if (unitId) ids.add(unitId);
    }
    return ids.size;
  }

  applyFilters(): void {
    const year = this.selectedAcademicYearId?.trim();

    this.filteredRows = year
      ? this.rows.filter(r => r.academicYearId === year)
      : this.rows.slice();

    // keep selection consistent
    if (this.selectedRow && !this.filteredRows.some(r => r.id === this.selectedRow?.id)) {
      this.selectedRow = this.filteredRows[0] ?? null;
    }
  }

  onSelectionChange(rows: HeadClassRow[]): void {
    this.selectedRows = rows;
  }

  onRowClick(row: HeadClassRow): void {
    this.selectRow(row);
  }

  selectRow(row: HeadClassRow): void {
    this.selectedRow = row;
  }

  // Toolbar actions (UI-only for now)
  openCreate(): void {
    this.infoMessage = '';
    this.draftName = '';
    this.draftLevel = '';
    this.draftAcademicYearId = this.selectedAcademicYearId || '';
    this.createOpen = true;
  }

  openEdit(row?: HeadClassRow): void {
    const r = row ?? this.selectedRow;
    if (!r) return;

    this.infoMessage = '';
    this.draftName = r.className;
    this.draftLevel = r.level;
    this.draftAcademicYearId = r.academicYearId;
    this.editOpen = true;
  }

  openDelete(row?: HeadClassRow): void {
    const r = row ?? this.selectedRow;
    if (!r) return;

    this.infoMessage = '';
    this.selectedRow = r;
    this.deleteOpen = true;
  }

  confirmCreate(): void {
    if (!this.draftName.trim() || !this.draftAcademicYearId) return;

    const ay = this.academicYears.find(a => a.id === this.draftAcademicYearId);
    const academicYearLabel = ay ? `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` : '';

    const newRow: HeadClassRow = {
      id: `TEMP-${Date.now()}`,
      classId: `TEMP-${Date.now()}`,
      className: this.draftName.trim(),
      level: this.draftLevel?.trim() ?? '',
      academicYearId: this.draftAcademicYearId,
      academicYearLabel,
      students: 0,
      teachers: 0,
      subjects: 0,
    };

    this.rows = [newRow, ...this.rows];
    this.applyFilters();
    this.selectRow(newRow);

    this.activity.unshift({ message: `Created class "${newRow.className}"`, timeAgo: 'Just now', tone: 'success' });
    this.createOpen = false;

    this.infoMessage = 'Create is UI-only (API not wired yet).';
  }

  confirmEdit(): void {
    if (!this.selectedRow) return;
    if (!this.draftName.trim() || !this.draftAcademicYearId) return;

    const ay = this.academicYears.find(a => a.id === this.draftAcademicYearId);
    const academicYearLabel = ay ? `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` : '';

    const id = this.selectedRow.id;

    this.rows = this.rows.map(r =>
      r.id === id
        ? {
            ...r,
            className: this.draftName.trim(),
            level: this.draftLevel?.trim() ?? '',
            academicYearId: this.draftAcademicYearId,
            academicYearLabel,
          }
        : r,
    );

    this.applyFilters();
    const updated = this.rows.find(r => r.id === id) ?? null;
    if (updated) this.selectedRow = updated;

    this.activity.unshift({ message: `Edited class "${this.draftName.trim()}"`, timeAgo: 'Just now', tone: 'info' });
    this.editOpen = false;

    this.infoMessage = 'Edit is UI-only (API not wired yet).';
  }

  confirmDelete(): void {
    if (!this.selectedRow) return;

    const name = this.selectedRow.className;
    const id = this.selectedRow.id;

    this.rows = this.rows.filter(r => r.id !== id);
    this.applyFilters();
    this.selectedRow = this.filteredRows[0] ?? null;

    this.activity.unshift({ message: `Deleted class "${name}"`, timeAgo: 'Just now', tone: 'danger' });
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

    this.activity.unshift({ message: `Archived ${count} class(es)`, timeAgo: 'Just now', tone: 'warning' });
    this.infoMessage = 'Archive is UI-only (API not wired yet).';
  }

  importExcel(): void {
    this.infoMessage = 'Import Excel is not wired yet.';
  }

  exportExcel(): void {
    this.infoMessage = 'Export Excel is not wired yet.';
  }
}