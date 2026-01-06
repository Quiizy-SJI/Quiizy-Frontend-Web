import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TeacherApiService } from '../../../services/teacher-api.service';
import { Router } from '@angular/router';
import type { QuizDto } from '../../../domain/dtos/teacher/teacher-quiz.dto';
import { TableComponent } from '../../ui/tables/table/table.component';
import { CardComponent } from '../../ui/cards/card/card.component';
import { ButtonComponent } from '../../ui/buttons/button/button.component';
import { ModalComponent } from '../../ui/modals/modal/modal.component';

@Component({
  selector: 'teacher-quiz-manager',
  standalone: true,
  imports: [CommonModule, CardComponent, TableComponent, ButtonComponent, ModalComponent],
  templateUrl: './quiz-manager.component.html',
  styleUrls: ['./quiz-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizManagerComponent implements OnInit {
  quizzes$!: Observable<Array<any>>;
  loading = false;

  // Modal state
  confirmOpen = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmAction: 'publish' | 'delete' | null = null;
  private pendingQuiz?: QuizDto;

  columns = [
    { key: 'title', label: 'Title', width: '35%' },
    { key: 'course', label: 'Course', width: '20%' },
    { key: 'status', label: 'Status', width: '15%' },
    { key: 'date', label: 'Date', width: '15%' },
  ];

  constructor(private readonly teacherApi: TeacherApiService, private readonly router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.quizzes$ = this.teacherApi.getMyQuizzes().pipe(
      map((quizzes) =>
        quizzes.map((q) => ({
          id: q.id,
          title: q.type ? `${q.type} - ${q.author || ''}` : q.author,
          course: q.courseQuizes?.[0]?.course?.teachingUnit?.name || q.courseQuizes?.[0]?.course?.classAcademicYear?.class?.name || '—',
          status: q.status,
          date: q.date,
          _orig: q,
        })),
      ),
      tap(() => (this.loading = false)),
      catchError(() => {
        this.loading = false;
        return of([] as any[]);
      }),
    );
  }

  onCreate(): void {
    this.router.navigate(['/teacher/create-exam']);
  }

  onEdit(row: any): void {
    const quiz: QuizDto = row._orig;
    this.router.navigate(['/teacher/create-exam'], { queryParams: { edit: quiz.id } });
  }

  onCreateFrom(row: any): void {
    const quiz: QuizDto = row._orig;
    this.router.navigate(['/teacher/create-exam'], { queryParams: { fromQuiz: quiz.id } });
  }

  onPublish(row: any): void {
    this.pendingQuiz = row._orig;
    this.confirmAction = 'publish';
    this.confirmTitle = 'Publish Quiz';
    this.confirmMessage = 'Publishing will create StudentQuiz entries and make the quiz read-only. Continue?';
    this.confirmOpen = true;
  }

  onDelete(row: any): void {
    this.pendingQuiz = row._orig;
    this.confirmAction = 'delete';
    this.confirmTitle = 'Delete Quiz';
    this.confirmMessage = 'This will permanently delete the quiz draft. Continue?';
    this.confirmOpen = true;
  }

  confirm(): void {
    if (!this.pendingQuiz || !this.confirmAction) return;

    const id = this.pendingQuiz.id;
    if (this.confirmAction === 'publish') {
      this.teacherApi.publishQuiz(id).subscribe({
        next: () => this.load(),
        error: (err) => console.error('Publish failed', err),
      });
    } else if (this.confirmAction === 'delete') {
      this.teacherApi.deleteQuiz(id).subscribe({
        next: () => this.load(),
        error: (err) => console.error('Delete failed', err),
      });
    }

    this.closeConfirm();
  }

  closeConfirm(): void {
    this.confirmOpen = false;
    this.confirmAction = null;
    this.pendingQuiz = undefined;
  }
}
