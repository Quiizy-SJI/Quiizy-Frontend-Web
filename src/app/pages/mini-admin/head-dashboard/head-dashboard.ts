import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DropdownOption, TableColumn, SelectComponent, AlertComponent } from '../../../components/ui';
import { BadgeComponent, ButtonComponent, CardComponent, StatCardComponent, TableComponent } from "../../../components/ui";
import { AcademicYearDto, ClassDto, CourseDto } from '../../../domain/dtos/teacher';
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
  imports: [CommonModule, CardComponent, StatCardComponent, TableComponent, ButtonComponent, BadgeComponent, SelectComponent, AlertComponent],
  templateUrl: './head-dashboard.html',
  styleUrl: './head-dashboard.scss',
})
export class HeadDashboard {

    private readonly headApi = inject(HeadService);


  readonly stats = {
    classesManaged: 12,
    students: 5,
    teachers: 12,
    upcomingExams: 12,
  };

  readonly classesColumns: TableColumn<ManagedClassRow>[] = [
    { key: 'id', label: 'ID', sortable: true, width: '90px' },
    { key: 'className', label: 'Class', sortable: true },
    { key: 'level', label: 'Level', sortable: true, width: '90px', align: 'center' },
    { key: 'students', label: 'Students', sortable: true, width: '110px', align: 'center' },
    { key: 'teachers', label: 'Teachers', sortable: true, width: '110px', align: 'center' },
    { key: 'actions', label: 'Actions', sortable: false, width: '120px', align: 'right' },
  ];

  readonly classesData: ManagedClassRow[] = [
    { id: 'ISI4', className: 'ING 4 ISI EN', level: 4, students: 28, teachers: 4 },
    { id: 'ISI3', className: 'ING 3 ISI EN', level: 3, students: 28, teachers: 4 },
  ];

  readonly weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  readonly weekLabel = 'Week of Nov 10 - Nov 16';

  readonly upcomingExams: UpcomingExam[] = [
    { name: 'ISI 4 - Web Dev Final', time: 'Nov 10 - 10:00 - 11:30', tone: 'info' },
    { name: 'ISI 5 - AI Midterm', time: 'Nov 12 - 14:00 - 15:30', tone: 'success' },
    { name: 'ISI 3 - DB Mock', time: '9:00', tone: 'warning' },
  ];

  readonly activity: ActivityItem[] = [
    { message: 'Mini-admin Sarah created Exam "DB Systems CC"', timeAgo: '5 min ago', tone: 'info' },
    { message: '40 students submitted Operating Systems Final', timeAgo: '25 min ago', tone: 'success' },
    { message: 'Grading backlog exceeds SLA in ISI 4', timeAgo: '1 hr ago', tone: 'warning' },
    { message: 'System maintenance scheduled Nov 12 02:00 UTC', timeAgo: 'Today', tone: 'danger' },
  ];

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
  courses : CourseDto[] = [];
  classes: ClassDto[] = [];
  selectedAcademicYearId = '';
  errorMessage = '';


  academicYearOptions(): DropdownOption<string>[] {
      const opts: DropdownOption<string>[] = [{ value: '', label: 'All academic years' }];
      for (const ay of this.academicYears) {
        opts.push({ value: ay.id, label: `${ay.start.split('-')[0]}–${ay.end.split('-')[0]}` });
      }
      return opts;
    }

   async onFilterChanged(): Promise<void> {
    await this.loadAcademicYears();
  }

  async loadAcademicYears(): Promise<void> {
      this.errorMessage = '';
  
      try {
        this.academicYears = await firstValueFrom(this.headApi.listAcademicYears());
      } catch (err: unknown) {
        this.errorMessage = err instanceof Error ? err.message : 'Failed to load academic years.';
      }
    }
  
  async loadCourses(): Promise<void> {
    this.errorMessage = '';
    try {
      this.courses = await firstValueFrom(this.headApi.listCourses());
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load courses.';
    }
  }

  async loadClasses() {
    this.errorMessage = '';
    try {
      let result = await firstValueFrom(this.headApi.listClasses());
      this.classes = result.map((c) => c.class!);
      this.classes = this.classes.filter((cls) => cls.speciality === this.getUser().speciality?.name);
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to load classes.';
    }
  }

  getUser(): MiniAdminDto{
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  filterClasses(): CourseDto[] {
    this.courses.filter((course) => {
      return course.classAcademicYear?.class?.speciality === this.getUser().speciality?.name;
    });
    return this.courses;
  }

  ngOnInit(): void {
    this.loadAcademicYears();
    // this.loadClasses();
    this.loadCourses()
  }
  
  
}
