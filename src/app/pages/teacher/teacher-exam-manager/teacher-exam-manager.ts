import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizManagerComponent } from '../../../components/teacher/quiz-manager/quiz-manager.component';

@Component({
  selector: 'app-teacher-exam-manager',
  standalone: true,
  imports: [CommonModule, QuizManagerComponent],
  template: `<teacher-quiz-manager></teacher-quiz-manager>`,
  styles: []
})
export class TeacherExamManager {}
