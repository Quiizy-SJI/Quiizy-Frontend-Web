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
  id: string; // UI-only
  matricule: string;
  name: string;
  surname: string;
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
  draftCarryovers = 0;
  draftClassAcademicYearId = '';

  readonly activity: ActivityItem[] = [
    { message: 'Imported 42 students via Excel', timeAgo: 'Today', tone: 'info' },
    { message: 'Archived 3 inactive students', timeAgo: 'Yesterday', tone: 'warning' },
    { message: 'Student list export generated', timeAgo: '2 days ago', tone: 'success' },
  ];

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

  async loadAll(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const [ays, cays] = await Promise.all([
        firstValueFrom(this.headApi.listAcademicYears()),
        firstValueFrom(this.headApi.listClasses()),
      ]);

      this.academicYears = ays;
      this.classAcademicYears = cays;

      // No students endpoint wired yet in the frontend.
      // Keep UI functional by starting with an empty list (students can be added in the modal).
      this.rows = [];
      this.applyFilters();

      if (!this.selectedRow && this.filteredRows.length > 0) {
        this.selectRow(this.filteredRows[0]);
      }
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load student metadata.';
    } finally {
      this.loading = false;
    }
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

  confirmCreate(): void {
    if (!this.draftMatricule.trim()) return;
    if (!this.draftName.trim() || !this.draftSurname.trim()) return;
    if (!this.draftEmail.trim()) return;
    if (!this.draftClassAcademicYearId) return;

    const cay = this.classAcademicYears.find(c => c.id === this.draftClassAcademicYearId);
    const className = cay?.class?.name ?? '—';
    const level = String(cay?.class?.level ?? '');
    const ay = cay?.academicYear;
    const academicYearId = ay?.id ?? '';
    const academicYearLabel = ay ? `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` : '';

    const newRow: HeadStudentRow = {
      id: `TEMP-${Date.now()}`,
      matricule: this.draftMatricule.trim(),
      name: this.draftName.trim(),
      surname: this.draftSurname.trim(),
      classAcademicYearId: this.draftClassAcademicYearId,
      className,
      level,
      academicYearId,
      academicYearLabel,
      carryovers: Number(this.draftCarryovers) || 0,
      email: this.draftEmail.trim(),
    };

    this.rows = [newRow, ...this.rows];
    this.applyFilters();
    this.selectRow(newRow);

    this.activity.unshift({ message: `Added student ${newRow.name} ${newRow.surname}`, timeAgo: 'Just now', tone: 'success' });
    this.createOpen = false;

    this.infoMessage = 'Create is UI-only (API not wired yet).';
  }

  confirmEdit(): void {
    if (!this.selectedRow) return;
    if (!this.draftMatricule.trim()) return;
    if (!this.draftName.trim() || !this.draftSurname.trim()) return;
    if (!this.draftEmail.trim()) return;
    if (!this.draftClassAcademicYearId) return;

    const cay = this.classAcademicYears.find(c => c.id === this.draftClassAcademicYearId);
    const className = cay?.class?.name ?? '—';
    const level = String(cay?.class?.level ?? '');
    const ay = cay?.academicYear;
    const academicYearId = ay?.id ?? '';
    const academicYearLabel = ay ? `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` : '';

    const id = this.selectedRow.id;

    this.rows = this.rows.map(r =>
      r.id === id
        ? {
            ...r,
            matricule: this.draftMatricule.trim(),
            name: this.draftName.trim(),
            surname: this.draftSurname.trim(),
            email: this.draftEmail.trim(),
            carryovers: Number(this.draftCarryovers) || 0,
            classAcademicYearId: this.draftClassAcademicYearId,
            className,
            level,
            academicYearId,
            academicYearLabel,
          }
        : r,
    );

    this.applyFilters();
    const updated = this.rows.find(r => r.id === id) ?? null;
    if (updated) this.selectedRow = updated;

    this.activity.unshift({ message: `Edited student ${this.draftName.trim()} ${this.draftSurname.trim()}`, timeAgo: 'Just now', tone: 'info' });
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

    this.activity.unshift({ message: `Deleted student ${name}`, timeAgo: 'Just now', tone: 'danger' });
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

    this.activity.unshift({ message: `Archived ${count} student(s)`, timeAgo: 'Just now', tone: 'warning' });
    this.infoMessage = 'Archive is UI-only (API not wired yet).';
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
