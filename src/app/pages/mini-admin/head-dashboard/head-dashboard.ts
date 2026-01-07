import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownOption, TableColumn, SelectComponent, AlertComponent } from '../../../components/ui';
import { BadgeComponent, ButtonComponent, CardComponent, StatCardComponent, TableComponent } from "../../../components/ui";
import { AcademicYearDto, ClassAcademicYearDto, CourseDto } from '../../../domain/dtos/teacher';
import { firstValueFrom } from 'rxjs';
import { HeadService } from '../../../services/head.service';
import { MiniAdminDto } from '../../../domain/dtos/dean/dean-shared.dto';

type Tone = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'secondary' | 'accent';
export interface HeadDashboardStats {
  classesManaged: number;
  students: number;
  teachers: number;
  upcomingExams: number;
}


export interface HeadDashboardData {
  stats: HeadDashboardStats;
  classes: ManagedClassRow[];
  weekdays: string[];
  weekLabel: string;
  upcomingExams: UpcomingExam[];
  activity: ActivityItem[];
  sentimentAlerts: SentimentAlertRow[];
}
interface ManagedClassRow {
  id: string;
  className: string;
  level: number;
  students: number;
  teachers: number;
}

interface UpcomingExam {
  name: string;
  time: string;
  tone: Tone;
}

interface ActivityItem {
  message: string;
  timeAgo: string;
  tone: Tone;
}

interface SentimentAlertRow {
  student: string;
  department: string;
  exam: string;
  mood: 'Low' | 'Medium' | 'High';
  flagged: string;
}

@Component({
  selector: 'app-head-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, StatCardComponent, TableComponent, ButtonComponent, BadgeComponent, SelectComponent, AlertComponent],
  templateUrl: './head-dashboard.html',
  styleUrl: './head-dashboard.scss',
})
export class HeadDashboard {

    private readonly headApi = inject(HeadService);

  loading = false;
  errorMessage = '';

  readonly classesColumns: TableColumn<ManagedClassRow>[] = [
    { key: 'id', label: 'ID', sortable: true, width: '90px' },
    { key: 'className', label: 'Class', sortable: true },
    { key: 'level', label: 'Level', sortable: true, width: '90px', align: 'center' },
    { key: 'students', label: 'Students', sortable: true, width: '110px', align: 'center' },
    { key: 'teachers', label: 'Teachers', sortable: true, width: '110px', align: 'center' },
    { key: 'actions', label: 'Actions', sortable: false, width: '120px', align: 'right' },
  ];

  classesData: ManagedClassRow[] = [];

  readonly weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  readonly weekLabel = 'Week of Nov 10 - Nov 16';

  readonly upcomingExams: UpcomingExam[] = [];

  readonly activity: ActivityItem[] = [];

  readonly sentimentColumns: TableColumn<SentimentAlertRow>[] = [
    { key: 'student', label: 'Student', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'exam', label: 'Exam', sortable: true },
    { key: 'mood', label: 'Mood', sortable: true, width: '110px', align: 'center' },
    { key: 'flagged', label: 'Flagged', sortable: true, width: '120px', align: 'center' },
    { key: 'actions', label: 'Action', sortable: false, width: '120px', align: 'right' },
  ];

  readonly sentimentData: SentimentAlertRow[] = [];

  moodColor(mood: SentimentAlertRow['mood']): Tone {
    if (mood === 'High') return 'danger';
    if (mood === 'Medium') return 'warning';
    return 'info';
  }

  activityDotClass(tone: Tone): string {
    return `dot dot--${tone}`;
  }

  academicYears: AcademicYearDto[] = [];
  classAcademicYears: ClassAcademicYearDto[] = [];
  courses: CourseDto[] = [];
  selectedAcademicYearId = '';


  academicYearOptions(): DropdownOption<string>[] {
      const opts: DropdownOption<string>[] = [{ value: '', label: 'All academic years' }];
      for (const ay of this.academicYears) {
        opts.push({ value: ay.id, label: `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` });
      }
      return opts;
    }

  onFilterChanged(): void {
    void this.loadForAcademicYear(this.selectedAcademicYearId);
  }

  private async loadAll(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      this.academicYears = await firstValueFrom(this.headApi.listAcademicYears());

      // Default selection = latest academic year (by end date, fallback to start).
      if (!this.selectedAcademicYearId) {
        this.selectedAcademicYearId = this.pickLatestAcademicYearId(this.academicYears);
      }

      await this.loadForAcademicYear(this.selectedAcademicYearId);
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data.';
    } finally {
      this.loading = false;
    }
  }

  private async loadForAcademicYear(academicYearId: string): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const year = academicYearId?.trim() || undefined;

      const [cays, courses] = await Promise.all([
        firstValueFrom(this.headApi.listClasses(year)),
        firstValueFrom(this.headApi.listCourses(year)),
      ]);

      this.classAcademicYears = cays;
      this.courses = courses;

      this.recomputeDashboard();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data.';
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

    return best?.id ?? '';
  }

  getUser(): MiniAdminDto{
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  private recomputeDashboard(): void {
    const selectedYear = this.selectedAcademicYearId?.trim() || undefined;
    const specialityName = this.getUser()?.speciality?.name;

    const filteredCays = this.classAcademicYears.filter(cay => {
      if (selectedYear && cay.academicYear?.id !== selectedYear) return false;
      const classAny = cay.class as any;
      const caySpecialityName: string | undefined = classAny?.speciality?.name;
      if (specialityName && caySpecialityName && caySpecialityName !== specialityName) return false;
      return true;
    });

    const filteredCourses = this.courses.filter(c => {
      if (selectedYear && c.classAcademicYear?.academicYear?.id !== selectedYear) return false;

      const classAny = c.classAcademicYear?.class as any;
      const courseSpecialityName: string | undefined = classAny?.speciality?.name;
      if (specialityName && courseSpecialityName && courseSpecialityName !== specialityName) return false;

      return true;
    });

    this.classesData = this.buildClassesOverview(filteredCays, filteredCourses);

    const teacherIds = new Set<string>();
    for (const c of filteredCourses) {
      const teacherId = c.teacher?.id;
      if (teacherId) teacherIds.add(teacherId);
    }

    this.stats = {
      classesManaged: filteredCays.length,
      students: 0,
      teachers: teacherIds.size,
      upcomingExams: this.upcomingExams.length,
    };
  }

  private buildClassesOverview(
    cays: ClassAcademicYearDto[],
    courses: CourseDto[],
  ): ManagedClassRow[] {
    const byId = new Map<string, ManagedClassRow>();

    for (const cay of cays) {
      if (!cay?.id) continue;
      const classDto = cay.class;
      if (!classDto?.name) continue;

      byId.set(cay.id, {
        id: classDto.id ?? cay.id,
        className: classDto.name,
        level: Number(classDto.level) || 0,
        students: 0,
        teachers: 0,
      });
    }

    const teacherIdsByCay = new Map<string, Set<string>>();
    for (const c of courses) {
      const cayId = c.classAcademicYear?.id;
      const teacherId = c.teacher?.id;
      if (!cayId || !teacherId) continue;
      const set = teacherIdsByCay.get(cayId) ?? new Set<string>();
      set.add(teacherId);
      teacherIdsByCay.set(cayId, set);
    }

    for (const [cayId, row] of byId.entries()) {
      row.teachers = teacherIdsByCay.get(cayId)?.size ?? 0;
    }

    return Array.from(byId.values()).sort((a, b) => a.className.localeCompare(b.className));
  }

  stats: HeadDashboardStats = {
    classesManaged: 0,
    students: 0,
    teachers: 0,
    upcomingExams: 0,
  };

  ngOnInit(): void {
    void this.loadAll();
  }
  
  
}
