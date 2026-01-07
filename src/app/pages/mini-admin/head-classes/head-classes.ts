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
import { toString } from '../../../core/utils/payload-sanitizer';
import { downloadXlsx, getCell, readExcelFile } from '../../../core/utils/excel-utils';
import { pushHeadActivity } from '../../../core/utils/head-activity-store';

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
  pagedRows: HeadClassRow[] = [];

  pagination = { page: 1, pageSize: 5, total: 0, pageSizes: [5, 10, 25, 50] };

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
      opts.push({ value: String((ay as any).id ?? ''), label: `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` });
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

  async loadAll(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    try {
      this.academicYears = await firstValueFrom(this.headApi.listAcademicYears());

      if (!this.selectedAcademicYearId) {
        this.selectedAcademicYearId = this.pickLatestAcademicYearId(this.academicYears);
      }

      await this.loadForAcademicYear(this.selectedAcademicYearId);
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load classes.';
    } finally {
      this.loading = false;
    }
  }

  async onAcademicYearChanged(): Promise<void> {
    await this.loadForAcademicYear(this.selectedAcademicYearId);
  }

  private async loadForAcademicYear(academicYearId: unknown): Promise<void> {
    const year = toString(academicYearId);
    if (!year) {
      this.rows = [];
      this.filteredRows = [];
      this.selectedRow = null;
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    try {
      let courses: CourseDto[] = [];
      let cays: ClassAcademicYearDto[] = [];

      try {
        [courses, cays] = await Promise.all([
          firstValueFrom(this.headApi.listCourses(year)),
          firstValueFrom(this.headApi.listClasses(year)),
        ]);
      } catch {
        // Fallback: if backend rejects academicYearId filter, load all and filter locally.
        [courses, cays] = await Promise.all([
          firstValueFrom(this.headApi.listCourses(undefined)),
          firstValueFrom(this.headApi.listClasses(undefined)),
        ]);
      }

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

  private pickLatestAcademicYearId(ays: AcademicYearDto[]): string {
    const parseDate = (value: unknown): number => {
      if (typeof value !== 'string') return Number.NEGATIVE_INFINITY;
      const t = Date.parse(value);
      return Number.isFinite(t) ? t : Number.NEGATIVE_INFINITY;
    };

    const best = ays
      .filter(a => !!a?.id)
      .map(a => {
        const end = parseDate((a as any).end);
        const start = parseDate((a as any).start);
        return { ay: a, score: end !== Number.NEGATIVE_INFINITY ? end : start };
      })
      .sort((a, b) => b.score - a.score)[0]?.ay;

    return String((best as any)?.id ?? '');
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
        academicYearId: String((ay as any).id ?? ''),
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
    const year = toString(this.selectedAcademicYearId);

    this.filteredRows = year ? this.rows.filter(r => r.academicYearId === year) : this.rows.slice();

    // keep selection consistent
    if (this.selectedRow && !this.filteredRows.some(r => r.id === this.selectedRow?.id)) {
      this.selectedRow = this.filteredRows[0] ?? null;
    }

    this.pagination.page = 1;
    this.updatePaging();
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

  async confirmCreate(): Promise<void> {
    if (!this.draftName.trim() || !this.draftAcademicYearId) return;

    this.loading = true;
    this.errorMessage = '';
    this.infoMessage = '';
    try {
      const createdClass = await firstValueFrom(
        this.headApi.createClass({
          name: this.draftName.trim(),
          level: this.draftLevel?.trim() || undefined,
        }),
      );

      await firstValueFrom(
        this.headApi.createClassAcademicYear({
          classId: createdClass.id,
          academicYearId: this.draftAcademicYearId,
        }),
      );

      this.createOpen = false;
      await this.loadForAcademicYear(this.selectedAcademicYearId);
      this.infoMessage = 'Class created successfully.';
      pushHeadActivity('Created class', 'success');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to create class.';
    } finally {
      this.loading = false;
    }
  }

  async confirmEdit(): Promise<void> {
    if (!this.selectedRow) return;
    if (!this.draftName.trim() || !this.draftAcademicYearId) return;

    this.loading = true;
    this.errorMessage = '';
    this.infoMessage = '';
    try {
      await firstValueFrom(
        this.headApi.updateClass(this.selectedRow.classId, {
          name: this.draftName.trim(),
          level: this.draftLevel?.trim() || undefined,
        }),
      );

      if (this.selectedRow.academicYearId !== this.draftAcademicYearId) {
        await firstValueFrom(
          this.headApi.updateClassAcademicYear(this.selectedRow.id, {
            academicYearId: this.draftAcademicYearId,
          }),
        );
      }

      this.editOpen = false;
      await this.loadForAcademicYear(this.selectedAcademicYearId);
      this.infoMessage = 'Class updated successfully.';
      pushHeadActivity('Updated class', 'info');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to update class.';
    } finally {
      this.loading = false;
    }
  }

  async confirmDelete(): Promise<void> {
    if (!this.selectedRow) return;

    this.loading = true;
    this.errorMessage = '';
    this.infoMessage = '';
    try {
      await firstValueFrom(this.headApi.deleteClassAcademicYear(this.selectedRow.id));
      this.deleteOpen = false;
      await this.loadForAcademicYear(this.selectedAcademicYearId);
      this.infoMessage = 'Class removed from the academic year.';
      pushHeadActivity('Deleted class (academic year link)', 'danger');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to delete class.';
    } finally {
      this.loading = false;
    }
  }

  async archiveSelected(): Promise<void> {
    if (this.selectedRows.length === 0) return;

    this.loading = true;
    this.errorMessage = '';
    this.infoMessage = '';
    try {
      await Promise.all(
        this.selectedRows.map(r => firstValueFrom(this.headApi.deleteClassAcademicYear(r.id))),
      );
      this.selectedRows = [];
      await this.loadForAcademicYear(this.selectedAcademicYearId);
      this.infoMessage = 'Selected classes archived.';
      pushHeadActivity('Archived classes', 'warning');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to archive classes.';
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

    const selectedYearId = toString(this.selectedAcademicYearId);
    if (!selectedYearId) {
      this.infoMessage = 'Select an academic year before importing.';
      return;
    }

    this.loading = true;
    try {
      const excelRows = await readExcelFile(file);
      let ok = 0;
      let failed = 0;

      for (const r of excelRows) {
        const name = getCell(r, 'classname', 'class name', 'class', 'name');
        const level = getCell(r, 'level');
        const academicYearId = getCell(r, 'academicyearid', 'academic year id', 'academicYearId') || selectedYearId;

        if (!name || !academicYearId) {
          failed++;
          continue;
        }

        try {
          const createdClass = await firstValueFrom(
            this.headApi.createClass({
              name,
              level: level || undefined,
            }),
          );

          await firstValueFrom(
            this.headApi.createClassAcademicYear({
              classId: createdClass.id,
              academicYearId,
            }),
          );

          ok++;
        } catch {
          failed++;
        }
      }

      await this.loadForAcademicYear(this.selectedAcademicYearId);
      this.infoMessage = `Imported ${ok} class(es). ${failed ? `Failed: ${failed}.` : ''}`.trim();
      pushHeadActivity(`Imported ${ok} class(es)`, failed ? 'warning' : 'success');
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to import classes.';
    } finally {
      this.loading = false;
    }
  }

  exportExcel(): void {
    const year = toString(this.selectedAcademicYearId) || 'all';
    const rows = (this.filteredRows.length ? this.filteredRows : this.rows).map(r => ({
      Class: r.className,
      Level: r.level,
      AcademicYear: r.academicYearLabel,
      Teachers: r.teachers,
      Subjects: r.subjects,
      ClassAcademicYearId: r.id,
      ClassId: r.classId,
    }));
    downloadXlsx(`classes-${year}.xlsx`, rows, 'Classes');
    pushHeadActivity('Exported classes (Excel)', 'info');
  }
}