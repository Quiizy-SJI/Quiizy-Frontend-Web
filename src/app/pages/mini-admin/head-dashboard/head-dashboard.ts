import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownOption, TableColumn, SelectComponent, AlertComponent } from '../../../components/ui';
import { BadgeComponent, ButtonComponent, CardComponent, SpinnerComponent, StatCardComponent, TableComponent } from "../../../components/ui";
import { AcademicYearDto, ClassAcademicYearDto, CourseDto } from '../../../domain/dtos/teacher';
import { firstValueFrom } from 'rxjs';
import { HeadService } from '../../../services/head.service';
import { MiniAdminDto } from '../../../domain/dtos/dean/dean-shared.dto';
import { toString } from '../../../core/utils/payload-sanitizer';
import { loadHeadActivity, type ActivityItem, type ActivityTone } from '../../../core/utils/head-activity-store';
import { SentimentAnalysisService } from '../../../services/sentiment-analysis.service';
import type { SentimentAnalysisResponseDto } from '../../../domain/dtos/teacher/teacher-sentiment.dto';

type Tone = ActivityTone;
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
  imports: [CommonModule, FormsModule, CardComponent, StatCardComponent, TableComponent, ButtonComponent, BadgeComponent, SelectComponent, AlertComponent, SpinnerComponent],
  templateUrl: './head-dashboard.html',
  styleUrl: './head-dashboard.scss',
})
export class HeadDashboard {

    private readonly headApi = inject(HeadService);
  private readonly sentimentApi = inject(SentimentAnalysisService);

  loading = false;
  private loadingCount = 0;
  errorMessage = '';

  private beginLoading(): void {
    this.loadingCount++;
    this.loading = true;
  }

  private endLoading(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    this.loading = this.loadingCount > 0;
  }

  readonly classesColumns: TableColumn<ManagedClassRow>[] = [
    { key: 'id', label: 'ID', sortable: true, width: '90px' },
    { key: 'className', label: 'Class', sortable: true },
    { key: 'level', label: 'Level', sortable: true, width: '90px', align: 'center' },
    { key: 'students', label: 'Students', sortable: true, width: '110px', align: 'center' },
    { key: 'teachers', label: 'Teachers', sortable: true, width: '110px', align: 'center' },
    { key: 'actions', label: 'Actions', sortable: false, width: '120px', align: 'right' },
  ];

  classesData: ManagedClassRow[] = [];
  pagedClassesData: ManagedClassRow[] = [];
  classesPagination = { page: 1, pageSize: 5, total: 0, pageSizes: [5, 10, 25, 50] };

  readonly weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  readonly weekLabel = 'Week of Nov 10 - Nov 16';

  readonly upcomingExams: UpcomingExam[] = [];

  activity: ActivityItem[] = [];

  readonly sentimentColumns: TableColumn<SentimentAlertRow>[] = [
    { key: 'student', label: 'Student', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'exam', label: 'Exam', sortable: true },
    { key: 'mood', label: 'Mood', sortable: true, width: '110px', align: 'center' },
    { key: 'flagged', label: 'Flagged', sortable: true, width: '120px', align: 'center' },
    { key: 'actions', label: 'Action', sortable: false, width: '120px', align: 'right' },
  ];

  sentimentData: SentimentAlertRow[] = [];
  pagedSentimentData: SentimentAlertRow[] = [];
  sentimentPagination = { page: 1, pageSize: 5, total: 0, pageSizes: [5, 10, 25, 50] };

  moodColor(mood: SentimentAlertRow['mood']): Tone {
    if (mood === 'High') return 'danger';
    if (mood === 'Medium') return 'warning';
    return 'info';
  }

  activityDotClass(tone: Tone): string {
    return `dot dot--${tone}`;
  }

  onClassesPageChange(page: number): void {
    this.classesPagination.page = page;
    this.updateClassesPaging();
  }

  onClassesPageSizeChange(pageSize: number): void {
    this.classesPagination.pageSize = pageSize;
    this.classesPagination.page = 1;
    this.updateClassesPaging();
  }

  private updateClassesPaging(): void {
    this.classesPagination.total = this.classesData.length;
    const totalPages = Math.max(1, Math.ceil(this.classesPagination.total / this.classesPagination.pageSize));
    if (this.classesPagination.page > totalPages) this.classesPagination.page = totalPages;
    if (this.classesPagination.page < 1) this.classesPagination.page = 1;
    const start = (this.classesPagination.page - 1) * this.classesPagination.pageSize;
    this.pagedClassesData = this.classesData.slice(start, start + this.classesPagination.pageSize);
  }

  onSentimentPageChange(page: number): void {
    this.sentimentPagination.page = page;
    this.updateSentimentPaging();
  }

  onSentimentPageSizeChange(pageSize: number): void {
    this.sentimentPagination.pageSize = pageSize;
    this.sentimentPagination.page = 1;
    this.updateSentimentPaging();
  }

  private updateSentimentPaging(): void {
    this.sentimentPagination.total = this.sentimentData.length;
    const totalPages = Math.max(1, Math.ceil(this.sentimentPagination.total / this.sentimentPagination.pageSize));
    if (this.sentimentPagination.page > totalPages) this.sentimentPagination.page = totalPages;
    if (this.sentimentPagination.page < 1) this.sentimentPagination.page = 1;
    const start = (this.sentimentPagination.page - 1) * this.sentimentPagination.pageSize;
    this.pagedSentimentData = this.sentimentData.slice(start, start + this.sentimentPagination.pageSize);
  }

  academicYears: AcademicYearDto[] = [];
  classAcademicYears: ClassAcademicYearDto[] = [];
  courses: CourseDto[] = [];
  students: any[] = [];
  selectedAcademicYearId = '';


  academicYearOptions(): DropdownOption<string>[] {
      const opts: DropdownOption<string>[] = [{ value: '', label: 'All academic years' }];
      for (const ay of this.academicYears) {
        opts.push({ value: String((ay as any).id ?? ''), label: `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` });
      }
      return opts;
    }

  onFilterChanged(): void {
    void this.loadForAcademicYear(this.selectedAcademicYearId);
  }

  private async loadAll(): Promise<void> {
    this.beginLoading();
    this.errorMessage = '';

    try {
      this.academicYears = await firstValueFrom(this.headApi.listAcademicYears());

      // Default selection = latest academic year (by end date, fallback to start).
      if (!this.selectedAcademicYearId) {
        this.selectedAcademicYearId = this.pickLatestAcademicYearId(this.academicYears);
      }

      await this.loadForAcademicYear(this.selectedAcademicYearId);
      await this.loadSentimentAlerts();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data.';
    } finally {
      this.endLoading();
    }
  }

  private async loadForAcademicYear(academicYearId: unknown): Promise<void> {
    this.beginLoading();
    this.errorMessage = '';

    try {
      const year = toString(academicYearId);

      const [cays, courses, students] = await Promise.all([
        firstValueFrom(this.headApi.listClasses(year)),
        firstValueFrom(this.headApi.listCourses(year)),
        firstValueFrom(this.headApi.listStudents(year)),
      ]);

      this.classAcademicYears = cays;
      this.courses = courses;
      this.students = students;

      this.recomputeDashboard();
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data.';
    } finally {
      this.endLoading();
    }
  }

  private mapSentimentToMood(a: SentimentAnalysisResponseDto): SentimentAlertRow['mood'] {
    const overall = a.resultJson?.overallSentiment;
    if (overall === 'NEGATIVE') return 'High';
    if (overall === 'MIXED') return 'Medium';
    return 'Low';
  }

  private async loadSentimentAlerts(): Promise<void> {
    this.beginLoading();
    // Best-effort: if endpoint is not allowed for HEAD role, keep empty.
    try {
      const analyses = await firstValueFrom(this.sentimentApi.getAll());

      const critical = (analyses ?? [])
        .filter(a => a?.status === 'COMPLETED')
        .filter(a => {
          const overall = a.resultJson?.overallSentiment;
          return overall === 'NEGATIVE' || overall === 'MIXED';
        })
        .slice(0, 10);

      this.sentimentData = critical.map(a => {
        const exam = String(a.courseName ?? a.quiz?.title ?? a.quiz?.name ?? a.quizId ?? '—');
        const department = String(
          a.quiz?.classAcademicYear?.class?.speciality?.name ??
            a.quiz?.department ??
            this.getUser()?.speciality?.name ??
            '—',
        );

        // We typically don't have per-student identity here; show the class/group instead.
        const student = String(a.quiz?.classAcademicYear?.class?.name ?? a.quiz?.className ?? '—');

        const flagged = a.analyzedAt
          ? new Date(a.analyzedAt).toLocaleDateString()
          : new Date(a.createdAt).toLocaleDateString();

        return {
          student,
          department,
          exam,
          mood: this.mapSentimentToMood(a),
          flagged,
        };
      });

      this.sentimentPagination.page = 1;
      this.updateSentimentPaging();
    } catch {
      this.sentimentData = [];
      this.sentimentPagination.page = 1;
      this.updateSentimentPaging();
    } finally {
      this.endLoading();
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

  getUser(): MiniAdminDto{
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  private recomputeDashboard(): void {
    const selectedYear = toString(this.selectedAcademicYearId);
    const specialityName = this.getUser()?.speciality?.name;

    const filteredCays = this.classAcademicYears.filter(cay => {
      if (selectedYear && toString(cay.academicYear?.id) !== selectedYear) return false;
      const classAny = cay.class as any;
      const caySpecialityName: string | undefined = classAny?.speciality?.name;
      if (specialityName && caySpecialityName && caySpecialityName !== specialityName) return false;
      return true;
    });

    const filteredCourses = this.courses.filter(c => {
      if (selectedYear && toString(c.classAcademicYear?.academicYear?.id) !== selectedYear) return false;

      const classAny = c.classAcademicYear?.class as any;
      const courseSpecialityName: string | undefined = classAny?.speciality?.name;
      if (specialityName && courseSpecialityName && courseSpecialityName !== specialityName) return false;

      return true;
    });

    this.classesData = this.buildClassesOverview(filteredCays, filteredCourses);
    this.classesPagination.page = 1;
    this.updateClassesPaging();

    const teacherIds = new Set<string>();
    for (const c of filteredCourses) {
      const teacherId = c.teacher?.id;
      if (teacherId) teacherIds.add(teacherId);
    }

    this.stats = {
      classesManaged: filteredCays.length,
      students: (this.students ?? []).length,
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
    this.activity = loadHeadActivity();
    void this.loadAll();
  }
  
  
}
