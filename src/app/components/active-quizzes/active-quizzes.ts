import { Component, Input } from '@angular/core';
import { ThemeService } from '../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-active-quizzes',
  imports: [CommonModule],
  templateUrl: './active-quizzes.html',
  styleUrl: './active-quizzes.scss',
})
export class ActiveQuizzes {
  @Input() quizzes: any[] = [];

  constructor(public themeService: ThemeService) {}
}
